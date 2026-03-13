'use client';

import React, { memo, useCallback } from 'react';
import { cn } from '@/utils/cn';
import type { KitchenTicket as KitchenTicketData, KitchenOrderStatus, KitchenPriority, TicketSize } from '@/types/kitchen';
import { OrderStatusBadge } from './OrderStatusBadge';
import { TicketTimer } from './TicketTimer';
import { formatDateTime } from '@/utils/dates';

// ─── Priority badge ────────────────────────────────────────────────────────────

const PRIORITY_CONFIG: Record<KitchenPriority, { label: string; className: string }> = {
  normal:      { label: 'Normal',     className: 'bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200' },
  rush:        { label: '⚡ Rush',     className: 'bg-orange-500 text-white animate-pulse' },
  vip:         { label: '⭐ VIP',      className: 'bg-purple-600 text-white' },
  large_order: { label: '🍽 Large',   className: 'bg-indigo-600 text-white' },
};

// ─── Card color by status ──────────────────────────────────────────────────────

const CARD_STATUS_CLASS: Record<KitchenOrderStatus, string> = {
  new:       'bg-gray-50 border-gray-300 dark:bg-gray-800 dark:border-gray-600',
  preparing: 'bg-yellow-50 border-yellow-400 dark:bg-yellow-900/40 dark:border-yellow-500',
  ready:     'bg-green-50 border-green-500 dark:bg-green-900/40 dark:border-green-500',
  overdue:   'bg-red-50 border-red-500 dark:bg-red-900/40 dark:border-red-500 animate-pulse',
  completed: 'bg-blue-50 border-blue-400 dark:bg-blue-900/30 dark:border-blue-500 opacity-70',
};

const SIZE_CLASS: Record<TicketSize, string> = {
  S: 'text-sm',
  M: 'text-base',
  L: 'text-lg',
};

// ─── Props ─────────────────────────────────────────────────────────────────────

interface KitchenTicketProps {
  ticket: KitchenTicketData;
  size?: TicketSize;
  onStart: (orderId: string) => void;
  onReady: (orderId: string) => void;
  onSendToServer: (orderId: string) => void;
  onComplete: (orderId: string) => void;
  onItemClick?: (menuItemId: string, recipeId?: string) => void;
  isProcessing?: boolean;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export const KitchenTicket = memo(function KitchenTicket({
  ticket,
  size = 'M',
  onStart,
  onReady,
  onSendToServer,
  onComplete,
  onItemClick,
  isProcessing = false,
}: KitchenTicketProps) {
  const priorityConfig = PRIORITY_CONFIG[ticket.priority];
  const textSize = SIZE_CLASS[size];

  const handleStart = useCallback(() => onStart(ticket.orderId), [onStart, ticket.orderId]);
  const handleReady = useCallback(() => onReady(ticket.orderId), [onReady, ticket.orderId]);
  const handleSend = useCallback(() => onSendToServer(ticket.orderId), [onSendToServer, ticket.orderId]);
  const handleComplete = useCallback(() => onComplete(ticket.orderId), [onComplete, ticket.orderId]);

  const tableLabel = ticket.isOnlineOrder
    ? '🌐 Online Order'
    : `Table ${ticket.tableNumber ?? '—'}`;

  return (
    <div
      className={cn(
        'rounded-xl border-2 shadow-sm flex flex-col overflow-hidden transition-all duration-300',
        CARD_STATUS_CLASS[ticket.status],
        textSize,
        isProcessing && 'opacity-60 pointer-events-none',
      )}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between px-4 pt-4 pb-2 gap-2">
        <div>
          <p className="font-bold text-xl leading-tight">{tableLabel}</p>
          <p className="text-muted-foreground text-sm font-mono">#{ticket.orderId.slice(-6).toUpperCase()}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <OrderStatusBadge status={ticket.status} />
          <span
            className={cn(
              'px-2 py-0.5 rounded text-xs font-bold',
              priorityConfig.className,
            )}
          >
            {priorityConfig.label}
          </span>
        </div>
      </div>

      {/* ── Time info ── */}
      <div className="px-4 pb-2 text-xs text-muted-foreground flex gap-4">
        <span>Placed: {formatDateTime(ticket.timePlaced)}</span>
        {ticket.timeDue && <span>Due: {formatDateTime(ticket.timeDue)}</span>}
      </div>

      {ticket.chefAssigned && (
        <div className="px-4 pb-1 text-sm text-muted-foreground">
          👨‍🍳 {ticket.chefAssigned}
        </div>
      )}

      {/* ── Timer ── */}
      <div className="px-4 py-2 border-t border-dashed border-current/10">
        <TicketTimer timePlaced={ticket.timePlaced} timeDue={ticket.timeDue} />
      </div>

      {/* ── Items ── */}
      <div className="px-4 py-3 flex-1 border-t border-dashed border-current/10">
        <p className="text-xs uppercase font-bold tracking-wider text-muted-foreground mb-2">Items</p>
        <ul className="space-y-1">
          {ticket.items.map((item) => (
            <li key={item.id} className="flex items-start gap-2">
              <span className="font-bold min-w-[2rem] text-right">{item.quantity}×</span>
              <div className="flex-1">
                {onItemClick && (item.recipeId ?? item.menuItemId) ? (
                  <button
                    className="font-semibold underline underline-offset-2 decoration-dotted hover:text-primary text-left"
                    onClick={() => onItemClick(item.menuItemId, item.recipeId)}
                  >
                    {item.name}
                  </button>
                ) : (
                  <span className="font-semibold">{item.name}</span>
                )}
                {item.notes && (
                  <p className="text-xs text-orange-600 dark:text-orange-400 italic mt-0.5">
                    Note: {item.notes}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        {ticket.notes && (
          <p className="mt-2 text-sm italic text-orange-600 dark:text-orange-400 border-l-2 border-orange-400 pl-2">
            {ticket.notes}
          </p>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="grid grid-cols-2 gap-2 p-3 border-t border-current/10">
        {ticket.status === 'new' && (
          <button
            onClick={handleStart}
            className="col-span-2 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-base transition-colors active:scale-95"
          >
            🍳 Start Preparing
          </button>
        )}
        {ticket.status === 'preparing' && (
          <button
            onClick={handleReady}
            className="col-span-2 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold text-base transition-colors active:scale-95"
          >
            ✅ Mark Ready
          </button>
        )}
        {ticket.status === 'ready' && (
          <button
            onClick={handleSend}
            className="col-span-2 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition-colors active:scale-95"
          >
            🚀 Send to Server
          </button>
        )}
        <button
          onClick={handleComplete}
          className="col-span-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-semibold text-sm transition-colors active:scale-95"
        >
          Complete Order
        </button>
      </div>
    </div>
  );
});
