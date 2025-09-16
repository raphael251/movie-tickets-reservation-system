import { IEventRepository } from '../../events/repositories/interfaces/event.repository.ts';
import { IHasher } from '../../shared/security/interfaces/hasher.ts';
import { User } from '../database/user.entity.ts';
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered.ts';
import { IUserRepository } from '../repositories/interfaces/user.repository.ts';
import { UserRole } from '../util/constants/roles.ts';
import { UsersSignUpUseCase } from './sign-up';

jest.mock('../../shared/data-source/data-source.ts', () => {});

describe('UsersSignUpUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let eventRepository: jest.Mocked<IEventRepository>;
  let hasher: jest.Mocked<IHasher>;
  let useCase: UsersSignUpUseCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    hasher = {
      hash: jest.fn().mockResolvedValue('hashedPassword'),
      compare: jest.fn(),
    };

    eventRepository = {
      create: jest.fn(),
    };

    useCase = new UsersSignUpUseCase(userRepository, eventRepository, hasher);
  });

  it('should create a user with hashed password', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await useCase.execute({
      email: 'test@example.com',
      password: 'password',
    });

    expect(userRepository.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      role: UserRole.REGULAR,
      password: 'hashedPassword',
    });
  });

  it('should not create a user if email is already registered', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(User.create('test@example.com', 'hashedPassword', UserRole.REGULAR));

    await expect(
      useCase.execute({
        email: 'test@example.com',
        password: 'password',
      }),
    ).rejects.toThrow(EmailAlreadyRegisteredError);
  });
});
