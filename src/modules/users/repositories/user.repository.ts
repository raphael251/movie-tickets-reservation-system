import { appDataSource } from '../../shared/data-source/data-source.ts';
import { User } from '../database/user.entity.ts';
import { IUserRepository } from './interfaces/user.repository.ts';

export class UserRepository implements IUserRepository {
  findByEmail(email: string): Promise<User | null> {
    return appDataSource.getRepository(User).findOne({ where: { email } });
  }

  async create(userData: { email: string; password: string }): Promise<User> {
    const user = User.create(userData.email, userData.password);

    await appDataSource.getRepository(User).save(user);

    return user;
  }
}
