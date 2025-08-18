import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller';
import { IReservationRepository } from '../../repositories/interfaces/reservation.repository';
import { Reservation } from '../../entities/reservation';

export class ListReservationsController implements IHttpControllerV2<Reservation[]> {
  constructor(private repository: IReservationRepository) {}
  async handle(request: THttpRequest): Promise<THttpResponse<Reservation[]>> {
    try {
      if (!request.user) {
        return {
          status: 500,
        };
      }

      const reservations = await this.repository.findAllByUserId(request.user.id);

      return {
        status: 200,
        data: reservations,
      };
    } catch (error) {
      console.error('Error during reservation listing:', error);
      return { status: 500 };
    }
  }
}
