import api from './api';
import type { SalesReport, InventoryReport, EmployeeReport, KitchenReport } from '@/types/reports';

export const reportsApi = {
  getSales: (params?: { period?: 'daily' | 'weekly' | 'monthly'; start?: string; end?: string }) =>
    api.get<SalesReport>('/reports/sales', { params }),

  getInventory: () =>
    api.get<InventoryReport>('/reports/inventory'),

  getEmployees: (params?: { start?: string; end?: string }) =>
    api.get<EmployeeReport[]>('/reports/employees', { params }),

  getKitchen: (params?: { start?: string; end?: string }) =>
    api.get<KitchenReport>('/reports/kitchen', { params }),

  export: (type: string, format: 'csv' | 'pdf' | 'json') =>
    api.get(`/reports/${type}/export`, { params: { format }, responseType: 'blob' }),
};
