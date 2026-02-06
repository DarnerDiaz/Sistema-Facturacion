const http = require('http');
const qs = require('querystring');

const API_HOST = process.env.API_HOST || 'localhost';
const API_PORT = process.env.API_PORT || 5000;
const BASE = `/api`;

function request(path, method = 'GET', body = null, token = null) {
  const data = body ? JSON.stringify(body) : null;
  const headers = {
    'Content-Type': 'application/json',
  };
  if (data) headers['Content-Length'] = Buffer.byteLength(data);
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = {
    hostname: API_HOST,
    port: API_PORT,
    path,
    method,
    headers,
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        const status = res.statusCode;
        let parsed = null;
        try { parsed = JSON.parse(chunks); } catch (e) { parsed = chunks; }
        if (status >= 200 && status < 300) return resolve(parsed);
        const err = new Error(`HTTP ${status}`);
        err.status = status;
        err.body = parsed;
        return reject(err);
      });
    });

    req.on('error', (e) => reject(e));
    if (data) req.write(data);
    req.end();
  });
}

function randInt(max) { return Math.floor(Math.random() * max) + 1; }
function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function ensureToken() {
  const testEmail = process.env.SEED_ADMIN_EMAIL || 'prueba1@example.com';
  const testPass = process.env.SEED_ADMIN_PASS || 'password123';
  try {
    const res = await request(`${BASE}/auth/login`, 'POST', { email: testEmail, password: testPass });
    return res.token;
  } catch (e) {
    if (e.status === 400 || e.status === 401 || e.status === 404) {
      try {
        await request(`${BASE}/auth/registro`, 'POST', { nombre: 'Seeder', email: testEmail, password: testPass });
        const res2 = await request(`${BASE}/auth/login`, 'POST', { email: testEmail, password: testPass });
        return res2.token;
      } catch (e2) {
        console.error('Failed to register/login seed admin:', e2.body || e2.message);
        process.exit(1);
      }
    }
    console.error('Auth error:', e.body || e.message);
    process.exit(1);
  }
}

async function run({ clientes = 100, productos = 500, facturas = 1000 }) {
  console.log('Starting seeder with', { clientes, productos, facturas });
  const token = await ensureToken();

  const clienteIds = [];
  for (let i = 0; i < clientes; i++) {
    const body = {
      nombre: `Cliente ${i+1}`,
      email: `cliente${Date.now()%100000}-${i}@example.com`,
      telefono: `9${Math.floor(100000000 + Math.random()*899999999)}`,
      cedula: `${10000000 + i}`,
      direccion: `Calle ${i+1}`,
      ciudad: 'Ciudad'
    };
    try {
      const res = await request(`${BASE}/clientes`, 'POST', body, token);
      clienteIds.push(res.id);
      if ((i+1) % 50 === 0) console.log(`  Created ${i+1} clientes`);
    } catch (e) {
      console.warn('  Cliente create failed:', e.body || e.message);
    }
  }

  const productList = [];
  for (let i = 0; i < productos; i++) {
    const body = {
      nombre: `Producto ${i+1}`,
      descripcion: 'Producto para pruebas',
      precio: parseFloat((Math.random() * 100 + 1).toFixed(2)),
      cantidad: randInt(100),
      sku: `SKU-${Date.now()%100000}-${i}`,
      categoria: 'General'
    };
    try {
      const res = await request(`${BASE}/productos`, 'POST', body, token);
      productList.push(res);
      if ((i+1) % 100 === 0) console.log(`  Created ${i+1} productos`);
    } catch (e) {
      console.warn('  Producto create failed:', e.body || e.message);
    }
  }

  for (let i = 0; i < facturas; i++) {
    const clienteId = randFrom(clienteIds || []) || null;
    if (!clienteId) break;
    const itemsCount = Math.min(3, randInt(3));
    const items = [];
    for (let j = 0; j < itemsCount; j++) {
      const prod = randFrom(productList);
      if (!prod) continue;
      const qty = Math.min(5, Math.max(1, Math.floor(prod.cantidad / 10) || randInt(3)));
      items.push({ productoId: prod.id, cantidad: qty, precio: prod.precio });
    }
    if (items.length === 0) continue;
    const body = { clienteId, items, notas: 'Factura generada por seeder' };
    try {
      const res = await request(`${BASE}/facturas`, 'POST', body, token);
      if ((i+1) % 100 === 0) console.log(`  Created ${i+1} facturas`);
    } catch (e) {
      console.warn('  Factura create failed:', e.body || e.message);
    }
  }

  console.log('Seeding complete');
}

function parseArgs() {
  const argv = require('minimist')(process.argv.slice(2));
  return {
    clientes: parseInt(argv.clientes || argv.c || 100, 10),
    productos: parseInt(argv.productos || argv.p || 500, 10),
    facturas: parseInt(argv.facturas || argv.f || 1000, 10),
  };
}

(async () => {
  try {
    const args = parseArgs();
    await run(args);
  } catch (e) {
    console.error('Seeder failed:', e.body || e.message || e);
    process.exit(1);
  }
})();
