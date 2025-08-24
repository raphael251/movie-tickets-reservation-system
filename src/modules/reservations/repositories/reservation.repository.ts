import { AppConfig } from '../../shared/configs/app-config.ts';
import { decodeCursor, encodeCursor } from '../../shared/pagination/helpers.ts';
import { IPaginationParams, TPaginationResponse } from '../../shared/pagination/types.ts';
import { RESERVATION_STATUS, ReservationDBEntity } from '../database/reservation.entity.ts';
import { Reservation } from '../entities/reservation.ts';
import { IReservationRepository } from './interfaces/reservation.repository';

export class ReservationRepository implements IReservationRepository {
  constructor(private appConfig: AppConfig) {}

  async findByScreeningIdAndSeatCode(screeningId: string, seatCode: string): Promise<Reservation | null> {
    return ReservationDBEntity.createQueryBuilder('reservation')
      .select()
      .where('reservation.screeningId = :screeningId', { screeningId })
      .andWhere('reservation.seatCode = :seatCode', { seatCode })
      .getOne();
  }
  async save(reservation: Reservation): Promise<void> {
    ReservationDBEntity.upsert(reservation, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
  }

  async findAllByUserId(
    userId: string,
    { limit = this.appConfig.PAGINATION_DEFAULT_LIMIT, cursor }: IPaginationParams,
  ): Promise<TPaginationResponse<Reservation>> {
    // Increasing the number of retrieved registers to check if there is a next page
    const limitWithNextPageFirstElement = limit + 1;

    const reservationsQuery = ReservationDBEntity.createQueryBuilder('reservation')
      .select()
      .where('reservation.userId = :userId', { userId })
      .orderBy('reservation.createdAt', 'DESC')
      .limit(limitWithNextPageFirstElement);

    if (cursor) {
      const decodedCursor = decodeCursor(cursor);
      reservationsQuery.andWhere('reservation.createdAt < :createdAt', { createdAt: new Date(Number(decodedCursor)) });
    }

    const reservations = await reservationsQuery.getMany();

    const hasNext = reservations.length === limitWithNextPageFirstElement;

    if (hasNext) {
      const reservationsToReturn = reservations.slice(0, -1);
      const lastReservation = reservationsToReturn[reservationsToReturn.length - 1];

      return {
        hasNext: true,
        data: reservationsToReturn,
        nextCursor: encodeCursor(lastReservation.createdAt.getTime().toString()),
      };
    }

    return {
      hasNext: false,
      data: reservations,
      nextCursor: undefined,
    };
  }

  async findById(reservationId: string): Promise<Reservation | null> {
    return ReservationDBEntity.createQueryBuilder('reservation').select().where('reservation.id = :reservationId', { reservationId }).getOne();
  }

  async updateStatusById(reservationId: string, status: RESERVATION_STATUS): Promise<void> {
    await ReservationDBEntity.createQueryBuilder().update().set({ status }).where('id = :reservationId', { reservationId }).execute();
  }
}
