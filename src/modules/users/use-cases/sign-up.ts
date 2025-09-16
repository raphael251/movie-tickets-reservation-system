import z from 'zod';
import type { IHasher } from '../../shared/security/interfaces/hasher.ts';
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered.ts';
import type { IUserRepository } from '../repositories/interfaces/user.repository.ts';
import { UserRole } from '../util/constants/roles.ts';
import { InputValidationError } from '../../shared/errors/input-validation.ts';
import { inject, injectable } from 'inversify';
import { UserRepository } from '../repositories/user.repository.ts';
import { Hasher } from '../../shared/security/hasher.ts';
import { EventRepository } from '../../events/repositories/event.repository.ts';
import type { IEventRepository } from '../../events/repositories/interfaces/event.repository.ts';
import { Events } from '../../events/database/outbox.entity.ts';

type Input = {
  email: string;
  password: string;
};

@injectable()
export class UsersSignUpUseCase {
  constructor(
    @inject(UserRepository)
    private readonly userRepository: IUserRepository,
    @inject(EventRepository)
    private readonly eventRepository: IEventRepository,
    @inject(Hasher)
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

    await this.eventRepository.create({
      event: Events.USER_CREATED,
      email,
    });
  }
}
