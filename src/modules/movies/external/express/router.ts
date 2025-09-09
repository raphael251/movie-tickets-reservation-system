import { Container } from 'inversify';
import { AppConfig } from '../../../shared/configs/app-config';
import { Router } from 'express';
import { expressHttpControllerAdapter } from '../../../shared/external/express/adapters/controller-adapter';
import { expressAuthMiddleware } from '../../../shared/external/express/middlewares/auth-middleware';
import { expressRequiredPermissionsMiddleware } from '../../../shared/external/express/middlewares/required-permissions';
import { JWTTokenValidator } from '../../../shared/security/token-validator';
import { CreateMovieController } from '../../http/controllers/create';
import { DeleteMovieController } from '../../http/controllers/delete';
import { ListMoviesController } from '../../http/controllers/list';
import { UpdateMovieController } from '../../http/controllers/update';

export function moviesRouter(container: Container, appConfig: AppConfig): Router {
  const router = Router();

  router.post(
    '/movies',
    expressRequiredPermissionsMiddleware(['movies:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CreateMovieController)),
  );

  router.get(
    '/movies',
    expressRequiredPermissionsMiddleware(['movies:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ListMoviesController)),
  );

  router.put(
    '/movies/:movieId',
    expressRequiredPermissionsMiddleware(['movies:update']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(UpdateMovieController)),
  );

  router.delete(
    '/movies/:movieId',
    expressRequiredPermissionsMiddleware(['movies:delete']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(DeleteMovieController)),
  );

  return router;
}
