import 'dotenv/config';
import { DataSource } from 'typeorm';
import { Screening } from '../../screenings/database/screening.entity.ts';
import { User } from '../../users/database/user.entity.ts';
import { AppConfigLoader } from '../configs/app-config.ts';
import { Reservation } from '../../reservations/database/reservation.entity.ts';
import { readFileSync } from 'node:fs';
import { Seat } from '../../seats/database/seat.entity.ts';
import { Theater } from '../../theaters/database/theater.entity.ts';
import { ScreeningSeat } from '../../screenings/database/screening-seat.entity.ts';
import { Movie } from '../../movies/database/movie.entity.ts';

const appConfig = AppConfigLoader.load();

export const appDataSource = new DataSource({
  type: 'postgres',
  host: appConfig.DB_HOST,
  port: appConfig.DB_PORT,
  username: appConfig.DB_USERNAME,
  password: appConfig.DB_PASSWORD,
  database: appConfig.DB_DATABASE,
  ssl: appConfig.DB_SSL_CA_PATH
    ? {
        rejectUnauthorized: false,
        ca: readFileSync(appConfig.DB_SSL_CA_PATH, 'utf-8'),
      }
    : false,
  entities: [User, Screening, Reservation, Seat, Theater, ScreeningSeat, Movie],
  migrations: [appConfig.DB_MIGRATIONS_PATH],
  logging: appConfig.DB_LOGGING_ENABLED,
  useUTC: true,
});
