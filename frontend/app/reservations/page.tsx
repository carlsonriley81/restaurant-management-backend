'use client';

import React, { useEffect } from 'react';
import { useReservationStore } from '@/stores/reservationStore';
import { reservationsApi } from '@/services/reservations.api';
import { ReservationCard } from '@/components/reservations/ReservationCard';
import { Button } from '@/components/ui/button';
import type { Reservation } from '@/types/reservations';

export default function ReservationsPage() {
  const { reservations, isLoading, fetchReservations, upsertReservation } = useReservationStore();

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleCheckIn = async (reservation: Reservation) => {
    try {
      const response = await reservationsApi.checkIn(reservation.id);
      upsertReservation(response.data);
    } catch {
      alert('Check-in failed.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <Button onClick={() => fetchReservations()}>↺ Refresh</Button>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-muted-foreground">Loading reservations…</div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No reservations found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((reservation) => (
            <ReservationCard
              key={reservation.id}
              reservation={reservation}
              onEdit={() => {/* TODO: edit modal */}}
              onAssignTables={() => {/* TODO: assign tables */}}
              onCheckIn={() => handleCheckIn(reservation)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
