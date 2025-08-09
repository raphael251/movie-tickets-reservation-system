import { Reservation } from '../../entities/reservation.ts';

export interface IReservationRepository {
  findByScreeningIdAndSeatCode(screeningId: string, seatCode: string): Promise<Reservation | null>;
  save(reservation: Reservation): Promise<void>;
}
