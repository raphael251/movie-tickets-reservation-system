import { Seat } from '../../../seats/entities/seat.ts';
import { Screening } from '../../entities/screening.ts';

export interface IScreeningRepository {
  findByTheaterIdAndTime(theaterId: string, startTime: Date, endTime: Date): Promise<Screening | null>;
  findAll(): Promise<Screening[]>;
  findSeatsByScreeningId(screeningId: string): Promise<Seat[]>;
  findById(id: string): Promise<Screening | null>;
  save(screening: Screening): Promise<void>;
  createScreeningSeats(screeningId: string): Promise<void>;
}
