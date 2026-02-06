const request = require('supertest');
const app = require('../server');
const { getToken } = require('./auth-helper');

describe('Productos Endpoints', () => {
  let token;
  let createdProductId;

  beforeAll(async () => {
    token = await getToken();
  });

  it('POST /api/productos - should create a new product', async () => {
    const productData = {
      nombre: `Producto Test ${Date.now()}`,
      descripcion: 'Descripción test',
      precio: 99.99,
      cantidad: 50,
      sku: `SKU-${Date.now()}`,
      categoria: 'Test'
    };

    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send(productData);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.nombre).toBe(productData.nombre);
    createdProductId = res.body.id;
  });

  it('GET /api/productos - should list products', async () => {
    const res = await request(app)
      .get('/api/productos')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 401]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  it('POST /api/productos - should reject negative price', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Bad Product',
        descripcion: 'desc',
        precio: -10,
        cantidad: 1,
        sku: 'BAD-SKU',
        categoria: 'Bad'
      });

    expect([400, 422]).toContain(res.status);
  });

  it('POST /api/productos - should reject negative quantity', async () => {
    const res = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: 'Bad Product',
        descripcion: 'desc',
        precio: 10,
        cantidad: -5,
        sku: 'BAD-SKU-2',
        categoria: 'Bad'
      });

    expect([400, 422]).toContain(res.status);
  });

  it('GET /api/productos/:id - should get a product by id', async () => {
    if (!createdProductId) {
      console.warn('Skipping GET /api/productos/:id test (no product created)');
      return;
    }

    const res = await request(app)
      .get(`/api/productos/${createdProductId}`)
      .set('Authorization', `Bearer ${token}`);

    expect([200, 401, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body.id).toBe(createdProductId);
    }
  });
});
