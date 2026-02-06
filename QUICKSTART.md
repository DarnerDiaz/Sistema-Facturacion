# 🚀 QUICKSTART - Sistema de Facturación

Guía rápida para poner en marcha el sistema en 10 minutos.

## Requisitos Mínimos
- Node.js 16+ instalado
- PostgreSQL instalado y ejecutándose
- Git

## Pasos Rápidos

### 1. Preparar PostgreSQL
```bash
# Crear base de datos
createdb facturacion_db

# Ejecutar schema (desde la carpeta del proyecto)
psql -U postgres -d facturacion_db -f backend/scripts/init_db.sql
```

### 2. Configurar y Iniciar Backend
```bash
cd backend
cp .env.example .env

# Editar .env (mínimo):
# DB_PASSWORD = tu contraseña de postgres

npm install
npm run dev
```

El backend se iniciará en `http://localhost:5000`

### 3. Configurar y Iniciar Frontend (en otra terminal)
```bash
cd frontend
npm install
npm run dev
```

El frontend se iniciará en `http://localhost:3000`

## 4. Probar el Sistema

1. Abre `http://localhost:3000` en tu navegador
2. Regístrate con:
   - Email: `test@example.com`
   - Contraseña: `password123`
3. Inicia sesión

## 5. Datos de Prueba

Crea algunos registros:

1. **Clientes**: Ve a "Clientes" → "+ Nuevo Cliente"
   - Nombre: Juan Pérez
   - Email: juan@example.com
   - Teléfono: 3001234567
   - Cédula: 1234567890
   - Dirección: Calle 1 #123
   - Ciudad: Bogotá

2. **Productos**: Ve a "Productos" → "+ Nuevo Producto"
   - Nombre: Laptop
   - Descripción: Laptop de última generación
   - Precio: 1200000
   - Cantidad: 10
   - SKU: LAPTOP-001
   - Categoría: Electrónica

3. **Facturas**: Ve a "Crear Factura"
   - Selecciona el cliente
   - Agrega el producto
   - Revisa el total con IVA 19%
   - Crea y descarga el PDF

## Troubleshooting

### Error: "Cannot find module 'express'"
```bash
cd backend
npm install
```

### Error: "ECONNREFUSED - base de datos"
1. Verifica que PostgreSQL esté ejecutándose: `psql -U postgres`
2. Verifica las credenciales en `.env`
3. Asegúrate de que la base de datos existe: `psql -l`

### Error: "Port 3000 is already in use"
```bash
# En otra terminal:
npm run dev -- -p 3001
```

### Cambiar puerto del Backend
Edita el archivo `backend/.env`:
```
PORT=5001
```

## Estructura Rápida

```
Sistema-Facturacion/
├── backend/            # API REST (Node.js/Express)
│   ├── models/         # Modelos de datos
│   ├── routes/         # Rutas API
│   ├── middleware/     # Middleware
│   └── scripts/        # Scripts SQL
├── frontend/           # UI (Next.js/React)
│   ├── src/
│   │   ├── pages/      # Páginas
│   │   ├── components/ # Componentes
│   │   └── store/      # Estado global
└── docs/              # Documentación
```

## Próximos Pasos

1. Consulta [README.md](./README.md) para documentación completa
2. Revisa [SETUP.md](./SETUP.md) para configuración avanzada
3. Exporta facturas en PDF
4. Analiza reportes de ventas

## Características Principales

✅ Crear facturas profesionales  
✅ Gestionar clientes y productos  
✅ Descargar PDFs  
✅ Ver reportes y analytics  
✅ Control de inventario  

---

**¡Listo! Tu sistema de facturación está en marcha.** 🎉
