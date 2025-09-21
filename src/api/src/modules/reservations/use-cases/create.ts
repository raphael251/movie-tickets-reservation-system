import z from 'zod';
import type { IScreeningRepository } from '../../screenings/repositories/interfaces/screening.repository.ts';
import { Reservation } from '../database/reservation.entity.ts';
import { InvalidScreeningSeatIdError } from '../errors/invalid-screening-id.ts';
import { SeatAlreadyReservedError } from '../errors/seat-already-reserved.ts';
import type { IReservationRepository } from '../repositories/interfaces/reservation.repository.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';
import { SCREENING_SEAT_STATUS } from '../../screenings/database/screening-seat.entity.ts';
import { RESERVATION_STATUS } from '../database/reservation.entity.ts';
import { inject, injectable } from 'inversify';
import { ReservationRepository } from '../repositories/reservation.repository.ts';
import { ScreeningRepository } from '../../screenings/repositories/screening.repository.ts';

type Input = {
  userId: string;
  screeningSeatId: string;
};

@injectable()
export class CreateReservationUseCase {
  constructor(
    @inject(ReservationRepository)
    private readonly reservationRepository: IReservationRepository,
    @inject(ScreeningRepository)
    private readonly screeningRepository: IScreeningRepository,
  ) {}

  async execute(input: Input): Promise<Reservation> {
    const inputValidationSchema = z.object({
      screeningSeatId: z.uuid('Invalid screening seat ID format'),
    });

    const parseResult = inputValidationSchema.safeParse(input);

    if (!parseResult.success) {
      throw new InputValidationError(parseResult.error.issues.map((issue) => issue.message));
    }

    const { screeningSeatId } = parseResult.data;

    const existingScreeningSeat = await this.screeningRepository.findSeatByScreeningSeatId(screeningSeatId);

    if (!existingScreeningSeat) {
      throw new InvalidScreeningSeatIdError();
    }

    if (existingScreeningSeat.status === SCREENING_SEAT_STATUS.RESERVED) {
      throw new SeatAlreadyReservedError();
    }

    existingScreeningSeat.status = SCREENING_SEAT_STATUS.RESERVED;

    const reservation = Reservation.create(input.userId, existingScreeningSeat, RESERVATION_STATUS.CONFIRMED);

    await this.reservationRepository.save(reservation);

    return reservation;
  }
}
