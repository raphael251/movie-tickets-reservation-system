import { injectable, inject } from 'inversify';
import z from 'zod';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';
import { ReservationDTO, mapReservationToDTO } from '../../dtos/reservation.dto.ts';
import type { IReservationRepository } from '../../repositories/interfaces/reservation.repository.ts';
import { ReservationRepository } from '../../repositories/reservation.repository.ts';

@injectable()
export class ReadReservationController implements IHttpControllerV2<ReservationDTO> {
  constructor(
    @inject(ReservationRepository)
    private readonly reservationRepository: IReservationRepository,
    @inject(WinstonLogger)
    private readonly logger: ILogger,
  ) {}

  async handle(request: THttpRequest): Promise<THttpResponse<ReservationDTO>> {
    try {
      if (!request.user) {
        return {
          status: 500,
        };
      }

      const requestQuerySchema = z.object({
        reservationId: z.uuid(),
      });

      const { success: isValid, data: params } = requestQuerySchema.safeParse(request.params);

      if (!isValid) {
        return {
          status: 400,
          errors: ['Invalid param'],
        };
      }

      const reservation = await this.reservationRepository.findById(params.reservationId);

      if (!reservation || reservation.userId !== request.user.id) {
        return {
          status: 404,
        };
      }

      return {
        status: 200,
        data: mapReservationToDTO(reservation),
      };
    } catch (error) {
      this.logger.error('Error trying to read a specific reservation:', { error });
      return { status: 500 };
    }
  }
}
