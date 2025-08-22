import request from 'supertest';
import { createApp } from '../../../../app.ts';
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { appDataSource } from '../../../../modules/shared/data-source/data-source.ts';

describe('POST /movies - Create movie', () => {
  let testingApp: Express;
  let dataSource: DataSource;
  let token: string;

  beforeAll(async () => {
    testingApp = createApp();
    dataSource = await appDataSource.initialize();

    await request(testingApp).post('/users').send({
      email: 'test@example.com',
      password: 'password',
    });

    await dataSource.getRepository('user').update({ email: 'test@example.com' }, { role: 'admin' });

    const response = await request(testingApp).post('/users/login').send({
      email: 'test@example.com',
      password: 'password',
    });

    token = response.body.data.token;
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM "user"');
  });

  it('should create a movie successfully', async () => {
    const response = await request(testingApp).post('/movies').set('authorization', `Bearer ${token}`).send({
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
