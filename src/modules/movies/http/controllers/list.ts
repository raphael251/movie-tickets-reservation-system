import type { IMovieRepository } from '../../repositories/interfaces/movie.repository.ts';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import z from 'zod';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { mapMovieToDTO, MovieDTO } from '../../dtos/movie.dto.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { inject, injectable } from 'inversify';
import { MovieRepository } from '../../repositories/movie.repository.ts';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';

@injectable()
export class ListMoviesController implements IHttpControllerV2<MovieDTO> {
  constructor(
    @inject(MovieRepository)
    private readonly repository: IMovieRepository,
    @inject(WinstonLogger)
    private readonly logger: ILogger,
  ) {}
  async handle(request: THttpRequest): Promise<THttpResponse<MovieDTO>> {
    try {
      const inputValidationSchema = z.object({
        cursor: z.string().min(1).optional(),
        limit: z.coerce.number().min(1).optional(),
      });

      const validationResult = inputValidationSchema.safeParse(request.query);

      if (!validationResult.success) {
        throw new InputValidationError(validationResult.error.issues.map((issue) => issue.message));
      }

      const { limit, cursor } = validationResult.data;

      const { data, hasNext, nextCursor } = await this.repository.findPaginated({
        cursor,
        limit,
      });

      return {
        status: 200,
        data: data.map((movie) => mapMovieToDTO(movie)),
        meta: {
          hasNext,
          nextCursor,
        },
      };
    } catch (error) {
      this.logger.error('Error during movie listing:', { error });
      return { status: 500 };
    }
  }
}
