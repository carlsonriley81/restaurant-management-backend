import api from './api';
import type { Recipe } from '@/types/kitchen';
import type { Order, OrderStatus } from '@/types/orders';

export const kitchenApi = {
  /** GET /orders/active — fetch all non-completed orders for the KDS. */
  getActiveOrders: () => api.get<Order[]>('/orders/active'),

  /** PUT /orders/:id/status — update order status. */
  updateOrderStatus: (orderId: string, status: OrderStatus) =>
    api.put(`/orders/${orderId}/status`, { status }),

  /** GET /recipes/:id — fetch recipe details. */
  getRecipe: (recipeId: string) => api.get<Recipe>(`/recipes/${recipeId}`),

  /** POST /kitchen/start — notify backend to deduct ingredients and begin tracking. */
  startPreparation: (orderId: string, options?: { station?: string; chef?: string }) =>
    api.post('/kitchen/start', { orderId, ...options }),

  /** POST /kitchen/complete — notify backend of order completion. */
  completeOrder: (orderId: string) =>
    api.post('/kitchen/complete', { orderId }),
};
