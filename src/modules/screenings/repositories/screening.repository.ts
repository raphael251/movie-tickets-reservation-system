import { Brackets } from 'typeorm';
import { ScreeningDBEntity } from '../database/screening.entity.ts';
import { Screening } from '../entities/screening.ts';
import { IScreeningRepository } from './interfaces/screening.repository.ts';
import { appDataSource } from '../../shared/data-source/data-source.ts';
import { ScreeningSeatDBEntity } from '../database/screening-seat.entity.ts';
import { SCREENING_SEAT_STATUS, ScreeningSeat } from '../../screenings/entities/screening-seat.ts';
import { IPaginationParams, TPaginationResponse } from '../../shared/pagination/types.ts';
import { AppConfig } from '../../shared/configs/app-config.ts';
import { decodeCursor, encodeCursor } from '../../shared/pagination/helpers.ts';

export class ScreeningRepository implements IScreeningRepository {
  constructor(private appConfig: AppConfig) {}

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

    return new Screening(foundScreening.id, foundScreening.movieId, foundScreening.theaterId, foundScreening.startTime, foundScreening.endTime);
  }

  async findById(id: string): Promise<Screening | null> {
    const foundScreening = await ScreeningDBEntity.findOne({ where: { id } });

    if (!foundScreening) {
      return null;
    }

    return new Screening(foundScreening.id, foundScreening.movieId, foundScreening.theaterId, foundScreening.startTime, foundScreening.endTime);
  }

  async findAll(): Promise<Screening[]> {
    const screenings = await ScreeningDBEntity.find();

    return screenings.map((screening) => new Screening(screening.id, screening.movieId, screening.theaterId, screening.startTime, screening.endTime));
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

  async findSeatsByScreeningId(
    screeningId: string,
    filter: { status?: SCREENING_SEAT_STATUS },
    { limit = this.appConfig.PAGINATION_DEFAULT_LIMIT, cursor }: IPaginationParams,
  ): Promise<TPaginationResponse<ScreeningSeat>> {
    // Increasing the number of retrieved registers to check if there is a next page
    const limitWithNextPageFirstElement = limit + 1;

    const seatsQuery = ScreeningSeatDBEntity.createQueryBuilder()
      .select()
      .where('"screeningId" = :screeningId', { screeningId })
      .orderBy('"rowLabel"', 'ASC')
      .addOrderBy('"seatNumber"', 'ASC')
      .take(limitWithNextPageFirstElement);

    if (filter.status) {
      seatsQuery.andWhere('"status" = :status', { status: filter.status });
    }

    if (cursor) {
      const [rowLabel, seatNumber] = decodeCursor(cursor).split(':');

      seatsQuery.andWhere('("rowLabel", "seatNumber") > (:rowLabel, :seatNumber)', { rowLabel, seatNumber });
    }

    const screeningSeats = await seatsQuery.getMany();

    const hasNext = screeningSeats.length > limit;

    if (hasNext) {
      const screeningSeatsToReturn = screeningSeats.slice(0, -1);

      const lastSeat = screeningSeatsToReturn[screeningSeatsToReturn.length - 1];

      return {
        hasNext: true,
        nextCursor: encodeCursor(`${lastSeat.rowLabel}:${lastSeat.seatNumber}`),
        data: screeningSeatsToReturn.map((seat) => new ScreeningSeat(seat.id, seat.screeningId, seat.rowLabel, seat.seatNumber, seat.status)),
      };
    }

    return {
      data: screeningSeats.map((seat) => new ScreeningSeat(seat.id, seat.screeningId, seat.rowLabel, seat.seatNumber, seat.status)),
      hasNext: false,
      nextCursor: undefined,
    };
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

  async findScreeningByScreeningSeatId(screeningSeatId: string): Promise<Screening | null> {
    const screening = await ScreeningDBEntity.createQueryBuilder('screening')
      .select()
      .innerJoin(ScreeningSeatDBEntity, 'screeningSeat', 'screeningSeat.screeningId = screening.id')
      .where('screeningSeat.id = :screeningSeatId', { screeningSeatId })
      .getOne();

    return screening ? new Screening(screening.id, screening.movieId, screening.theaterId, screening.startTime, screening.endTime) : null;
  }
}
