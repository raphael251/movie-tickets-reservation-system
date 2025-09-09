import { Router } from 'express';
import { Container } from 'inversify';
import { expressHttpControllerAdapter } from '../../../shared/external/express/adapters/controller-adapter';
import { UsersLoginController } from '../../http/controllers/login';
import { UsersSignUpController } from '../../http/controllers/sign-up';

export function usersRouter(container: Container): Router {
  const app = Router();

  app.post('/users', expressHttpControllerAdapter(container.get(UsersSignUpController)));

  app.post('/users/login', expressHttpControllerAdapter(container.get(UsersLoginController)));

  return app;
}
