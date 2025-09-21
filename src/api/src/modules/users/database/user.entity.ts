import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../util/constants/roles.ts';
import { randomUUID } from 'crypto';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({ enum: UserRole, default: UserRole.REGULAR, type: 'enum' })
  role!: UserRole;

  @Column()
  password!: string;

  static create(email: string, password: string, role: UserRole = UserRole.REGULAR): User {
    const user = new User();

    user.id = randomUUID();
    user.email = email;
    user.password = password;
    user.role = role;

    return user;
  }
}
