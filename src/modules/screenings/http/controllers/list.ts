import { IHttpController } from '../../../shared/interfaces/http/controller';
import { IScreeningRepository } from '../../repositories/interfaces/screening.repository';
import { Request, Response } from 'express';

export class ListScreeningsController implements IHttpController {
  constructor(private repository: IScreeningRepository) {}

  async handle(request: Request, response: Response): Promise<void> {
    const screenings = await this.repository.findAll();

    response.status(200).json({ screenings });
  }
}
