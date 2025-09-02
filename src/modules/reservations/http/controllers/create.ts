import { inject, injectable } from 'inversify';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { mapReservationToDTO, ReservationDTO } from '../../dtos/reservation.dto.ts';
import { InvalidScreeningSeatIdError } from '../../errors/invalid-screening-id.ts';
import { SeatAlreadyReservedError } from '../../errors/seat-already-reserved.ts';
import { CreateReservationUseCase } from '../../use-cases/create.ts';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';

@injectable()
export class CreateReservationController implements IHttpControllerV2<ReservationDTO> {
  constructor(
    @inject(CreateReservationUseCase)
    private readonly createReservationUseCase: CreateReservationUseCase,
    @inject(WinstonLogger)
    private readonly logger: ILogger,
  ) {}

  async handle(request: THttpRequest): Promise<THttpResponse<ReservationDTO>> {
    try {
      const { screeningSeatId } = request.body;

      const reservation = await this.createReservationUseCase.execute({
        userId: request.user!.id,
        screeningSeatId,
      });

      return {
        status: 201,
        data: mapReservationToDTO(reservation),
      };
    } catch (error) {
      this.logger.error('Error during reservation listing:', { error });

      if (error instanceof SeatAlreadyReservedError || error instanceof InvalidScreeningSeatIdError) {
        return {
          status: 409,
          errors: [error.message],
        };
      }

      if (error instanceof InputValidationError) {
        return {
          status: 400,
          errors: error.errors,
        };
      }

      return { status: 500 };
    }
  }
}
