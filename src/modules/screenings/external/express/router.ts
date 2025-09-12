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

  /**
   * @swagger
   * components:
   *  schemas:
   *    CreateScreeningInput:
   *      type: object
   *      properties:
   *        movieId:
   *          type: string
   *        theaterId:
   *          type: string
   *        startTime:
   *          type: string
   *        endTime:
   *          type: string
   *    Screening:
   *      type: object
   *      properties:
   *        id:
   *          type: string
   *        movie:
   *          type: object
   *          properties:
   *            id:
   *              type: string
   *            title:
   *              type: string
   *            description:
   *              type: string
   *            category:
   *              type: string
   *        theater:
   *          type: object
   *          properties:
   *            id:
   *              type: string
   *            name:
   *              type: string
   *        startTime:
   *          type: string
   *        endTime:
   *          type: string
   */

  /**
   * @swagger
   * /screenings:
   *   post:
   *     summary: Create a screening.
   *     tags:
   *      - Screenings
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateScreeningInput"
   *     responses:
   *       '201':
   *         description: The screening was created successfuly.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Screening"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.post(
    '/screenings',
    expressRequiredPermissionsMiddleware(['screenings:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CreateScreeningController)),
  );

  /**
   * @swagger
   * /screenings:
   *   get:
   *     summary: List all screenings.
   *     tags:
   *      - Screenings
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/Screening"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.get(
    '/screenings',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ListScreeningsController)),
  );

  /**
   * @swagger
   * /screenings/{screeningId}/seats:
   *   get:
   *     summary: Get the seats for one specific screening.
   *     tags:
   *      - Screenings
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Screening"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.get(
    '/screenings/:screeningId/seats',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ListScreeningSeatsController)),
  );

  /**
   * @swagger
   * /seats/{screeningSeatId}:
   *   get:
   *     summary: Get one specific screening seat details.
   *     tags:
   *      - Screenings
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Screening"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.get(
    '/seats/:screeningSeatId',
    expressRequiredPermissionsMiddleware(['screenings:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ReadScreeningSeatController)),
  );

  return router;
}
