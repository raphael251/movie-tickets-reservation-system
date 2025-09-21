import z from 'zod';
import { InputValidationError } from '../../shared/errors/input-validation.ts';
import type { IMovieRepository } from '../repositories/interfaces/movie.repository.ts';
import { MovieDoesNotExistError } from '../errors/movie-does-not-exist.ts';
import { inject, injectable } from 'inversify';
import { MovieRepository } from '../repositories/movie.repository.ts';

type Input = {
  movieId: string;
};

@injectable()
export class DeleteMovieUseCase {
  constructor(
    @inject(MovieRepository)
    private repository: IMovieRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const inputSchema = z.object({
      movieId: z.uuid(),
    });

    const validationResult = inputSchema.safeParse(input);
    if (!validationResult.success) {
      throw new InputValidationError(['Invalid movieId']);
    }

    const foundMovie = await this.repository.findById(input.movieId);

    if (!foundMovie) {
      throw new MovieDoesNotExistError();
    }

    await this.repository.deleteById(input.movieId);
  }
}
