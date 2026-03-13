import api from './api';
import type { Order, CreateOrderPayload, OrderStatus } from '@/types/orders';

export const ordersApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<Order[]>('/orders', { params }),

  getById: (id: string) =>
    api.get<Order>(`/orders/${id}`),

  create: (payload: CreateOrderPayload) =>
    api.post<Order>('/orders', payload),

  update: (id: string, payload: Partial<CreateOrderPayload>) =>
    api.put<Order>(`/orders/${id}`, payload),

  updateStatus: (id: string, status: OrderStatus) =>
    api.put<Order>(`/orders/${id}/status`, { status }),

  assignChef: (id: string, chefId: string) =>
    api.put<Order>(`/orders/${id}/chef`, { chefId }),

  delete: (id: string) =>
    api.delete(`/orders/${id}`),
};
