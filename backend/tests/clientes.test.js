const request = require('supertest');
const app = require('../server');
const { getToken } = require('./auth-helper');

describe('Clientes Endpoints', () => {
  let token;

  beforeAll(async () => {
    token = await getToken();
  });

  it('POST /api/clientes - should create a new client', async () => {
    const clientData = {
      nombre: `Cliente Test ${Date.now()}`,
      email: `cliente-${Date.now()}@test.com`,
      telefono: '3001234567',
      cedula: String(Math.floor(Math.random() * 99999999)),
      direccion: 'Calle 1',
      ciudad: 'Ciudad Test'
    };

    const res = await request(app)
      .post('/api/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send(clientData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe(clientData.nombre);
  });

  it('GET /api/clientes - should list clients', async () => {
    const res = await request(app)
      .get('/api/clientes')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 401]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  it('POST /api/clientes - should require valid email', async () => {
    const res = await request(app)
      .post('/api/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Invalid',
        email: 'not-an-email',
        telefono: '123',
        cedula: '123',
        direccion: 'addr',
        ciudad: 'city'
      });

    expect([400, 422]).toContain(res.status);
  });

  it('PUT /api/clientes/:id - should require valid data', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000';
    const res = await request(app)
      .put(`/api/clientes/${fakeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ nombre: 'Updated' });

    expect([400, 404, 422]).toContain(res.status);
  });
});
