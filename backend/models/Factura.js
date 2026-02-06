const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Factura {
  static async crear(usuarioId, datos) {
    const id = uuidv4();
    const { clienteId, items, notas } = datos;
    
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Crear factura
      const subtotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
      const iva = subtotal * 0.19; // 19% IVA
      const total = subtotal + iva;

      const fackturaQuery = `
        INSERT INTO facturas (id, usuario_id, cliente_id, numero, subtotal, iva, total, estado, notas, created_at)
        VALUES ($1, $2, $3, (SELECT COALESCE(MAX(CAST(numero AS INTEGER)), 0) + 1 FROM facturas WHERE usuario_id = $2), $4, $5, $6, 'PENDIENTE', $7, NOW())
        RETURNING *
      `;
      const facturaResult = await client.query(fackturaQuery, [id, usuarioId, clienteId, subtotal, iva, total, notas]);
      const factura = facturaResult.rows[0];

      // Crear items
      for (const item of items) {
        const itemId = uuidv4();
        const itemQuery = `
          INSERT INTO factura_items (id, factura_id, producto_id, cantidad, precio, total)
          VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await client.query(itemQuery, [itemId, id, item.productoId, item.cantidad, item.precio, item.cantidad * item.precio]);

        // Decrementar stock
        await client.query(
          'UPDATE productos SET cantidad = cantidad - $1 WHERE id = $2 AND usuario_id = $3',
          [item.cantidad, item.productoId, usuarioId]
        );
      }

      await client.query('COMMIT');
      return factura;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async obtenerPorUsuario(usuarioId) {
    const query = `
      SELECT f.*, c.nombre as cliente_nombre
      FROM facturas f
      JOIN clientes c ON f.cliente_id = c.id
      WHERE f.usuario_id = $1
      ORDER BY f.created_at DESC
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows;
  }

  static async obtenerPorId(id, usuarioId) {
    const query = `
      SELECT f.*, c.nombre as cliente_nombre
      FROM facturas f
      JOIN clientes c ON f.cliente_id = c.id
      WHERE f.id = $1 AND f.usuario_id = $2
    `;
    const result = await pool.query(query, [id, usuarioId]);
    return result.rows[0];
  }

  static async obtenerItems(facturaId) {
    const query = `
      SELECT fi.*, p.nombre as producto_nombre
      FROM factura_items fi
      JOIN productos p ON fi.producto_id = p.id
      WHERE fi.factura_id = $1
    `;
    const result = await pool.query(query, [facturaId]);
    return result.rows;
  }

  static async actualizarEstado(id, usuarioId, estado) {
    const query = `
      UPDATE facturas 
      SET estado = $1, updated_at = NOW()
      WHERE id = $2 AND usuario_id = $3
      RETURNING *
    `;
    const result = await pool.query(query, [estado, id, usuarioId]);
    return result.rows[0];
  }
}

module.exports = Factura;
