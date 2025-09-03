import { Container } from 'inversify';
import { UsersLoginController } from '../http/controllers/login.ts';
import { UsersSignUpController } from '../http/controllers/sign-up.ts';
import { UserLoginUseCase } from '../use-cases/login.ts';
import { UsersSignUpUseCase } from '../use-cases/sign-up.ts';
import { UserRepository } from '../repositories/user.repository.ts';

export function createDependenciesContainer(container: Container): Container {
  // Controllers
  container.bind(UsersLoginController).toSelf();
  container.bind(UsersSignUpController).toSelf();

  // Use Cases
  container.bind(UserLoginUseCase).toSelf();
  container.bind(UsersSignUpUseCase).toSelf();

  // Repositories
  container.bind(UserRepository).toSelf();

  return container;
}
