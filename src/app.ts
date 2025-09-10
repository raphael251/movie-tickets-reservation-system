import express, { NextFunction, Request, Response } from 'express';
import { AppConfigLoader } from './modules/shared/configs/app-config.ts';
import { Container } from 'inversify';
import { createDependenciesContainer } from './modules/shared/dependencies/create-dependencies-container.ts';
import cors from 'cors';
import { reservationsRouter } from './modules/reservations/external/express/router.ts';
import { screeningsRouter } from './modules/screenings/external/express/router.ts';
import { moviesRouter } from './modules/movies/external/express/router.ts';
import { usersRouter } from './modules/users/external/express/router.ts';
import { appDataSource } from './modules/shared/data-source/data-source.ts';

const appConfig = AppConfigLoader.load();

export function createApp() {
  const container: Container = createDependenciesContainer(appConfig);

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', async (_, res) => {
    try {
      await appDataSource.query('SELECT 1');
      res.status(200).end();
    } catch (err) {
      console.error('error on health check: ', err);
      res.status(500).end();
    }
  });

  app.use(usersRouter(container));

  app.use(moviesRouter(container, appConfig));

  app.use(screeningsRouter(container, appConfig));

  app.use(reservationsRouter(container, appConfig));

  // Generic handler for not-found routes (404)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((req: Request, res: Response, _next: NextFunction) => {
    res.status(404).send('Not Found');
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error('Unknown error:', err);
    }

    res.status(500).send('Internal Server Error');
  });

  return app;
}
