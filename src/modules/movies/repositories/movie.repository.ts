import { MovieDBEntity } from '../database/movie.entity.ts';
import { Movie } from '../entities/movie.ts';
import { IMovieRepository } from './interfaces/movie.repository.ts';

export class MovieRepository implements IMovieRepository {
  async save(movie: Movie): Promise<void> {
    await MovieDBEntity.upsert(movie, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}
