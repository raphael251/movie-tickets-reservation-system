import { Reservation } from '../../entities/reservation.ts';

export interface IReservationRepository {
  save(reservation: Reservation): Promise<void>;
}
