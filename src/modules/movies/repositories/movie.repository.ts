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

  async findById(movieId: string): Promise<Movie | null> {
    const movie = await MovieDBEntity.findOne({ where: { id: movieId } });
    return movie ? new Movie(movie.id, movie.title, movie.description, movie.category) : null;
  }
}
