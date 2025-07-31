import { UserRole } from '../util/constants/roles.ts';

export class User {
  id: string;
  role: UserRole;
  email: string;
  password: string;

  constructor(id: string, role: UserRole, email: string, password: string) {
    this.id = id;
    this.role = role;
    this.email = email;
    this.password = password;
  }
}
