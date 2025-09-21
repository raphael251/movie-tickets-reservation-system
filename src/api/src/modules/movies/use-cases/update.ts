import z from 'zod';
import { Movie } from '../database/movie.entity.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';
import type { IMovieRepository } from '../repositories/interfaces/movie.repository.ts';
import { inject, injectable } from 'inversify';
import { MovieRepository } from '../repositories/movie.repository.ts';

type Input = {
  movieId: string;
  title: string;
  description: string;
  category: string;
};

@injectable()
export class UpdateMovieUseCase {
  constructor(
    @inject(MovieRepository)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(input: Input): Promise<Movie> {
    const inputValidationSchema = z.object({
      movieId: z.uuid(),
      title: z.string().optional(),
      description: z.string().optional(),
      category: z.string().optional(),
    });

    const validationResult = inputValidationSchema.safeParse(input);

    if (!validationResult.success) {
      throw new InputValidationError(validationResult.error.issues.map((issue) => issue.message));
    }

    const { movieId, title, description, category } = validationResult.data;

    const foundMovie = await this.movieRepository.findById(movieId);

    if (!foundMovie) {
      throw new InputValidationError(['Movie not found']);
    }

    foundMovie.title = title || foundMovie.title;
    foundMovie.description = description || foundMovie.description;
    foundMovie.category = category || foundMovie.category;

    await this.movieRepository.save(foundMovie);

    return foundMovie;
  }
}
