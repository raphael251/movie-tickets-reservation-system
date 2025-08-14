import z from 'zod';
import { RESERVATION_STATUS } from '../database/reservation.entity.ts';
import { ReservationDoesNotExistError } from '../errors/reservation-does-not-exist.ts';
import { IReservationRepository } from '../repositories/interfaces/reservation.repository.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';
import { IScreeningRepository } from '../../screenings/repositories/interfaces/screening.repository.ts';
import { SCREENING_SEAT_STATUS } from '../../screenings/entities/screening-seat.ts';

type Input = {
  reservationId: string;
};

export class CancelReservationUseCase {
  constructor(
    private repository: IReservationRepository,
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

    const reservation = await this.repository.findById(reservationId);

    if (!reservation) {
      throw new ReservationDoesNotExistError();
    }

    await this.screeningRepository.updateScreeningSeatStatusById(reservation.screeningSeatId, SCREENING_SEAT_STATUS.RESERVED);

    await this.repository.updateStatusById(reservationId, RESERVATION_STATUS.CANCELED);
  }
}
