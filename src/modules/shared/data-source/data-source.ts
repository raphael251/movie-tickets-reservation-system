import 'dotenv/config';
import { DataSource } from 'typeorm';
import { MovieDBEntity } from '../../movies/database/movie.entity.ts';
import { UserDBEntity } from '../../users/database/user.entity.ts';
import { AppConfigLoader } from '../configs/app-config.ts';

const appConfig = AppConfigLoader.load();

export const appDataSource = new DataSource({
  type: 'postgres',
  host: appConfig.DB_HOST,
  port: appConfig.DB_PORT,
  username: appConfig.DB_USERNAME,
  password: appConfig.DB_PASSWORD,
  database: appConfig.DB_DATABASE,
  entities: [UserDBEntity, MovieDBEntity],
  logging: true,
});
