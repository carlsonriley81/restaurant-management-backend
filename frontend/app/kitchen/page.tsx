'use client';

import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKitchenStore, selectFilteredTickets } from '@/stores/kitchenStore';
import { kitchenApi } from '@/services/kitchen.api';
import { getSocket } from '@/services/websocket';
import { KitchenHeader } from '@/components/kitchen/KitchenHeader';
import { StationFilter } from '@/components/kitchen/StationFilter';
import { TicketGrid } from '@/components/kitchen/TicketGrid';
import { RecipeViewer } from '@/components/kitchen/RecipeViewer';
import { SoundAlert } from '@/components/kitchen/SoundAlert';
import type { KitchenTicket, KitchenOrderStatus, KitchenStation, Recipe } from '@/types/kitchen';
import type { Order } from '@/types/orders';
import { sampleKitchenTickets } from '@/utils/sampleData';
import { getItem, STORAGE_KEYS } from '@/utils/storage';

/** Convert a backend Order into a KDS KitchenTicket. */
function orderToTicket(order: Order): KitchenTicket {
  const placed = new Date(order.orderPlacedTime ?? order.createdAt);
  const timeDue = order.estimatedWaitTime
    ? new Date(placed.getTime() + order.estimatedWaitTime * 60000).toISOString()
    : undefined;

  let status: KitchenOrderStatus = 'new';
  if (order.orderStatus === 'preparing') status = 'preparing';
  else if (order.orderStatus === 'ready') status = 'ready';
  else if (order.orderStatus === 'served' || order.orderStatus === 'completed') status = 'completed';

  // Mark overdue if past due time and not yet completed
  if (timeDue && status !== 'completed' && new Date(timeDue) < new Date()) {
    status = 'overdue';
  }

  return {
    id: order.id,
    orderId: order.id,
    tableNumber: order.tableNumber,
    isOnlineOrder: !order.tableId,
    customerName: order.customerName,
    timePlaced: order.orderPlacedTime ?? order.createdAt,
    timeDue,
    estimatedMinutes: order.estimatedWaitTime,
    status,
    chefAssigned: order.chefAssigned,
    priority: 'normal',
    items: order.items.map((item) => ({
      id: item.id,
      menuItemId: item.menuItemId,
      name: item.name,
      quantity: item.quantity,
      notes: item.notes,
    })),
  };
}

export default function KitchenPage() {
  const router = useRouter();
  const {
    settings,
    updateSettings,
    setTickets,
    upsertTicket,
    removeTicket,
    updateTicketStatus,
    setLoading,
    setOnline,
    isOnline,
    offlineQueue,
    enqueueAction,
    dequeueAction,
    tickets,
  } = useKitchenStore();

  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [openRecipe, setOpenRecipe] = useState<Recipe | null>(null);

  // Sound alert triggers (increment to play sound)
  const [newOrderTrigger, setNewOrderTrigger] = useState(0);
  const [overdueTrigger, setOverdueTrigger] = useState(0);
  const [rushTrigger, setRushTrigger] = useState(0);

  const mountedRef = useRef(false);

  // ── Fetch active orders ────────────────────────────────────────────────────
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    setLoading(true);
    kitchenApi
      .getActiveOrders()
      .then((res) => {
        const converted = res.data.map(orderToTicket);
        setTickets(converted);
      })
      .catch(() => {
        // API unavailable — load from cache or sample data
        const cached = getItem<KitchenTicket[]>(STORAGE_KEYS.kitchenTicketCache);
        if (cached && cached.length > 0) {
          setTickets(cached);
        } else {
          setTickets(sampleKitchenTickets);
        }
      })
      .finally(() => setLoading(false));
  }, [setLoading, setTickets]);

  // ── Overdue watcher (re-evaluate every 30s) ───────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      tickets.forEach((t) => {
        if (
          t.timeDue &&
          t.status !== 'completed' &&
          t.status !== 'overdue' &&
          new Date(t.timeDue).getTime() < now
        ) {
          updateTicketStatus(t.orderId, 'overdue');
          if (settings.soundEnabled && settings.soundOverdue) {
            setOverdueTrigger((n) => n + 1);
          }
        }
      });
    }, 30_000);
    return () => clearInterval(interval);
  }, [tickets, updateTicketStatus, settings]);

  // ── WebSocket integration ──────────────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (order: Order) => {
      const ticket = orderToTicket(order);
      upsertTicket(ticket);
      if (settings.soundEnabled && settings.soundNewOrder) {
        setNewOrderTrigger((n) => n + 1);
      }
      if (ticket.priority === 'rush' && settings.soundEnabled && settings.soundRush) {
        setRushTrigger((n) => n + 1);
      }
    };

    const handleUpdated = (order: Order) => {
      upsertTicket(orderToTicket(order));
    };

    const handleCancelled = (order: Order) => {
      removeTicket(order.id);
    };

    // Support both dot and underscore naming conventions
    socket.on('order.created', handleCreated);
    socket.on('order_created', handleCreated);
    socket.on('order.updated', handleUpdated);
    socket.on('order_updated', handleUpdated);
    socket.on('order.cancelled', handleCancelled);
    socket.on('order_cancelled', handleCancelled);
    socket.on('order.ready', handleUpdated);
    socket.on('order_ready', handleUpdated);

    socket.on('connect', () => setOnline(true));
    socket.on('disconnect', () => setOnline(false));

    return () => {
      socket.off('order.created', handleCreated);
      socket.off('order_created', handleCreated);
      socket.off('order.updated', handleUpdated);
      socket.off('order_updated', handleUpdated);
      socket.off('order.cancelled', handleCancelled);
      socket.off('order_cancelled', handleCancelled);
      socket.off('order.ready', handleUpdated);
      socket.off('order_ready', handleUpdated);
    };
  }, [upsertTicket, removeTicket, setOnline, settings]);

  // ── Replay offline queue when back online ─────────────────────────────────
  useEffect(() => {
    if (!isOnline || offlineQueue.length === 0) return;

    (async () => {
      for (const action of offlineQueue) {
        try {
          if (action.type === 'start') {
            await kitchenApi.startPreparation(action.orderId);
            await kitchenApi.updateOrderStatus(action.orderId, 'preparing');
          } else if (action.type === 'mark_ready') {
            await kitchenApi.updateOrderStatus(action.orderId, 'ready');
          } else if (action.type === 'send_to_server') {
            await kitchenApi.updateOrderStatus(action.orderId, 'served');
          } else if (action.type === 'complete') {
            await kitchenApi.completeOrder(action.orderId);
            await kitchenApi.updateOrderStatus(action.orderId, 'completed');
          }
          dequeueAction(action.id);
        } catch {
          break; // stop on error, retry next cycle
        }
      }
    })();
  }, [isOnline, offlineQueue, dequeueAction]);

  // ── Ticket action handlers ─────────────────────────────────────────────────

  const markProcessing = useCallback((orderId: string, fn: () => Promise<void>) => {
    setProcessingIds((s) => new Set(s).add(orderId));
    fn().finally(() => {
      setProcessingIds((s) => {
        const next = new Set(s);
        next.delete(orderId);
        return next;
      });
    });
  }, []);

  const handleStart = useCallback(
    (orderId: string) => {
      updateTicketStatus(orderId, 'preparing'); // optimistic
      markProcessing(orderId, async () => {
        if (!isOnline) {
          enqueueAction('start', orderId);
          return;
        }
        try {
          await kitchenApi.startPreparation(orderId);
          await kitchenApi.updateOrderStatus(orderId, 'preparing');
        } catch {
          enqueueAction('start', orderId);
        }
      });
    },
    [updateTicketStatus, markProcessing, isOnline, enqueueAction],
  );

  const handleReady = useCallback(
    (orderId: string) => {
      updateTicketStatus(orderId, 'ready'); // optimistic
      markProcessing(orderId, async () => {
        if (!isOnline) {
          enqueueAction('mark_ready', orderId);
          return;
        }
        try {
          await kitchenApi.updateOrderStatus(orderId, 'ready');
        } catch {
          enqueueAction('mark_ready', orderId);
        }
      });
    },
    [updateTicketStatus, markProcessing, isOnline, enqueueAction],
  );

  const handleSendToServer = useCallback(
    (orderId: string) => {
      updateTicketStatus(orderId, 'completed'); // optimistic (served → completed from KDS perspective)
      markProcessing(orderId, async () => {
        if (!isOnline) {
          enqueueAction('send_to_server', orderId);
          return;
        }
        try {
          await kitchenApi.updateOrderStatus(orderId, 'served');
        } catch {
          enqueueAction('send_to_server', orderId);
        }
      });
    },
    [updateTicketStatus, markProcessing, isOnline, enqueueAction],
  );

  const handleComplete = useCallback(
    (orderId: string) => {
      updateTicketStatus(orderId, 'completed'); // optimistic
      markProcessing(orderId, async () => {
        if (!isOnline) {
          enqueueAction('complete', orderId);
          return;
        }
        try {
          await kitchenApi.completeOrder(orderId);
          await kitchenApi.updateOrderStatus(orderId, 'completed');
        } catch {
          enqueueAction('complete', orderId);
        }
      });
    },
    [updateTicketStatus, markProcessing, isOnline, enqueueAction],
  );

  // ── Recipe viewer ──────────────────────────────────────────────────────────
  const handleItemClick = useCallback(
    (menuItemId: string, recipeId?: string) => {
      const id = recipeId ?? menuItemId;
      // Try to navigate to full-screen recipe view
      router.push(`/kitchen/recipe-view/${id}`);
    },
    [router],
  );

  const handleInlineRecipeClose = useCallback(() => setOpenRecipe(null), []);

  // ── Filters ────────────────────────────────────────────────────────────────
  const filteredTickets = selectFilteredTickets(tickets, settings);

  const newCount = filteredTickets.filter((t) => t.status === 'new').length;
  const overdueCount = filteredTickets.filter((t) => t.status === 'overdue').length;

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        {/* Sound alerts (invisible) */}
        <SoundAlert
          enabled={settings.soundEnabled && settings.soundNewOrder}
          trigger={newOrderTrigger}
          type="new_order"
        />
        <SoundAlert
          enabled={settings.soundEnabled && settings.soundOverdue}
          trigger={overdueTrigger}
          type="overdue"
        />
        <SoundAlert
          enabled={settings.soundEnabled && settings.soundRush}
          trigger={rushTrigger}
          type="rush"
        />

        {/* Inline recipe overlay (fallback when not navigating) */}
        {openRecipe && (
          <RecipeViewer recipe={openRecipe} onClose={handleInlineRecipeClose} />
        )}

        {/* Header */}
        <KitchenHeader
          ticketCount={filteredTickets.length}
          newCount={newCount}
          overdueCount={overdueCount}
        />

        {/* Station filter bar */}
        <div className="px-4 py-3 border-b border-border">
          <StationFilter
            value={settings.stationFilter as KitchenStation | 'all'}
            onChange={(station) => updateSettings({ stationFilter: station })}
          />
        </div>

        {/* Offline banner */}
        {!isOnline && (
          <div className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold text-center">
            ⚠️ Offline — changes are queued and will sync when reconnected
            {offlineQueue.length > 0 && ` (${offlineQueue.length} pending)`}
          </div>
        )}

        {/* Ticket grid */}
        <main className="flex-1 p-4">
          <TicketGrid
            tickets={filteredTickets}
            ticketSize={settings.ticketSize}
            density={settings.layoutDensity}
            processingIds={processingIds}
            onStart={handleStart}
            onReady={handleReady}
            onSendToServer={handleSendToServer}
            onComplete={handleComplete}
            onItemClick={handleItemClick}
          />
        </main>
      </div>
    </div>
  );
}
