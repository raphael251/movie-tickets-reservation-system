import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { UpdateMovieUseCase } from '../../use-cases/update.ts';
import { Movie } from '../../entities/movie.ts';

export class UpdateMovieController implements IHttpControllerV2<Movie> {
  constructor(private readonly updateMovieUseCase: UpdateMovieUseCase) {}

  async handle(request: THttpRequest): Promise<THttpResponse<Movie>> {
    try {
      const { title, description, category } = request.body;
      const { movieId } = request.params;

      const movie = await this.updateMovieUseCase.execute({ movieId, title, description, category });

      return {
        status: 200,
        data: movie,
      };
    } catch (error) {
      if (error instanceof InputValidationError) {
        return {
          status: 400,
          errors: error.errors,
        };
      }

      console.error('Error during movie update:', error);
      return {
        status: 500,
      };
    }
  }
}
