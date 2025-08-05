import 'dotenv/config';
import { DataSource } from 'typeorm';
import { MovieDBEntity } from '../../movies/database/movie.entity.ts';
import { UserDBEntity } from '../../users/database/user.entity.ts';
import { AppConfigLoader } from '../configs/app-config.ts';
import { ReservationDBEntity } from '../../reservations/database/reservation.entity.ts';

const appConfig = AppConfigLoader.load();

export const appDataSource = new DataSource({
  type: 'postgres',
  host: appConfig.DB_HOST,
  port: appConfig.DB_PORT,
  username: appConfig.DB_USERNAME,
  password: appConfig.DB_PASSWORD,
  database: appConfig.DB_DATABASE,
  ssl: appConfig.DB_SSL_ENABLED,
  entities: [UserDBEntity, MovieDBEntity, ReservationDBEntity],
  migrations: [appConfig.DB_MIGRATIONS_PATH],
  logging: true,
});
