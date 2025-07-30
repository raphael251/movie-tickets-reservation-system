import jwt from 'jsonwebtoken';
import { AppConfig } from '../configs/app-config.ts';
import { ITokenValidator } from './interfaces/token-validator.ts';

export class JWTTokenValidator implements ITokenValidator {
  constructor(private readonly appConfig: AppConfig) {}

  validate(token: string): { userId: string } | null {
    if (!token) {
      return null;
    }

    try {
      const decoded = jwt.verify(token, this.appConfig.JWT_SECRET);

      if (!decoded || typeof decoded === 'string' || typeof decoded.userId !== 'string') {
        return null;
      }

      return { userId: decoded.userId };
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }
}
