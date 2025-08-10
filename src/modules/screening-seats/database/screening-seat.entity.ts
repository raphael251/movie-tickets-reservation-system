import { BaseEntity, PrimaryGeneratedColumn, Column, ForeignKey, Entity } from 'typeorm';
import { ScreeningDBEntity } from '../../screenings/database/screening.entity.ts';

enum SCREENING_SEAT_STATUS {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  RESERVED = 'RESERVED',
}

@Entity('screeningSeat')
export class ScreeningSeatDBEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @ForeignKey(() => ScreeningDBEntity)
  screeningId!: string;

  @Column()
  rowLabel!: string;

  @Column()
  seatNumber!: string;

  @Column({ type: 'enum', enum: SCREENING_SEAT_STATUS, default: SCREENING_SEAT_STATUS.AVAILABLE })
  status!: SCREENING_SEAT_STATUS;
}
