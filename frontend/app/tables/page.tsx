'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TableCard } from '@/components/tables/TableCard';
import { useTableStore } from '@/stores/tableStore';
import { useOrderStore } from '@/stores/orderStore';

export default function TablesPage() {
  const router = useRouter();
  const { tables, selectedTable, fetchTables, selectTable } = useTableStore();
  const { setSelectedTable } = useOrderStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTables().finally(() => setIsLoading(false));
  }, [fetchTables]);

  const handleSelectTable = (tableId: string) => {
    if (selectedTable?.id === tableId) {
      selectTable(null);
    } else {
      selectTable(tableId);
    }
  };

  const handleCreateOrder = (tableId: string) => {
    setSelectedTable(tableId);
    router.push('/pos');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading tables…
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Table Manager</h1>
        <div className="flex gap-3 text-sm text-muted-foreground">
          {[
            { color: 'bg-green-500', label: 'Available' },
            { color: 'bg-yellow-500', label: 'Seated' },
            { color: 'bg-orange-500', label: 'Ordering' },
            { color: 'bg-red-500', label: 'Preparing' },
            { color: 'bg-blue-500', label: 'Served' },
            { color: 'bg-gray-400', label: 'Paid' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded-full ${color}`} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            isSelected={selectedTable?.id === table.id}
            onClick={() => handleSelectTable(table.id)}
            onCreateOrder={() => handleCreateOrder(table.id)}
            onViewOrders={() => router.push(`/orders?tableId=${table.id}`)}
          />
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No tables found. Add tables through the admin panel.
        </div>
      )}
    </div>
  );
}
