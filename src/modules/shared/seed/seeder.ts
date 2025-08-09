import { SeatDBEntity } from '../../seats/database/seat.entity.ts';
import { TheaterDBEntity } from '../../theaters/database/theater.entity.ts';
import { seatsSeed } from './seats.ts';
import { theatersSeed } from './theaters.ts';
import { QueryFailedError } from 'typeorm';

export class Seeder {
  static async run() {
    try {
      await TheaterDBEntity.insert(theatersSeed);
      await SeatDBEntity.insert(seatsSeed);
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof QueryFailedError) {
          if (error.driverError.code === '23505') {
            console.log('Duplicate entry detected. The seeder already ran.', error.message);
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
