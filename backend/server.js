require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const clientesRoutes = require('./routes/clientes');
const productosRoutes = require('./routes/productos');
const facturasRoutes = require('./routes/facturas');
const reportesRoutes = require('./routes/reportes');

const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Middleware de parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/reportes', reportesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler
app.use(errorHandler);

module.exports = app;

// Start server only if this file is run directly (not imported for tests)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor iniciado en puerto ${PORT}`);
    logger.info(`Ambiente: ${process.env.NODE_ENV}`);
  });
}
