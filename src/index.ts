import express from 'express';
import { UsersSignUpController } from './modules/users/http/controllers/sign-up.ts';
import { UserRepository } from './modules/users/repositories/user.repository.ts';
import { Hasher } from './modules/shared/security/hasher.ts';
import { AppConfigLoader } from './modules/shared/configs/app-config.ts';
import { UsersSignUpUseCase } from './modules/users/use-cases/sign-up.ts';
import { UsersLoginController } from './modules/users/http/controllers/login.ts';
import { UserLoginUseCase } from './modules/users/use-cases/login.ts';
import { CreateScreeningController } from './modules/screenings/http/controllers/create.ts';
import { ScreeningRepository } from './modules/screenings/repositories/screening.repository.ts';
import { CreateScreeningUseCase } from './modules/screenings/use-cases/create.ts';
import { ListScreeningsController } from './modules/screenings/http/controllers/list-screenings.ts';
import { expressAuthMiddleware } from './modules/shared/external/express/middlewares/auth-middleware.ts';
import { JWTTokenValidator } from './modules/shared/security/token-validator.ts';
import { appDataSource } from './modules/shared/data-source/data-source.ts';
import { expressRequiredPermissionsMiddleware } from './modules/shared/external/express/middlewares/required-permissions.ts';
import { CreateReservationController } from './modules/reservations/http/controllers/create.ts';
import { CreateReservationUseCase } from './modules/reservations/use-cases/create.ts';
import { ReservationRepository } from './modules/reservations/repositories/reservation.repository.ts';
import { Seeder } from './modules/shared/seed/seeder.ts';
import { ListScreeningSeatsController } from './modules/screenings/http/controllers/list-screening-seats.ts';
import { ListReservationsController } from './modules/reservations/http/controllers/list.ts';
import { CreateMovieController } from './modules/movies/http/controllers/create.ts';
import { MovieRepository } from './modules/movies/repositories/movie.repository.ts';
import { CreateMovieUseCase } from './modules/movies/use-cases/create.ts';

async function startApplication() {
  const appConfig = AppConfigLoader.load();

  const app = express();

  await appDataSource.initialize();

  console.log('Data Source has been initialized!');

  await Seeder.run();

  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('Welcome to the Movie Tickets Reservation System!');
  });

  app.post('/users', (req, res) => new UsersSignUpController(new UsersSignUpUseCase(new UserRepository(), new Hasher())).handle(req, res));

  app.post('/users/login', async (req, res) =>
    new UsersLoginController(new UserLoginUseCase(new UserRepository(), new Hasher(), appConfig)).handle(req, res),
  );

  app.post('/movies', expressRequiredPermissionsMiddleware(['movies:create']), expressAuthMiddleware(new JWTTokenValidator(appConfig)), (req, res) =>
    new CreateMovieController(new CreateMovieUseCase(new MovieRepository())).handle(req, res),
  );

  app.post(
    '/screenings',
    expressRequiredPermissionsMiddleware(['screenings:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    async (req, res) => new CreateScreeningController(new CreateScreeningUseCase(new ScreeningRepository())).handle(req, res),
  );

  app.get(
    '/screenings',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    async (req, res) => new ListScreeningsController(new ScreeningRepository()).handle(req, res),
  );

  app.get(
    '/screenings/:screeningId/seats',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    async (req, res) => new ListScreeningSeatsController(new ScreeningRepository()).handle(req, res),
  );

  app.post(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    async (req, res) =>
      new CreateReservationController(new CreateReservationUseCase(new ReservationRepository(), new ScreeningRepository())).handle(req, res),
  );

  app.get(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    async (req, res) => new ListReservationsController(new ReservationRepository()).handle(req, res),
  );

  app.listen(appConfig.SERVER_PORT, () => {
    console.log(`Server is running on port ${appConfig.SERVER_PORT}`);
  });
}

startApplication().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
