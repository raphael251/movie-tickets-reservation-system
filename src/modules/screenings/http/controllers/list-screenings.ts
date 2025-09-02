import z from 'zod';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import type { IScreeningRepository } from '../../repositories/interfaces/screening.repository';
import { mapScreeningToDTO, ScreeningDTO } from '../../dtos/screening.dto.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { inject, injectable } from 'inversify';
import { ScreeningRepository } from '../../repositories/screening.repository.ts';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';

@injectable()
export class ListScreeningsController implements IHttpControllerV2<ScreeningDTO> {
  constructor(
    @inject(ScreeningRepository)
    private readonly screeningRepository: IScreeningRepository,
    @inject(WinstonLogger)
    private readonly logger: ILogger,
  ) {}

  async handle(request: THttpRequest): Promise<THttpResponse<ScreeningDTO>> {
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
        data: data.map((screening) => mapScreeningToDTO(screening)),
        meta: {
          hasNext,
          nextCursor,
        },
      };
    } catch (error) {
      this.logger.error('Error during screenings listing:', { error });
      return { status: 500 };
    }
  }
}
