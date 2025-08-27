import z from 'zod';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { Screening } from '../../database/screening.entity.ts';
import { IScreeningRepository } from '../../repositories/interfaces/screening.repository';

export class ListScreeningsController implements IHttpControllerV2<Screening[]> {
  constructor(private screeningRepository: IScreeningRepository) {}

  async handle(request: THttpRequest): Promise<THttpResponse<Screening[]>> {
    try {
      const requestQuerySchema = z.object({
        cursor: z.string().min(1).optional(),
        limit: z.coerce.number().min(1).optional(),
      });

      const { success: isValid, data: pagination } = requestQuerySchema.safeParse(request.query);

      if (!isValid) {
        return {
          status: 400,
          errors: ['Invalid query parameters'],
        };
      }

      const { data, hasNext, nextCursor } = await this.screeningRepository.findAll(pagination);

      return {
        status: 200,
        data,
        meta: {
          hasNext,
          nextCursor,
        },
      };
    } catch (error) {
      console.error('Error during screenings listing:', error);
      return { status: 500 };
    }
  }
}
