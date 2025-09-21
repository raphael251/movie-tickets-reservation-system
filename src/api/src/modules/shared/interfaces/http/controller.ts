/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { UserRole } from '../../../users/util/constants/roles.ts';

export interface IHttpController {
  handle(request: Request, response: Response): Promise<void>;
}

export type THttpRequest = {
  body?: any;
  query?: any;
  params?: any;
  headers: { [key: string]: string | string[] | undefined };
  user?: {
    id: string;
    role: UserRole;
  };
};

export type THttpResponse<T> =
  | {
      status: 200 | 201;
      data?: T;
    }
  | {
      status: 204;
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
      status: 400 | 401 | 409 | 404;
      errors?: string[];
    };

export interface IHttpControllerV2<T> {
  handle(request: THttpRequest): Promise<THttpResponse<T>>;
}
