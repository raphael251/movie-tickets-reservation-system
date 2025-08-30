import request from 'supertest';
import { createApp } from '../../../../app.ts';
import { Express } from 'express';
import { appDataSource } from '../../../../modules/shared/data-source/data-source.ts';
import { theatersSeed } from '../../../../modules/shared/seed/theaters.ts';
import { getAdminUserToken, getRegularUserToken } from '../utils/login.ts';

describe('POST /reservations - Create reservation', () => {
  let testingApp: Express;
  let adminUserToken: string;
  let regularUserToken: string;
  let screeningSeatId: string;

  beforeAll(async () => {
    testingApp = createApp();
    await appDataSource.initialize();

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
      startTime: '2025-08-21T23:41',
      endTime: '2025-08-22T00:40',
    });

    const screeningSeats = await request(testingApp)
      .get(`/screenings/${screeningResponse.body.data.id}/seats`)
      .set('authorization', `Bearer ${regularUserToken}`)
      .send();

    screeningSeatId = screeningSeats.body.data[0].id;
  });

  it('should create a reservation successfully', async () => {
    const response = await request(testingApp).post('/reservations').set('authorization', `Bearer ${regularUserToken}`).send({
      screeningSeatId,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      data: {
        id: expect.any(String),
        screening: {
          id: expect.any(String),
          movieTitle: expect.any(String),
          startTime: expect.any(String),
          endTime: expect.any(String),
          theaterName: expect.any(String),
        },
        seat: 'A1',
        status: 'CONFIRMED',
      },
    });
  });
});
