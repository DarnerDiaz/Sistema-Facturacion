const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Usuario {
  static async crear(email, hashedPassword, nombre) {
    const id = uuidv4();
    const query = `
      INSERT INTO usuarios (id, email, password, nombre, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id, email, nombre, created_at
    `;
    const result = await pool.query(query, [id, email, hashedPassword, nombre]);
    return result.rows[0];
  }

  static async buscarPorEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async buscarPorId(id) {
    const query = 'SELECT id, email, nombre, created_at FROM usuarios WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Usuario;
