import z from 'zod';
import { RESERVATION_STATUS } from '../database/reservation.entity.ts';
import { ReservationDoesNotExistError } from '../errors/reservation-does-not-exist.ts';
import { IReservationRepository } from '../repositories/interfaces/reservation.repository.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';
import { IScreeningRepository } from '../../screenings/repositories/interfaces/screening.repository.ts';
import { SCREENING_SEAT_STATUS } from '../../screenings/entities/screening-seat.ts';
import { ScreeningDoesNotExistError } from '../errors/screening-does-not-exist.ts';
import { CancelingOperationOutOfRange } from '../errors/canceling-operation-out-of-range.ts';

type Input = {
  reservationId: string;
};

export class CancelReservationUseCase {
  constructor(
    private reservationRepository: IReservationRepository,
    private readonly screeningRepository: IScreeningRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const inputValidationSchema = z.object({
      reservationId: z.uuid('Invalid reservation ID format'),
    });

    const parseResult = inputValidationSchema.safeParse(input);

    if (!parseResult.success) {
      throw new InputValidationError(parseResult.error.issues.map((issue) => issue.message));
    }

    const { reservationId } = parseResult.data;

    const reservation = await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new ReservationDoesNotExistError();
    }

    const screening = await this.screeningRepository.findScreeningByScreeningSeatId(reservation.screeningSeatId);

    if (!screening) {
      throw new ScreeningDoesNotExistError();
    }

    const currentTime = new Date();

    const FORTY_EIGHT_HOURS_IN_MS = 48 * 60 * 60 * 1000;

    if (screening.startTime.getTime() - currentTime.getTime() < FORTY_EIGHT_HOURS_IN_MS) {
      throw new CancelingOperationOutOfRange();
    }

    await this.screeningRepository.updateScreeningSeatStatusById(reservation.screeningSeatId, SCREENING_SEAT_STATUS.AVAILABLE);

    await this.reservationRepository.updateStatusById(reservationId, RESERVATION_STATUS.CANCELED);
  }
}
