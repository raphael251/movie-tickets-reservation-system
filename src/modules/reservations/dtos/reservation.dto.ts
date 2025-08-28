import { RESERVATION_STATUS } from '../database/reservation.entity.ts';
import { Reservation } from '../database/reservation.entity.ts';

export type ReservationDTO = {
  id: string;
  screening: {
    id: string;
    movieTitle: string;
    theaterNameName: string;
    startTime: Date;
    endTime: Date;
  };
  seat: string;
  status: RESERVATION_STATUS;
};

export const mapReservationToDTO = ({ id, status, screeningSeat: { rowLabel, seatNumber, screening } }: Reservation): ReservationDTO => ({
  id,
  screening: {
    id: screening.id,
    movieTitle: screening.movie.title,
    theaterNameName: screening.theater.name,
    startTime: screening.startTime,
    endTime: screening.endTime,
  },
  seat: rowLabel + seatNumber,
  status,
});
