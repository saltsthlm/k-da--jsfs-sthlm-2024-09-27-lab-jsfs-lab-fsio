import request from 'supertest';
import express from 'express';
import usersRoutes from './users';
import { User } from '@ngneat/falso';

const app = express();
app.use('/api/v1/users', usersRoutes);

jest.mock('../../data/users', () => ({
  USERS_LIST: [
    {
      id: 'a4e494d2-8c46-4f07-bfae-dc80bae11a89',
      firstName: 'Muhammad Ahsan',
      lastName: 'Ayaz',
    },
    {
      id: '8f3aeb52-a5f2-4a82-b177-7ada5e3fbcdd',
      firstName: 'Roeline',
      lastName: 'Burger',
    }
  ],
}));

describe('Users API', () => {
  it('should fetch a all users', async () => {
    const response = await request(app).get('/api/v1/users');
    expect(response.status).toBe(200);
    const { users } = response.body
    expect(users.length).toBe(2);
  });

  it('should fetch a user by ID', async () => {
    const response = await request(app).get('/api/v1/users/a4e494d2-8c46-4f07-bfae-dc80bae11a89');
    expect(response.status).toBe(200);
    const user = response.body.user as User;
    expect(user).toBeTruthy();

    expect(user.firstName).toBe('Muhammad Ahsan');
    expect(user.lastName).toBe('Ayaz');
  });

  it('should search users by name', async () => {
    const response = await request(app).get('/api/v1/users?name=el');
    expect(response.status).toBe(200);
    const users = response.body.users as User[];
    expect(users.length).toBe(1);
    const user = users[0];
    expect(user.firstName).toBe('Roeline');
    expect(user.lastName).toBe('Burger');
  });

});

