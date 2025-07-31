import { NextFunction, Request, Response } from 'express';
import { ITokenValidator } from '../../../security/interfaces/token-validator';

export function expressAuthMiddleware(tokenValidator: ITokenValidator) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validationResult = tokenValidator.validate(token);

    if (!validationResult) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    req.user = { id: validationResult.userId, role: validationResult.userRole };
    next();
  };
}
