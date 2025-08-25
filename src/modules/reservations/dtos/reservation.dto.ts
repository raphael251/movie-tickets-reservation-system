import { RESERVATION_STATUS } from '../database/reservation.entity.ts';
import { Reservation } from '../entities/reservation.ts';

export type ReservationDTO = {
  id: string;
  seat: string;
  status: RESERVATION_STATUS;
};

export const mapReservationToDTO = ({ id, status, screeningSeat: { rowLabel, seatNumber } }: Reservation): ReservationDTO => ({
  id,
  seat: rowLabel + seatNumber,
  status,
});
