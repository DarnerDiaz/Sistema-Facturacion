-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  cedula VARCHAR(20) UNIQUE NOT NULL,
  direccion TEXT NOT NULL,
  ciudad VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10, 2) NOT NULL,
  cantidad INTEGER DEFAULT 0,
  sku VARCHAR(100) UNIQUE NOT NULL,
  categoria VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS facturas (
  id UUID PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  numero INTEGER NOT NULL,
  subtotal DECIMAL(10, 2),
  iva DECIMAL(10, 2),
  total DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(20) DEFAULT 'PENDIENTE',
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(usuario_id, numero)
);

-- Tabla de Items de Facturas
CREATE TABLE IF NOT EXISTS factura_items (
  id UUID PRIMARY KEY,
  factura_id UUID NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
  producto_id UUID NOT NULL REFERENCES productos(id),
  cantidad INTEGER NOT NULL,
  precio DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL
);

-- Índices
CREATE INDEX idx_clientes_usuario ON clientes(usuario_id);
CREATE INDEX idx_productos_usuario ON productos(usuario_id);
CREATE INDEX idx_facturas_usuario ON facturas(usuario_id);
CREATE INDEX idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX idx_factura_items_factura ON factura_items(factura_id);
CREATE INDEX idx_factura_items_producto ON factura_items(producto_id);
