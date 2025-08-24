import { IPaginationParams, TPaginationResponse } from '../../../shared/pagination/types.ts';
import { RESERVATION_STATUS } from '../../database/reservation.entity.ts';
import { Reservation } from '../../entities/reservation.ts';

export interface IReservationRepository {
  save(reservation: Reservation): Promise<void>;
  findAllByUserId(userId: string, pagination?: IPaginationParams): Promise<TPaginationResponse<Reservation>>;
  findById(reservationId: string): Promise<Reservation | null>;
  updateStatusById(reservationId: string, status: RESERVATION_STATUS): Promise<void>;
}
