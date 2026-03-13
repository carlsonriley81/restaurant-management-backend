export type TableStatus =
  | 'available'
  | 'seated'
  | 'ordering'
  | 'food_preparing'
  | 'served'
  | 'paid';

export interface Table {
  id: string;
  tableNumber: number;
  capacity: number;
  serverAssigned?: string;
  status: TableStatus;
  currentOrderId?: string;
  currentTotal?: number;
  posX?: number;
  posY?: number;
}

export interface UpdateTablePayload {
  status?: TableStatus;
  serverAssigned?: string;
}
