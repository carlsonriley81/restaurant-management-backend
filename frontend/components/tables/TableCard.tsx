import React from 'react';
import { cn } from '@/utils/cn';
import { formatMoney } from '@/utils/money';
import type { Table, TableStatus } from '@/types/tables';

const statusStyles: Record<TableStatus, { bg: string; border: string; dot: string; label: string }> = {
  available: { bg: 'bg-green-50', border: 'border-green-400', dot: 'bg-green-500', label: 'Available' },
  seated: { bg: 'bg-yellow-50', border: 'border-yellow-400', dot: 'bg-yellow-500', label: 'Seated' },
  ordering: { bg: 'bg-orange-50', border: 'border-orange-400', dot: 'bg-orange-500', label: 'Ordering' },
  food_preparing: { bg: 'bg-red-50', border: 'border-red-400', dot: 'bg-red-500', label: 'Preparing' },
  served: { bg: 'bg-blue-50', border: 'border-blue-400', dot: 'bg-blue-500', label: 'Served' },
  paid: { bg: 'bg-gray-50', border: 'border-gray-300', dot: 'bg-gray-400', label: 'Paid' },
};

interface TableCardProps {
  table: Table;
  isSelected?: boolean;
  onClick?: () => void;
  onCreateOrder?: () => void;
  onViewOrders?: () => void;
}

export function TableCard({ table, isSelected, onClick, onCreateOrder, onViewOrders }: TableCardProps) {
  const style = statusStyles[table.status];

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative rounded-xl border-2 p-4 cursor-pointer transition-all select-none',
        style.bg,
        style.border,
        isSelected && 'ring-4 ring-primary ring-offset-2',
        'hover:shadow-md active:scale-95',
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl font-bold">#{table.tableNumber}</span>
        <span className={cn('w-3 h-3 rounded-full', style.dot)} />
      </div>

      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{style.label}</p>

      {table.serverAssigned && (
        <p className="text-xs text-muted-foreground truncate">
          🧑‍💼 {table.serverAssigned}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        👥 Cap: {table.capacity}
      </p>

      {table.currentTotal !== undefined && table.currentTotal > 0 && (
        <p className="mt-2 font-semibold text-sm">{formatMoney(table.currentTotal)}</p>
      )}

      {/* Action buttons shown on selected */}
      {isSelected && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onCreateOrder?.(); }}
            className="flex-1 text-xs bg-primary text-primary-foreground rounded-md py-1.5 hover:bg-primary/90 font-medium"
          >
            + Order
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onViewOrders?.(); }}
            className="flex-1 text-xs bg-secondary text-secondary-foreground rounded-md py-1.5 hover:bg-secondary/80 font-medium"
          >
            View
          </button>
        </div>
      )}
    </div>
  );
}
