import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { AlreadyScheduledMovieError } from '../../errors/already-scheduled-movie.ts';
import { InvalidTimeError } from '../../errors/invalid-time.ts';
import { CreateScreeningUseCase } from '../../use-cases/create.ts';
import { Request, Response } from 'express';

export class CreateScreeningController implements IHttpController {
  constructor(private readonly createScreeningUseCase: CreateScreeningUseCase) {}

  async handle(request: Request, response: Response): Promise<void> {
    const { title, description, category, theaterId, startTime, endTime } = request.body;

    try {
      const screening = await this.createScreeningUseCase.execute({
        title,
        description,
        category,
        theaterId,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });

      response.status(201).json(screening);
    } catch (error) {
      if (error instanceof InvalidTimeError || error instanceof AlreadyScheduledMovieError) {
        response.status(409).json({ errors: [error.message] });
        return;
      }

      if (error instanceof InputValidationError) {
        response.status(400).json({ errors: error.errors });
        return;
      }

      console.error('Error during screening creation:', error);
      response.status(500).send('Internal Server Error');
    }
  }
}
