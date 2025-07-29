import express from 'express';
import { UsersSignUpController } from './modules/users/http/controllers/sign-up.ts';
import { DataSource } from 'typeorm';
import { UserRepository } from './modules/users/repositories/user.repository.ts';
import { Hasher } from './modules/shared/security/hasher.ts';
import { AppConfigLoader } from './modules/shared/configs/app-config.ts';
import { UserDBEntity } from './modules/users/database/user.entity.ts';
import { UsersSignUpUseCase } from './modules/users/use-cases/sign-up.ts';
import { UsersLoginController } from './modules/users/http/controllers/login.ts';
import { UserLoginUseCase } from './modules/users/use-cases/login.ts';
import { MovieDBEntity } from './modules/movies/database/movie.entity.ts';
import { CreateMovieController } from './modules/movies/http/controllers/create.ts';
import { MovieRepository } from './modules/movies/repositories/movie.repository.ts';
import { CreateMovieUseCase } from './modules/movies/use-cases/create.ts';

async function startApplication() {
  const appConfig = AppConfigLoader.load();

  const appDataSource = new DataSource({
    type: 'postgres',
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    username: appConfig.DB_USERNAME,
    password: appConfig.DB_PASSWORD,
    database: appConfig.DB_DATABASE,
    entities: [UserDBEntity, MovieDBEntity],
    synchronize: true, // Set to false in production
    logging: true,
  });

  const app = express();

  appDataSource
    .initialize()
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

  app.post('/users', (req, res) => new UsersSignUpController(new UsersSignUpUseCase(new UserRepository(), new Hasher())).handle(req, res));

  app.post('/users/login', async (req, res) =>
    new UsersLoginController(new UserLoginUseCase(new UserRepository(), new Hasher(), appConfig)).handle(req, res),
  );

  app.post('/movies', async (req, res) => new CreateMovieController(new CreateMovieUseCase(new MovieRepository())).handle(req, res));

  app.listen(appConfig.SERVER_PORT, () => {
    console.log(`Server is running on port ${appConfig.SERVER_PORT}`);
  });
}

startApplication().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
