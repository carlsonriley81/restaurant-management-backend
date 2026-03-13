import api from './api';
import type { InventoryItem } from '@/types/inventory';

export const inventoryApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<InventoryItem[]>('/inventory', { params }),

  getById: (id: string) =>
    api.get<InventoryItem>(`/inventory/${id}`),

  getLowStock: () =>
    api.get<InventoryItem[]>('/inventory?filter=low_stock'),

  getExpiring: () =>
    api.get<InventoryItem[]>('/inventory?filter=expiring'),

  create: (payload: Omit<InventoryItem, 'id'>) =>
    api.post<InventoryItem>('/inventory', payload),

  update: (id: string, payload: Partial<InventoryItem>) =>
    api.put<InventoryItem>(`/inventory/${id}`, payload),

  delete: (id: string) =>
    api.delete(`/inventory/${id}`),
};
