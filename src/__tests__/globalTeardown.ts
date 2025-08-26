import { Reservation } from '../modules/reservations/database/reservation.entity';
import { ScreeningSeat } from '../modules/screenings/database/screening-seat.entity';
import { ScreeningDBEntity } from '../modules/screenings/database/screening.entity';
import { SeatDBEntity } from '../modules/seats/database/seat.entity';
import { appDataSource } from '../modules/shared/data-source/data-source';
import { TheaterDBEntity } from '../modules/theaters/database/theater.entity';
import { UserDBEntity } from '../modules/users/database/user.entity';

export default async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.getRepository(Reservation).deleteAll();
    await appDataSource.getRepository(UserDBEntity).deleteAll();
    await appDataSource.getRepository(SeatDBEntity).deleteAll();
    await appDataSource.getRepository(ScreeningSeat).deleteAll();
    await appDataSource.getRepository(ScreeningDBEntity).deleteAll();
    await appDataSource.getRepository(TheaterDBEntity).deleteAll();
    await appDataSource.destroy();
  }
};
