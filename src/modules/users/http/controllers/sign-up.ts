import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { UsersSignUpUseCase } from '../../use-cases/sign-up.ts';
import { EmailAlreadyRegisteredError } from '../../errors/email-already-registered.ts';
import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { ILogger } from '../../../shared/logger/interfaces/logger.ts';

export class UsersSignUpController implements IHttpControllerV2<never> {
  constructor(
    private readonly useCase: UsersSignUpUseCase,
    private readonly logger: ILogger,
  ) {}

  async handle(request: THttpRequest): Promise<THttpResponse<never>> {
    try {
      if (!request.body.email || !request.body.password) {
        return {
          status: 400,
          errors: ['Email and password are required'],
        };
      }

      await this.useCase.execute({
        email: request.body.email,
        password: request.body.password,
      });

      return { status: 201 };
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof EmailAlreadyRegisteredError) {
          return {
            status: 409,
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

      this.logger.error('Error during user sign-up:', { error });
      return { status: 500 };
    }
  }
}
