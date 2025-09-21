import request from 'supertest';
import { Express } from 'express';

export const getRegularUserToken = async (testingApp: Express) => {
  const regularUserLoginResponse = await request(testingApp).post('/users/login').send({
    email: 'regular@mail.com',
    password: '123456',
  });

  return regularUserLoginResponse.body.data.token;
};

export const getAdminUserToken = async (testingApp: Express) => {
  const adminUserLoginResponse = await request(testingApp).post('/users/login').send({
    email: 'admin@mail.com',
    password: '123456',
  });

  return adminUserLoginResponse.body.data.token;
};
