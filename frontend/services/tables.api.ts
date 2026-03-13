import api from './api';
import type { Table, UpdateTablePayload } from '@/types/tables';

export const tablesApi = {
  getAll: () =>
    api.get<Table[]>('/tables'),

  getById: (id: string) =>
    api.get<Table>(`/tables/${id}`),

  update: (id: string, payload: UpdateTablePayload) =>
    api.put<Table>(`/tables/${id}`, payload),

  assignServer: (id: string, serverId: string) =>
    api.put<Table>(`/tables/${id}/server`, { serverId }),

  create: (payload: Omit<Table, 'id'>) =>
    api.post<Table>('/tables', payload),

  delete: (id: string) =>
    api.delete(`/tables/${id}`),
};
