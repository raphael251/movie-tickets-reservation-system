import { IHttpController } from '../../../shared/interfaces/http/controller';
import { IScreeningRepository } from '../../repositories/interfaces/screening.repository';
import { Request, Response } from 'express';

export class ListScreeningSeatsController implements IHttpController {
  constructor(private repository: IScreeningRepository) {}

  async handle(request: Request, response: Response): Promise<void> {
    const seats = await this.repository.findSeatsByScreeningId(request.params.screeningId);

    response.status(200).json({ seats });
  }
}
