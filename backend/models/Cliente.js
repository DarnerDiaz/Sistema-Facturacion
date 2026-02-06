const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Cliente {
  static async crear(usuarioId, datos) {
    const id = uuidv4();
    const { nombre, email, telefono, cedula, direccion, ciudad } = datos;
    const query = `
      INSERT INTO clientes (id, usuario_id, nombre, email, telefono, cedula, direccion, ciudad, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [id, usuarioId, nombre, email, telefono, cedula, direccion, ciudad]);
    return result.rows[0];
  }

  static async obtenerPorUsuario(usuarioId) {
    const query = `
      SELECT * FROM clientes 
      WHERE usuario_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows;
  }

  static async obtenerPorId(id, usuarioId) {
    const query = `
      SELECT * FROM clientes 
      WHERE id = $1 AND usuario_id = $2
    `;
    const result = await pool.query(query, [id, usuarioId]);
    return result.rows[0];
  }

  static async actualizar(id, usuarioId, datos) {
    const { nombre, email, telefono, cedula, direccion, ciudad } = datos;
    const query = `
      UPDATE clientes 
      SET nombre = $1, email = $2, telefono = $3, cedula = $4, direccion = $5, ciudad = $6, updated_at = NOW()
      WHERE id = $7 AND usuario_id = $8
      RETURNING *
    `;
    const result = await pool.query(query, [nombre, email, telefono, cedula, direccion, ciudad, id, usuarioId]);
    return result.rows[0];
  }

  static async eliminar(id, usuarioId) {
    const query = 'DELETE FROM clientes WHERE id = $1 AND usuario_id = $2 RETURNING id';
    const result = await pool.query(query, [id, usuarioId]);
    return result.rows[0];
  }
}

module.exports = Cliente;
