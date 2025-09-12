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

  /**
   * @swagger
   * components:
   *  schemas:
   *    CreateReservationInput:
   *      type: object
   *      properties:
   *        screeningSeatId:
   *          type: string
   *    Reservation:
   *      type: object
   *      properties:
   *        id:
   *          type: string
   *        seat:
   *          type: string
   *        status:
   *          type: string
   *          enum: [PENDING, CONFIRMED, CANCELED]
   *        screening:
   *          type: object
   *          properties:
   *            id:
   *              type: string
   *            movieTitle:
   *              type: string
   *            theaterName:
   *              type: string
   *            startTime:
   *              type: string
   *            endTime:
   *              type: string
   */

  /**
   * @swagger
   * /reservations:
   *   post:
   *     summary: Create a reservation.
   *     tags:
   *      - Reservations
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: "#/components/schemas/CreateReservationInput"
   *     responses:
   *       '201':
   *         description: The reservation was created successfuly.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Reservation"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.post(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:create']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CreateReservationController)),
  );

  /**
   * @swagger
   * /reservations:
   *   get:
   *     summary: List all reservations for the authenticated user.
   *     tags:
   *      - Reservations
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/Reservation"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.get(
    '/reservations',
    expressRequiredPermissionsMiddleware(['reservations:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ListReservationsController)),
  );

  /**
   * @swagger
   * /reservations/{reservationId}:
   *   get:
   *     summary: Get one specific reservation details.
   *     tags:
   *      - Reservations
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         content:
   *           application/json:
   *             schema:
   *               $ref: "#/components/schemas/Reservation"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.get(
    '/reservations/:reservationId',
    expressRequiredPermissionsMiddleware(['reservations:read']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(ReadReservationController)),
  );

  /**
   * @swagger
   * /reservations/{reservationId}:
   *   delete:
   *     summary: Delete the reservation with the given ID.
   *     tags:
   *      - Reservations
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '204':
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: "#/components/schemas/Reservation"
   *       '401':
   *         $ref: "#/components/responses/UnauthorizedError"
   */
  router.delete(
    '/reservations/:reservationId',
    expressRequiredPermissionsMiddleware(['reservations:cancel']),
    expressAuthMiddleware(new JWTTokenValidator(appConfig)),
    expressHttpControllerAdapter(container.get(CancelReservationController)),
  );

  return router;
}
