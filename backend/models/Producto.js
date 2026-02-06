const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Producto {
  static async crear(usuarioId, datos) {
    const id = uuidv4();
    const { nombre, descripcion, precio, cantidad, sku, categoria } = datos;
    const query = `
      INSERT INTO productos (id, usuario_id, nombre, descripcion, precio, cantidad, sku, categoria, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [id, usuarioId, nombre, descripcion, precio, cantidad, sku, categoria]);
    return result.rows[0];
  }

  static async obtenerPorUsuario(usuarioId) {
    const query = `
      SELECT * FROM productos 
      WHERE usuario_id = $1 
      ORDER BY nombre
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows;
  }

  static async obtenerPorId(id, usuarioId) {
    const query = `
      SELECT * FROM productos 
      WHERE id = $1 AND usuario_id = $2
    `;
    const result = await pool.query(query, [id, usuarioId]);
    return result.rows[0];
  }

  static async actualizar(id, usuarioId, datos) {
    const { nombre, descripcion, precio, cantidad, sku, categoria } = datos;
    const query = `
      UPDATE productos 
      SET nombre = $1, descripcion = $2, precio = $3, cantidad = $4, sku = $5, categoria = $6, updated_at = NOW()
      WHERE id = $7 AND usuario_id = $8
      RETURNING *
    `;
    const result = await pool.query(query, [nombre, descripcion, precio, cantidad, sku, categoria, id, usuarioId]);
    return result.rows[0];
  }

  static async decrementarStock(id, usuarioId, cantidad) {
    const query = `
      UPDATE productos 
      SET cantidad = cantidad - $1, updated_at = NOW()
      WHERE id = $2 AND usuario_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [cantidad, id, usuarioId]);
    return result.rows[0];
  }

  static async eliminar(id, usuarioId) {
    const query = 'DELETE FROM productos WHERE id = $1 AND usuario_id = $2 RETURNING id';
    const result = await pool.query(query, [id, usuarioId]);
    return result.rows[0];
  }
}

module.exports = Producto;
