import z from 'zod';
import { IScreeningRepository } from '../../screenings/repositories/interfaces/screening.repository.ts';
import { Reservation } from '../entities/reservation.ts';
import { InvalidScreeningIdError } from '../errors/invalid-screening-id.ts';
import { SeatAlreadyReservedError } from '../errors/seat-already-reserved.ts';
import { IReservationRepository } from '../repositories/interfaces/reservation.repository.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';

type Input = {
  userId: string;
  screeningId: string;
  seatCode: string;
};

export class CreateReservationUseCase {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly screeninRepository: IScreeningRepository,
  ) {}

  async execute(input: Input): Promise<void> {
    const inputValidationSchema = z.object({
      screeningId: z.uuid('Invalid screening ID format'),
      seatCode: z.string().min(1, 'Seat code is required'),
    });

    const parseResult = inputValidationSchema.safeParse(input);

    if (!parseResult.success) {
      throw new InputValidationError(parseResult.error.issues.map((issue) => issue.message));
    }

    const { screeningId, seatCode } = parseResult.data;

    const existingReservation = await this.reservationRepository.findByScreeningIdAndSeatCode(screeningId, seatCode);

    if (existingReservation) {
      throw new SeatAlreadyReservedError();
    }

    const screeningExists = await this.screeninRepository.findById(screeningId);

    if (!screeningExists) {
      throw new InvalidScreeningIdError();
    }

    const ONE_HOUR_IN_MILLISECONDS = 60 * 60 * 1000;

    const expiresAt = new Date(Date.now() + ONE_HOUR_IN_MILLISECONDS);

    const reservation = new Reservation(crypto.randomUUID(), input.userId, screeningId, seatCode, expiresAt);

    await this.reservationRepository.save(reservation);
  }
}
