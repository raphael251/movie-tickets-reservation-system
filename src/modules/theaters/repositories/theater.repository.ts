import { appDataSource } from '../../shared/data-source/data-source.ts';
import { Theater } from '../database/theater.entity.ts';
import { ITheaterRepository } from './interfaces/theather.repository.ts';

export class TheaterRepository implements ITheaterRepository {
  async findById(id: string): Promise<Theater | null> {
    const theater = await appDataSource.getRepository(Theater).findOne({ where: { id } });

    if (!theater) return null;

    return theater;
  }
}
