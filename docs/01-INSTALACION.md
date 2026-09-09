# Instalación y configuración

[Índice](00-INDICE.md)

## 1. Requisitos

| Requisito | Detalle |
| --- | --- |
| Node y npm | Vite requiere Node 20.19+ o 22.12+ en las líneas indicadas por su documentación. Se encontró Node 24.13.0 y npm 11.6.2 en esta revisión. |
| PostgreSQL | Servidor TCP en 5432 y cliente `psql`. Se encontró cliente 18.1; no se confirmó el servidor. |
| Git | Clonación y publicación |
| Red | Dependencias, fuentes Google y enlaces externos |
| Disco persistente | PostgreSQL, uploads y logs |

Requisitos publicados: [Vite](https://vite.dev/guide/). Verificar bcrypt al instalar en otra plataforma, ya que utiliza componentes nativos.

```powershell
node --version
npm --version
git --version
psql --version
```

Si falta `psql` en PATH, usar la ruta de instalación, por ejemplo `& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' --version`.

## 2. Código y dependencias

Omitir clonación si ya tienes este proyecto:

```powershell
git clone https://github.com/oscarprada/ecoamigos-web.git
Set-Location ecoamigos-web
npm --prefix backend ci
npm --prefix frontend ci
```

Clonar exige acceso al remoto, no verificado en esta revisión. `npm ci` usa cada lockfile y reemplaza el `node_modules` correspondiente. Si hay discrepancias, revisar manifiesto y lockfile antes de regenerarlos. No hay workspaces ni script de arranque raíz; ExcelJS raíz es redundante para las aplicaciones.

## 3. Variables de entorno

No sobrescribir archivos existentes:

```powershell
if (-not (Test-Path backend/.env)) {
  Copy-Item backend/.env.example backend/.env
}
if (-not (Test-Path frontend/.env)) {
  Copy-Item frontend/.env.example frontend/.env
}
```

Editar `backend/.env`:

```dotenv
PORT=3000
CLIENT_URL=http://localhost:5173
JWT_SECRET=REEMPLAZAR_POR_SECRETO_ALEATORIO_LARGO
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=REEMPLAZAR_CLAVE_POSTGRESQL
DB_NAME=ecoamigos
```

Generar un secreto y guardarlo solo en `.env`, sin compartir la salida:

```powershell
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

| Variable | Comportamiento real |
| --- | --- |
| `PORT` | Servidor Express; respaldo 3000 |
| `JWT_SECRET` | Firma y verificación JWT; sin respaldo |
| `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Configuración de `pg.Pool` |
| `CLIENT_URL` | Declarada, pero no utilizada por el CORS actual |
| `VITE_API_URL` | URL pública frontend; respaldo `http://localhost:3000/api`; debe terminar en `/api` |
| `DATABASE_URL`, `DB_PORT` | No consumidas; PostgreSQL usa puerto fijo 5432 |

Editar `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:3000/api
```

Las variables `VITE_*` son públicas y quedan en el build. Reiniciar desarrollo tras cambiar entorno; reconstruir frontend para cambiar la URL compilada.

## 4. Base existente o nueva

**Esquema oficial único: [database/schema.sql](../database/schema.sql).** Las otras rutas SQL son entradas de compatibilidad con \ir y no definen tablas alternativas. Para una base vacía:

```powershell
psql -X -h localhost -U postgres -d postgres -v ON_ERROR_STOP=1 -c 'CREATE DATABASE ecoamigos;'
psql -X -h localhost -U postgres -d ecoamigos -f database/schema.sql
```

No ejecutar sobre una base existente. Respaldar e inspeccionar con [inspect_existing.sql](../database/inspect_existing.sql); resolver la migración manualmente según [database/README.md](../database/README.md). No se eliminan columnas ni datos existentes automáticamente.

## 5. Primer administrador

No hay usuario o contraseña por defecto. El seed histórico ya no inserta datos. Seguir el procedimiento de [primer administrador](../database/README.md): generar bcrypt mediante backend/scripts/hash-password.js con una clave propia y ejecutar database/create_admin.sql con nombre, correo y hash explícitos. El único campo almacenado es password_hash. Un correo repetido aborta sin modificar la cuenta.

## 6. Catálogo

El CSV histórico conserva sus 56 filas originales y evidencia descriptiva. El esquema usa evidence_required TEXT. Importación optativa desde la raíz:

```powershell
psql -X -h localhost -U postgres -d ecoamigos -f database/import_points_catalog.sql
```

Repetir el archivo no duplica ni actualiza filas; duplicados/conflictos abortan la transacción. No contiene Dependencias institucionales: sus valores deben ser autorizados por los responsables. No se renombran grupos ni se inventan puntos.

## 7. Directorios y arranque

```powershell
New-Item -ItemType Directory -Force backend/uploads/content | Out-Null
```

El middleware de evidencia crea `uploads`; el de contenido no crea `uploads/content`. El directorio de trabajo del backend debe ser `backend`.

Terminal 1:

```powershell
Set-Location backend
npm run dev
```

Terminal 2, desde la raíz:

```powershell
Set-Location frontend
npm run dev
```

Abrir `http://localhost:5173`. CORS admite solo ese origen: `127.0.0.1`, otro puerto o un dominio son diferentes.

## 8. Verificar

```powershell
Invoke-WebRequest http://localhost:3000/
Invoke-RestMethod http://localhost:3000/api/public/ranking
Invoke-RestMethod http://localhost:3000/api/public/points-catalog
npm --prefix frontend run build
```

La raíz comprueba Express, no PostgreSQL. Una consulta pública comprueba solo las tablas utilizadas por ella. Iniciar sesión, crear equipo, periodo activo y líder con equipo antes de ensayar reciclaje. Usar la [matriz funcional](09-CALIDAD-Y-PENDIENTES.md).

## 9. Build y preview

```powershell
npm --prefix frontend run build
npm --prefix frontend run preview
```

`preview` suele usar otro puerto y CORS puede bloquear su API. Es una vista local del build, no hosting productivo. El backend no compila: `npm start`, ejecutado dentro de `backend`, inicia Node.
