import { Column, CreateDateColumn, Entity, ForeignKey, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ScreeningSeat } from '../../screenings/database/screening-seat.entity.ts';
import { User } from '../../users/database/user.entity.ts';

export enum RESERVATION_STATUS {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

@Entity('reservation')
@Index('unique_reserved_seat', ['screeningSeat'], { unique: true, where: `status = '${RESERVATION_STATUS.CONFIRMED}'` })
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  @ForeignKey(() => User)
  userId!: string;

  @ManyToOne(() => ScreeningSeat, { nullable: false, cascade: true })
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
