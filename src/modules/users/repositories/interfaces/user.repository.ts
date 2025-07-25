import { User } from '../../entities/user.ts';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: { email: string; password: string }): Promise<User>;
}
