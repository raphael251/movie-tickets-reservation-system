import express from 'express';
import { UsersSignUpController } from './modules/users/http/controllers/sign-up';
import { DataSource } from 'typeorm';
import { UserRepository } from './modules/users/repositories';
import { Hasher } from './modules/shared/security/hasher';

const app = express();
export const appDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: '123456',
  database: 'users-db',
  entities: [__dirname + '/modules/**/*.{js,ts}'],
  synchronize: true, // Set to false in production
  logging: true,
})

appDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Movie Tickets Reservation System!');
});

app.post('/users', (req, res) => new UsersSignUpController(new UserRepository(), new Hasher()).handle(req, res));

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});