import { Theater } from '../../entities/theater.ts';

export interface ITheaterRepository {
  findById(id: string): Promise<Theater | null>;
}
