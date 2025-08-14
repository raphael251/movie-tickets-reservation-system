import { Request, Response } from 'express';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { CancelReservationUseCase } from '../../use-cases/cancel.ts';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { ReservationDoesNotExistError } from '../../errors/reservation-does-not-exist.ts';

export class CancelReservationController implements IHttpController {
  constructor(private readonly cancelReservationUseCase: CancelReservationUseCase) {}
  async handle(request: Request, response: Response): Promise<void> {
    try {
      const { reservationId } = request.params;

      await this.cancelReservationUseCase.execute({ reservationId });

      response.status(204).send();
    } catch (error) {
      if (error instanceof InputValidationError) {
        response.status(400).json({ errors: error.errors });
        return;
      }

      if (error instanceof ReservationDoesNotExistError) {
        response.status(404).json({ errors: [error.message] });
        return;
      }

      console.error('Error during reservation cancellation:', error);
      response.status(500).send('Internal Server Error');
    }
  }
}
