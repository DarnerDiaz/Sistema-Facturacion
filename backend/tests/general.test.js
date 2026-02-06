const request = require('supertest');
const app = require('../server');

describe('API Endpoints (Unauthenticated)', () => {
  it('GET /health - should return OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
  });

  it('GET /api/productos - should require auth or allow public', async () => {
    const res = await request(app).get('/api/productos');
    expect([200, 401]).toContain(res.status);
  });

  it('POST /api/clientes - should require auth', async () => {
    const res = await request(app)
      .post('/api/clientes')
      .send({ nombre: 'Test' });
    expect(res.status).toBe(401);
  });

  it('POST /api/facturas - should require auth', async () => {
    const res = await request(app)
      .post('/api/facturas')
      .send({ clienteId: '123', items: [] });
    expect(res.status).toBe(401);
  });
});

describe('General Error Handling', () => {
  it('GET /nonexistent - should return 404', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.status).toBe(404);
  });
});
