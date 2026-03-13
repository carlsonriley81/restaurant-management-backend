export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'credit' | 'debit' | 'mobile_pay' | 'gift_card';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderStatus: OrderStatus;
  orderPlacedTime: string;
  estimatedWaitTime?: number;
  chefAssigned?: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  tableId?: string;
  tableNumber?: number;
  customerName?: string;
  items: OrderItem[];
  totalPrice: number;
  discountId?: string;
  discountAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  tableId?: string;
  customerName?: string;
  items: Array<{ menuItemId: string; quantity: number; notes?: string }>;
  paymentMethod?: PaymentMethod;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}
