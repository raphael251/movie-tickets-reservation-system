import { InputValidationError } from '../../../shared/errors/input-validation.ts';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { InvalidEmailOrPasswordError } from '../../errors/invalid-email-or-password.ts';
import { UserLoginUseCase } from '../../use-cases/login.ts';
import { Request, Response } from 'express';

export class UsersLoginController implements IHttpController {
  constructor(private readonly useCase: UserLoginUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.email || !req.body.password) {
        res.status(400).send('Email and password are required');
        return;
      }

      const { token } = await this.useCase.execute({
        email: req.body.email,
        password: req.body.password,
      });

      res.status(200).send({ token });
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof InvalidEmailOrPasswordError) {
          res.status(401).json({ errors: [error.message] });
          return;
        }

        if (error instanceof InputValidationError) {
          res.status(400).json({ errors: error.errors });
          return;
        }
      }

      console.error('Error during user login:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}
