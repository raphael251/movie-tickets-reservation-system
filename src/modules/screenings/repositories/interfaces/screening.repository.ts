import { Screening } from '../../entities/screening.ts';

export interface IScreeningRepository {
  findByTheaterIdAndTime(theaterId: string, startTime: Date, endTime: Date): Promise<Screening | null>;
  findAll(): Promise<Screening[]>;
  findById(id: string): Promise<Screening | null>;
  save(screening: Screening): Promise<void>;
}
