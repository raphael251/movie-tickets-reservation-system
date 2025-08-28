import { PrimaryGeneratedColumn, Column, Entity, ManyToOne } from 'typeorm';
import { Screening } from '../../screenings/database/screening.entity.ts';

export enum SCREENING_SEAT_STATUS {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  RESERVED = 'RESERVED',
}

@Entity('screeningSeat')
export class ScreeningSeat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Screening, { nullable: false })
  screening!: Screening;

  @Column()
  rowLabel!: string;

  @Column()
  seatNumber!: string;

  @Column({ type: 'enum', enum: SCREENING_SEAT_STATUS, default: SCREENING_SEAT_STATUS.AVAILABLE })
  status!: SCREENING_SEAT_STATUS;
}
