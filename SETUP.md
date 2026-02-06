# 🔧 SETUP AVANZADO - Sistema de Facturación

Guía de instalación y configuración detallada.

## Índice
1. [Instalación Backend](#instalación-backend)
2. [Instalación Frontend](#instalación-frontend)
3. [Configuración PostgreSQL](#configuración-postgresql)
4. [Variables de Entorno](#variables-de-entorno)
5. [Deployments](#deployments)
6. [Scripts Útiles](#scripts-útiles)

## Instalación Backend

### Paso 1: Preparar Entorno
```bash
cd backend
npm init -y  # Si no existe package.json
```

### Paso 2: Instalar Dependencias
```bash
npm install express pg dotenv cors jsonwebtoken bcryptjs joi pdfkit uuid express-async-errors helmet
npm install --save-dev nodemon jest supertest
```

### Paso 3: Crear Archivo .env
```bash
cp .env.example .env
```

Edita `.env` con tus valores:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=facturacion_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña_segura
NODE_ENV=development
PORT=5000
JWT_SECRET=tu_clave_super_segura_aqui_min_32_chars
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### Paso 4: Verificar Variables
```bash
# En Node REPL:
node
> require('dotenv').config()
> process.env.DB_HOST
'localhost'
```

## Instalación Frontend

### Paso 1: Instalar Node y npm
```bash
# Verificar versión
node --version  # Debe ser 16+
npm --version   # Debe ser 8+
```

### Paso 2: Crear Estructura de Proyecto Next.js
```bash
cd frontend
npm install
```

### Paso 3: Instalar Dependencias
```bash
npm install axios react-hook-form zustand tailwindcss autoprefixer postcss date-fns lucide-react
npm install --save-dev next@latest react@latest react-dom@latest
```

### Paso 4: Crear .env.local
```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Configuración PostgreSQL

### Instalación en Windows

```bash
# 1. Descargar e instalar PostgreSQL desde:
# https://www.postgresql.org/download/windows/

# 2. Durante instalación:
# - Usuario: postgres
# - Contraseña: (la que configures)
# - Puerto: 5432

# 3. Verificar instalación
psql --version
```

### Instalación en macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Instalación en Linux (Ubuntu)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

### Crear Base de Datos

```bash
# Conectar a PostgreSQL
psql -U postgres

# En el prompt de psql:
CREATE DATABASE facturacion_db;
CREATE USER app_user WITH PASSWORD 'password123';
ALTER ROLE app_user SET client_encoding TO 'utf8';
ALTER ROLE app_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE app_user SET default_transaction_deferrable TO on;
ALTER ROLE app_user SET default_time_zone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE facturacion_db TO app_user;
\q
```

### Ejecutar Schema
```bash
psql -U app_user -d facturacion_db -f backend/scripts/init_db.sql

# Verificar tablas creadas
psql -U app_user -d facturacion_db
\dt
```

## Variables de Entorno

### Backend (.env)
```properties
# DATABASE
DB_HOST=localhost
DB_PORT=5432
DB_NAME=facturacion_db
DB_USER=postgres
DB_PASSWORD=tu_contraseña

# SERVER
NODE_ENV=development|production
PORT=5000

# JWT
JWT_SECRET=tu_clave_ultra_segura_minimo_32_caracteres
JWT_EXPIRES_IN=7d

# URLS
API_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```properties
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Sistema de Facturación
```

## Deployments

### Opción 1: Deploy Backend a Heroku

```bash
# 1. Instalar Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# 2. Login
heroku login

# 3. Crear app
heroku create tu-app-nombre

# 4. Agregar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# 5. Ver variables de entorno
heroku config

# 6. Configurar variables
heroku config:set JWT_SECRET=tu_clave_segura
heroku config:set NODE_ENV=production

# 7. Deploy
git push heroku main

# 8. Ver logs
heroku logs --tail
```

### Opción 2: Deploy Frontend a Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Login
vercel login

# 3. Deploy
cd frontend
vercel

# 4. Configurar variables en dashboard de Vercel
# NEXT_PUBLIC_API_URL=https://tu-backend.herokuapp.com/api

# 5. Redeploy
vercel --prod
```

### Opción 3: Deploy en VPS (DigitalOcean/AWS)

```bash
# Backend
ssh root@tu_ip_vps
cd /var/www
git clone tu_repo
cd Sistema-Facturacion/backend
npm install
npm start

# Frontend
cd /var/www
cd Sistema-Facturacion/frontend
npm install
npm run build
npm start
```

## Scripts Útiles

### Package.json Backend
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "migrations": "node scripts/migrate.js",
    "seed": "node scripts/seed.js"
  }
}
```

### Package.json Frontend
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export"
  }
}
```

### Scripts SQL Útiles

```sql
-- Backup
pg_dump -U postgres facturacion_db > backup.sql

-- Restore
psql -U postgres facturacion_db < backup.sql

-- Ver estadísticas
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) 
FROM pg_tables;

-- Limpiar datos de prueba
DELETE FROM factura_items;
DELETE FROM facturas;
DELETE FROM clientes;
DELETE FROM productos;
DELETE FROM usuarios;
```

## Troubleshooting

### Backend no se conecta a BD
```bash
# Verificar conexión PostgreSQL
psql -U postgres -h localhost -p 5432

# Ver variable DB_HOST en .env
# Por defecto debe ser: localhost (sin http://)
```

### Puerto en uso
```bash
# Verificar puerto 5000
netstat -ano | findstr :5000  # Windows
sudo lsof -i :5000            # macOS/Linux

# Cambiar puerto en .env
PORT=5001
```

### CORS Error
```bash
# En backend, verificar middleware CORS
# Asegurar que FRONTEND_URL coincida con el cliente
```

## Verificación Final

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Debe mostrar: 🚀 Servidor iniciado en puerto 5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Debe mostrar: ▲ Next.js 14.0.0

# Terminal 3 - Probar API
curl http://localhost:5000/health
# Resultado:
# {"status":"OK","timestamp":"2024-02-06T..."}
```

---

**✅ Si todo funciona, tu sistema está listo para desarrollo.**
