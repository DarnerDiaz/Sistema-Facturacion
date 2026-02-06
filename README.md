# Sistema de Facturación Moderno

Un sistema completo de facturación empresarial construido con tecnologías modernas y profesionales.

## 🚀 Características

- ✅ **Autenticación JWT** - Seguridad en la API
- ✅ **Gestión de Clientes** - Crear, editar y eliminar clientes
- ✅ **Catálogo de Productos** - Control de inventario en tiempo real
- ✅ **Generación de Facturas** - Crear facturas profesionales
- ✅ **Descarga de PDF** - Descargar facturas en formato PDF
- ✅ **Reportes Detallados**:
  - Ventas por mes
  - Top productos vendidos
  - Top clientes
  - Inventario bajo stock
- ✅ **Dashboard Interactivo** - Panel de control con estadísticas
- ✅ **Interfaz Moderna** - Diseño responsive con Tailwind CSS

## 📚 Stack Tecnológico

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos
- **JWT** - Autenticación
- **PDFKit** - Generación de PDFs
- **Joi** - Validación de datos

### Frontend
- **Next.js** - Framework React
- **React** - Librería UI
- **Tailwind CSS** - Estilos
- **Zustand** - State management
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios

## 🛠️ Instalación

### Requisitos Previos
- Node.js 16+
- PostgreSQL 12+
- npm o yarn

### Pasos de Instalación

#### 1. Clonar o descargar el proyecto
```bash
cd Sistema-Facturacion
```

#### 2. Configurar Backend
```bash
cd backend
cp .env.example .env
# Editar .env con tus valores
npm install
```

#### 3. Configurar Base de Datos
```bash
# Crear base de datos
createdb facturacion_db

# Ejecutar migrations
psql -U postgres -d facturacion_db -f scripts/init_db.sql
```

#### 4. Inicicar Backend
```bash
npm run dev
```

El backend estará disponible en: `http://localhost:5000`

#### 5. Configurar Frontend
```bash
cd ../frontend
npm install
```

#### 6. Iniciar Frontend
```bash
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

## 📖 Uso del Sistema

### 1. Registro e Inicio de Sesión
- Ir a `http://localhost:3000`
- Crear una nueva cuenta
- Iniciar sesión con tus credenciales

### 2. Configuración Inicial
1. **Crear Clientes**: Ve a "Clientes" y agrega tus clientes
2. **Crear Productos**: Ve a "Productos" y registra tu catálogo
3. **Crear Facturas**: Ve a "Crear Factura" para generar nuevas facturas

### 3. Generar Facturas
1. Selecciona un cliente
2. Agrega productos con cantidades
3. Revisa el resumen con IVA incluido
4. Crea la factura
5. Descarga el PDF

### 4. Reportes
- **Ventas por Mes**: Análisis de ventas mensuales
- **Top Productos**: Productos más vendidos
- **Top Clientes**: Clientes con mayor gasto
- **Bajo Stock**: Alerta de productos con stock bajo

## 🔑 Variables de Entorno

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=facturacion_db
DB_USER=postgres
DB_PASSWORD=tu_password

NODE_ENV=development
PORT=5000

JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=7d

API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

## 📊 Estructura de Base de Datos

### Tablas Principales
- **usuarios** - Usuarios registrados
- **clientes** - Clientes de la empresa
- **productos** - Catálogo de productos
- **facturas** - Facturas emitidas
- **factura_items** - Detalles de cada factura

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación JWT
- Validación de datos con Joi
- CORS configurado
- Helmet para headers de seguridad

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/registro` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión

### Clientes
- `GET /api/clientes` - Listar clientes
- `POST /api/clientes` - Crear cliente
- `PUT /api/clientes/:id` - Actualizar cliente
- `DELETE /api/clientes/:id` - Eliminar cliente

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto

### Facturas
- `GET /api/facturas` - Listar facturas
- `POST /api/facturas` - Crear factura
- `GET /api/facturas/:id/pdf` - Descargar PDF
- `PATCH /api/facturas/:id/estado` - Cambiar estado

### Reportes
- `GET /api/reportes/ventas/por-mes` - Ventas mensuales
- `GET /api/reportes/productos/top-vendidos` - Top productos
- `GET /api/reportes/clientes/top-compradores` - Top clientes
- `GET /api/reportes/inventario/bajo-stock` - Bajo stock

## 🚀 Despliegue

### En la Nube (Vercel/Heroku)

#### Vercel (Frontend)
1. Push a GitHub
2. Conectar a Vercel
3. Configurar variables de entorno
4. Deploy automático

#### Heroku (Backend)
1. Crear app en Heroku
2. Agregar PostgreSQL add-on
3. Configurar variables de entorno
4. Deploy con Git

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para más detalles.

## 🆘 Soporte

Para reportar problemas o hacer preguntas, por favor abre un issue en GitHub.

## ✨ Roadmap

- [ ] Integración de pagos (Stripe, PayPal)
- [ ] Envío de facturas por correo
- [ ] Multi-moneda
- [ ] Exportación a Excel
- [ ] App móvil
- [ ] Notificaciones en tiempo real
- [ ] Firma digital de facturas

---

**Desarrollado con ❤️ para pequeños y medianos negocios**
