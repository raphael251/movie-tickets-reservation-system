import z from 'zod';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import type { IScreeningRepository } from '../../repositories/interfaces/screening.repository.ts';
import { SCREENING_SEAT_STATUS } from '../../database/screening-seat.entity.ts';
import { mapScreeningSeatToDTO, ScreeningSeatDTO } from '../../dtos/screening-seat.dto.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { inject, injectable } from 'inversify';
import { ScreeningRepository } from '../../repositories/screening.repository.ts';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';

@injectable()
export class ListScreeningSeatsController implements IHttpControllerV2<ScreeningSeatDTO> {
  constructor(
    @inject(ScreeningRepository)
    private readonly repository: IScreeningRepository,
    @inject(WinstonLogger)
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
