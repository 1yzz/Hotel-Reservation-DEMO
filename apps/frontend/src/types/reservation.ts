export enum ReservationStatus {
  requested = 'requested',
  approved = 'approved',
  cancelled = 'cancelled',
  completed = 'completed'
}

export interface Reservation {
  id: string;
  userId: string;
  date: string;
  time: string;
  tableSize: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    email: string;
    phone: string;
  };
  expectedArrival: string;
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