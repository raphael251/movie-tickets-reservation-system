import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { InvalidMovieIdError } from '../../errors/invalid-movie-id.ts';
import { SeatAlreadyReservedError } from '../../errors/seat-already-reserved.ts';
import { CreateReservationUseCase } from '../../use-cases/create.ts';
import { Request, Response } from 'express';

export class CreateReservationController implements IHttpController {
  constructor(private readonly createReservationUseCase: CreateReservationUseCase) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      const { movieId, seatCode } = request.body;

      const reservation = await this.createReservationUseCase.execute(request.user!.id, movieId, seatCode);

      response.status(201).json(reservation);
    } catch (error) {
      if (error instanceof SeatAlreadyReservedError || error instanceof InvalidMovieIdError) {
        response.status(409).json({ error: error.message });
        return;
      }

      response.status(500).send('Internal Server Error');
    }
  }
}
