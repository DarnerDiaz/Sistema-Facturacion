# 📌 ARQUITECTURA DEL SISTEMA

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────────────┐
│                       Cliente Web (Browser)                      │
│                      Next.js + React + Tailwind                  │
│                    (http://localhost:3000)                       │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │   Axios + JWT Token    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   API REST - Express   │
                    │  (http://localhost:5000)|
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   PostgreSQL Database   │
                    │   (localhost:5432)      │
                    └────────────────────────┘
```

## 📁 Estructura de Carpetas

```
Sistema-Facturacion/
│
├── backend/
│   ├── config/
│   │   └── database.js              # Conexión PostgreSQL
│   ├── middleware/
│   │   ├── auth.js                  # Autenticación JWT
│   │   └── errorHandler.js          # Manejo de errores
│   ├── models/
│   │   ├── Usuario.js               # Modelo de Usuario
│   │   ├── Cliente.js               # Modelo de Cliente
│   │   ├── Producto.js              # Modelo de Producto
│   │   └── Factura.js               # Modelo de Factura
│   ├── routes/
│   │   ├── auth.js                  # Rutas de autenticación
│   │   ├── clientes.js              # Rutas de clientes
│   │   ├── productos.js             # Rutas de productos
│   │   ├── facturas.js              # Rutas de facturas
│   │   └── reportes.js              # Rutas de reportes
│   ├── utils/
│   │   └── logger.js                # Logger personalizado
│   ├── scripts/
│   │   └── init_db.sql              # Schema de BD
│   ├── server.js                    # Servidor principal
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.tsx            # Home page
│   │   │   ├── registro.tsx         # Registro
│   │   │   ├── login.tsx            # Login
│   │   │   ├── dashboard.tsx        # Dashboard principal
│   │   │   ├── clientes.tsx         # Gestión clientes
│   │   │   ├── productos.tsx        # Gestión productos
│   │   │   ├── facturas.tsx         # Listado facturas
│   │   │   ├── reportes.tsx         # Reportes
│   │   │   ├── facturas/
│   │   │   │   └── crear.tsx        # Crear factura
│   │   │   ├── _app.tsx             # App setup
│   │   │   └── _document.tsx        # Document
│   │   ├── components/
│   │   │   └── Layout.tsx           # Layout principal
│   │   ├── lib/
│   │   │   └── api.ts               # Cliente axios configurado
│   │   ├── store/
│   │   │   └── authStore.ts         # Store Zustand
│   │   ├── styles/
│   │   │   └── globals.css
│   │   └── types/
│   ├── public/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
│
├── docs/
│   └── (documentación adicional)
│
├── README.md                        # Documentación principal
├── QUICKSTART.md                    # Guía rápida
├── SETUP.md                         # Setup detallado
└── ARCHITECTURE.md                  # Este archivo

```

## 🔄 Flujo de Datos

### 1. Autenticación
```
Usuario → Formulario Login → API /auth/login → JWT Token → localStorage
                                                    ↓
                                            Axios Interceptor
                                            (agrega token)
```

### 2. Crear Factura
```
Usuario selecciona Cliente + Productos → Frontend valida → POST /facturas
                                                              ↓
                                                    Backend transacción:
                                                    1. Crear factura
                                                    2. Agregar items
                                                    3. Decrementar stock
                                                    4. Confirmar (commit)
                                                              ↓
                                                    Frontend navega a /facturas
```

### 3. Generar PDF
```
Usuario → Click PDF → GET /facturas/:id/pdf → PDFKit genera → Download
```

## 🗄️ Modelo de Datos

### Tabla Usuarios
```
id (UUID) → PK
email (VARCHAR)
password (VARCHAR) → bcrypt
nombre (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Tabla Clientes
```
id (UUID) → PK
usuario_id (UUID) → FK users
nombre (VARCHAR)
email (VARCHAR)
telefono (VARCHAR)
cedula (VARCHAR) → UNIQUE
direccion (TEXT)
ciudad (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Tabla Productos
```
id (UUID) → PK
usuario_id (UUID) → FK users
nombre (VARCHAR)
descripcion (TEXT)
precio (DECIMAL)
cantidad (INTEGER)
sku (VARCHAR) → UNIQUE
categoria (VARCHAR)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Tabla Facturas
```
id (UUID) → PK
usuario_id (UUID) → FK users
cliente_id (UUID) → FK clientes
numero (INTEGER) → auto-increment por usuario
subtotal (DECIMAL)
iva (DECIMAL)
total (DECIMAL)
estado (VARCHAR) → PENDIENTE|PAGADA|CANCELADA
notas (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Tabla Factura_Items
```
id (UUID) → PK
factura_id (UUID) → FK facturas (ON DELETE CASCADE)
producto_id (UUID) → FK productos
cantidad (INTEGER)
precio (DECIMAL) → precio en momento de venta
total (DECIMAL)
```

## 🔐 Flujo de Seguridad

1. **Contraseña**: Hash con bcrypt (salt rounds: 10)
2. **JWT Token**: 
   - Secret: 32+ caracteres
   - Expira: 7 días
   - Payload: {id, email}
3. **CORS**: Configurado para frontend URL
4. **Helmet**: Headers de seguridad
5. **Validación**: Joi en todos los endpoints

## 🚀 Flujo de Deploy

### Desarrollo
```
npm run dev (backend)  →  Nodemon reinicia en cambios
npm run dev (frontend) →  Next.js HMR
```

### Producción
```
npm run build (build estático)
npm start (server production)
```

### Diferentes Ambientes
```
.env.development  → desarrollo local
.env.production   → variables seguras en cloud
```

## 📊 Reportes SQL

### Ventas por Mes
```sql
SELECT 
  DATE_TRUNC('month', created_at) as mes,
  COUNT(*) as total_facturas,
  SUM(total) as total_vendido
FROM facturas
WHERE estado = 'PAGADA'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY mes DESC
```

### Top Productos
```sql
SELECT 
  p.nombre,
  SUM(fi.cantidad) as cantidad_vendida,
  SUM(fi.total) as total_vendido
FROM factura_items fi
JOIN productos p ON fi.producto_id = p.id
GROUP BY p.id
ORDER BY cantidad_vendida DESC
```

## 🔌 Endpoints API

### Estructura de Respuestas

**Success (200)**
```json
{
  "data": {...},
  "message": "Operación exitosa"
}
```

**Error (400-500)**
```json
{
  "error": "Mensaje de error",
  "details": ["detalle 1", "detalle 2"]
}
```

### Headers Requeridos
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

## 📱 Componentes Frontend Principales

### Layout
- Sidebar navigation
- Top bar con usuario
- Mobile responsive
- Logout handler

### Páginas
- **Public**: index, login, registro
- **Protected**: dashboard, clientes, productos, facturas, reportes

### Formularios
- React Hook Form
- Validación en tiempo real
- Error handling
- Submission loading state

## ⚡ Performance

### Backend
- Índices en FK y campos frecuentes
- Connection pooling
- Query optimization
- Gzip compression

### Frontend
- Code splitting (Next.js)
- Image optimization
- CSS minification (Tailwind)
- Bundle analysis

## 🧪 Testing (Roadmap)

```
├── Unit Tests (Jest)
│   ├── Models
│   ├── Utils
│   └── Validators
├── Integration Tests
│   ├── API endpoints
│   └── Database operations
└── E2E Tests (Cypress)
    ├── User flows
    └── Happy path
```

---

**Arquitectura moderna, escalable y lista para producción.**
