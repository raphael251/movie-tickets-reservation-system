import { Brackets } from 'typeorm';
import { ScreeningDBEntity } from '../database/screening.entity.ts';
import { Screening } from '../entities/screening.ts';
import { IScreeningRepository } from './interfaces/screening.repository.ts';
import { appDataSource } from '../../shared/data-source/data-source.ts';
import { ScreeningSeatDBEntity } from '../database/screening-seat.entity.ts';
import { SCREENING_SEAT_STATUS, ScreeningSeat } from '../../screenings/entities/screening-seat.ts';

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

  async createScreeningSeats(screeningId: string): Promise<void> {
    await appDataSource.query(`
      INSERT INTO "screeningSeat"  ("screeningId", "rowLabel", "seatNumber")
      SELECT '${screeningId}', s."rowLabel", s."seatNumber"
        FROM seat s
        INNER JOIN screening sc ON sc."theaterId" = s."theaterId"
        WHERE sc.id = '${screeningId}';
    `);
  }

  async findSeatsByScreeningId(screeningId: string): Promise<ScreeningSeat[]> {
    const seats = await ScreeningSeatDBEntity.createQueryBuilder().select().where('"screeningId" = :screeningId', { screeningId }).getMany();

    return seats.map((seat) => new ScreeningSeat(seat.id, seat.screeningId, seat.rowLabel, seat.seatNumber, seat.status));
  }

  async findSeatByScreeningSeatId(screeningSeatId: string): Promise<ScreeningSeat | null> {
    const foundScreeningSeat = await ScreeningSeatDBEntity.findOne({ where: { id: screeningSeatId } });

    if (!foundScreeningSeat) return null;

    return new ScreeningSeat(
      foundScreeningSeat.id,
      foundScreeningSeat.screeningId,
      foundScreeningSeat.rowLabel,
      foundScreeningSeat.seatNumber,
      foundScreeningSeat.status,
    );
  }

  async updateScreeningSeatStatusById(screeningSeatId: string, status: SCREENING_SEAT_STATUS): Promise<void> {
    await ScreeningSeatDBEntity.update({ id: screeningSeatId }, { status });
  }
}
