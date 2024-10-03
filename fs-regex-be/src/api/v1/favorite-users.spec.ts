/* eslint-disable @typescript-eslint/no-explicit-any */
// Import necessary modules and dependencies for your test file
import request from 'supertest';
import express from 'express';
import fs from 'fs';
import path from 'path';
import router from './favorite-users'; // Replace with the actual path
import bodyParser from 'body-parser';

// Create an Express app and use the router
const app = express();
app.use(bodyParser.json())
app.use('/api/v1/favorite-users', router);

// Mock the fs.existsSync and fs.readFileSync functions
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

describe('Favorites Router', () => {
  beforeEach(() => {
    // Reset the mock implementation before each test
    jest.clearAllMocks();
  });

  it('GET / should return a list of favorited users', async () => {
    // Mock the behavior of fs.existsSync and fs.readFileSync
    (fs.existsSync as jest.MockedFn<any>).mockReturnValue(true);
    (fs.readFileSync as jest.MockedFn<any>).mockReturnValue(JSON.stringify([{ id: '1', name: 'User1' }]));

    const response = await request(app).get('/api/v1/favorite-users');

    expect(response.status).toBe(200);
    expect(response.body.users).toEqual([{ id: '1', name: 'User1' }]);
  });

  it('GET / should handle the case when favorites.json does not exist', async () => {
    // Mock the behavior of fs.existsSync to return false
    (fs.existsSync as jest.MockedFn<any>).mockReturnValue(false);

    const response = await request(app).get('/api/v1/favorite-users');

    expect(response.status).toBe(200);
    expect(response.body.users).toEqual([]);
  });

  it('POST / should add a user to favorites', async () => {
    // Mock the behavior of fs.existsSync and fs.readFileSync
    (fs.existsSync as jest.MockedFn<any>).mockReturnValue(true);
    (fs.readFileSync as jest.MockedFn<any>).mockReturnValue(JSON.stringify([]));

    const response = await request(app)
      .post('/api/v1/favorite-users')
      .set({ 'Content-Type': 'application/json', 'Accept': 'application/json' })
      .send({ user: { id: '1', name: 'User1' } });

    expect(response.status).toBe(200);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.resolve(__dirname, '../../../db/favorites.json'),
      JSON.stringify([{ id: '1', name: 'User1' }])
    );
  });

  it('DELETE /:id should remove a user from favorites', async () => {
    (fs.existsSync as jest.MockedFn<any>).mockReturnValue(true);
    (fs.readFileSync as jest.MockedFn<any>).mockReturnValue(JSON.stringify([{ id: '1', name: 'User1' }]));

    const response = await request(app).delete('/api/v1/favorite-users/1');

    expect(response.status).toBe(200);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.resolve(__dirname, '../../../db/favorites.json'),
      '[]'
    );
  });

});

// You can add more test cases for other routes and error scenarios as needed
