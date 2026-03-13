'use client';

import React, { memo, useEffect, useState } from 'react';
import { cn } from '@/utils/cn';

interface TicketTimerProps {
  timePlaced: string;   // ISO timestamp — when the order was placed
  timeDue?: string;     // ISO timestamp — deadline
  className?: string;
}

function getElapsed(from: string): number {
  return Math.floor((Date.now() - new Date(from).getTime()) / 1000);
}

function getRemaining(due: string): number {
  return Math.floor((new Date(due).getTime() - Date.now()) / 1000);
}

function formatDuration(seconds: number): string {
  const abs = Math.abs(seconds);
  const m = Math.floor(abs / 60);
  const s = abs % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const TicketTimer = memo(function TicketTimer({
  timePlaced,
  timeDue,
  className,
}: TicketTimerProps) {
  const [, setTick] = useState(0);

  // Re-render every second to keep timers live.
  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const elapsed = getElapsed(timePlaced);
  const remaining = timeDue ? getRemaining(timeDue) : null;
  const isOverdue = remaining !== null && remaining < 0;

  return (
    <div className={cn('flex flex-col gap-1 text-sm font-mono', className)}>
      <div className="flex items-center gap-1 text-muted-foreground">
        <span className="text-xs uppercase tracking-wide font-semibold">Elapsed</span>
        <span className="ml-auto font-bold text-base">{formatDuration(elapsed)}</span>
      </div>
      {remaining !== null && (
        <div
          className={cn(
            'flex items-center gap-1',
            isOverdue ? 'text-red-600 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400',
          )}
        >
          <span className="text-xs uppercase tracking-wide font-semibold">
            {isOverdue ? 'Overdue' : 'Remaining'}
          </span>
          <span className="ml-auto font-bold text-base">
            {isOverdue ? '+' : ''}{formatDuration(remaining)}
          </span>
        </div>
      )}
    </div>
  );
});
