import { Column, CreateDateColumn, Entity, ForeignKey, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ScreeningSeat } from '../../screenings/database/screening-seat.entity.ts';
import { UserDBEntity } from '../../users/database/user.entity.ts';

export enum RESERVATION_STATUS {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  @ForeignKey(() => UserDBEntity)
  userId!: string;

  @OneToOne(() => ScreeningSeat, { nullable: false })
  @JoinColumn()
  screeningSeat!: ScreeningSeat;

  @Column({ type: 'enum', enum: RESERVATION_STATUS, default: RESERVATION_STATUS.PENDING })
  status!: RESERVATION_STATUS;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  static create(userId: string, screeningSeat: ScreeningSeat, status: RESERVATION_STATUS): Reservation {
    const reservation = new Reservation();

    reservation.id = crypto.randomUUID();
    reservation.userId = userId;
    reservation.screeningSeat = screeningSeat;
    reservation.status = status;
    reservation.createdAt = new Date();

    return reservation;
  }
}
