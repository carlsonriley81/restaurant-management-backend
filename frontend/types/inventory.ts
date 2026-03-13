export interface InventoryItem {
  id: string;
  productName: string;
  quantityOnHand: number;
  lastReceivedDate?: string;
  incomingQuantity?: number;
  incomingEta?: string;
  supplierName?: string;
  costToOrder?: number;
  expirationDate?: string;
  unit?: string;
  lowStockThreshold?: number;
}

export interface InventoryAlert {
  type: 'low_stock' | 'expiring';
  item: InventoryItem;
  message: string;
}
