import request from 'supertest';
import { createApp } from '../../../../app.ts';
import { Express } from 'express';
import { appDataSource } from '../../../../modules/shared/data-source/data-source.ts';
import { getAdminUserToken } from '../utils/login.ts';

describe('POST /movies - Create movie', () => {
  let testingApp: Express;
  let adminUserToken: string;

  beforeAll(async () => {
    testingApp = createApp();
    await appDataSource.initialize();

    adminUserToken = await getAdminUserToken(testingApp);
  });

  it('should create a movie successfully', async () => {
    const response = await request(testingApp).post('/movies').set('authorization', `Bearer ${adminUserToken}`).send({
      title: 'Cars',
      description: 'The story of Lightning McQueen, a race car who ends up in a small town and learns valuable life lessons.',
      category: 'animation',
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toEqual({
      id: expect.any(String),
      createdAt: expect.any(String),
      title: 'Cars',
      description: 'The story of Lightning McQueen, a race car who ends up in a small town and learns valuable life lessons.',
      category: 'animation',
    });
  });
});
