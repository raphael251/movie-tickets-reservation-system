import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { IReservationRepository } from '../../repositories/interfaces/reservation.repository.ts';
import z from 'zod';
import { mapReservationToDTO, ReservationDTO } from '../../dtos/reservation.dto.ts';
import { ILogger } from '../../../shared/logger/interfaces/logger.ts';

export class ListReservationsController implements IHttpControllerV2<ReservationDTO> {
  constructor(
    private readonly reservationRepository: IReservationRepository,
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

      const { data, hasNext, nextCursor } = await this.reservationRepository.findAllByUserId(request.user.id, pagination);

      return {
        status: 200,
        data: data.map((reservation) => mapReservationToDTO(reservation)),
        meta: {
          hasNext,
          nextCursor,
        },
      };
    } catch (error) {
      this.logger.error('Error during reservation listing:', { error });
      return { status: 500 };
    }
  }
}
