import { Request, Response } from 'express';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { UsersSignUpUseCase } from '../../use-cases/sign-up.ts';
import { EmailAlreadyRegisteredError } from '../../errors/email-already-registered.ts';

export class UsersSignUpController implements IHttpController {
  constructor(private readonly useCase: UsersSignUpUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      if (!req.body.email || !req.body.password) {
        res.status(400).send('Email and password are required');
        return;
      }

      await this.useCase.execute(req.body.email, req.body.password);

      res.status(201).send('User created successfully');
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === EmailAlreadyRegisteredError.name) {
          res.status(400).send(error.message);
          return;
        }
      }

      console.error('Error during user sign-up:', error);
      res.status(500).send('Internal Server Error');
    }
  }
}
