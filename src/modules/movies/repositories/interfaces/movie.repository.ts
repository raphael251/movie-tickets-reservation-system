import { IPaginationParams, TPaginationResponse } from '../../../shared/pagination/types.ts';
import { Movie } from '../../entities/movie.ts';

export interface IMovieRepository {
  findById(movieId: string): Promise<Movie | null>;
  save(movie: Movie): Promise<void>;
  deleteById(movieId: string): Promise<void>;
  findPaginated(pagination: IPaginationParams): Promise<TPaginationResponse<Movie>>;
}
