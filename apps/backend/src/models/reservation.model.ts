import mongoose, { Schema, HydratedDocument } from 'mongoose';
import { Reservation, ReservationStatus } from '../types/reservation';

export type ReservationDocument = HydratedDocument<Reservation>;

const ReservationSchema = new Schema({
  guestId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  expectedArrival: { type: Date, required: true, index: true },
  tableSize: { type: Number, required: true },
  status: {
    type: String,
    enum: Object.values(ReservationStatus),
    default: ReservationStatus.REQUESTED,
    index: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
ReservationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add virtual populate for guest information
ReservationSchema.virtual('guest', {
  ref: 'User',
  localField: 'guestId',
  foreignField: '_id',
  justOne: true
});

// Enable virtuals in JSON
ReservationSchema.set('toJSON', { virtuals: true });
ReservationSchema.set('toObject', { virtuals: true });

export const ReservationModel = mongoose.model<Reservation>('Reservation', ReservationSchema); 