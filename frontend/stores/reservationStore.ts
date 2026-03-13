import { create } from 'zustand';
import type { Reservation } from '@/types/reservations';
import { reservationsApi } from '@/services/reservations.api';
import { sampleReservations } from '@/utils/sampleData';

interface ReservationState {
  reservations: Reservation[];
  isLoading: boolean;

  fetchReservations: () => Promise<void>;
  upsertReservation: (reservation: Reservation) => void;
  removeReservation: (id: string) => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  reservations: [],
  isLoading: false,

  fetchReservations: async () => {
    set({ isLoading: true });
    try {
      const response = await reservationsApi.getAll();
      set({ reservations: response.data, isLoading: false });
    } catch {
      set({ reservations: sampleReservations, isLoading: false });
    }
  },

  upsertReservation: (reservation) => {
    set((state) => {
      const exists = state.reservations.some((r) => r.id === reservation.id);
      if (exists) {
        return { reservations: state.reservations.map((r) => (r.id === reservation.id ? reservation : r)) };
      }
      return { reservations: [reservation, ...state.reservations] };
    });
  },

  removeReservation: (id) => {
    set((state) => ({ reservations: state.reservations.filter((r) => r.id !== id) }));
  },
}));
