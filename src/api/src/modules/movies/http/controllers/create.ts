import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { CreateMovieUseCase } from '../../use-cases/create.ts';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { mapMovieToDTO, MovieDTO } from '../../dtos/movie.dto.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { inject, injectable } from 'inversify';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';

@injectable()
export class CreateMovieController implements IHttpControllerV2<MovieDTO> {
  constructor(
    @inject(CreateMovieUseCase)
    private readonly createMovieUseCase: CreateMovieUseCase,
    @inject(WinstonLogger)
    private readonly logger: ILogger,
  ) {}

  async handle(request: THttpRequest): Promise<THttpResponse<MovieDTO>> {
    try {
      const { title, description, category } = request.body;

      const movie = await this.createMovieUseCase.execute({ title, description, category });
      return { status: 201, data: mapMovieToDTO(movie) };
    } catch (error) {
      if (error instanceof InputValidationError) {
        return { status: 400, errors: error.errors };
      }

      this.logger.error('Error during movie creation:', { error });
      return { status: 500 };
    }
  }
}
