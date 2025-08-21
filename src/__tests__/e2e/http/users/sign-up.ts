import request from 'supertest';
import { createApp } from '../../../../app.ts';
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { appDataSource } from '../../../../modules/shared/data-source/data-source.ts';

describe('POST /users - Users sign-up', () => {
  let testingApp: Express;
  let dataSource: DataSource;

  beforeAll(async () => {
    testingApp = createApp();
    dataSource = await appDataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM "user"');
  });

  it('should create a new user', async () => {
    const response = await request(testingApp).post('/users').send({
      email: 'test@example.com',
      password: 'password',
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({});
  });
});
