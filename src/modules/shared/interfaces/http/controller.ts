import { Request, Response } from 'express';
import { UserRole } from '../../../users/util/constants/roles.ts';

export interface IHttpController {
  handle(request: Request, response: Response): Promise<void>;
}

export type THttpRequest = {
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
  params?: Record<string, unknown>;
  headers: Record<string, string | string[] | undefined>;
  user?: {
    id: string;
    role: UserRole;
  };
};

export type THttpResponse<T> =
  | {
      status: 200;
      data?: T;
    }
  | {
      status: 200;
      data: T[];
      meta: {
        hasNext: boolean;
        nextCursor?: string;
      };
    }
  | {
      status: 500;
    }
  | {
      status: 400;
      errors?: string[];
    };

export interface IHttpControllerV2<T> {
  handle(request: THttpRequest): Promise<THttpResponse<T>>;
}
