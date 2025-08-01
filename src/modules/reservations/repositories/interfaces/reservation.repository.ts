import { Reservation } from '../../entities/reservation.ts';

export interface IReservationRepository {
  findByMovieIdAndSeatCode(movieId: string, seatCode: string): Promise<Reservation | null>;
  save(reservation: Reservation): Promise<void>;
}
