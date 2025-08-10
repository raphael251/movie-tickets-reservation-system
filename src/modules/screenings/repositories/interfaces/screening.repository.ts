import { SCREENING_SEAT_STATUS, ScreeningSeat } from '../../../screenings/entities/screening-seat.ts';
import { Screening } from '../../entities/screening.ts';

export interface IScreeningRepository {
  findByTheaterIdAndTime(theaterId: string, startTime: Date, endTime: Date): Promise<Screening | null>;
  findAll(): Promise<Screening[]>;
  findSeatsByScreeningId(screeningId: string): Promise<ScreeningSeat[]>;
  findById(id: string): Promise<Screening | null>;
  save(screening: Screening): Promise<void>;
  createScreeningSeats(screeningId: string): Promise<void>;
  findSeatByScreeningSeatId(screeningSeatId: string): Promise<ScreeningSeat | null>;
  updateScreeningSeatStatusById(screeningSeatId: string, status: SCREENING_SEAT_STATUS): Promise<void>;
}
