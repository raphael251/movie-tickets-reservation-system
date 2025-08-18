import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { Screening } from '../../entities/screening.ts';
import { AlreadyScheduledMovieError } from '../../errors/already-scheduled-movie.ts';
import { InvalidTimeError } from '../../errors/invalid-time.ts';
import { MovieDoesNotExistError } from '../../errors/movie-does-not-exist.ts';
import { TheaterDoesNotExistError } from '../../errors/theater-does-not-exist.ts';
import { CreateScreeningUseCase } from '../../use-cases/create.ts';

export class CreateScreeningController implements IHttpControllerV2<Screening> {
  constructor(private readonly createScreeningUseCase: CreateScreeningUseCase) {}

  async handle(request: THttpRequest): Promise<THttpResponse<Screening>> {
    const { movieId, theaterId, startTime, endTime } = request.body;

    try {
      const screening = await this.createScreeningUseCase.execute({
        movieId,
        theaterId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });

      return {
        status: 201,
        data: screening,
      };
    } catch (error) {
      if (error instanceof InvalidTimeError || error instanceof AlreadyScheduledMovieError) {
        return {
          status: 409,
          errors: [error.message],
        };
      }

      if (error instanceof MovieDoesNotExistError || error instanceof TheaterDoesNotExistError) {
        return {
          status: 400,
          errors: [error.message],
        };
      }

      if (error instanceof InputValidationError) {
        return {
          status: 400,
          errors: error.errors,
        };
      }

      console.error('Error during screening creation:', error);
      return { status: 500 };
    }
  }
}
