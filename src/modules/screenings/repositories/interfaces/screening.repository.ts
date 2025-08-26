import { SCREENING_SEAT_STATUS, ScreeningSeat } from '../../../screenings/database/screening-seat.entity.ts';
import { IPaginationParams, TPaginationResponse } from '../../../shared/pagination/types.ts';
import { Screening } from '../../entities/screening.ts';

export interface IScreeningRepository {
  findByTheaterIdAndTime(theaterId: string, startTime: Date, endTime: Date): Promise<Screening | null>;
  findAll(pagination?: IPaginationParams): Promise<TPaginationResponse<Screening>>;
  findSeatsByScreeningId(
    screeningId: string,
    filter: { status?: SCREENING_SEAT_STATUS },
    pagination: IPaginationParams,
  ): Promise<TPaginationResponse<ScreeningSeat>>;
  findById(id: string): Promise<Screening | null>;
  save(screening: Screening): Promise<void>;
  createScreeningSeats(screeningId: string): Promise<void>;
  findSeatByScreeningSeatId(screeningSeatId: string): Promise<ScreeningSeat | null>;
  updateScreeningSeatStatusById(screeningSeatId: string, status: SCREENING_SEAT_STATUS): Promise<void>;
  findScreeningByScreeningSeatId(screeningSeatId: string): Promise<Screening | null>;
}
