const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  // Errores de validación
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.details.map(d => d.message)
    });
  }

  // Errores de base de datos
  if (err.code && err.code.startsWith('23')) {
    return res.status(409).json({
      error: 'Conflicto de datos',
      message: err.detail || 'El registro ya existe o viola restricciones'
    });
  }

  // Errores por defecto
  const status = err.status || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
