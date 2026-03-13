import api from './api';
import type { Reservation, CreateReservationPayload } from '@/types/reservations';

export const reservationsApi = {
  getAll: (params?: Record<string, string>) =>
    api.get<Reservation[]>('/reservations', { params }),

  getById: (id: string) =>
    api.get<Reservation>(`/reservations/${id}`),

  create: (payload: CreateReservationPayload) =>
    api.post<Reservation>('/reservations', payload),

  update: (id: string, payload: Partial<CreateReservationPayload>) =>
    api.put<Reservation>(`/reservations/${id}`, payload),

  assignTables: (id: string, tableIds: string[]) =>
    api.put<Reservation>(`/reservations/${id}/tables`, { tableIds }),

  checkIn: (id: string) =>
    api.put<Reservation>(`/reservations/${id}/checkin`, {}),

  delete: (id: string) =>
    api.delete(`/reservations/${id}`),
};
