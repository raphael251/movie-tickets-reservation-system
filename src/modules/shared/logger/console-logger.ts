import { ILogger } from './interfaces/logger';

export class ConsoleLogger implements ILogger {
  info(message: string, data?: unknown): void {
    console.info(message, data);
  }
  error(message: string, data?: unknown): void {
    console.error(message, data);
  }
  warn(message: string, data?: unknown): void {
    console.warn(message, data);
  }
}
