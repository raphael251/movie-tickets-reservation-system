import { Movie } from '../database/movie.entity';

export type MovieDTO = {
  id: string;
  title: string;
  description: string;
  category: string;
};

export const mapMovieToDTO = (movie: Movie): MovieDTO => ({
  id: movie.id,
  title: movie.title,
  description: movie.description,
  category: movie.category,
});
