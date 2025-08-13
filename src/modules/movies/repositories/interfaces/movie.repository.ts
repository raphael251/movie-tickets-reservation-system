import { Movie } from '../../entities/movie.ts';

export interface IMovieRepository {
  findById(movieId: string): Promise<Movie | null>;
  findAll(): Promise<Movie[]>;
  save(movie: Movie): Promise<void>;
}
