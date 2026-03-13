'use client';

import React, { memo } from 'react';
import type { KitchenOrderStatus } from '@/types/kitchen';
import { cn } from '@/utils/cn';

const STATUS_CONFIG: Record<
  KitchenOrderStatus,
  { label: string; className: string }
> = {
  new:       { label: 'New Order',  className: 'bg-gray-500 text-white' },
  preparing: { label: 'Preparing',  className: 'bg-yellow-500 text-black' },
  ready:     { label: 'Ready',      className: 'bg-green-600 text-white' },
  overdue:   { label: 'OVERDUE',    className: 'bg-red-600 text-white animate-pulse' },
  completed: { label: 'Completed',  className: 'bg-blue-600 text-white' },
};

interface OrderStatusBadgeProps {
  status: KitchenOrderStatus;
  className?: string;
  large?: boolean;
}

export const OrderStatusBadge = memo(function OrderStatusBadge({
  status,
  className,
  large = false,
}: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-bold rounded-md tracking-wide uppercase',
        large ? 'px-4 py-2 text-lg' : 'px-3 py-1 text-sm',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
});
