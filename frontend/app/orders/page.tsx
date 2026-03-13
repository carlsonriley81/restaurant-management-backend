'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useOrderStore } from '@/stores/orderStore';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { formatDateTime, minutesAgo } from '@/utils/dates';
import { formatMoney } from '@/utils/money';
import type { OrderStatus } from '@/types/orders';

const STATUS_FILTERS: Array<{ value: OrderStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'placed', label: 'Placed' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'served', label: 'Served' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const { activeOrders, isLoadingOrders, fetchOrders, updateOrderStatus } = useOrderStore();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = useCallback(
    async (orderId: string, status: OrderStatus) => {
      await updateOrderStatus(orderId, status);
    },
    [updateOrderStatus],
  );

  const filtered = statusFilter === 'all'
    ? activeOrders
    : activeOrders.filter((o) => o.orderStatus === statusFilter);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Order Tracking</h1>
        <button
          onClick={() => fetchOrders()}
          className="text-sm text-muted-foreground hover:text-foreground border rounded-md px-3 py-1.5"
        >
          ↺ Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              statusFilter === f.value
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoadingOrders ? (
        <div className="text-center py-16 text-muted-foreground">Loading orders…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No orders found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-semibold">Order ID</th>
                <th className="text-left p-3 font-semibold">Table</th>
                <th className="text-left p-3 font-semibold">Status</th>
                <th className="text-left p-3 font-semibold">Items</th>
                <th className="text-right p-3 font-semibold">Total</th>
                <th className="text-left p-3 font-semibold">Placed</th>
                <th className="text-left p-3 font-semibold">Wait</th>
                <th className="text-left p-3 font-semibold">Chef</th>
                <th className="text-left p-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-mono text-xs text-muted-foreground">
                    #{order.id.slice(-8)}
                  </td>
                  <td className="p-3">
                    {order.tableNumber ? `Table ${order.tableNumber}` : order.customerName ?? '—'}
                  </td>
                  <td className="p-3">
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </td>
                  <td className="p-3 text-right font-semibold">{formatMoney(order.totalPrice)}</td>
                  <td className="p-3 text-muted-foreground text-xs">
                    {formatDateTime(order.orderPlacedTime)}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {minutesAgo(order.orderPlacedTime)}m ago
                  </td>
                  <td className="p-3 text-muted-foreground">{order.chefAssigned ?? '—'}</td>
                  <td className="p-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                      className="text-xs border rounded px-2 py-1 bg-background"
                    >
                      {STATUS_FILTERS.filter((f) => f.value !== 'all').map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
