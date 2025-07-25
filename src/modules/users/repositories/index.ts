import { UserDBEntity } from "../database/entities/user";
import { User } from "../entities/user";
import { IUserRepository } from "./interfaces";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return UserDBEntity.findOne({ where: { email } });
  }

  async create(userData: { email: string; password: string; }): Promise<User> {
    const user = UserDBEntity.create({
      email: userData.email,
      password: userData.password,
    });

    await user.save();

    return new User(user.id, user.email, user.password);
  }
}