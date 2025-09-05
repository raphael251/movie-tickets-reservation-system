import request from 'supertest';
import { createApp } from '../../../../app.ts';
import { Express } from 'express';
import { appDataSource } from '../../../../modules/shared/data-source/data-source.ts';
import { theatersSeed } from '../../../../modules/shared/seed/theaters.ts';
import { getAdminUserToken, getRegularUserToken } from '../utils/login.ts';
import { Movie } from '../../../../modules/movies/database/movie.entity.ts';
import { Screening } from '../../../../modules/screenings/database/screening.entity.ts';
import { ScreeningSeat } from '../../../../modules/screenings/database/screening-seat.entity.ts';
import { Reservation } from '../../../../modules/reservations/database/reservation.entity.ts';

describe('POST /reservations - Cancel reservation', () => {
  let testingApp: Express;
  let adminUserToken: string;
  let regularUserToken: string;
  let screeningId: string;
  let screeningSeatId: string;

  beforeAll(async () => {
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] });
    jest.setSystemTime(new Date(2025, 7, 19));

    testingApp = createApp();
    await appDataSource.initialize();
    await appDataSource.getRepository(Reservation).deleteAll();
    await appDataSource.getRepository(ScreeningSeat).deleteAll();
    await appDataSource.getRepository(Screening).deleteAll();
    await appDataSource.getRepository(Movie).deleteAll();

    adminUserToken = await getAdminUserToken(testingApp);

    regularUserToken = await getRegularUserToken(testingApp);

    const movieResponse = await request(testingApp).post('/movies').set('authorization', `Bearer ${adminUserToken}`).send({
      title: 'Cars',
      description: 'The story of Lightning McQueen, a race car who ends up in a small town and learns valuable life lessons.',
      category: 'animation',
    });

    const screeningResponse = await request(testingApp).post('/screenings').set('authorization', `Bearer ${adminUserToken}`).send({
      movieId: movieResponse.body.data.id,
      theaterId: theatersSeed[0].id,
      startTime: '2025-08-21T20:00',
      endTime: '2025-08-21T22:00',
    });

    screeningId = screeningResponse.body.data.id;

    const screeningSeats = await request(testingApp)
      .get(`/screenings/${screeningId}/seats`)
      .set('authorization', `Bearer ${regularUserToken}`)
      .send();

    screeningSeatId = screeningSeats.body.data[0].id;
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should cancel a reservation successfully', async () => {
    const {
      body: { data: createdReservation },
    } = await request(testingApp).post('/reservations').set('authorization', `Bearer ${regularUserToken}`).send({
      screeningSeatId,
    });

    const response = await request(testingApp)
      .delete(`/reservations/${createdReservation.id}`)
      .set('authorization', `Bearer ${regularUserToken}`)
      .send();

    expect(response.status).toBe(204);
  });

  it.todo('should return the reservation status as canceled after canceling the reservation');

  it.todo('should return the screening seat status as available after canceling the reservation');
});
