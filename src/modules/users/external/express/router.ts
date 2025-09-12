import { Router } from 'express';
import { Container } from 'inversify';
import { expressHttpControllerAdapter } from '../../../shared/external/express/adapters/controller-adapter.ts';
import { UsersLoginController } from '../../http/controllers/login.ts';
import { UsersSignUpController } from '../../http/controllers/sign-up.ts';

export function usersRouter(container: Container): Router {
  const app = Router();

  /**
   * @swagger
   * components:
   *  schemas:
   *    UserSignUpInput:
   *      type: object
   *      properties:
   *        email:
   *          type: string
   *        password:
   *          type: string
   *    UserLoginInput:
   *      type: object
   *      properties:
   *        email:
   *          type: string
   *        password:
   *          type: string
   *    UserLoginOutput:
   *      type: object
   *      properties:
   *        data:
   *          type: object
   *          properties:
   *            token:
   *              type: string
   */

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: User sign up.
   *     tags:
   *      - Users Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UserSignUpInput"
   *     responses:
   *       '201':
   *         description: The user was created successfuly.
   */
  app.post('/users', expressHttpControllerAdapter(container.get(UsersSignUpController)));

  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: User login.
   *     tags:
   *      - Users Authentication
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/UserLoginInput"
   *     responses:
   *       '201':
   *         description: The user was created successfuly.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/UserLoginOutput"
   */
  app.post('/users/login', expressHttpControllerAdapter(container.get(UsersLoginController)));

  return app;
}
