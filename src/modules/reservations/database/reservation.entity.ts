import { BaseEntity, Column, CreateDateColumn, Entity, ForeignKey, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ScreeningSeatDBEntity } from '../../screenings/database/screening-seat.entity.ts';
import { UserDBEntity } from '../../users/database/user.entity.ts';

export enum RESERVATION_STATUS {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
}

@Entity('reservation')
export class ReservationDBEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  @ForeignKey(() => UserDBEntity)
  userId!: string;

  @Column('uuid')
  @ForeignKey(() => ScreeningSeatDBEntity)
  screeningSeatId!: string;

  @Column({ type: 'enum', enum: RESERVATION_STATUS, default: RESERVATION_STATUS.PENDING })
  status!: RESERVATION_STATUS;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
