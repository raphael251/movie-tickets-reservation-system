import { ExpressRequestUserData } from './request-user-data.ts';

declare module 'express-serve-static-core' {
  interface Request {
    user?: ExpressRequestUserData;
    requiredPermissions?: string[];
  }
}
