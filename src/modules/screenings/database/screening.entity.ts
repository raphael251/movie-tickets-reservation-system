import { Column, Entity, ForeignKey, PrimaryGeneratedColumn } from 'typeorm';
import { Theater } from '../../theaters/database/theater.entity.ts';
import { Movie } from '../../movies/database/movie.entity.ts';
import { randomUUID } from 'crypto';

@Entity('screening')
export class Screening {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  @ForeignKey(() => Movie)
  movieId!: string;

  @Column('uuid')
  @ForeignKey(() => Theater)
  theaterId!: string;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  static create(movieId: string, theaterId: string, startTime: Date, endTime: Date): Screening {
    const screening = new Screening();

    screening.id = randomUUID();
    screening.movieId = movieId;
    screening.theaterId = theaterId;
    screening.startTime = startTime;
    screening.endTime = endTime;

    return screening;
  }
}
