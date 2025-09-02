import { inject, injectable } from 'inversify';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { DeleteMovieUseCase } from '../../use-cases/delete.ts';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';

@injectable()
export class DeleteMovieController implements IHttpControllerV2<never> {
  constructor(
    @inject(DeleteMovieUseCase)
    private readonly deleteMovieUseCase: DeleteMovieUseCase,
    @inject(WinstonLogger)
    private readonly logger: ILogger,
  ) {}

  async handle(request: THttpRequest): Promise<THttpResponse<never>> {
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

      this.logger.error('Error during movie deletion:', { error });
      return {
        status: 500,
      };
    }
  }
}
