import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/utils/dates';
import type { Reservation } from '@/types/reservations';

interface ReservationCardProps {
  reservation: Reservation;
  onEdit?: () => void;
  onAssignTables?: () => void;
  onCheckIn?: () => void;
}

export function ReservationCard({ reservation, onEdit, onAssignTables, onCheckIn }: ReservationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{reservation.reservationName}</CardTitle>
          <Badge variant={reservation.depositPaid ? 'default' : 'outline'}>
            {reservation.depositPaid ? 'Deposit Paid' : 'No Deposit'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-4 text-sm">
          <span>🕐 {formatDateTime(reservation.reservationTime)}</span>
          <span>👥 Party of {reservation.partySize}</span>
        </div>

        {reservation.tablesReserved.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Tables: {reservation.tablesReserved.join(', ')}
          </p>
        )}

        {reservation.notes && (
          <p className="text-sm text-muted-foreground italic">&ldquo;{reservation.notes}&rdquo;</p>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="outline" size="sm" onClick={onAssignTables}>Tables</Button>
          <Button size="sm" onClick={onCheckIn}>Check In</Button>
        </div>
      </CardContent>
    </Card>
  );
}
