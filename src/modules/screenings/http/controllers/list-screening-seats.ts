import z from 'zod';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { IScreeningRepository } from '../../repositories/interfaces/screening.repository.ts';
import { Request, Response } from 'express';
import { SCREENING_SEAT_STATUS } from '../../entities/screening-seat.ts';

export class ListScreeningSeatsController implements IHttpController {
  constructor(private repository: IScreeningRepository) {}

  async handle(request: Request, response: Response): Promise<void> {
    const filterSchema = z.object({
      status: z.enum(SCREENING_SEAT_STATUS).optional(),
    });

    const { success: isValid, data: filter } = filterSchema.safeParse(request.query);

    if (!isValid) {
      response.status(400).json({ error: 'Invalid query parameters' });
      return;
    }

    const seats = await this.repository.findSeatsByScreeningId(request.params.screeningId, filter);

    response.status(200).json({ seats });
  }
}
