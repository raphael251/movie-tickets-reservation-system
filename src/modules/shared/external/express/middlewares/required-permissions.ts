import { Request, Response, NextFunction } from 'express';

export function expressRequiredPermissionsMiddleware(requiredPermissions: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    req.requiredPermissions = requiredPermissions;

    next();
  };
}
