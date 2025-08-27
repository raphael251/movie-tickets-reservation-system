import { Column, Entity, PrimaryGeneratedColumn, ForeignKey } from 'typeorm';
import { TheaterDBEntity } from '../../theaters/database/theater.entity.ts';

@Entity('seat')
export class Seat {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  @ForeignKey(() => TheaterDBEntity)
  theaterId!: string;

  @Column()
  rowLabel!: string;

  @Column()
  seatNumber!: string;
}
