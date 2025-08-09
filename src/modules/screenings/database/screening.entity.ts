import { BaseEntity, Column, Entity, ForeignKey, PrimaryGeneratedColumn } from 'typeorm';
import { TheaterDBEntity } from '../../theaters/database/theater.entity.ts';

@Entity('screening')
export class ScreeningDBEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  category!: string;

  @Column('uuid')
  @ForeignKey(() => TheaterDBEntity)
  theaterId!: string;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;
}
