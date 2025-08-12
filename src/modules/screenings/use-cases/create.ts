import z from 'zod';
import { Screening } from '../entities/screening.ts';
import { AlreadyScheduledMovieError } from '../errors/already-scheduled-movie.ts';
import { InvalidTimeError } from '../errors/invalid-time.ts';
import { IScreeningRepository } from '../repositories/interfaces/screening.repository.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';

type Input = {
  movieId: string;
  theaterId: string;
  startTime: Date;
  endTime: Date;
};

export class CreateScreeningUseCase {
  constructor(private readonly repository: IScreeningRepository) {}

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

    const existingScreening = await this.repository.findByTheaterIdAndTime(input.theaterId, input.startTime, input.endTime);

    if (existingScreening) {
      throw new AlreadyScheduledMovieError();
    }

    const screening = new Screening(crypto.randomUUID(), input.movieId, input.theaterId, input.startTime, input.endTime);

    await this.repository.save(screening);

    await this.repository.createScreeningSeats(screening.id);

    return screening;
  }
}
