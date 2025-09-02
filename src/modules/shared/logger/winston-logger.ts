import { injectable } from 'inversify';
import { ILogger } from './interfaces/logger';
import winston from 'winston';

@injectable()
export class WinstonLogger implements ILogger {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      format: winston.format.json(),
      transports: [new winston.transports.Console()],
    });
  }

  info(message: string, data?: unknown): void {
    this.logger.info(message, data);
  }
  error(message: string, data?: unknown): void {
    if (data && typeof data === 'object' && 'error' in data && data.error instanceof Error) {
      data.error = data.error.stack;
    }

    this.logger.error(message, data);
  }
  warn(message: string, data?: unknown): void {
    this.logger.warn(message, data);
  }
}
