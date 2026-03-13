import React from 'react';
import { cn } from '@/utils/cn';
import type { OrderStatus } from '@/types/orders';
import type { TableStatus } from '@/types/tables';

type Status = OrderStatus | TableStatus;

const statusConfig: Record<Status, { label: string; className: string }> = {
  // Order statuses
  placed: { label: 'Placed', className: 'bg-blue-100 text-blue-800' },
  accepted: { label: 'Accepted', className: 'bg-indigo-100 text-indigo-800' },
  preparing: { label: 'Preparing', className: 'bg-yellow-100 text-yellow-800' },
  ready: { label: 'Ready', className: 'bg-green-100 text-green-800' },
  served: { label: 'Served', className: 'bg-purple-100 text-purple-800' },
  completed: { label: 'Completed', className: 'bg-gray-100 text-gray-800' },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
  // Table statuses
  available: { label: 'Available', className: 'bg-green-100 text-green-800' },
  seated: { label: 'Seated', className: 'bg-yellow-100 text-yellow-800' },
  ordering: { label: 'Ordering', className: 'bg-orange-100 text-orange-800' },
  food_preparing: { label: 'Preparing', className: 'bg-red-100 text-red-800' },
  paid: { label: 'Paid', className: 'bg-gray-100 text-gray-800' },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? { label: status, className: 'bg-gray-100 text-gray-800' };
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
