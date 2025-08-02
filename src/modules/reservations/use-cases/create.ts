import z from 'zod';
import { IMovieRepository } from '../../movies/repositories/interfaces/movie.repository.ts';
import { Reservation } from '../entities/reservation.ts';
import { InvalidMovieIdError } from '../errors/invalid-movie-id.ts';
import { SeatAlreadyReservedError } from '../errors/seat-already-reserved.ts';
import { IReservationRepository } from '../repositories/interfaces/reservation.repository.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';

type Input = {
  userId: string;
  movieId: string;
  seatCode: string;
};

export class CreateReservationUseCase {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const inputValidationSchema = z.object({
      movieId: z.uuid('Invalid movie ID format'),
      seatCode: z.string().min(1, 'Seat code is required'),
    });

    const parseResult = inputValidationSchema.safeParse(input);

    if (!parseResult.success) {
      throw new InputValidationError(parseResult.error.issues.map((issue) => issue.message));
    }

    const { movieId, seatCode } = parseResult.data;

    const existingReservation = await this.reservationRepository.findByMovieIdAndSeatCode(movieId, seatCode);

    if (existingReservation) {
      throw new SeatAlreadyReservedError();
    }

    const movieExists = await this.movieRepository.findById(movieId);

    if (!movieExists) {
      throw new InvalidMovieIdError();
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // Reservation expires in 30 minutes

    const reservation = new Reservation(crypto.randomUUID(), input.userId, movieId, seatCode, expiresAt);

    await this.reservationRepository.save(reservation);
  }
}
