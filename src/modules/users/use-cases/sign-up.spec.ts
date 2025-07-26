import { IHasher } from '../../shared/security/interfaces/hasher.ts';
import { User } from '../entities/user.ts';
import { EmailAlreadyRegisteredError } from '../errors/email-already-registered.ts';
import { IUserRepository } from '../repositories/interfaces/user.repository.ts';
import { UsersSignUpUseCase } from './sign-up';

describe('UsersSignUpUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;
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

    useCase = new UsersSignUpUseCase(userRepository, hasher);
  });

  it('should create a user with hashed password', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await useCase.execute('test@example.com', 'password');

    expect(userRepository.create).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'hashedPassword',
    });
  });

  it('should not create a user if email is already registered', async () => {
    userRepository.findByEmail.mockResolvedValueOnce(new User('1', 'test@example.com', 'hashedPassword'));

    await expect(useCase.execute('test@example.com', 'password')).rejects.toThrow(EmailAlreadyRegisteredError);
  });
});
