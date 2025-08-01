import { Movie } from '../../entities/movie.ts';

export interface IMovieRepository {
  findByRoomAndTime(room: string, startTime: Date, endTime: Date): Promise<Movie | null>;
  findAll(): Promise<Movie[]>;
  findById(id: string): Promise<Movie | null>;
  save(movie: Movie): Promise<void>;
}
