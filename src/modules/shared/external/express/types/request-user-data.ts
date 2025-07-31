import { UserRole } from '../../../../users/util/constants/roles';

export interface ExpressRequestUserData {
  id: string;
  role: UserRole;
}
