import { Router } from 'express';
import { Container } from 'inversify';
import { expressHttpControllerAdapter } from '../../../shared/external/express/adapters/controller-adapter.ts';
import { expressAuthMiddleware } from '../../../shared/external/express/middlewares/auth-middleware.ts';
import { expressRequiredPermissionsMiddleware } from '../../../shared/external/express/middlewares/required-permissions.ts';
import { JWTTokenValidator } from '../../../shared/security/token-validator.ts';
import { CancelReservationController } from '../../http/controllers/cancel.ts';
import { CreateReservationController } from '../../http/controllers/create.ts';
import { ListReservationsController } from '../../http/controllers/list.ts';
import { ReadReservationController } from '../../http/controllers/read.ts';
import { AppConfig } from '../../../shared/configs/app-config.ts';

export function reservationsRouter(container: Container, appConfig: AppConfig): Router {
  const router = Router();

  router.post(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CreateReservationController)),
  );

  router.get(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ListReservationsController)),
  );

  router.get(
    '/reservations/:reservationId',
    expressRequiredPermissionsMiddleware(['reservations:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ReadReservationController)),
  );

  router.delete(
    '/reservations/:reservationId',
    expressRequiredPermissionsMiddleware(['reservations:cancel']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CancelReservationController)),
  );

  return router;
}
