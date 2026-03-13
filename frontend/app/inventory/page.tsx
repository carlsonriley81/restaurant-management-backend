'use client';

import React, { useEffect } from 'react';
import { useInventoryStore } from '@/stores/inventoryStore';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { Button } from '@/components/ui/button';

export default function InventoryPage() {
  const { items, alerts, isLoading, fetchItems } = useInventoryStore();

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Inventory</h1>
        <Button variant="outline" onClick={() => fetchItems()}>↺ Refresh</Button>
      </div>

      {alerts.length > 0 && (
        <div className="mb-4 space-y-2">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`rounded-lg px-4 py-2 text-sm font-medium ${
                alert.type === 'low_stock'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {alert.type === 'low_stock' ? '⚠️ Low Stock:' : '⏰ Expiring:'} {alert.message}
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Loading inventory…</div>
      ) : (
        <InventoryTable items={items} />
      )}
    </div>
  );
}
