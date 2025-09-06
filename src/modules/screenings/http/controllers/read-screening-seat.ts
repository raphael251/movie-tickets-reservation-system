import z from 'zod';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import type { IScreeningRepository } from '../../repositories/interfaces/screening.repository.ts';
import { mapScreeningSeatToDTO, ScreeningSeatDTO } from '../../dtos/screening-seat.dto.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { inject, injectable } from 'inversify';
import { ScreeningRepository } from '../../repositories/screening.repository.ts';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';

@injectable()
export class ReadScreeningSeatController implements IHttpControllerV2<ScreeningSeatDTO> {
  constructor(
    @inject(ScreeningRepository)
    private readonly repository: IScreeningRepository,
    @inject(WinstonLogger)
    private readonly logger: ILogger,
  ) {}

  async handle(request: THttpRequest): Promise<THttpResponse<ScreeningSeatDTO>> {
    try {
      const requestParamsSchema = z.object({
        screeningSeatId: z.uuid(),
      });

      const { success: isValid, data: parsedParams } = requestParamsSchema.safeParse(request.params);

      if (!isValid) {
        return {
          status: 400,
          errors: ['Invalid query parameters'],
        };
      }

      const screeningSeat = await this.repository.findSeatByScreeningSeatId(parsedParams.screeningSeatId);

      if (!screeningSeat) {
        return {
          status: 404,
        };
      }

      return {
        status: 200,
        data: mapScreeningSeatToDTO(screeningSeat),
      };
    } catch (error) {
      this.logger.error('Error during screening seats listing:', { error });
      return { status: 500 };
    }
  }
}
