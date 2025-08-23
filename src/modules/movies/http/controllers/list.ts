import { IMovieRepository } from '../../repositories/interfaces/movie.repository.ts';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import z from 'zod';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { decodeCursor } from '../../../shared/pagination/helpers.ts';
import { Movie } from '../../entities/movie.ts';

export class ListMoviesController implements IHttpControllerV2<Movie> {
  constructor(private repository: IMovieRepository) {}
  async handle(request: THttpRequest): Promise<THttpResponse<Movie>> {
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
        cursor: cursor ? decodeCursor(cursor) : undefined,
        limit,
      });

      return {
        status: 200,
        data,
        meta: {
          hasNext,
          nextCursor,
        },
      };
    } catch (error) {
      console.error('Error during movie listing:', error);
      return { status: 500 };
    }
  }
}
