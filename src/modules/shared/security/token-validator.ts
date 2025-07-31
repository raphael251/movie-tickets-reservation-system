import jwt from 'jsonwebtoken';
import { AppConfig } from '../configs/app-config.ts';
import { ITokenValidator } from './interfaces/token-validator.ts';
import { UserRole } from '../../users/util/constants/roles.ts';

export class JWTTokenValidator implements ITokenValidator {
  constructor(private readonly appConfig: AppConfig) {}

  validate(token: string): { userId: string; userRole: UserRole } | null {
    if (!token) {
      return null;
    }

    try {
      const decoded = jwt.verify(token, this.appConfig.JWT_SECRET);

      if (!decoded || typeof decoded === 'string' || typeof decoded.userId !== 'string') {
        return null;
      }

      return { userId: decoded.userId, userRole: decoded.role };
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }
}
