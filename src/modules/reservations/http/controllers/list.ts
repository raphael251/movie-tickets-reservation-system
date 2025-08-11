import { Request, Response } from 'express';
import { IHttpController } from '../../../shared/interfaces/http/controller';
import { IReservationRepository } from '../../repositories/interfaces/reservation.repository';

export class ListReservationsController implements IHttpController {
  constructor(private repository: IReservationRepository) {}
  async handle(request: Request, response: Response): Promise<void> {
    try {
      if (!request.user) {
        response.status(500).send('Internal Server Error');
        return;
      }

      const reservations = await this.repository.findAllByUserId(request.user.id);

      response.status(200).json({ reservations });
    } catch (error) {
      console.error('Error during reservation listing:', error);
      response.status(500).send('Internal Server Error');
    }
  }
}
