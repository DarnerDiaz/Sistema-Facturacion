const express = require('express');
const router = express.Router();
const joi = require('joi');
const authMiddleware = require('../middleware/auth');
const Producto = require('../models/Producto');
const logger = require('../utils/logger');

const schemaProducto = joi.object({
  nombre: joi.string().required().min(3),
  descripcion: joi.string().required().min(10),
  precio: joi.number().positive().required(),
  cantidad: joi.number().integer().min(0).required(),
  sku: joi.string().required(),
  categoria: joi.string().required()
});

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const productos = await Producto.obtenerPorUsuario(req.user.id);
    res.json(productos);
  } catch (error) {
    logger.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.obtenerPorId(req.params.id, req.user.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    logger.error('Error obteniendo producto:', error);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

router.post('/', async (req, res) => {
  try {
    await schemaProducto.validateAsync(req.body);
    const producto = await Producto.crear(req.user.id, req.body);
    logger.info(`Producto creado: ${producto.id}`);
    res.status(201).json(producto);
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ error: 'Validación fallida', details: error.details.map(d => d.message) });
    }
    logger.error('Error creando producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await schemaProducto.validateAsync(req.body);
    const producto = await Producto.actualizar(req.params.id, req.user.id, req.body);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    logger.info(`Producto actualizado: ${producto.id}`);
    res.json(producto);
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ error: 'Validación fallida', details: error.details.map(d => d.message) });
    }
    logger.error('Error actualizando producto:', error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const producto = await Producto.eliminar(req.params.id, req.user.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    logger.info(`Producto eliminado: ${producto.id}`);
    res.json({ message: 'Producto eliminado', id: producto.id });
  } catch (error) {
    logger.error('Error eliminando producto:', error);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

module.exports = router;
