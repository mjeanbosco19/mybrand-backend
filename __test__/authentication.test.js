import request from 'supertest';
import app from '../app.js';
jest.setTimeout(30000);
describe('Authentication endpoints', () => {
  let token = '';

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

      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();

      // Save the token for use in later tests
      token = res.body.token;
    });

    it('should return an error if the user already exists', async () => {
      const res = await request(app)
        .post('/api/v1/users/signup')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
        })
        .expect(400);

      expect(res.body.status).toBe('fail');
      expect(res.body.message).toBe('User already exists with that email');
    });
  });

  describe('POST /api/v1/users/login', () => {
    it('should log in the user and return a token', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'john@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(res.body.token).toBeDefined();
    });

    it('should return an error if the email or password is incorrect', async () => {
      const res = await request(app)
        .post('/api/v1/users/login')
        .send({
          email: 'john@example.com',
          password: 'wrongpassword',
        })
        .expect(401);

      expect(res.body.status).toBe('fail');
      expect(res.body.message).toBe('Incorrect email or password');
    });
  });
});
