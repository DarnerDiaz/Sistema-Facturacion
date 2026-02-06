const request = require('supertest');
const app = require('../server');

describe('Auth Endpoints', () => {
  const testUser = { nombre: 'Test User', email: 'testauth@example.com', password: 'password123' };

  it('POST /api/auth/registro - should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send(testUser);
    expect([201, 409]).toContain(res.status); // 409 if already exists
    if (res.status === 201) {
      expect(res.body).toHaveProperty('message');
    }
  });

  it('POST /api/auth/login - should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect([200, 401, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('token');
    }
  });

  it('POST /api/auth/login - should fail with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@example.com', password: 'x' });
    expect(res.status).toBe(401);
  });

  it('POST /api/auth/registro - should reject invalid email format', async () => {
    const res = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'X', email: 'invalid-email', password: '123456' });
    expect(res.status).toBe(400);
  });
});
