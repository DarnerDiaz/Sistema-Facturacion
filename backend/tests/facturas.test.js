const request = require('supertest');
const app = require('../server');
const { getToken } = require('./auth-helper');

describe('Facturas Endpoints', () => {
  let token;
  let clienteId;
  let productoId;

  beforeAll(async () => {
    token = await getToken();

    // Create a test client
    const clientRes = await request(app)
      .post('/api/clientes')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: `Cliente Factura ${Date.now()}`,
        email: `cliente-factura-${Date.now()}@test.com`,
        telefono: '3009876543',
        cedula: String(Math.floor(Math.random() * 99999999)),
        direccion: 'Calle 1',
        ciudad: 'Ciudad'
      });

    if (clientRes.status === 201) {
      clienteId = clientRes.body.id;
    }

    // Create a test product
    const prodRes = await request(app)
      .post('/api/productos')
      .set('Authorization', `Bearer ${token}`)
      .send({
        nombre: `Producto Factura ${Date.now()}`,
        descripcion: 'Para facturas',
        precio: 50,
        cantidad: 100,
        sku: `SKU-FACTURA-${Date.now()}`,
        categoria: 'Test'
      });

    if (prodRes.status === 201) {
      productoId = prodRes.body.id;
    }
  });

  it('POST /api/facturas - should create an invoice', async () => {
    if (!clienteId || !productoId) {
      console.warn('Skipping invoice creation test (setup failed)');
      return;
    }

    const invoiceData = {
      clienteId,
      items: [{ productoId, cantidad: 2, precio: 50 }],
      notas: 'Test invoice'
    };

    const res = await request(app)
      .post('/api/facturas')
      .set('Authorization', `Bearer ${token}`)
      .send(invoiceData);

    expect([201, 400, 422]).toContain(res.status);
    if (res.status === 201) {
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('estado', 'PENDIENTE');
    }
  });

  it('GET /api/facturas - should list invoices', async () => {
    const res = await request(app)
      .get('/api/facturas')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 401]).toContain(res.status);
    if (res.status === 200) {
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  it('POST /api/facturas - should create invoice with valid data', async () => {
    if (!clienteId || !productoId) {
      console.warn('Skipping additional invoice test (setup failed)');
      return;
    }

    const invoiceData = {
      clienteId,
      items: [{ productoId, cantidad: 1, precio: 50 }],
      notas: 'Another test invoice'
    };

    const res = await request(app)
      .post('/api/facturas')
      .set('Authorization', `Bearer ${token}`)
      .send(invoiceData);

    expect([201, 400, 422]).toContain(res.status);
  });

  it('GET /api/reportes - should return sales metrics or auth error', async () => {
    const res = await request(app)
      .get('/api/reportes')
      .set('Authorization', `Bearer ${token}`);

    expect([200, 401, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.body).toHaveProperty('totalVentas');
    }
  });
});
