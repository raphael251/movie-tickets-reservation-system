import { UserDBEntity } from '../database/user.entity.ts';
import { User } from '../entities/user.ts';
import { IUserRepository } from './interfaces/user.repository.ts';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await UserDBEntity.findOne({ where: { email } });
    return user ? new User(user.id, user.role, user.email, user.password) : null;
  }

  async create(userData: { email: string; password: string }): Promise<User> {
    const user = UserDBEntity.create({
      email: userData.email,
      password: userData.password,
    });

    await user.save();

    return new User(user.id, user.role, user.email, user.password);
  }
}
