const request = require('supertest');
const app = require('../server');

const testEmail = 'test-auth@example.com';
const testPassword = 'password123';

async function getToken() {
  try {
    // Try login first
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testEmail, password: testPassword });
    if (loginRes.status === 200) {
      return loginRes.body.token;
    }
  } catch (e) {
    // Ignore
  }

  try {
    // Try register
    await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'Test User', email: testEmail, password: testPassword });
  } catch (e) {
    // Ignore if already exists
  }

  // Try login again
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: testEmail, password: testPassword });
  
  if (loginRes.status === 200) {
    return loginRes.body.token;
  }

  throw new Error(`Failed to get token: ${loginRes.status} ${JSON.stringify(loginRes.body)}`);
}

module.exports = { getToken, testEmail, testPassword };
