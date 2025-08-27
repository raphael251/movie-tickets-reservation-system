import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { DeleteMovieUseCase } from '../../use-cases/delete.ts';
import { Movie } from '../../database/movie.entity.ts';

export class DeleteMovieController implements IHttpControllerV2<Movie> {
  constructor(private deleteMovieUseCase: DeleteMovieUseCase) {}

  async handle(request: THttpRequest): Promise<THttpResponse<Movie>> {
    try {
      const { movieId } = request.params;

      await this.deleteMovieUseCase.execute({ movieId });
      return { status: 204 };
    } catch (error) {
      if (error instanceof InputValidationError) {
        return {
          status: 400,
          errors: error.errors,
        };
      }

      console.error('Error during movie deletion:', error);
      return {
        status: 500,
      };
    }
  }
}
