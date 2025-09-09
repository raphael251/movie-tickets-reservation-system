import { Container } from 'inversify';
import { AppConfig } from '../../../shared/configs/app-config.ts';
import { Router } from 'express';
import { expressHttpControllerAdapter } from '../../../shared/external/express/adapters/controller-adapter.ts';
import { expressAuthMiddleware } from '../../../shared/external/express/middlewares/auth-middleware.ts';
import { expressRequiredPermissionsMiddleware } from '../../../shared/external/express/middlewares/required-permissions.ts';
import { JWTTokenValidator } from '../../../shared/security/token-validator.ts';
import { CreateScreeningController } from '../../http/controllers/create.ts';
import { ListScreeningSeatsController } from '../../http/controllers/list-screening-seats.ts';
import { ListScreeningsController } from '../../http/controllers/list-screenings.ts';
import { ReadScreeningSeatController } from '../../http/controllers/read-screening-seat.ts';

export function screeningsRouter(container: Container, appConfig: AppConfig): Router {
  const router = Router();

  router.post(
    '/screenings',
    expressRequiredPermissionsMiddleware(['screenings:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CreateScreeningController)),
  );

  router.get(
    '/screenings',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ListScreeningsController)),
  );

  router.get(
    '/screenings/:screeningId/seats',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ListScreeningSeatsController)),
  );

  router.get(
    '/seats/:screeningSeatId',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ReadScreeningSeatController)),
  );

  return router;
}
