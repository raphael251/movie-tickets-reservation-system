import 'dotenv/config';
import express from 'express';
import { UsersSignUpController } from './modules/users/http/controllers/sign-up';
import { DataSource } from 'typeorm';
import { UserRepository } from './modules/users/repositories';
import { Hasher } from './modules/shared/security/hasher';
import { AppConfigLoader } from './modules/shared/configs/app-config';

async function startApplication() {
  const appConfig = AppConfigLoader.load();

  const appDataSource = new DataSource({
    type: 'postgres',
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    username: appConfig.DB_USERNAME,
    password: appConfig.DB_PASSWORD,
    database: appConfig.DB_DATABASE,
    entities: [__dirname + '/modules/**/*.{js,ts}'],
    synchronize: true, // Set to false in production
    logging: true,
  })

  const app = express();

  appDataSource.initialize()
    .then(() => {
      console.log('Data Source has been initialized!');
    })
    .catch((err) => {
      console.error('Error during Data Source initialization:', err);
    });

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Welcome to the Movie Tickets Reservation System!');
  });

  app.post('/users', (req, res) => new UsersSignUpController(new UserRepository(), new Hasher()).handle(req, res));

  app.listen(appConfig.SERVER_PORT, () => {
    console.log(`Server is running on http://localhost:${appConfig.SERVER_PORT}`);
  });
}

startApplication().catch((error) => {
    console.error('Error starting the application:', error);
    process.exit(1);
});