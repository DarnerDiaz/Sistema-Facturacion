const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const Usuario = require('../models/Usuario');
const logger = require('../utils/logger');

const schemaRegistro = joi.object({
  nombre: joi.string().required().min(3),
  email: joi.string().email().required(),
  password: joi.string().required().min(6)
});

const schemaLogin = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required()
});

router.post('/registro', async (req, res) => {
  try {
    await schemaRegistro.validateAsync(req.body);
    const { nombre, email, password } = req.body;

    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const usuario = await Usuario.crear(email, hashedPassword, nombre);

    logger.info(`Usuario registrado: ${email}`);

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ error: 'Validación fallida', details: error.details.map(d => d.message) });
    }
    logger.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

router.post('/login', async (req, res) => {
  try {
    await schemaLogin.validateAsync(req.body);
    const { email, password } = req.body;

    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info(`Usuario autenticado: ${email}`);

    res.json({
      message: 'Sesión iniciada',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ error: 'Validación fallida', details: error.details.map(d => d.message) });
    }
    logger.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
