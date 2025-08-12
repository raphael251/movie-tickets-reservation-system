import { BaseEntity, Column, Entity, ForeignKey, PrimaryGeneratedColumn } from 'typeorm';
import { TheaterDBEntity } from '../../theaters/database/theater.entity.ts';
import { MovieDBEntity } from '../../movies/database/movie.entity.ts';

@Entity('screening')
export class ScreeningDBEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  @ForeignKey(() => MovieDBEntity)
  movieId!: string;

  @Column('uuid')
  @ForeignKey(() => TheaterDBEntity)
  theaterId!: string;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;
}
