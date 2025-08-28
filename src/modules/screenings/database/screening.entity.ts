import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Theater } from '../../theaters/database/theater.entity.ts';
import { Movie } from '../../movies/database/movie.entity.ts';
import { randomUUID } from 'crypto';

@Entity('screening')
export class Screening {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Movie, { nullable: false })
  movie!: Movie;

  @ManyToOne(() => Theater, { nullable: false })
  theater!: Theater;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

  static create(movie: Movie, theater: Theater, startTime: Date, endTime: Date): Screening {
    const screening = new Screening();

    screening.id = randomUUID();
    screening.movie = movie;
    screening.theater = theater;
    screening.startTime = startTime;
    screening.endTime = endTime;

    return screening;
  }
}
