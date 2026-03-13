'use client';

import React, { memo } from 'react';
import type { KitchenStation } from '@/types/kitchen';
import { cn } from '@/utils/cn';

export const STATIONS: Array<{ value: KitchenStation | 'all'; label: string }> = [
  { value: 'all',     label: 'All Stations' },
  { value: 'grill',   label: '🔥 Grill' },
  { value: 'fryer',   label: '🍟 Fryer' },
  { value: 'salad',   label: '🥗 Salad' },
  { value: 'dessert', label: '🍰 Dessert' },
  { value: 'drinks',  label: '🥤 Drinks' },
  { value: 'prep',    label: '🔪 Prep' },
  { value: 'bar',     label: '🍸 Bar' },
];

interface StationFilterProps {
  value: KitchenStation | 'all';
  onChange: (station: KitchenStation | 'all') => void;
  className?: string;
}

export const StationFilter = memo(function StationFilter({
  value,
  onChange,
  className,
}: StationFilterProps) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {STATIONS.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold transition-colors',
            value === s.value
              ? 'bg-primary text-primary-foreground shadow'
              : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
});
