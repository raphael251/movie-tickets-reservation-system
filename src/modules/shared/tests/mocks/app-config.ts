import { AppConfig } from '../../configs/app-config';

export const appConfigMock: AppConfig = {
  SERVER_PORT: '3000',

  JWT_SECRET: 'secret',
  JWT_EXPIRATION: 300,

  DB_USERNAME: 'user',
  DB_PASSWORD: 'password',
  DB_DATABASE: 'database',
  DB_MIGRATIONS_PATH: 'migrations',
  DB_HOST: 'localhost',
  DB_PORT: 5432,
};
