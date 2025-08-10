import { BaseEntity, Column, Entity, ForeignKey, PrimaryGeneratedColumn } from 'typeorm';
import { ScreeningSeatDBEntity } from '../../screenings/database/screening-seat.entity.ts';
import { UserDBEntity } from '../../users/database/user.entity.ts';

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
}
