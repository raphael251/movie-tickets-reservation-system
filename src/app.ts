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
import { ListScreeningSeatsController } from './modules/screenings/http/controllers/list-screening-seats.ts';
import { ListReservationsController } from './modules/reservations/http/controllers/list.ts';
import { CreateMovieController } from './modules/movies/http/controllers/create.ts';
import { MovieRepository } from './modules/movies/repositories/movie.repository.ts';
import { UpdateMovieController } from './modules/movies/http/controllers/update.ts';
import { ListMoviesController } from './modules/movies/http/controllers/list.ts';
import { DeleteMovieController } from './modules/movies/http/controllers/delete.ts';
import { CancelReservationController } from './modules/reservations/http/controllers/cancel.ts';
import { TheaterRepository } from './modules/theaters/repositories/theater.repository.ts';
import { expressHttpControllerAdapter } from './modules/shared/external/express/adapters/controller-adapter.ts';
import { WinstonLogger } from './modules/shared/logger/winston-logger.ts';
import { Container } from 'inversify';
import { createDependenciesContainer } from './modules/shared/dependencies/create-dependencies-container.ts';

const appConfig = AppConfigLoader.load();

export function createApp() {
  const container: Container = createDependenciesContainer(appConfig);

  const app = express();

  app.use(express.json());

  app.get('/', (_, res) => {
    res.send('Welcome to the Movie Tickets Reservation System!');
  });

  app.post(
    '/users',
    expressHttpControllerAdapter(new UsersSignUpController(new UsersSignUpUseCase(new UserRepository(), new Hasher()), new WinstonLogger())),
  );

  app.post(
    '/users/login',
    expressHttpControllerAdapter(new UsersLoginController(new UserLoginUseCase(new UserRepository(), new Hasher(), appConfig), new WinstonLogger())),
  );

  app.post(
    '/movies',
    expressRequiredPermissionsMiddleware(['movies:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CreateMovieController)),
  );

  app.get(
    '/movies',
    expressRequiredPermissionsMiddleware(['movies:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ListMoviesController)),
  );

  app.put(
    '/movies/:movieId',
    expressRequiredPermissionsMiddleware(['movies:update']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(UpdateMovieController)),
  );

  app.delete(
    '/movies/:movieId',
    expressRequiredPermissionsMiddleware(['movies:delete']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(DeleteMovieController)),
  );

  app.post(
    '/screenings',
    expressRequiredPermissionsMiddleware(['screenings:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(
      new CreateScreeningController(
        new CreateScreeningUseCase(new ScreeningRepository(appConfig), new MovieRepository(appConfig), new TheaterRepository()),
        new WinstonLogger(),
      ),
    ),
  );

  app.get(
    '/screenings',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(new ListScreeningsController(new ScreeningRepository(appConfig), new WinstonLogger())),
  );

  app.get(
    '/screenings/:screeningId/seats',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(new ListScreeningSeatsController(new ScreeningRepository(appConfig), new WinstonLogger())),
  );

  app.post(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CreateReservationController)),
  );

  app.get(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ListReservationsController)),
  );

  app.delete(
    '/reservations/:reservationId',
    expressRequiredPermissionsMiddleware(['reservations:cancel']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CancelReservationController)),
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
