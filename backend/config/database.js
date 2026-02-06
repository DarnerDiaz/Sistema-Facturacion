const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'facturacion_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password123'
});

pool.on('error', (err) => {
  logger.error('Error inesperado en el pool de conexiones', err);
});

// Test de conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    logger.error('Error conectando a la BD:', err);
  } else {
    logger.info('✅ Conexión a PostgreSQL exitosa');
  }
});

module.exports = pool;
