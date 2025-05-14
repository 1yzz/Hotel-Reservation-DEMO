import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ReservationEntity } from '../entities/reservation.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'reservations.db',
  synchronize: true,
  logging: true,
  entities: [UserEntity, ReservationEntity],
  migrations: [],
  subscribers: [],
}); 