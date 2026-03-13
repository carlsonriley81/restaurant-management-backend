import api from './api';

export interface Discount {
  id: string;
  name: string;
  type: 'percentage' | 'fixed';
  percentage?: number;
  fixedAmount?: number;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

export const discountsApi = {
  getAll: () =>
    api.get<Discount[]>('/discounts'),

  getById: (id: string) =>
    api.get<Discount>(`/discounts/${id}`),

  create: (payload: Omit<Discount, 'id'>) =>
    api.post<Discount>('/discounts', payload),

  update: (id: string, payload: Partial<Discount>) =>
    api.put<Discount>(`/discounts/${id}`, payload),

  validate: (code: string) =>
    api.post<Discount>('/discounts/validate', { code }),

  delete: (id: string) =>
    api.delete(`/discounts/${id}`),
};
