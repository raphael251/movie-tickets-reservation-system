import { Seat } from '../../seats/database/seat.entity.ts';
import { Theater } from '../../theaters/database/theater.entity.ts';
import { appDataSource } from '../data-source/data-source.ts';
import { seatsSeed } from './seats.ts';
import { theatersSeed } from './theaters.ts';
import { QueryFailedError } from 'typeorm';

export class Seeder {
  static async run() {
    try {
      await appDataSource.getRepository(Theater).insert(theatersSeed);
      await appDataSource.getRepository(Seat).insert(seatsSeed);
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof QueryFailedError) {
          if (error.driverError.code === '23505') {
            console.log('Seeder already ran.');
            return;
          }

          throw new Error(`Query failed error: ${error.message}`, { cause: error });
        }

        throw new Error(`Seeder failed: ${error.message}`);
      }

      throw new Error('Unknown error occurred during seeding', { cause: error });
    }
  }
}
