import z from 'zod';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { IScreeningRepository } from '../../repositories/interfaces/screening.repository.ts';
import { SCREENING_SEAT_STATUS, ScreeningSeat } from '../../entities/screening-seat.ts';

export class ListScreeningSeatsController implements IHttpControllerV2<ScreeningSeat[]> {
  constructor(private repository: IScreeningRepository) {}

  async handle(request: THttpRequest): Promise<THttpResponse<ScreeningSeat[]>> {
    const filterSchema = z.object({
      status: z.enum(SCREENING_SEAT_STATUS).optional(),
    });

    const { success: isValid, data: filter } = filterSchema.safeParse(request.query);

    if (!isValid) {
      return {
        status: 400,
        errors: ['Invalid query parameters'],
      };
    }

    const seats = await this.repository.findSeatsByScreeningId(request.params.screeningId, filter);

    return {
      status: 200,
      data: seats,
    };
  }
}
