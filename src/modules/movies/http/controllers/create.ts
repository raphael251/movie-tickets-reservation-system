import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { CreateMovieUseCase } from '../../use-cases/create.ts';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { Movie } from '../../entities/movie.ts';

export class CreateMovieController implements IHttpControllerV2<Movie> {
  constructor(private createMovieUseCase: CreateMovieUseCase) {}

  async handle(request: THttpRequest): Promise<THttpResponse<Movie>> {
    try {
      const { title, description, category } = request.body;

      const movie = await this.createMovieUseCase.execute({ title, description, category });
      return { status: 201, data: movie };
    } catch (error) {
      if (error instanceof InputValidationError) {
        return { status: 400, errors: error.errors };
      }

      console.error('Error during movie creation:', error);
      return { status: 500 };
    }
  }
}
