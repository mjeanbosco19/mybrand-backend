import mongoose from 'mongoose';
import app from '../app.js';
import request from 'supertest';
import dotenv from 'dotenv';
dotenv.config();

jest.setTimeout(30000);

const signup = {
  name: 'New User',
  email: 'testuser@example.com',
  password: 'password123',
  passwordConfirm: 'password123',
};

const login = {
  email: 'testuser@example.com',
  password: 'password123',
};

let token;

describe('Authentication endpoints', () => {
  // let accessToken;

  beforeAll(async () => {
    // Connect to the database
    await mongoose.connect(
      'mongodb://bosco:etite@ac-d364pw5-shard-00-00.qgktwu4.mongodb.net:27017,ac-d364pw5-shard-00-01.qgktwu4.mongodb.net:27017,ac-d364pw5-shard-00-02.qgktwu4.mongodb.net:27017/?ssl=true&replicaSet=atlas-5gh9rp-shard-0&authSource=admin&retryWrites=true&w=majority'
    );
  });

  afterAll(async () => {
    // Disconnect from the database
    await mongoose.disconnect();
  });

  describe('POST /api/v1/users/signup', () => {
    test('It should create a new user account', async () => {
      const response = await request(app)
        .post('/api/v1/users/signup')
        .send(signup)
        .expect(201);
      console.log(response.body);
    });
    test('User should be able to login', async () => {
      const response = await request(app)
        .post('/api/v1/users/login')
        .send(login)
        .expect(200);
      token = response.body.token;
    });
    test('User should be deleted', async () => {
      const response = await request(app)
        .delete('/api/v1/users/deleteMe')
        .set('authorization', 'Bearer ' + token)
        .expect(204);
      token = response.body.token;
    });
  });
});
