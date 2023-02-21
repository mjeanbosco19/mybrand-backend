import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/userModels.js';

jest.setTimeout(30000);
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

describe('Authentication endpoints', () => {
  let token = '';
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
    it('should create a new user and return a token', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
        })
        .expect(201);

      // expect(res.body.status).toBe('success');
      // expect(res.body.token).toBeDefined();

      // Save the token for use in later tests
      token = res.body.token;
    });

    it('should return an error if the user already exists', async () => {
      const existingUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await User.create(existingUser);

      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
        })
        .expect(400);

      // expect(res.body.status).toBe('fail');
      // expect(res.body.message).toBe('User already exists with that email');
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should log in the user and return a token', async () => {
      const existingUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await User.create(existingUser);

      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(200);

      // expect(res.body.status).toBe('success');
      // expect(res.body.token).toBeDefined();
    });

    it('should return an error if the email or password is incorrect', async () => {
      const existingUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      await User.create(existingUser);

      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      // expect(res.body.status).toBe('fail');
      // expect(res.body.message).toBe('Incorrect email or password');
    });
  });
});
