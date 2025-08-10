import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { InvalidScreeningSeatIdError } from '../../errors/invalid-screening-id.ts';
import { SeatAlreadyReservedError } from '../../errors/seat-already-reserved.ts';
import { CreateReservationUseCase } from '../../use-cases/create.ts';
import { Request, Response } from 'express';

export class CreateReservationController implements IHttpController {
  constructor(private readonly createReservationUseCase: CreateReservationUseCase) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      const { screeningSeatId } = request.body;

      const reservation = await this.createReservationUseCase.execute({
        userId: request.user!.id,
        screeningSeatId,
      });

      response.status(201).json(reservation);
    } catch (error) {
      if (error instanceof SeatAlreadyReservedError || error instanceof InvalidScreeningSeatIdError) {
        response.status(409).json({ errors: [error.message] });
        return;
      }

      if (error instanceof InputValidationError) {
        response.status(400).json({ errors: error.errors });
        return;
      }

      response.status(500).send('Internal Server Error');
    }
  }
}
