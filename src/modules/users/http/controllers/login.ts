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
        if (error.name === InvalidEmailOrPasswordError.name) {
          res.status(400).send(error.message);
          return;
        }
      }

      console.error('Error during user login:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}
