'use client';

import React, { memo, useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useKitchenStore } from '@/stores/kitchenStore';

interface KitchenHeaderProps {
  ticketCount: number;
  newCount: number;
  overdueCount: number;
}

function useClock(): string {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return time;
}

export const KitchenHeader = memo(function KitchenHeader({
  ticketCount,
  newCount,
  overdueCount,
}: KitchenHeaderProps) {
  const { isOnline, settings, updateSettings, offlineQueue } = useKitchenStore();
  const now = useClock();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur gap-3">
      {/* Left — branding + counts */}
      <div className="flex items-center gap-4 shrink-0">
        <Link href="/kitchen" className="text-2xl font-black tracking-tight">
          🍳 KDS
        </Link>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="px-2 py-0.5 rounded bg-muted font-semibold">{ticketCount} tickets</span>
          {newCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-yellow-500 text-black font-bold">
              {newCount} new
            </span>
          )}
          {overdueCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-bold animate-pulse">
              {overdueCount} overdue
            </span>
          )}
        </div>
      </div>

      {/* Right — controls */}
      <div className="flex items-center gap-3">
        {/* Offline queue badge */}
        {offlineQueue.length > 0 && (
          <span className="px-2 py-1 rounded bg-orange-500 text-white text-xs font-bold">
            {offlineQueue.length} queued
          </span>
        )}

        {/* Online indicator */}
        <span
          className={cn(
            'w-3 h-3 rounded-full shrink-0',
            isOnline ? 'bg-green-500' : 'bg-red-500 animate-pulse',
          )}
          title={isOnline ? 'Connected' : 'Offline — changes are queued'}
        />

        {/* Mute toggle */}
        <button
          onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          className="px-3 py-1.5 rounded-md text-sm font-semibold border border-border hover:bg-accent transition-colors"
          title={settings.soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
        >
          {settings.soundEnabled ? '🔔' : '🔕'}
        </button>

        {/* Clock */}
        <span className="hidden md:block text-lg font-mono font-bold tabular-nums">
          {now}
        </span>

        {/* Settings link */}
        <Link
          href="/kitchen/settings"
          className="px-3 py-1.5 rounded-md text-sm font-semibold border border-border hover:bg-accent transition-colors"
        >
          ⚙️
        </Link>
      </div>
    </header>
  );
});
