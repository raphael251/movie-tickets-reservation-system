import { IMovieRepository } from '../../movies/repositories/interfaces/movie.repository.ts';
import { Reservation } from '../entities/reservation.ts';
import { InvalidMovieIdError } from '../errors/invalid-movie-id.ts';
import { SeatAlreadyReservedError } from '../errors/seat-already-reserved.ts';
import { IReservationRepository } from '../repositories/interfaces/reservation.repository.ts';

export class CreateReservationUseCase {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly movieRepository: IMovieRepository,
  ) {}

  async execute(userId: string, movieId: string, seatCode: string): Promise<void> {
    const existingReservation = await this.reservationRepository.findByMovieIdAndSeatCode(movieId, seatCode);

    if (existingReservation) {
      throw new SeatAlreadyReservedError();
    }

    const movieExists = await this.movieRepository.findById(movieId);

    if (!movieExists) {
      throw new InvalidMovieIdError();
    }

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // Reservation expires in 30 minutes

    const reservation = new Reservation(crypto.randomUUID(), userId, movieId, seatCode, expiresAt);

    await this.reservationRepository.save(reservation);
  }
}
