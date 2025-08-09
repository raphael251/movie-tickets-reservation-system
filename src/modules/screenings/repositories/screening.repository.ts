import { Brackets } from 'typeorm';
import { ScreeningDBEntity } from '../database/screening.entity.ts';
import { Screening } from '../entities/screening.ts';
import { IScreeningRepository } from './interfaces/screening.repository.ts';

export class ScreeningRepository implements IScreeningRepository {
  async findByTheaterIdAndTime(theaterId: string, startTime: Date, endTime: Date): Promise<Screening | null> {
    const foundScreening = await ScreeningDBEntity.createQueryBuilder('screening')
      .select()
      .where('screening.theaterId = :theaterId', { theaterId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            new Brackets((qb2) => {
              qb2
                .where('screening.startTime >= :qb2StartTime', { qb2StartTime: startTime })
                .andWhere('screening.startTime <= :qb2EndTime', { qb2EndTime: endTime });
            }),
          ).orWhere(
            new Brackets((qb3) => {
              qb3
                .where('screening.endTime >= :qb3StartTime', { qb3StartTime: startTime })
                .andWhere('screening.endTime <= :qb3EndTime', { qb3EndTime: endTime });
            }),
          );
        }),
      )
      .getOne();

    if (!foundScreening) {
      return null;
    }

    return new Screening(
      foundScreening.id,
      foundScreening.title,
      foundScreening.description,
      foundScreening.category,
      foundScreening.theaterId,
      foundScreening.startTime,
      foundScreening.endTime,
    );
  }

  async findById(id: string): Promise<Screening | null> {
    const foundScreening = await ScreeningDBEntity.findOne({ where: { id } });

    if (!foundScreening) {
      return null;
    }

    return new Screening(
      foundScreening.id,
      foundScreening.title,
      foundScreening.description,
      foundScreening.category,
      foundScreening.theaterId,
      foundScreening.startTime,
      foundScreening.endTime,
    );
  }

  async findAll(): Promise<Screening[]> {
    const screenings = await ScreeningDBEntity.find();

    return screenings.map(
      (screening) =>
        new Screening(
          screening.id,
          screening.title,
          screening.description,
          screening.category,
          screening.theaterId,
          screening.startTime,
          screening.endTime,
        ),
    );
  }

  async save(screening: Screening): Promise<void> {
    await ScreeningDBEntity.upsert(screening, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}
