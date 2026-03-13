'use client';

import React from 'react';
import Link from 'next/link';
import { useKitchenStore } from '@/stores/kitchenStore';
import { STATIONS } from '@/components/kitchen/StationFilter';
import type { KitchenStation, TicketSize, LayoutDensity } from '@/types/kitchen';
import { cn } from '@/utils/cn';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-border last:border-0">
      <span className="text-lg font-semibold">{label}</span>
      <div>{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-14 h-7 rounded-full transition-colors',
        checked ? 'bg-green-500' : 'bg-muted',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-7' : 'translate-x-0.5',
        )}
      />
    </button>
  );
}

function ButtonGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold border transition-colors',
            value === opt.value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-background border-border hover:bg-accent',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function KitchenSettingsPage() {
  const { settings, updateSettings, resetSettings } = useKitchenStore();

  return (
    <div className={settings.darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4 border-b border-border bg-background">
          <Link
            href="/kitchen"
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent font-semibold text-sm transition-colors"
          >
            ← Back to KDS
          </Link>
          <h1 className="text-2xl font-black">Kitchen Settings</h1>
          <button
            onClick={resetSettings}
            className="ml-auto px-4 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 text-sm font-semibold transition-colors"
          >
            Reset to defaults
          </button>
        </div>

        <div className="max-w-2xl mx-auto px-6 py-6">
          {/* ── Station ── */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-muted-foreground uppercase tracking-wide text-sm">
              Station
            </h2>
            <Row label="Default station filter">
              <div className="flex flex-wrap gap-2">
                {STATIONS.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => updateSettings({ stationFilter: s.value as KitchenStation | 'all' })}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-sm font-semibold border transition-colors',
                      settings.stationFilter === s.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background border-border hover:bg-accent',
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </Row>
          </section>

          {/* ── Sound ── */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-muted-foreground uppercase tracking-wide text-sm">
              Sound Alerts
            </h2>
            <Row label="Enable sounds">
              <Toggle
                checked={settings.soundEnabled}
                onChange={(v) => updateSettings({ soundEnabled: v })}
              />
            </Row>
            <Row label="New order sound">
              <Toggle
                checked={settings.soundNewOrder}
                onChange={(v) => updateSettings({ soundNewOrder: v })}
              />
            </Row>
            <Row label="Overdue alert sound">
              <Toggle
                checked={settings.soundOverdue}
                onChange={(v) => updateSettings({ soundOverdue: v })}
              />
            </Row>
            <Row label="Rush order sound">
              <Toggle
                checked={settings.soundRush}
                onChange={(v) => updateSettings({ soundRush: v })}
              />
            </Row>
          </section>

          {/* ── Display ── */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-muted-foreground uppercase tracking-wide text-sm">
              Display
            </h2>
            <Row label="Layout density">
              <ButtonGroup<LayoutDensity>
                options={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'comfortable', label: 'Comfortable' },
                  { value: 'spacious', label: 'Spacious' },
                ]}
                value={settings.layoutDensity}
                onChange={(v) => updateSettings({ layoutDensity: v })}
              />
            </Row>
            <Row label="Ticket size">
              <ButtonGroup<TicketSize>
                options={[
                  { value: 'S', label: 'Small' },
                  { value: 'M', label: 'Medium' },
                  { value: 'L', label: 'Large' },
                ]}
                value={settings.ticketSize}
                onChange={(v) => updateSettings({ ticketSize: v })}
              />
            </Row>
            <Row label="Dark mode">
              <Toggle
                checked={settings.darkMode}
                onChange={(v) => updateSettings({ darkMode: v })}
              />
            </Row>
          </section>
        </div>
      </div>
    </div>
  );
}
