import { SCREENING_SEAT_STATUS, ScreeningSeat } from '../database/screening-seat.entity';

export type ScreeningSeatDTO = {
  id: string;
  screening: {
    id: string;
    movieTitle: string;
    theaterNameName: string;
    startTime: Date;
    endTime: Date;
  };
  seat: string;
  status: SCREENING_SEAT_STATUS;
};

export const mapScreeningSeatToDTO = ({ id, screening, seatNumber, rowLabel, status }: ScreeningSeat): ScreeningSeatDTO => ({
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
