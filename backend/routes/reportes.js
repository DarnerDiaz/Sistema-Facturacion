const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const pool = require('../config/database');
const logger = require('../utils/logger');

router.use(authMiddleware);

router.get('/ventas/por-mes', async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE_TRUNC('month', f.created_at) as mes,
        COUNT(*) as total_facturas,
        SUM(f.total) as total_vendido
      FROM facturas f
      WHERE f.usuario_id = $1 AND f.estado = 'PAGADA'
      GROUP BY DATE_TRUNC('month', f.created_at)
      ORDER BY mes DESC
      LIMIT 12
    `;
    const result = await pool.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error obteniendo reportes de ventas:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

router.get('/productos/top-vendidos', async (req, res) => {
  try {
    const query = `
      SELECT 
        p.nombre,
        p.sku,
        SUM(fi.cantidad) as cantidad_vendida,
        SUM(fi.total) as total_vendido
      FROM factura_items fi
      JOIN facturas f ON fi.factura_id = f.id
      JOIN productos p ON fi.producto_id = p.id
      WHERE f.usuario_id = $1
      GROUP BY p.id, p.nombre, p.sku
      ORDER BY cantidad_vendida DESC
      LIMIT 10
    `;
    const result = await pool.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error obteniendo top productos:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

router.get('/inventario/bajo-stock', async (req, res) => {
  try {
    const umbral = req.query.umbral || 10;
    const query = `
      SELECT 
        id,
        nombre,
        sku,
        cantidad,
        precio
      FROM productos
      WHERE usuario_id = $1 AND cantidad <= $2
      ORDER BY cantidad ASC
    `;
    const result = await pool.query(query, [req.user.id, umbral]);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error obteniendo inventario:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

router.get('/clientes/top-compradores', async (req, res) => {
  try {
    const query = `
      SELECT 
        c.id,
        c.nombre,
        c.email,
        COUNT(f.id) as total_facturas,
        SUM(f.total) as total_gastado
      FROM clientes c
      JOIN facturas f ON c.id = f.cliente_id
      WHERE c.usuario_id = $1
      GROUP BY c.id, c.nombre, c.email
      ORDER BY total_gastado DESC
      LIMIT 10
    `;
    const result = await pool.query(query, [req.user.id]);
    res.json(result.rows);
  } catch (error) {
    logger.error('Error obteniendo top clientes:', error);
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

module.exports = router;
