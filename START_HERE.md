# 🎯 START HERE - Primeros Pasos

**¡Bienvenido! Esta guía te ayudará a iniciar el sistema de facturación en minutos.**

## 📋 Qué obtuviste

He creado un **sistema de facturación profesional y moderno** completamente funcional con:

### ✨ Características
- 🔐 **Autenticación Segura** - JWT + bcrypt
- 👥 **Gestión de Clientes** - CRUD completo
- 📦 **Catálogo de Productos** - Control de inventario
- 📄 **Facturas Profesionales** - Con PDF descargable
- 📊 **Reportes Completos** - Análisis de ventas
- 🎨 **UI Moderna** - Responsive y profesional

### 🛠️ Tecnologías
- **Backend**: Node.js + Express + PostgreSQL
- **Frontend**: Next.js + React + Tailwind CSS
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT

---

## 🚀 Inicio Rápido (5 minutos)

### 1️⃣ Configura PostgreSQL
```bash
# Windows: Descarga desde https://www.postgresql.org/download/windows/
# macOS:  brew install postgresql@15
# Linux:  sudo apt install postgresql

# Crear base de datos
createdb facturacion_db

# Ejecutar schema
psql -U postgres -d facturacion_db -f backend/scripts/init_db.sql
```

### 2️⃣ Inicia Backend
```bash
cd backend
cp .env.example .env
# Edita .env si es necesario (cambiar DB_PASSWORD)
npm install
npm run dev
```

### 3️⃣ Inicia Frontend (en otra terminal)
```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ Abre en el navegador
- Frontend: **http://localhost:3000** 👈 aquí va
- Backend: **http://localhost:5000** (acceso a API)

### 5️⃣ Registra una cuenta
- Email: `test@example.com`
- Contraseña: `password123` (o la que quieras)

---

## 📂 Documentación

Consulta estos archivos según necesites:

| Archivo | Para qué |
|---------|----------|
| **[README.md](./README.md)** | Documentación completa y de referencia |
| **[QUICKSTART.md](./QUICKSTART.md)** | Guía rápida (10 minutos) |
| **[SETUP.md](./SETUP.md)** | Setup avanzado y troubleshooting |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Entender cómo funciona |
| **[COMPLETION_CHECKLIST.md](./COMPLETION_CHECKLIST.md)** | Qué está hecho |

---

## 🎯 Próximos Pasos

### 1. Crear Datos de Prueba
- Ve a **Clientes** y agrega un cliente
- Ve a **Productos** y crea algunos productos
- Ve a **Crear Factura** y genera una factura

### 2. Probar Características
- [ ] Descargar factura en PDF
- [ ] Ver reportes
- [ ] Cambiar estado de factura
- [ ] Agregar más clientes y productos

### 3. Personalizar (Opcional)
- Cambiar colores en `frontend/tailwind.config.js`
- Cambiar nombre en componentes
- Modificar estructura según necesites

### 4. Deploy (Cuando esté listo)
- **Backend**: Heroku, DigitalOcean, AWS, Railway
- **Frontend**: Vercel, Netlify
- Ver instrucciones en [SETUP.md](./SETUP.md)

---

## ⚡ Comandos Útiles

```bash
# Backend
cd backend
npm run dev          # Desarrollo
npm start            # Producción
npm test             # Tests

# Frontend
cd frontend
npm run dev          # Desarrollo
npm run build        # Build
npm start            # Producción

# BD
psql -U postgres -d facturacion_db  # Conectar a BD
\dt                                # Ver tablas
\q                                 # Salir
```

---

## 🆘 Problemas Comunes

### ❌ "Port already in use"
```bash
# Cambiar puerto en backend/.env
PORT=5001

# O cambiar frontend
npm run dev -- -p 3001
```

### ❌ "Cannot connect to database"
1. Verifica PostgreSQL esté ejecutándose
2. Verificar credenciales en `.env`
3. Verifica que la base de datos existe: `psql -l`

### ❌ "Module not found"
```bash
# En backend y frontend:
rm -rf node_modules
npm install
```

---

## 📞 Estructura del Proyecto

```
Sistema-Facturacion/
├── backend/              # API REST (Express + PostgreSQL)
├── frontend/             # Interfaz (Next.js + React)
├── docs/                 # Documentación adicional
├── README.md             # Documentación completa
├── QUICKSTART.md         # Guía rápida
├── SETUP.md              # Setup avanzado
├── ARCHITECTURE.md       # Arquitectura
└── START_HERE.md         # Este archivo
```

---

## 🎓 Aprender Más

El código está bien estructurado y comentado. Puedes:

1. **Explorar Backend**
   - `backend/routes/` - Ver cómo funcionan los endpoints
   - `backend/models/` - Lógica de negocios
   - `backend/middleware/` - Seguridad y validación

2. **Explorar Frontend**
   - `frontend/src/pages/` - Diferentes vistas
   - `frontend/src/components/` - Componentes reutilizables
   - `frontend/src/store/` - Manejo de estado

---

## ✅ Checklist de Inicio

- [ ] PostgreSQL instalado y ejecutándose
- [ ] Backend iniciado (`npm run dev`)
- [ ] Frontend iniciado (`npm run dev`)
- [ ] Navegador en `http://localhost:3000`
- [ ] Registro completado
- [ ] Login exitoso
- [ ] Dashboard visible
- [ ] Primer cliente creado
- [ ] Primer producto creado
- [ ] Primera factura creada

---

## 🎉 ¡Listo!

Tu sistema de facturación está completo y funcionando. 

**Próximas mejoras que puedes hacer:**
- Agregar más reportes
- Integración de pagos
- Envío de facturas por email
- Exportación a Excel
- App móvil

---

## 📧 Soporte

Para reportar problemas o sugerencias, consulta la documentación:
- [README.md](./README.md) - Documentación general
- [SETUP.md](./SETUP.md) - Troubleshooting

---

**Desarrollado con ❤️ para tu negocio**
