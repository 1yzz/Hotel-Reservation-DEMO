import { Reservation, CreateReservationInput, UpdateReservationInput, ReservationStatus } from '../types/reservation';
import { ReservationModel } from '../models/reservation.model';
import { MongoDBConnection } from '../config/mongodb.config';

export class ReservationService {
  async initialize() {
    await MongoDBConnection.getInstance().connect();
  }

  async createReservation(input: CreateReservationInput): Promise<Reservation> {
    const reservation = new ReservationModel({
      ...input,
      status: ReservationStatus.REQUESTED,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return reservation.save();
  }

  async findById(id: string): Promise<Reservation | null> {
    return ReservationModel.findById(id)
      .populate('guest', 'email name phone')
      .exec();
  }

  async findByGuestId(guestId: string): Promise<Reservation[]> {
    return ReservationModel.find({ guestId })
      .populate('guest', 'email name phone')
      .exec();
  }

  async findByStatus(status: ReservationStatus): Promise<Reservation[]> {
    return ReservationModel.find({ status })
      .populate('guest', 'email name phone')
      .exec();
  }

  async findByDate(date: Date): Promise<Reservation[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    return ReservationModel.find({
      expectedArrival: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('guest', 'email name phone')
      .exec();
  }

  async findAll(): Promise<Reservation[]> {
    return ReservationModel.find()
      .populate('guest', 'email name phone')
      .exec();
  }

  async updateReservation(id: string, input: UpdateReservationInput): Promise<Reservation | null> {
    return ReservationModel.findByIdAndUpdate(
      id,
      { ...input, updatedAt: new Date() },
      { new: true }
    )
      .populate('guest', 'email name phone')
      .exec();
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation | null> {
    return this.updateReservation(id, { status });
  }
} 