import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
// import jwt from 'jsonwebtoken';
// import User from '../models/userModels.js';

describe('User endpoints', () => {
  let authToken;
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
    it('should create a new user', async () => {
      const res = await request(app).post('/api/v1/users/signup').send({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        passwordConfirm: 'password123',
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should log in the user and return an auth token', async () => {
      const res = await request(app).post('/api/v1/users/login').send({
        email: 'john.doe@example.com',
        password: 'password123',
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('token');
      authToken = res.body.token;
    });
  });

  describe('GET /api/v1/users/logout', () => {
    it('should log out the user', async () => {
      const res = await request(app)
        .get('/api/v1/users/logout')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
    });
  });

  describe('GET /api/v1/users/me', () => {
    it('should return the current user', async () => {
      const res = await request(app)
        .get('/api/v1/users/me')
        .set('Authorization', `Bearer ${authToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('PATCH /api/v1/users/updateMe', () => {
    it('should update the current user', async () => {
      const res = await request(app)
        .patch('/api/v1/users/updateMe')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'John Smith',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('data');
    });
  });

  describe('PATCH /api/v1/users/updateMyPassword', () => {
    it('should update the password of the current user', async () => {
      const res = await request(app)
        .patch('/api/v1/users/updateMyPassword')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123',
          newPasswordConfirm: 'newpassword123',
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('status', 'success');
      expect(res.body).toHaveProperty('token');
    });
  });

  describe('DELETE /api/v1/users/deleteMe', () => {
    it('should delete the current user', async () => {
      const user = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'password123',
      };

      // Sign up a new user
      const signUpRes = await request(app)
        .post('/api/v1/users/signup')
        .send(user);

      // Log in the user
      const loginRes = await request(app).post('/api/v1/users/login').send({
        email: user.email,
        password: user.password,
      });

      // Delete the user
      const res = await request(app)
        .delete('/api/v1/users/deleteMe')
        .set('Authorization', `Bearer ${loginRes.body.token}`);

      expect(res.status).toBe(204);

      // Try to log in again with the deleted user's credentials
      const loginAgainRes = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: user.email,
          password: user.password,
        });

      expect(loginAgainRes.status).toBe(401);
    });

    it('should return 401 if user is not logged in', async () => {
      const res = await request(app).delete('/api/v1/users/deleteMe');

      expect(res.status).toBe(401);
    });
  });
});
