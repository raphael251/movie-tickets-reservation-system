import express, { Request, Response } from 'express';
import { AppConfigLoader } from './modules/shared/configs/app-config.ts';
import { Container } from 'inversify';
import { createDependenciesContainer } from './modules/shared/dependencies/create-dependencies-container.ts';
import cors from 'cors';
import { reservationsRouter } from './modules/reservations/external/express/router.ts';
import { screeningsRouter } from './modules/screenings/external/express/router.ts';
import { moviesRouter } from './modules/movies/external/express/router.ts';
import { usersRouter } from './modules/users/external/express/router.ts';

const appConfig = AppConfigLoader.load();

export function createApp() {
  const container: Container = createDependenciesContainer(appConfig);

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (_, res) => {
    res.send('Welcome to the Movie Tickets Reservation System!');
  });

  app.use(usersRouter(container));

  app.use(moviesRouter(container, appConfig));

  app.use(screeningsRouter(container, appConfig));

  app.use(reservationsRouter(container, appConfig));

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
