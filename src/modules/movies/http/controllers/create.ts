import { Request, Response } from 'express';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { CreateMovieUseCase } from '../../use-cases/create.ts';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';

export class CreateMovieController implements IHttpController {
  constructor(private createMovieUseCase: CreateMovieUseCase) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      const { title, description, category } = request.body;

      const movie = await this.createMovieUseCase.execute({ title, description, category });
      response.status(201).json(movie);
    } catch (error) {
      if (error instanceof InputValidationError) {
        response.status(400).json({ errors: error.errors });
      }

      console.error('Error during screening creation:', error);
      response.status(500).send('Internal Server Error');
    }
  }
}
