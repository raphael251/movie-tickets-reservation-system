import z from 'zod';
import { Movie } from '../entities/movie.ts';
import { AlreadyScheduledMovieError } from '../errors/already-schedule-movie.ts';
import { InvalidTimeError } from '../errors/invalid-time.ts';
import { IMovieRepository } from '../repositories/interfaces/movie.repository.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';

type Input = {
  title: string;
  description: string;
  category: string;
  room: string;
  startTime: Date;
  endTime: Date;
};

export class CreateMovieUseCase {
  constructor(private readonly movieRepository: IMovieRepository) {}

  async execute(input: Input): Promise<Movie> {
    const inputValidationSchema = z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().optional(),
      category: z.string().min(1, 'Category is required'),
      room: z.string().min(1, 'Room is required'),
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

    const existingMovie = await this.movieRepository.findByRoomAndTime(input.room, input.startTime, input.endTime);

    if (existingMovie) {
      throw new AlreadyScheduledMovieError();
    }

    const movie = new Movie(crypto.randomUUID(), input.title, input.description, input.category, input.room, input.startTime, input.endTime);

    await this.movieRepository.save(movie);

    return movie;
  }
}
