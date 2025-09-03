import { inject, injectable } from 'inversify';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import type { ILogger } from '../../../shared/logger/interfaces/logger.ts';
import { UserLoginDTO } from '../../dtos/user-login.dto.ts';
import { InvalidEmailOrPasswordError } from '../../errors/invalid-email-or-password.ts';
import { UserLoginUseCase } from '../../use-cases/login.ts';
import { WinstonLogger } from '../../../shared/logger/winston-logger.ts';

@injectable()
export class UsersLoginController implements IHttpControllerV2<UserLoginDTO> {
  constructor(
    @inject(UserLoginUseCase)
    private readonly useCase: UserLoginUseCase,
    @inject(WinstonLogger)
    private readonly logger: ILogger,
  ) {}

  async handle(request: THttpRequest): Promise<THttpResponse<UserLoginDTO>> {
    try {
      if (!request.body.email || !request.body.password) {
        return { status: 400, errors: ['Email and password are required'] };
      }

      const { token } = await this.useCase.execute({
        email: request.body.email,
        password: request.body.password,
      });

      return {
        status: 200,
        data: {
          token,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof InvalidEmailOrPasswordError) {
          return {
            status: 401,
            errors: [error.message],
          };
        }

        if (error instanceof InputValidationError) {
          return {
            status: 400,
            errors: error.errors,
          };
        }
      }

      this.logger.error('Error during user login:', { error });
      return { status: 500 };
    }
  }
}
