'use client';

import { useEffect, useRef } from 'react';
import { getSocket, disconnectSocket } from '@/services/websocket';
import { useOrderStore } from '@/stores/orderStore';
import { useTableStore } from '@/stores/tableStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import type { Order } from '@/types/orders';
import type { Table } from '@/types/tables';
import type { InventoryAlert } from '@/types/inventory';

export function useSocket() {
  const mountedRef = useRef(false);
  const upsertOrder = useOrderStore((s) => s.upsertOrder);
  const upsertTable = useTableStore((s) => s.upsertTable);
  const addAlert = useInventoryStore((s) => s.addAlert);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const socket = getSocket();

    socket.on('order.created', (order: Order) => upsertOrder(order));
    socket.on('order.updated', (order: Order) => upsertOrder(order));
    socket.on('table.updated', (table: Table) => upsertTable(table));
    socket.on('inventory.low_stock', (alert: InventoryAlert) => addAlert(alert));
    socket.on('inventory.expiring', (alert: InventoryAlert) => addAlert(alert));

    return () => {
      socket.off('order.created');
      socket.off('order.updated');
      socket.off('table.updated');
      socket.off('inventory.low_stock');
      socket.off('inventory.expiring');
      disconnectSocket();
      mountedRef.current = false;
    };
  }, [upsertOrder, upsertTable, addAlert]);
}
