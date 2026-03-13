import type { Order } from './orders';
import type { Table } from './tables';
import type { InventoryAlert } from './inventory';

export interface WsOrderCreatedEvent {
  event: 'order.created';
  data: Order;
}

export interface WsOrderUpdatedEvent {
  event: 'order.updated';
  data: Order;
}

export interface WsTableUpdatedEvent {
  event: 'table.updated';
  data: Table;
}

export interface WsInventoryLowStockEvent {
  event: 'inventory.low_stock';
  data: InventoryAlert;
}

export interface WsInventoryExpiringEvent {
  event: 'inventory.expiring';
  data: InventoryAlert;
}

export interface WsNotificationNewEvent {
  event: 'notification.new';
  data: {
    id: string;
    message: string;
    type: string;
    createdAt: string;
  };
}

export type WsEvent =
  | WsOrderCreatedEvent
  | WsOrderUpdatedEvent
  | WsTableUpdatedEvent
  | WsInventoryLowStockEvent
  | WsInventoryExpiringEvent
  | WsNotificationNewEvent;
