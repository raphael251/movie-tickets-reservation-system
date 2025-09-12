import { Container } from 'inversify';
import { AppConfig } from '../../../shared/configs/app-config';
import { Router } from 'express';
import { expressHttpControllerAdapter } from '../../../shared/external/express/adapters/controller-adapter.ts';
import { expressAuthMiddleware } from '../../../shared/external/express/middlewares/auth-middleware.ts';
import { expressRequiredPermissionsMiddleware } from '../../../shared/external/express/middlewares/required-permissions.ts';
import { JWTTokenValidator } from '../../../shared/security/token-validator.ts';
import { CreateMovieController } from '../../http/controllers/create.ts';
import { DeleteMovieController } from '../../http/controllers/delete.ts';
import { ListMoviesController } from '../../http/controllers/list.ts';
import { UpdateMovieController } from '../../http/controllers/update.ts';

export function moviesRouter(container: Container, appConfig: AppConfig): Router {
  const router = Router();

  /**
   * @swagger
   * components:
   *  schemas:
   *    CreateMovieInput:
   *      type: object
   *      properties:
   *        title:
   *          type: string
   *        description:
   *          type: string
   *        category:
   *          type: string
   *    Movie:
   *      type: object
   *      properties:
   *        id:
   *          type: string
   *        title:
   *          type: string
   *        description:
   *          type: string
   *        category:
   *          type: string
   */

  /**
   * @swagger
   * /movies:
   *   post:
   *     summary: Create a movie.
   *     tags:
   *      - Movies
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateMovieInput"
   *     responses:
   *       '201':
   *         description: The movie was created successfuly.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/CreateMovieOutput"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.post(
    '/movies',
    expressRequiredPermissionsMiddleware(['movies:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CreateMovieController)),
  );

  /**
   * @swagger
   * /movies:
   *   get:
   *     summary: List all movies for the authenticated user.
   *     tags:
   *      - Movies
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/Movie"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.get(
    '/movies',
    expressRequiredPermissionsMiddleware(['movies:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ListMoviesController)),
  );

  /**
   * @swagger
   * /movies/{movieId}:
   *   get:
   *     summary: Get one specific movie details.
   *     tags:
   *      - Movies
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Movie"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.put(
    '/movies/:movieId',
    expressRequiredPermissionsMiddleware(['movies:update']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(UpdateMovieController)),
  );

  /**
   * @swagger
   * /movies/{movieId}:
   *   delete:
   *     summary: Delete the movie with the given ID.
   *     tags:
   *      - Movies
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '204':
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/Movie"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.delete(
    '/movies/:movieId',
    expressRequiredPermissionsMiddleware(['movies:delete']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(DeleteMovieController)),
  );

  return router;
}
