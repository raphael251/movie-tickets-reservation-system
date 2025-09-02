import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { UpdateMovieUseCase } from '../../use-cases/update.ts';
import { mapMovieToDTO, MovieDTO } from '../../dtos/movie.dto.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { inject, injectable } from 'inversify';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';

@injectable()
export class UpdateMovieController implements IHttpControllerV2<MovieDTO> {
  constructor(
    @inject(UpdateMovieUseCase)
    private readonly updateMovieUseCase: UpdateMovieUseCase,
    @inject(WinstonLogger)
    private readonly logger: ILogger,
  ) {}

  async handle(request: THttpRequest): Promise<THttpResponse<MovieDTO>> {
    try {
      const { title, description, category } = request.body;
      const { movieId } = request.params;

      const movie = await this.updateMovieUseCase.execute({ movieId, title, description, category });

      return {
        status: 200,
        data: mapMovieToDTO(movie),
      };
    } catch (error) {
      if (error instanceof InputValidationError) {
        return {
          status: 400,
          errors: error.errors,
        };
      }

      this.logger.error('Error during movie update:', { error });
      return {
        status: 500,
      };
    }
  }
}
