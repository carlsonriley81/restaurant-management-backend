export interface Reservation {
  id: string;
  reservationName: string;
  reservationTime: string;
  reservationType?: string;
  partySize: number;
  tablesReserved: string[];
  requestedMenu?: string[];
  paymentStatus?: string;
  depositPaid: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReservationPayload {
  reservationName: string;
  reservationTime: string;
  partySize: number;
  tablesReserved?: string[];
  requestedMenu?: string[];
  depositPaid?: boolean;
  notes?: string;
}
