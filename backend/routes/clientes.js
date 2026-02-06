const express = require('express');
const router = express.Router();
const joi = require('joi');
const authMiddleware = require('../middleware/auth');
const Cliente = require('../models/Cliente');
const logger = require('../utils/logger');

const schemaCliente = joi.object({
  nombre: joi.string().required().min(3),
  email: joi.string().email().required(),
  telefono: joi.string().required(),
  cedula: joi.string().required(),
  direccion: joi.string().required(),
  ciudad: joi.string().required()
});

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.obtenerPorUsuario(req.user.id);
    res.json(clientes);
  } catch (error) {
    logger.error('Error obteniendo clientes:', error);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.obtenerPorId(req.params.id, req.user.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(cliente);
  } catch (error) {
    logger.error('Error obteniendo cliente:', error);
    res.status(500).json({ error: 'Error al obtener cliente' });
  }
});

router.post('/', async (req, res) => {
  try {
    await schemaCliente.validateAsync(req.body);
    const cliente = await Cliente.crear(req.user.id, req.body);
    logger.info(`Cliente creado: ${cliente.id}`);
    res.status(201).json(cliente);
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ error: 'Validación fallida', details: error.details.map(d => d.message) });
    }
    logger.error('Error creando cliente:', error);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await schemaCliente.validateAsync(req.body);
    const cliente = await Cliente.actualizar(req.params.id, req.user.id, req.body);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    logger.info(`Cliente actualizado: ${cliente.id}`);
    res.json(cliente);
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ error: 'Validación fallida', details: error.details.map(d => d.message) });
    }
    logger.error('Error actualizando cliente:', error);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const cliente = await Cliente.eliminar(req.params.id, req.user.id);
    if (!cliente) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    logger.info(`Cliente eliminado: ${cliente.id}`);
    res.json({ message: 'Cliente eliminado', id: cliente.id });
  } catch (error) {
    logger.error('Error eliminando cliente:', error);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;
