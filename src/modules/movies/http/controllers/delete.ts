import { Request, Response } from 'express';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { DeleteMovieUseCase } from '../../use-cases/delete.ts';

export class DeleteMovieController implements IHttpController {
  constructor(private deleteMovieUseCase: DeleteMovieUseCase) {}

  async handle(request: Request, response: Response): Promise<void> {
    try {
      const { movieId } = request.params;

      await this.deleteMovieUseCase.execute({ movieId });
      response.status(204).send();
    } catch (error) {
      if (error instanceof InputValidationError) {
        response.status(400).json({ errors: error.errors });
      }

      console.error('Error during movie deletion:', error);
      response.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
