import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ReservationStatus } from '../types/reservation';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  guestId: string;

  @Column()
  expectedArrival: Date;

  @Column()
  tableSize: number;

  @Column({
    type: 'text',
    default: ReservationStatus.REQUESTED
  })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 