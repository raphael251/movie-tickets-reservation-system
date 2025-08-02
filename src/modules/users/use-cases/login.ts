import z from 'zod';
import { AppConfig } from '../../shared/configs/app-config.ts';
import { IHasher } from '../../shared/security/interfaces/hasher.ts';
import { InvalidEmailOrPasswordError } from '../errors/invalid-email-or-password.ts';
import { IUserRepository } from '../repositories/interfaces/user.repository.ts';
import jwt from 'jsonwebtoken';
import { InputValidationError } from '../../shared/errors/input-validation.ts';

type Input = {
  email: string;
  password: string;
};

export class UserLoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
    private readonly appConfig: AppConfig,
  ) {}

  async execute(input: Input): Promise<{ token: string }> {
    const inputValidationSchema = z.object({
      email: z.email(),
      password: z.string(),
    });

    const parseResult = inputValidationSchema.safeParse(input);
    if (!parseResult.success) {
      throw new InputValidationError(parseResult.error.issues.map((issue) => issue.message));
    }

    const { email, password } = parseResult.data;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidEmailOrPasswordError();
    }

    const isPasswordValid = await this.hasher.compare(password, user.password);
    if (!isPasswordValid) {
      throw new InvalidEmailOrPasswordError();
    }

    try {
      const token = jwt.sign({ userId: user.id, role: user.role }, this.appConfig.JWT_SECRET, { expiresIn: this.appConfig.JWT_EXPIRATION });
      return { token };
    } catch (error) {
      console.error('Error generating token:', error);
      throw new Error('Error generating token');
    }
  }
}
