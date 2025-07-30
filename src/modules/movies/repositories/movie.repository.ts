import { Brackets } from 'typeorm';
import { MovieDBEntity } from '../database/movie.entity.ts';
import { Movie } from '../entities/movie.ts';
import { IMovieRepository } from './interfaces/movie.repository.ts';

export class MovieRepository implements IMovieRepository {
  async findByRoomAndTime(room: string, startTime: Date, endTime: Date): Promise<Movie | null> {
    const foundMovie = await MovieDBEntity.createQueryBuilder('movie')
      .select()
      .where('movie.room = :room', { room })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qb2) => {
              qb2
                .where('movie.startTime >= :qb2StartTime', { qb2StartTime: startTime })
                .andWhere('movie.startTime <= :qb2EndTime', { qb2EndTime: endTime });
            }),
          ).orWhere(
            new Brackets((qb3) => {
              qb3
                .where('movie.endTime >= :qb3StartTime', { qb3StartTime: startTime })
                .andWhere('movie.endTime <= :qb3EndTime', { qb3EndTime: endTime });
            }),
          );
        }),
      )
      .getOne();

    if (!foundMovie) {
      return null;
    }

    return new Movie(
      foundMovie.id,
      foundMovie.title,
      foundMovie.description,
      foundMovie.category,
      foundMovie.room,
      foundMovie.startTime,
      foundMovie.endTime,
    );
  }

  async findAll(): Promise<Movie[]> {
    const movies = await MovieDBEntity.find();

    return movies.map((movie) => new Movie(movie.id, movie.title, movie.description, movie.category, movie.room, movie.startTime, movie.endTime));
  }

  async save(movie: Movie): Promise<void> {
    await MovieDBEntity.upsert(movie, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}
