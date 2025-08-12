import { Movie } from '../../entities/movie.ts';

export interface IMovieRepository {
  save(movie: Movie): Promise<void>;
}
