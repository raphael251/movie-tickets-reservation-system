import { ReservationDBEntity } from '../database/reservation.entity.ts';
import { Reservation } from '../entities/reservation.ts';
import { IReservationRepository } from './interfaces/reservation.repository';

export class ReservationRepository implements IReservationRepository {
  async findByMovieIdAndSeatCode(movieId: string, seatCode: string): Promise<Reservation | null> {
    return ReservationDBEntity.createQueryBuilder('reservation')
      .select()
      .where('reservation.movieId = :movieId', { movieId })
      .andWhere('reservation.seatCode = :seatCode', { seatCode })
      .getOne();
  }
  async save(reservation: Reservation): Promise<void> {
    ReservationDBEntity.upsert(reservation, {
      conflictPaths: ['id'],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}
