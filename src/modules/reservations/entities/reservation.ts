import { RESERVATION_STATUS } from '../database/reservation.entity.ts';

export class Reservation {
  constructor(
    public id: string,
    public userId: string,
    public screeningSeatId: string,
    public status: RESERVATION_STATUS,
  ) {}
}
