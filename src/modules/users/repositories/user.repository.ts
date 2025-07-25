import { UserDBEntity } from '../database/user.entity.ts';
import { User } from '../entities/user.ts';
import { IUserRepository } from './interfaces/user.repository.ts';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return UserDBEntity.findOne({ where: { email } });
  }

  async create(userData: { email: string; password: string }): Promise<User> {
    const user = UserDBEntity.create({
      email: userData.email,
      password: userData.password,
    });

    await user.save();

    return new User(user.id, user.email, user.password);
  }
}
