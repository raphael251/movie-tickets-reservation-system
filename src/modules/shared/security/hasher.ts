import crypto from 'node:crypto';
import { IHasher } from './interfaces/hasher.ts';
import { injectable } from 'inversify';

@injectable()
export class Hasher implements IHasher {
  async hash(value: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');

      crypto.scrypt(value, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hashedValue.split(':');
      crypto.scrypt(value, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key == derivedKey.toString('hex'));
      });
    });
  }
}
