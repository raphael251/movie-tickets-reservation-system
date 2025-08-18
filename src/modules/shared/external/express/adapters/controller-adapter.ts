import { Request, Response } from 'express';
import { IHttpControllerV2 } from '../../../interfaces/http/controller.ts';

export function expressHttpControllerAdapter<T>(controller: IHttpControllerV2<T>) {
  return async (req: Request, res: Response) => {
    const { status, ...httpResponse } = await controller.handle({
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      user: req.user,
    });

    switch (status) {
      case 200:
      case 201:
        res.status(status).json(httpResponse);
        break;
      case 204:
        res.status(status).send();
        break;
      case 400:
      case 401:
      case 409:
        res.status(status).json(httpResponse);
        break;
      case 500:
      default:
        res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
