import { UserRole } from '../../../users/util/constants/roles.ts';

export interface ITokenValidator {
  validate(token: string): { userId: string; userRole: UserRole } | null;
}
