import z from 'zod';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { IScreeningRepository } from '../../repositories/interfaces/screening.repository.ts';
import { SCREENING_SEAT_STATUS } from '../../database/screening-seat.entity.ts';
import { mapScreeningSeatToDTO, ScreeningSeatDTO } from '../../dtos/screening-seat.dto.ts';
import { ILogger } from '../../../shared/logger/interfaces/logger.ts';

export class ListScreeningSeatsController implements IHttpControllerV2<ScreeningSeatDTO> {
  constructor(
    private readonly repository: IScreeningRepository,
    private readonly logger: ILogger,
  ) {}

  async handle(request: THttpRequest): Promise<THttpResponse<ScreeningSeatDTO>> {
    try {
      const requestQuerySchema = z.object({
        status: z.enum(SCREENING_SEAT_STATUS).optional(),
        cursor: z.string().min(1).optional(),
        limit: z.coerce.number().min(1).optional(),
      });

      const { success: isValid, data: parsedQuery } = requestQuerySchema.safeParse(request.query);

      if (!isValid) {
        return {
          status: 400,
          errors: ['Invalid query parameters'],
        };
      }

      const { data, hasNext, nextCursor } = await this.repository.findSeatsByScreeningId(
        request.params.screeningId,
        { status: parsedQuery.status },
        { cursor: parsedQuery.cursor, limit: parsedQuery.limit },
      );

      return {
        status: 200,
        data: data.map((screeningSeat) => mapScreeningSeatToDTO(screeningSeat)),
        meta: {
          hasNext,
          nextCursor,
        },
      };
    } catch (error) {
      this.logger.error('Error during screening seats listing:', { error });
      return { status: 500 };
    }
  }
}
