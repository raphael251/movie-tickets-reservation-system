import { Request, Response } from 'express';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { UpdateMovieUseCase } from '../../use-cases/update.ts';

export class UpdateMovieController implements IHttpController {
  constructor(private readonly updateMovieUseCase: UpdateMovieUseCase) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      const { title, description, category } = request.body;
      const { movieId } = request.params;

      const movie = await this.updateMovieUseCase.execute({ movieId, title, description, category });

      response.status(200).json(movie);
    } catch (error) {
      if (error instanceof InputValidationError) {
        response.status(400).json({ error: error.message });
        return;
      }

      console.error('Error during movie update:', error);
      response.status(500).send('Internal Server Error');
    }
  }
}
