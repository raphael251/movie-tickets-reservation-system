import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { AlreadyScheduledMovieError } from '../../errors/already-schedule-movie.ts';
import { InvalidTimeError } from '../../errors/invalid-time.ts';
import { CreateMovieUseCase } from '../../use-cases/create.ts';
import { Request, Response } from 'express';

export class CreateMovieController implements IHttpController {
  constructor(private readonly createMovieUseCase: CreateMovieUseCase) {}

  async handle(request: Request, response: Response): Promise<void> {
    const { title, description, category, room, startTime, endTime } = request.body;

    try {
      const movie = await this.createMovieUseCase.execute({
        title,
        description,
        category,
        room,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
      });

      response.status(201).json(movie);
    } catch (error) {
      if (error instanceof InvalidTimeError || error instanceof AlreadyScheduledMovieError) {
        response.status(409).json({ errors: [error.message] });
        return;
      }

      if (error instanceof InputValidationError) {
        response.status(400).json({ errors: error.errors });
        return;
      }

      console.error('Error during movie creation:', error);
      response.status(500).send('Internal Server Error');
    }
  }
}
