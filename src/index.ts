import express from 'express';
import { UsersSignUpController } from './modules/users/http/controllers/sign-up.ts';
import { UserRepository } from './modules/users/repositories/user.repository.ts';
import { Hasher } from './modules/shared/security/hasher.ts';
import { AppConfigLoader } from './modules/shared/configs/app-config.ts';
import { UsersSignUpUseCase } from './modules/users/use-cases/sign-up.ts';
import { UsersLoginController } from './modules/users/http/controllers/login.ts';
import { UserLoginUseCase } from './modules/users/use-cases/login.ts';
import { CreateMovieController } from './modules/movies/http/controllers/create.ts';
import { MovieRepository } from './modules/movies/repositories/movie.repository.ts';
import { CreateMovieUseCase } from './modules/movies/use-cases/create.ts';
import { ListMoviesController } from './modules/movies/http/controllers/list.ts';
import { expressAuthMiddleware } from './modules/shared/external/express/middlewares/auth-middleware.ts';
import { JWTTokenValidator } from './modules/shared/security/token-validator.ts';
import { appDataSource } from './modules/shared/data-source/data-source.ts';
import { expressRequiredPermissionsMiddleware } from './modules/shared/external/express/middlewares/required-permissions.ts';
import { CreateReservationController } from './modules/reservations/http/controllers/create.ts';
import { CreateReservationUseCase } from './modules/reservations/use-cases/create.ts';
import { ReservationRepository } from './modules/reservations/repositories/reservation.repository.ts';

async function startApplication() {
  const appConfig = AppConfigLoader.load();

  const app = express();

  await appDataSource.initialize();

  console.log('Data Source has been initialized!');

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Welcome to the Movie Tickets Reservation System!');
  });

  app.post('/users', (req, res) => new UsersSignUpController(new UsersSignUpUseCase(new UserRepository(), new Hasher())).handle(req, res));

  app.post('/users/login', async (req, res) =>
    new UsersLoginController(new UserLoginUseCase(new UserRepository(), new Hasher(), appConfig)).handle(req, res),
  );

  app.post(
    '/movies',
    expressRequiredPermissionsMiddleware(['movies:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    async (req, res) => new CreateMovieController(new CreateMovieUseCase(new MovieRepository())).handle(req, res),
  );

  app.get(
    '/movies',
    expressRequiredPermissionsMiddleware(['movies:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    async (req, res) => new ListMoviesController(new MovieRepository()).handle(req, res),
  );

  app.post(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    async (req, res) =>
      new CreateReservationController(new CreateReservationUseCase(new ReservationRepository(), new MovieRepository())).handle(req, res),
  );

  app.listen(appConfig.SERVER_PORT, () => {
    console.log(`Server is running on port ${appConfig.SERVER_PORT}`);
  });
}

startApplication().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
