import { Column, Entity, PrimaryGeneratedColumn, ForeignKey } from 'typeorm';
import { Theater } from '../../theaters/database/theater.entity.ts';

@Entity('seat')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  @ForeignKey(() => Theater)
  theaterId!: string;

  @Column()
  rowLabel!: string;

  @Column()
  seatNumber!: string;
}
