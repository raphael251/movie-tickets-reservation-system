import z from 'zod';
import { IScreeningRepository } from '../../screenings/repositories/interfaces/screening.repository.ts';
import { Reservation } from '../entities/reservation.ts';
import { InvalidScreeningSeatIdError } from '../errors/invalid-screening-id.ts';
import { SeatAlreadyReservedError } from '../errors/seat-already-reserved.ts';
import { IReservationRepository } from '../repositories/interfaces/reservation.repository.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';
import { SCREENING_SEAT_STATUS } from '../../screenings/entities/screening-seat.ts';
import { RESERVATION_STATUS } from '../database/reservation.entity.ts';

type Input = {
  userId: string;
  screeningSeatId: string;
};

export class CreateReservationUseCase {
  constructor(
    private readonly reservationRepository: IReservationRepository,
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

    const reservation = new Reservation(crypto.randomUUID(), input.userId, existingScreeningSeat, RESERVATION_STATUS.CONFIRMED);

    await this.screeningRepository.updateScreeningSeatStatusById(screeningSeatId, SCREENING_SEAT_STATUS.RESERVED);

    await this.reservationRepository.save(reservation);

    return reservation;
  }
}
