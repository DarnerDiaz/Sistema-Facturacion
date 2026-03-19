# Cómo empujar a GitHub

Tu proyecto ya tiene un repositorio Git inicializado localmente. Sigue estos pasos para subirlo a GitHub:

## 1. Crear repositorio en GitHub

1. Ve a [github.com](https://github.com) y accede a tu cuenta
2. Haz clic en **"+"** > **"New repository"** en la esquina superior derecha
3. Configura:
   - **Repository name:** `Sistema-Facturacion`
   - **Description:** `Full-stack billing system with Next.js, Node.js, and PostgreSQL`
   - **Public** o **Private** (según prefieras)
   - **NO inicialices** con README, .gitignore o LICENSE (ya tiene)
4. Haz clic en **"Create repository"**

## 2. Agregar remote y empujar

Una vez creado el repositorio, copia el HTTPS URL (ej: `https://github.com/tu-usuario/Sistema-Facturacion.git`)

Luego ejecuta en PowerShell (en la carpeta del proyecto):

```powershell
cd "d:/Proyectos Programación/Sistema-Facturacion"

# Agregar el remote
git remote add origin https://github.com/tu-usuario/Sistema-Facturacion.git

# Renombrar rama a "main" (opcional, pero recomendado)
git branch -M main

# Empujar
git push -u origin main
```

## 3. Verificar

- Ve a tu repositorio en GitHub
- Deberías ver todos los archivos del proyecto
- El historial de commits mostrará el "Initial commit"

## Próximas veces

Después del primer push, para futuros cambios simplemente usa:

```powershell
git add .
git commit -m "Tu mensaje de cambios"
git push
```

---

**Nota:** Si tienes 2FA habilitado en GitHub, usa un [Personal Access Token](https://github.com/settings/tokens) en lugar de contraseña.
