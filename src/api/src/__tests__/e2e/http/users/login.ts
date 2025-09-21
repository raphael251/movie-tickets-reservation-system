import request from 'supertest';
import { createApp } from '../../../../app.ts';
import { Express } from 'express';
import { appDataSource } from '../../../../modules/shared/data-source/data-source.ts';

describe('POST /users/login - Users login', () => {
  let testingApp: Express;

  beforeAll(async () => {
    testingApp = createApp();
    await appDataSource.initialize();
  });

  it('should log a user in successfully', async () => {
    const response = await request(testingApp).post('/users/login').send({
      email: 'regular@mail.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeDefined();
  });

  it('should return an unauthorized error if the email is incorrect', async () => {
    const response = await request(testingApp).post('/users/login').send({
      email: 'wrong-email@mail.com',
      password: '123456',
    });

    expect(response.status).toBe(401);
    expect(response.body.errors).toEqual(['Invalid email or password']);
  });

  it('should return an unauthorized error if the password is incorrect', async () => {
    const response = await request(testingApp).post('/users/login').send({
      email: 'regular@mail.com',
      password: 'wrong-password',
    });

    expect(response.status).toBe(401);
    expect(response.body.errors).toEqual(['Invalid email or password']);
  });
});
