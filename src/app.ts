import express, { Request, Response } from 'express';
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
import { expressRequiredPermissionsMiddleware } from './modules/shared/external/express/middlewares/required-permissions.ts';
import { CreateReservationController } from './modules/reservations/http/controllers/create.ts';
import { CreateReservationUseCase } from './modules/reservations/use-cases/create.ts';
import { ReservationRepository } from './modules/reservations/repositories/reservation.repository.ts';
import { ListScreeningSeatsController } from './modules/screenings/http/controllers/list-screening-seats.ts';
import { ListReservationsController } from './modules/reservations/http/controllers/list.ts';
import { CreateMovieController } from './modules/movies/http/controllers/create.ts';
import { MovieRepository } from './modules/movies/repositories/movie.repository.ts';
import { CreateMovieUseCase } from './modules/movies/use-cases/create.ts';
import { UpdateMovieController } from './modules/movies/http/controllers/update.ts';
import { UpdateMovieUseCase } from './modules/movies/use-cases/update.ts';
import { ListMoviesController } from './modules/movies/http/controllers/list.ts';
import { DeleteMovieUseCase } from './modules/movies/use-cases/delete.ts';
import { DeleteMovieController } from './modules/movies/http/controllers/delete.ts';
import { CancelReservationController } from './modules/reservations/http/controllers/cancel.ts';
import { CancelReservationUseCase } from './modules/reservations/use-cases/cancel.ts';
import { TheaterRepository } from './modules/theaters/repositories/theater.repository.ts';
import { expressHttpControllerAdapter } from './modules/shared/external/express/adapters/controller-adapter.ts';
import { ConsoleLogger } from './modules/shared/logger/console-logger.ts';

const appConfig = AppConfigLoader.load();

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/', (_, res) => {
    res.send('Welcome to the Movie Tickets Reservation System!');
  });

  app.post(
    '/users',
    expressHttpControllerAdapter(new UsersSignUpController(new UsersSignUpUseCase(new UserRepository(), new Hasher()), new ConsoleLogger())),
  );

  app.post(
    '/users/login',
    expressHttpControllerAdapter(new UsersLoginController(new UserLoginUseCase(new UserRepository(), new Hasher(), appConfig), new ConsoleLogger())),
  );

  app.post(
    '/movies',
    expressRequiredPermissionsMiddleware(['movies:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(new CreateMovieController(new CreateMovieUseCase(new MovieRepository(appConfig)), new ConsoleLogger())),
  );

  app.get(
    '/movies',
    expressRequiredPermissionsMiddleware(['movies:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(new ListMoviesController(new MovieRepository(appConfig), new ConsoleLogger())),
  );

  app.put(
    '/movies/:movieId',
    expressRequiredPermissionsMiddleware(['movies:update']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(new UpdateMovieController(new UpdateMovieUseCase(new MovieRepository(appConfig)), new ConsoleLogger())),
  );

  app.delete(
    '/movies/:movieId',
    expressRequiredPermissionsMiddleware(['movies:delete']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(new DeleteMovieController(new DeleteMovieUseCase(new MovieRepository(appConfig)), new ConsoleLogger())),
  );

  app.post(
    '/screenings',
    expressRequiredPermissionsMiddleware(['screenings:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(
      new CreateScreeningController(
        new CreateScreeningUseCase(new ScreeningRepository(appConfig), new MovieRepository(appConfig), new TheaterRepository()),
      ),
    ),
  );

  app.get(
    '/screenings',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(new ListScreeningsController(new ScreeningRepository(appConfig))),
  );

  app.get(
    '/screenings/:screeningId/seats',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(new ListScreeningSeatsController(new ScreeningRepository(appConfig))),
  );

  app.post(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(
      new CreateReservationController(new CreateReservationUseCase(new ReservationRepository(appConfig), new ScreeningRepository(appConfig))),
    ),
  );

  app.get(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(new ListReservationsController(new ReservationRepository(appConfig))),
  );

  app.delete(
    '/reservations/:reservationId',
    expressRequiredPermissionsMiddleware(['reservations:cancel']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(
      new CancelReservationController(new CancelReservationUseCase(new ReservationRepository(appConfig), new ScreeningRepository(appConfig))),
    ),
  );

  app.use((err: unknown, req: Request, res: Response) => {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error('Unknown error:', err);
    }

    res.status(500).send('Internal Server Error');
  });

  return app;
}
