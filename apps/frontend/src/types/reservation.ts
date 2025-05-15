export enum ReservationStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface Reservation {
  _id: string;
  guestId: string;
  expectedArrival: string;
  tableSize: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  guest: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface CreateReservationInput {
  date: string;
  time: string;
  tableSize: number;
}

export interface UpdateReservationInput {
  date?: string;
  time?: string;
  tableSize?: number;
  status?: ReservationStatus;
} 