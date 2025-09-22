import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AppConfigLoader } from '../configs/app-config.ts';
import { readFileSync } from 'node:fs';
import { Outbox } from '../database/outbox.entity.ts';

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
  entities: [Outbox],
  migrations: [appConfig.DB_MIGRATIONS_PATH],
  logging: appConfig.DB_LOGGING_ENABLED,
  useUTC: true,
});
