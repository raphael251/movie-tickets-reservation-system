import { NextFunction, Request, Response } from 'express';
import { ITokenValidator } from '../../../security/interfaces/token-validator.ts';
import { rolesAndPermissions } from '../../../security/roles-and-permissions.ts';

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

    const { userId, userRole } = validationResult;

    if (req.requiredPermissions) {
      const hasRequiredPermissions = req.requiredPermissions.every((perm) => rolesAndPermissions[userRole].has(perm));

      if (!hasRequiredPermissions) {
        return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      }
    }

    req.user = { id: userId, role: userRole };
    next();
  };
}
