import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { CancelReservationUseCase } from '../../use-cases/cancel.ts';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { ReservationDoesNotExistError } from '../../errors/reservation-does-not-exist.ts';
import { CancelingOperationOutOfRange } from '../../errors/canceling-operation-out-of-range.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { inject, injectable } from 'inversify';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';

@injectable()
export class CancelReservationController implements IHttpControllerV2<never> {
  constructor(
    @inject(CancelReservationUseCase)
    private readonly cancelReservationUseCase: CancelReservationUseCase,
    @inject(WinstonLogger)
    private readonly logger: ILogger,
  ) {}
  async handle(request: THttpRequest): Promise<THttpResponse<never>> {
    try {
      const { reservationId } = request.params;

      await this.cancelReservationUseCase.execute({ reservationId });

      return { status: 204 };
    } catch (error) {
      if (error instanceof InputValidationError) {
        return { status: 400, errors: error.errors };
      }

      if (error instanceof ReservationDoesNotExistError) {
        return { status: 404, errors: [error.message] };
      }

      if (error instanceof CancelingOperationOutOfRange) {
        return { status: 409, errors: [error.message] };
      }

      this.logger.error('Error during reservation cancellation:', { error });
      return { status: 500 };
    }
  }
}
