import { ReservationDBEntity } from '../modules/reservations/database/reservation.entity';
import { ScreeningSeatDBEntity } from '../modules/screenings/database/screening-seat.entity';
import { ScreeningDBEntity } from '../modules/screenings/database/screening.entity';
import { SeatDBEntity } from '../modules/seats/database/seat.entity';
import { appDataSource } from '../modules/shared/data-source/data-source';
import { TheaterDBEntity } from '../modules/theaters/database/theater.entity';
import { UserDBEntity } from '../modules/users/database/user.entity';

export default async () => {
  if (appDataSource.isInitialized) {
    await appDataSource.getRepository(ReservationDBEntity).deleteAll();
    await appDataSource.getRepository(UserDBEntity).deleteAll();
    await appDataSource.getRepository(SeatDBEntity).deleteAll();
    await appDataSource.getRepository(ScreeningSeatDBEntity).deleteAll();
    await appDataSource.getRepository(ScreeningDBEntity).deleteAll();
    await appDataSource.getRepository(TheaterDBEntity).deleteAll();
    await appDataSource.destroy();
  }
};
