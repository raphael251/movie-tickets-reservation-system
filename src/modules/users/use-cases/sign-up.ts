import { IHasher } from '../../shared/security/interfaces/hasher.ts';
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered.ts';
import { IUserRepository } from '../repositories/interfaces/user.repository.ts';

export class UsersSignUpUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hasher: IHasher,
  ) {}

  async execute(email: string, password: string): Promise<void> {
    if (await this.userRepository.findByEmail(email)) {
      throw new EmailAlreadyRegisteredError();
    }

    await this.userRepository.create({
      email,
      password: await this.hasher.hash(password),
    });
  }
}
