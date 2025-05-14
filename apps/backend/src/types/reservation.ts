export enum ReservationStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
} 

export interface Reservation {
  id: string;
  guestId: string;
  expectedArrival: Date;
  tableSize: number;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationInput {
  guestId: string;
  expectedArrival: Date;
  tableSize: number;
  status: ReservationStatus;
}

export interface UpdateReservationInput {
  expectedArrival?: Date;
  tableSize?: number;
  status: ReservationStatus;
} 