'use client';

import React, { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useKitchenStore } from '@/stores/kitchenStore';
import { kitchenApi } from '@/services/kitchen.api';
import { KitchenTicket } from '@/components/kitchen/KitchenTicket';
import Link from 'next/link';

export default function TicketViewPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router = useRouter();
  const { tickets, updateTicketStatus, isOnline, enqueueAction } = useKitchenStore();

  const ticket = tickets.find((t) => t.orderId === orderId);

  const handleStart = useCallback(
    async (id: string) => {
      updateTicketStatus(id, 'preparing');
      if (!isOnline) { enqueueAction('start', id); return; }
      try {
        await kitchenApi.startPreparation(id);
        await kitchenApi.updateOrderStatus(id, 'preparing');
      } catch { enqueueAction('start', id); }
    },
    [updateTicketStatus, isOnline, enqueueAction],
  );

  const handleReady = useCallback(
    async (id: string) => {
      updateTicketStatus(id, 'ready');
      if (!isOnline) { enqueueAction('mark_ready', id); return; }
      try { await kitchenApi.updateOrderStatus(id, 'ready'); }
      catch { enqueueAction('mark_ready', id); }
    },
    [updateTicketStatus, isOnline, enqueueAction],
  );

  const handleSend = useCallback(
    async (id: string) => {
      updateTicketStatus(id, 'completed');
      if (!isOnline) { enqueueAction('send_to_server', id); return; }
      try { await kitchenApi.updateOrderStatus(id, 'served'); }
      catch { enqueueAction('send_to_server', id); }
    },
    [updateTicketStatus, isOnline, enqueueAction],
  );

  const handleComplete = useCallback(
    async (id: string) => {
      updateTicketStatus(id, 'completed');
      if (!isOnline) { enqueueAction('complete', id); return; }
      try {
        await kitchenApi.completeOrder(id);
        await kitchenApi.updateOrderStatus(id, 'completed');
      } catch { enqueueAction('complete', id); }
      router.push('/kitchen');
    },
    [updateTicketStatus, isOnline, enqueueAction, router],
  );

  const handleItemClick = useCallback(
    (_menuItemId: string, recipeId?: string) => {
      if (recipeId) router.push(`/kitchen/recipe-view/${recipeId}`);
    },
    [router],
  );

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-2xl font-semibold text-muted-foreground">Ticket not found.</p>
        <Link href="/kitchen" className="px-5 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-lg">
          ← Back to KDS
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground p-6">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/kitchen"
          className="px-4 py-2 rounded-lg border border-border hover:bg-accent font-semibold text-sm transition-colors"
        >
          ← Back
        </Link>
        <h1 className="text-2xl font-black">Ticket Focus View</h1>
      </div>
      <div className="max-w-xl mx-auto w-full">
        <KitchenTicket
          ticket={ticket}
          size="L"
          onStart={handleStart}
          onReady={handleReady}
          onSendToServer={handleSend}
          onComplete={handleComplete}
          onItemClick={handleItemClick}
        />
      </div>
    </div>
  );
}
