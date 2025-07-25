import { Request, Response } from "express";

export interface IHttpController {
  handle(request: Request, response: Response): Promise<void>;
}