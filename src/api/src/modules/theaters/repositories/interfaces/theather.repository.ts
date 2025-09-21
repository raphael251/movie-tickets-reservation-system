import { Theater } from '../../database/theater.entity.ts';

export interface ITheaterRepository {
  findById(id: string): Promise<Theater | null>;
}
