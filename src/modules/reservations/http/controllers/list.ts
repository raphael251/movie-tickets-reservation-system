import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller';
import { IReservationRepository } from '../../repositories/interfaces/reservation.repository';
import { Reservation } from '../../entities/reservation';
import z from 'zod';

export class ListReservationsController implements IHttpControllerV2<Reservation[]> {
  constructor(private reservationRepository: IReservationRepository) {}
  async handle(request: THttpRequest): Promise<THttpResponse<Reservation[]>> {
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
        data,
        meta: {
          hasNext,
          nextCursor,
        },
      };
    } catch (error) {
      console.error('Error during reservation listing:', error);
      return { status: 500 };
    }
  }
}
