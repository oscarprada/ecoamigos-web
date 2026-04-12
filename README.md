# Ecoamigos Web

Sistema web completo en JavaScript para la campaña interna **Ecoamigos** de **Parques Nacionales Naturales de Colombia - Dirección Territorial Pacífico**.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: PostgreSQL
- Autenticación: JWT

## Módulos incluidos
- Inicio público con identidad Ecoamigos
- Ranking público, premios y ganadores anteriores
- Login por correo y contraseña
- Panel de líder para registrar reciclaje y consultar historial
- Panel de administración para:
  - crear usuarios (máximo 15)
  - crear equipos
  - crear periodos
  - crear premios
  - gestionar contenidos (incluye enlaces de YouTube)
  - validar registros de reciclaje
- Sistema de puntos y ranking automático

## Sistema de puntos
Fórmula implementada:

`puntos = (base_material × cantidad × multiplicador_calidad) + (criterios_cumplidos × 2)`

Base por material:
- papel_carton: 8
- plastico: 10
- vidrio: 9
- metal: 12
- organico: 6

Multiplicador por calidad:
- alta: 1.4
- media: 1.0
- baja: 0.5

## Estructura
```text
ecoamigos-web/
  backend/
  frontend/
  schema.sql
  README.md
```

## 1. Base de datos
Crear una base llamada `ecoamigos` en PostgreSQL y luego ejecutar:

```sql
\i schema.sql
\i backend/src/seed.sql
```

## 2. Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Variables importantes del `.env`:
- `PORT=3000`
- `CLIENT_URL=http://localhost:5173`
- `JWT_SECRET=change_this_secret`
- `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ecoamigos`

## 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Acceso inicial
Administrador precargado:
- correo: `admin@ecoamigos.local`
- contraseña: `Admin123*`

## Personalización visual
La app ya usa estos lineamientos:
- Verde `#71b956`
- Turquesa `#2cab87`
- Negro `#000000`
- Títulos: Nunito Sans
- Cuerpo: Montserrat
- slogan: `¡Pequeñas acciones, grandes cambios!`

## Mascota PNG
Cuando me pases el PNG, reemplaza el bloque de placeholder en:
- `frontend/src/pages/public/HomePage.jsx`

También puedes guardar la imagen dentro de `frontend/src/assets/` y renderizarla en el hero principal.

## Notas importantes
- La recuperación de contraseña quedó señalada como mejora siguiente. El login y gestión de usuarios ya funcionan.
- Los ganadores anteriores se alimentan desde la tabla `winner_records`.
- El panel de administración está preparado para cargar videos de YouTube mediante URL.
- Para entorno productivo conviene agregar validaciones extra, edición/eliminación completa de CRUD, auditoría y pruebas automatizadas.
