import { AppConfig } from '../../shared/configs/app-config.ts';
import { IHasher } from '../../shared/security/interfaces/hasher.ts';
import { appConfigMock } from '../../shared/tests/mocks/app-config.ts';
import { InvalidEmailOrPasswordError } from '../errors/invalid-email-or-password.ts';
import { IUserRepository } from '../repositories/interfaces/user.repository.ts';
import { UserLoginUseCase } from './login.ts';

describe('UserLoginUseCase', () => {
  let userRepository: jest.Mocked<IUserRepository>;
  let hasher: jest.Mocked<IHasher>;
  let appConfig: AppConfig;
  let useCase: UserLoginUseCase;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    hasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    appConfig = appConfigMock;

    useCase = new UserLoginUseCase(userRepository, hasher, appConfig);
  });

  it('should return a token for valid credentials', async () => {
    const user = { id: '1', email: 'test@example.com', password: 'password' };
    userRepository.findByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(true);

    const result = await useCase.execute('test@example.com', 'password');

    expect(result).toHaveProperty('token');
  });

  it('should throw InvalidEmailOrPasswordError for invalid email', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute('test@example.com', 'password')).rejects.toThrow(new InvalidEmailOrPasswordError());
  });
});
