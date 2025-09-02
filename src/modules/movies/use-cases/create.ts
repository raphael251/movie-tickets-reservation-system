import z from 'zod';
import { Movie } from '../database/movie.entity.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';
import type { IMovieRepository } from '../repositories/interfaces/movie.repository.ts';
import { inject, injectable } from 'inversify';
import { MovieRepository } from '../repositories/movie.repository.ts';

type Input = {
  title: string;
  description: string;
  category: string;
};

@injectable()
export class CreateMovieUseCase {
  constructor(
    @inject(MovieRepository)
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(input: Input): Promise<Movie> {
    const inputValidationSchema = z.object({
      title: z.string(),
      description: z.string(),
      category: z.string(),
    });

    const validationResult = inputValidationSchema.safeParse(input);

    if (!validationResult.success) {
      throw new InputValidationError(validationResult.error.issues.map((issue) => issue.message));
    }

    const { title, description, category } = validationResult.data;

    const movie = Movie.create(title, description, category);

    await this.movieRepository.save(movie);

    return movie;
  }
}
