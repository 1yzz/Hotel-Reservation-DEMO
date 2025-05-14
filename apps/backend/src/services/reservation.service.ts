import { DataSource, Between } from 'typeorm';
import { Reservation, CreateReservationInput, UpdateReservationInput, ReservationStatus } from '../types/reservation';
import { ReservationEntity } from '../entities/reservation.entity';

export class ReservationService {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'sqlite',
      database: 'reservations.db',
      synchronize: true,
      logging: true,
      entities: [ReservationEntity],
    });
  }

  async initialize() {
    await this.dataSource.initialize();
  }

  async createReservation(input: CreateReservationInput): Promise<Reservation> {
    const repository = this.dataSource.getRepository(ReservationEntity);
    const reservation = repository.create({
      ...input,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return repository.save(reservation);
  }

  async updateReservation(id: string, input: UpdateReservationInput): Promise<Reservation> {
    const repository = this.dataSource.getRepository(ReservationEntity);
    await repository.update(id, {
      ...input,
      updatedAt: new Date(),
    });
    return repository.findOneByOrFail({ id });
  }

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<Reservation> {
    return this.updateReservation(id, { status });
  }

  async findByGuestId(guestId: string): Promise<Reservation> {
    const repository = this.dataSource.getRepository(ReservationEntity);
    return repository.findOneByOrFail({ guestId });
  }

  async findAll(): Promise<Reservation[]> {
    const repository = this.dataSource.getRepository(ReservationEntity);
    return repository.find();
  }

  async findByDate(date: Date): Promise<Reservation[]> {
    const repository = this.dataSource.getRepository(ReservationEntity);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return repository.find({
      where: {
        expectedArrival: Between(startOfDay, endOfDay),
      },
    });
  }

  async findByStatus(status: ReservationStatus): Promise<Reservation[]> {
    const repository = this.dataSource.getRepository(ReservationEntity);
    return repository.findBy({ status });
  }

  async findById(id: string): Promise<Reservation> {
    const repository = this.dataSource.getRepository(ReservationEntity);
    return repository.findOneByOrFail({ id });
  }
} 