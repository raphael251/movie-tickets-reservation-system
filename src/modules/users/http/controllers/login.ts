import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpControllerV2, THttpRequest, THttpResponse } from '../../../shared/interfaces/http/controller.ts';
import { InvalidEmailOrPasswordError } from '../../errors/invalid-email-or-password.ts';
import { UserLoginUseCase } from '../../use-cases/login.ts';

export class UsersLoginController implements IHttpControllerV2<{ token: string }> {
  constructor(private readonly useCase: UserLoginUseCase) {}

  async handle(request: THttpRequest): Promise<THttpResponse<{ token: string }>> {
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

      console.error('Error during user login:', error);
      return { status: 500 };
    }
  }
}
