import { Reservation } from '../modules/reservations/database/reservation.entity';
import { ScreeningSeat } from '../modules/screenings/database/screening-seat.entity';
import { Screening } from '../modules/screenings/database/screening.entity';
import { Seat } from '../modules/seats/database/seat.entity';
import { appDataSource } from '../modules/shared/data-source/data-source';
import { Theater } from '../modules/theaters/database/theater.entity';
import { User } from '../modules/users/database/user.entity';

export default async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.getRepository(Reservation).deleteAll();
    await appDataSource.getRepository(User).deleteAll();
    await appDataSource.getRepository(Seat).deleteAll();
    await appDataSource.getRepository(ScreeningSeat).deleteAll();
    await appDataSource.getRepository(Screening).deleteAll();
    await appDataSource.getRepository(Theater).deleteAll();
    await appDataSource.destroy();
    process.exit(0);
  }
};
