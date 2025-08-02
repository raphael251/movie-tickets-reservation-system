import z from 'zod';
import { IHasher } from '../../shared/security/interfaces/hasher.ts';
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered.ts';
import { IUserRepository } from '../repositories/interfaces/user.repository.ts';
import { UserRole } from '../util/constants/roles.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';

type Input = {
  email: string;
  password: string;
};

export class UsersSignUpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) {}

  async execute(input: Input): Promise<void> {
    const inputValidationSchema = z.object({
      email: z.email(),
      password: z.string().min(6, 'Password must be at least 6 characters long'),
    });

    const parseResult = inputValidationSchema.safeParse(input);
    if (!parseResult.success) {
      throw new InputValidationError(parseResult.error.issues.map((issue) => issue.message));
    }

    const { email, password } = parseResult.data;

    if (await this.userRepository.findByEmail(email)) {
      throw new EmailAlreadyRegisteredError();
    }

    await this.userRepository.create({
      email,
      role: UserRole.REGULAR,
      password: await this.hasher.hash(password),
    });
  }
}
