import mongoose from "mongoose";

export enum ReservationStatus {
  REQUESTED = 'requested',
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
} 

export interface Reservation {
  _id?: mongoose.Types.ObjectId;
  guestId: string;
  expectedArrival: Date;
  tableSize: number;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReservationInput {
  expectedArrival: Date;
  tableSize: number;
  guestId: string;
}

export interface UpdateReservationInput {
  expectedArrival?: Date;
  tableSize?: number;
  status?: ReservationStatus;
} 