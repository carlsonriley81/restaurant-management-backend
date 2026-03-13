'use client';

import React, { memo } from 'react';
import type { KitchenTicket, KitchenOrderStatus, TicketSize, LayoutDensity } from '@/types/kitchen';
import { KitchenTicket as KitchenTicketCard } from './KitchenTicket';
import { cn } from '@/utils/cn';

interface TicketGridProps {
  tickets: KitchenTicket[];
  ticketSize: TicketSize;
  density: LayoutDensity;
  processingIds: Set<string>;
  onStart: (orderId: string) => void;
  onReady: (orderId: string) => void;
  onSendToServer: (orderId: string) => void;
  onComplete: (orderId: string) => void;
  onItemClick?: (menuItemId: string, recipeId?: string) => void;
}

// How many columns per density + ticket size
const GRID_COLS: Record<LayoutDensity, string> = {
  compact:     'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
  comfortable: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  spacious:    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};

// Status sort order (lower = shown first)
const STATUS_ORDER: Record<KitchenOrderStatus, number> = {
  overdue:   0,
  new:       1,
  preparing: 2,
  ready:     3,
  completed: 4,
};

/** Sort tickets: overdue first, then by status, then oldest first within each group. */
function sortTickets(tickets: KitchenTicket[]): KitchenTicket[] {
  return [...tickets].sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (statusDiff !== 0) return statusDiff;
    return new Date(a.timePlaced).getTime() - new Date(b.timePlaced).getTime();
  });
}

export const TicketGrid = memo(function TicketGrid({
  tickets,
  ticketSize,
  density,
  processingIds,
  onStart,
  onReady,
  onSendToServer,
  onComplete,
  onItemClick,
}: TicketGridProps) {
  const sorted = sortTickets(tickets);

  if (sorted.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <span className="text-6xl mb-4">🍽</span>
        <p className="text-2xl font-semibold">No active tickets</p>
        <p className="text-base mt-1">Waiting for new orders…</p>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4', GRID_COLS[density])}>
      {sorted.map((ticket) => (
        <KitchenTicketCard
          key={ticket.orderId}
          ticket={ticket}
          size={ticketSize}
          onStart={onStart}
          onReady={onReady}
          onSendToServer={onSendToServer}
          onComplete={onComplete}
          onItemClick={onItemClick}
          isProcessing={processingIds.has(ticket.orderId)}
        />
      ))}
    </div>
  );
});
