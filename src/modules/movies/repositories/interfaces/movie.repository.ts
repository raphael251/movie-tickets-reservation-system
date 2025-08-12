import { Movie } from '../../entities/movie.ts';

export interface IMovieRepository {
  findById(movieId: string): Promise<Movie | null>;
  save(movie: Movie): Promise<void>;
}
