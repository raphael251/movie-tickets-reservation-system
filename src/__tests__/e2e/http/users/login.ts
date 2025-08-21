import request from 'supertest';
import { createApp } from '../../../../app.ts';
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { appDataSource } from '../../../../modules/shared/data-source/data-source.ts';

describe('POST /users/login - Users login', () => {
  let testingApp: Express;
  let dataSource: DataSource;

  beforeAll(async () => {
    testingApp = createApp();
    dataSource = await appDataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.query('DELETE FROM "user"');
  });

  beforeEach(async () => {
    await request(testingApp).post('/users').send({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should log a user in successfully', async () => {
    const response = await request(testingApp).post('/users/login').send({
      email: 'test@example.com',
      password: 'password',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });

  it('should return an unauthorized error if the email is incorrect', async () => {
    const response = await request(testingApp).post('/users/login').send({
      email: 'wrong-email@example.com',
      password: 'password',
    });

    expect(response.status).toBe(401);
    expect(response.body.errors).toEqual(['Invalid email or password']);
  });

  it('should return an unauthorized error if the password is incorrect', async () => {
    const response = await request(testingApp).post('/users/login').send({
      email: 'test@example.com',
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
    expect(response.body.errors).toEqual(['Invalid email or password']);
  });
});
