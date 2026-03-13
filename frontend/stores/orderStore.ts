import { create } from 'zustand';
import type { Order, CartItem, OrderStatus, PaymentMethod } from '@/types/orders';
import { ordersApi } from '@/services/orders.api';
import { env } from '@/config/env';
import { calculateTax } from '@/utils/money';

interface OrderState {
  // Active orders list
  activeOrders: Order[];
  isLoadingOrders: boolean;

  // POS cart
  cart: CartItem[];
  selectedTableId: string | null;
  appliedDiscountId: string | null;
  appliedDiscountAmount: number;

  // Computed cart values
  cartSubtotal: () => number;
  cartTax: () => number;
  cartTotal: () => number;

  // Cart actions
  addToCart: (item: CartItem) => void;
  removeFromCart: (menuItemId: string) => void;
  updateCartItemQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setSelectedTable: (tableId: string | null) => void;
  applyDiscount: (discountId: string, amount: number) => void;
  clearDiscount: () => void;

  // Order actions
  fetchOrders: (params?: Record<string, string>) => Promise<void>;
  createOrder: (paymentMethod?: PaymentMethod) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  upsertOrder: (order: Order) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  activeOrders: [],
  isLoadingOrders: false,
  cart: [],
  selectedTableId: null,
  appliedDiscountId: null,
  appliedDiscountAmount: 0,

  cartSubtotal: () => {
    return get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  cartTax: () => {
    return calculateTax(get().cartSubtotal(), env.taxRate);
  },

  cartTotal: () => {
    const { appliedDiscountAmount } = get();
    const subtotal = get().cartSubtotal();
    const discounted = Math.max(0, subtotal - appliedDiscountAmount);
    return discounted + calculateTax(discounted, env.taxRate);
  },

  addToCart: (item) => {
    set((state) => {
      const existing = state.cart.find((c) => c.menuItemId === item.menuItemId);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.menuItemId === item.menuItemId
              ? { ...c, quantity: c.quantity + 1 }
              : c,
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    });
  },

  removeFromCart: (menuItemId) => {
    set((state) => ({ cart: state.cart.filter((c) => c.menuItemId !== menuItemId) }));
  },

  updateCartItemQuantity: (menuItemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(menuItemId);
      return;
    }
    set((state) => ({
      cart: state.cart.map((c) =>
        c.menuItemId === menuItemId ? { ...c, quantity } : c,
      ),
    }));
  },

  clearCart: () => set({ cart: [], appliedDiscountId: null, appliedDiscountAmount: 0, selectedTableId: null }),

  setSelectedTable: (tableId) => set({ selectedTableId: tableId }),

  applyDiscount: (discountId, amount) =>
    set({ appliedDiscountId: discountId, appliedDiscountAmount: amount }),

  clearDiscount: () => set({ appliedDiscountId: null, appliedDiscountAmount: 0 }),

  fetchOrders: async (params) => {
    set({ isLoadingOrders: true });
    try {
      const response = await ordersApi.getAll(params);
      set({ activeOrders: response.data, isLoadingOrders: false });
    } catch {
      set({ isLoadingOrders: false });
    }
  },

  createOrder: async (paymentMethod) => {
    const { cart, selectedTableId } = get();
    const response = await ordersApi.create({
      tableId: selectedTableId ?? undefined,
      items: cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.quantity, notes: c.notes })),
      paymentMethod,
    });
    get().clearCart();
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    await ordersApi.updateStatus(orderId, status);
    set((state) => ({
      activeOrders: state.activeOrders.map((o) =>
        o.id === orderId ? { ...o, orderStatus: status } : o,
      ),
    }));
  },

  upsertOrder: (order) => {
    set((state) => {
      const exists = state.activeOrders.some((o) => o.id === order.id);
      if (exists) {
        return { activeOrders: state.activeOrders.map((o) => (o.id === order.id ? order : o)) };
      }
      return { activeOrders: [order, ...state.activeOrders] };
    });
  },
}));
