const express = require('express');
const router = express.Router();
const joi = require('joi');
const authMiddleware = require('../middleware/auth');
const Factura = require('../models/Factura');
const PDFDocument = require('pdfkit');
const logger = require('../utils/logger');

const schemaFactura = joi.object({
  clienteId: joi.string().uuid().required(),
  items: joi.array().items(
    joi.object({
      productoId: joi.string().uuid().required(),
      cantidad: joi.number().integer().positive().required(),
      precio: joi.number().positive().required()
    })
  ).required(),
  notas: joi.string().optional()
});

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const facturas = await Factura.obtenerPorUsuario(req.user.id);
    res.json(facturas);
  } catch (error) {
    logger.error('Error obteniendo facturas:', error);
    res.status(500).json({ error: 'Error al obtener facturas' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const factura = await Factura.obtenerPorId(req.params.id, req.user.id);
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    const items = await Factura.obtenerItems(req.params.id);
    res.json({ ...factura, items });
  } catch (error) {
    logger.error('Error obteniendo factura:', error);
    res.status(500).json({ error: 'Error al obtener factura' });
  }
});

router.post('/', async (req, res) => {
  try {
    await schemaFactura.validateAsync(req.body);
    const factura = await Factura.crear(req.user.id, req.body);
    logger.info(`Factura creada: ${factura.id}`);
    res.status(201).json(factura);
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ error: 'Validación fallida', details: error.details.map(d => d.message) });
    }
    logger.error('Error creando factura:', error);
    res.status(500).json({ error: 'Error al crear factura' });
  }
});

router.get('/:id/pdf', async (req, res) => {
  try {
    const factura = await Factura.obtenerPorId(req.params.id, req.user.id);
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }

    const items = await Factura.obtenerItems(req.params.id);

    // Crear PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=factura-${factura.numero}.pdf`);

    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).text('FACTURA', { align: 'center' });
    doc.fontSize(10).text(`Número: ${factura.numero}`, { align: 'center' });
    doc.text(`Fecha: ${new Date(factura.created_at).toLocaleDateString('es-ES')}`, { align: 'center' });
    doc.moveDown();

    // Cliente
    doc.fontSize(12).text('CLIENTE', { underline: true });
    doc.fontSize(10);
    doc.text(`Nombre: ${factura.cliente_nombre}`);
    doc.moveDown();

    // Items
    doc.fontSize(12).text('ITEMS', { underline: true });
    doc.fontSize(10);

    const tableTop = doc.y;
    const col1X = 50;
    const col2X = 250;
    const col3X = 350;
    const col4X = 450;

    doc.text('Producto', col1X, tableTop);
    doc.text('Cantidad', col2X, tableTop);
    doc.text('Precio', col3X, tableTop);
    doc.text('Total', col4X, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    let y = tableTop + 25;
    items.forEach(item => {
      doc.text(item.producto_nombre, col1X, y);
      doc.text(item.cantidad, col2X, y);
      doc.text(`$${item.precio.toFixed(2)}`, col3X, y);
      doc.text(`$${item.total.toFixed(2)}`, col4X, y);
      y += 20;
    });

    doc.moveDown();
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 20;

    // Totales
    doc.fontSize(11).text(`Subtotal: $${factura.subtotal.toFixed(2)}`, col3X);
    doc.text(`IVA 19%: $${factura.iva.toFixed(2)}`, col3X);
    doc.font('Helvetica-Bold').text(`TOTAL: $${factura.total.toFixed(2)}`, col3X);

    doc.end();
  } catch (error) {
    logger.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error al generar PDF' });
  }
});

router.patch('/:id/estado', async (req, res) => {
  try {
    const { estado } = req.body;
    if (!['PENDIENTE', 'PAGADA', 'CANCELADA'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }
    const factura = await Factura.actualizarEstado(req.params.id, req.user.id, estado);
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    logger.info(`Factura ${factura.id} actualizada a ${estado}`);
    res.json(factura);
  } catch (error) {
    logger.error('Error actualizando estado:', error);
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

module.exports = router;
