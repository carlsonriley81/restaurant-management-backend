import api from './api';
import type { MenuItem, CreateMenuItemPayload, MenuCategory } from '@/types/menu';

export const menuApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<MenuItem[]>('/menu', { params }),

  getById: (id: string) =>
    api.get<MenuItem>(`/menu/${id}`),

  getCategories: () =>
    api.get<MenuCategory[]>('/menu/categories'),

  create: (payload: CreateMenuItemPayload) =>
    api.post<MenuItem>('/menu', payload),

  update: (id: string, payload: Partial<CreateMenuItemPayload>) =>
    api.put<MenuItem>(`/menu/${id}`, payload),

  toggleActive: (id: string, active: boolean) =>
    api.put<MenuItem>(`/menu/${id}`, { active }),

  delete: (id: string) =>
    api.delete(`/menu/${id}`),
};
