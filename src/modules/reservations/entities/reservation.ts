import { ScreeningSeat } from '../../screenings/entities/screening-seat.ts';
import { RESERVATION_STATUS } from '../database/reservation.entity.ts';

export class Reservation {
  constructor(
    public id: string,
    public userId: string,
    public screeningSeat: ScreeningSeat,
    public status: RESERVATION_STATUS,
  ) {}
}
