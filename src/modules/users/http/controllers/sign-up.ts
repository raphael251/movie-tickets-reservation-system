import { Request, Response } from 'express';
import { IHttpController } from '../../../shared/interfaces/http/controller.ts';
import { IUserRepository } from '../../repositories/interfaces/user.repository.ts';
import { IHasher } from '../../../shared/security/interfaces/hasher.ts';

export class UsersSignUpController implements IHttpController {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) {}

  async handle(req: Request, res: Response): Promise<void> {
    if (!req.body.email || !req.body.password) {
      res.status(400).send('Email and password are required');
      return;
    }

    if (await this.userRepository.findByEmail(req.body.email)) {
      res.status(400).send('E-mail already registered');
      return;
    }

    await this.userRepository.create({
      email: req.body.email,
      password: await this.hasher.hash(req.body.password),
    });

    res.status(201).send('User created successfully');
  }
}
