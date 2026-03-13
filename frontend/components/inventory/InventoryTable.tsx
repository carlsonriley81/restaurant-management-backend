import React from 'react';
import { cn } from '@/utils/cn';
import { formatMoney } from '@/utils/money';
import { formatDate, isWithinDays } from '@/utils/dates';
import type { InventoryItem } from '@/types/inventory';

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No inventory items found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-semibold">Product</th>
            <th className="text-right p-3 font-semibold">Qty On Hand</th>
            <th className="text-right p-3 font-semibold">Incoming</th>
            <th className="text-left p-3 font-semibold">Supplier</th>
            <th className="text-left p-3 font-semibold">Expires</th>
            <th className="text-right p-3 font-semibold">Cost</th>
            <th className="text-left p-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => {
            const isLowStock =
              item.lowStockThreshold !== undefined && item.quantityOnHand <= item.lowStockThreshold;
            const isExpiringSoon =
              item.expirationDate !== undefined && isWithinDays(item.expirationDate, 3);

            return (
              <tr
                key={item.id}
                className={cn(
                  'hover:bg-muted/30 transition-colors',
                  isLowStock && 'bg-red-50',
                  isExpiringSoon && !isLowStock && 'bg-yellow-50',
                )}
              >
                <td className="p-3 font-medium">
                  {item.productName}
                  {item.unit && <span className="text-muted-foreground text-xs ml-1">({item.unit})</span>}
                </td>
                <td className="p-3 text-right">{item.quantityOnHand}</td>
                <td className="p-3 text-right text-muted-foreground">
                  {item.incomingQuantity ?? '—'}
                </td>
                <td className="p-3 text-muted-foreground">{item.supplierName ?? '—'}</td>
                <td className="p-3 text-muted-foreground">
                  {item.expirationDate ? formatDate(item.expirationDate) : '—'}
                </td>
                <td className="p-3 text-right">
                  {item.costToOrder !== undefined ? formatMoney(item.costToOrder) : '—'}
                </td>
                <td className="p-3">
                  <div className="flex gap-1 flex-wrap">
                    {isLowStock && (
                      <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                        Low Stock
                      </span>
                    )}
                    {isExpiringSoon && (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-700">
                        Expiring
                      </span>
                    )}
                    {!isLowStock && !isExpiringSoon && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                        OK
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
