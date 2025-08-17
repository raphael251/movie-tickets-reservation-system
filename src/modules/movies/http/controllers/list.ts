import { Request, Response } from 'express';
import { IMovieRepository } from '../../repositories/interfaces/movie.repository.ts';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import z from 'zod';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { decodeCursor } from '../../../shared/pagination/index.ts';

export class ListMoviesController implements IHttpController {
  constructor(private repository: IMovieRepository) {}
  async handle(request: Request, response: Response): Promise<void> {
    try {
      const inputValidationSchema = z.object({
        cursor: z.string().min(1).optional(),
        limit: z.coerce.number().min(1).default(10),
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

      response.status(200).json({
        data,
        meta: {
          hasNext,
          nextCursor,
        },
      });
    } catch (error) {
      console.error('Error during movie listing:', error);
      response.status(500).send('Internal Server Error');
    }
  }
}
