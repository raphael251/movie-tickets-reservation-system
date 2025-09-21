import z from 'zod';
import { Screening } from '../database/screening.entity.ts';
import { AlreadyScheduledMovieError } from '../errors/already-scheduled-movie.ts';
import { InvalidTimeError } from '../errors/invalid-time.ts';
import type { IScreeningRepository } from '../repositories/interfaces/screening.repository.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';
import type { IMovieRepository } from '../../movies/repositories/interfaces/movie.repository.ts';
import type { ITheaterRepository } from '../../theaters/repositories/interfaces/theather.repository.ts';
import { MovieDoesNotExistError } from '../errors/movie-does-not-exist.ts';
import { TheaterDoesNotExistError } from '../errors/theater-does-not-exist.ts';
import { inject, injectable } from 'inversify';
import { ScreeningRepository } from '../repositories/screening.repository.ts';
import { MovieRepository } from '../../movies/repositories/movie.repository.ts';
import { TheaterRepository } from '../../theaters/repositories/theater.repository.ts';

type Input = {
  movieId: string;
  theaterId: string;
  startTime: Date;
  endTime: Date;
};

@injectable()
export class CreateScreeningUseCase {
  constructor(
    @inject(ScreeningRepository)
    private readonly screeningRepository: IScreeningRepository,
    @inject(MovieRepository)
    private readonly movieRepository: IMovieRepository,
    @inject(TheaterRepository)
    private readonly theaterRepository: ITheaterRepository,
  ) {}

  async execute(input: Input): Promise<Screening> {
    const inputValidationSchema = z.object({
      movieId: z.uuid('movieId field is required'),
      theaterId: z.uuid('theaterId field is required'),
      startTime: z.date().refine((date) => !isNaN(date.getTime()), {
        message: 'Start time must be a valid date',
      }),
      endTime: z.date().refine((date) => !isNaN(date.getTime()), {
        message: 'End time must be a valid date',
      }),
    });

    const parseResult = inputValidationSchema.safeParse(input);

    if (!parseResult.success) {
      throw new InputValidationError(parseResult.error.issues.map((issue) => issue.message));
    }

    if (input.startTime >= input.endTime) {
      throw new InvalidTimeError();
    }

    const existingScreening = await this.screeningRepository.findByTheaterIdAndTime(input.theaterId, input.startTime, input.endTime);

    if (existingScreening) {
      throw new AlreadyScheduledMovieError();
    }

    const foundMovie = await this.movieRepository.findById(input.movieId);

    if (!foundMovie) {
      throw new MovieDoesNotExistError();
    }

    const foundTheater = await this.theaterRepository.findById(input.theaterId);

    if (!foundTheater) {
      throw new TheaterDoesNotExistError();
    }

    const screening = Screening.create(foundMovie, foundTheater, input.startTime, input.endTime);

    await this.screeningRepository.save(screening);

    await this.screeningRepository.createScreeningSeats(screening.id);

    return screening;
  }
}
