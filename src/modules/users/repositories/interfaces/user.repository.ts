import { User } from '../../entities/user.ts';
import { UserRole } from '../../util/constants/roles.ts';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(userData: { email: string; role: UserRole; password: string }): Promise<User>;
}
