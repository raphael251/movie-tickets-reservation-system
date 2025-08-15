import { TheaterDBEntity } from '../database/theater.entity.ts';
import { Theater } from '../entities/theater.ts';
import { ITheaterRepository } from './interfaces/theather.repository.ts';

export class TheaterRepository implements ITheaterRepository {
  async findById(id: string): Promise<Theater | null> {
    const theater = await TheaterDBEntity.findOne({ where: { id } });

    if (!theater) return null;

    return new Theater(theater.id, theater.name);
  }
}
