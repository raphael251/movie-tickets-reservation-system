import { Movie } from '../entities/movie.ts';
import { AlreadyScheduledMovieError } from '../errors/already-schedule-movie.ts';
import { InvalidTimeError } from '../errors/invalid-time.ts';
import { IMovieRepository } from '../repositories/interfaces/movie.repository.ts';

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
