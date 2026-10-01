# Instalación y configuración

[Índice](00-INDICE.md)

## 1. Requisitos

| Requisito | Detalle |
| --- | --- |
| Node y npm | Usar Node 22.12+ o 24: file-type 22.1.0 exige Node >=22 y Vite requiere 22.12+ en esa línea. Se encontró Node 24.13.0 y npm 11.6.2 en esta revisión. |
| PostgreSQL | Servidor TCP (5432 por defecto, DB_PORT configurable) y cliente `psql`. Referencia de regresión local registrada: PostgreSQL 18.1; CI usa 18. Esta consolidación no consulta el servidor de aplicación. |
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
DB_PORT=5432
DB_SSL=false
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
| `CLIENT_URL` | Un origen frontend exacto para enlaces F16, CORS con credentials y validación CSRF |
| `VITE_API_URL` | URL pública frontend; respaldo `http://localhost:3000/api`; debe terminar en `/api` |
| `DATABASE_URL` | Si no está vacía, prevalece sobre las cinco variables DB_* de conexión; URL postgres/postgresql sin query ni fragmento |
| `DB_PORT`, `DB_SSL` | Puerto 1–65535, respaldo 5432; SSL false/true, true verifica certificado |
| `LOG_DIR`, `LOG_MAX_BYTES`, `LOG_MAX_FILES`, `LOG_QUEUE_LIMIT` | logs; 5242880 bytes por archivo; cinco archivos rotados; cola de 1000 eventos |

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

No ejecutar sobre una base existente. Respaldar e inspeccionar con [inspect_existing.sql](../database/inspect_existing.sql); resolver la migración manualmente según [database/README.md](../database/README.md). No se eliminan columnas ni datos existentes automáticamente. D01/F09/F16/S01 ya cuentan con aplicación y verificación en el PostgreSQL local de desarrollo/QA del proyecto, según evidencia informada; eso no describe producción institucional ni autoriza repetir scripts. La guía distingue base nueva de adopción en otra instalación.

## 5. Primer administrador

No hay usuario o contraseña por defecto. El seed histórico ya no inserta datos. Seguir el procedimiento de [primer administrador](../database/README.md): generar bcrypt mediante backend/scripts/hash-password.js con una clave propia y ejecutar database/create_admin.sql con nombre, correo y hash explícitos. El único campo almacenado es password_hash. Un correo repetido aborta sin modificar la cuenta.

## 6. Catálogo

El CSV histórico conserva sus 56 filas originales y evidencia descriptiva. El esquema usa evidence_required TEXT. Importación optativa desde la raíz:

```powershell
psql -X -h localhost -U postgres -d ecoamigos -f database/import_points_catalog.sql
```

Repetir el archivo no duplica ni actualiza filas; duplicados/conflictos abortan la transacción. No contiene Dependencias institucionales: sus valores deben ser autorizados por los responsables. No se renombran grupos ni se inventan puntos.

## 7. Directorios y arranque

Los dos flujos crean sus directorios privados bajo UPLOAD_ROOT; no es necesario crear uploads/content para cargas nuevas. El directorio de trabajo del backend debe ser `backend`.

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

Abrir `http://localhost:5173`. CLIENT_URL admite por defecto solo ese origen: `127.0.0.1`, otro puerto o un dominio son diferentes.

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


S01: para bases existentes aplicar la migración incremental de session_version antes de iniciar el backend actualizado; instrucciones en [Operación](08-OPERACION.md). Configuración nueva de CORS y límites de autenticación en backend/.env.example. No usar schema.sql sobre datos existentes.


## Archivos — S04–S07

Instalar backend con su lockfile actualizado (file-type 22.1.0, ESM). Configurar UPLOAD_ROOT como directorio persistente privado; por defecto uploads relativo al proceso backend. Las carpetas managed/content y managed/evidence se crean al recibir cargas nuevas. No configurar ningún servidor/proxy para servir este directorio como estático. No se requiere migración SQL ni mover adjuntos existentes.

Límites técnicos configurables, no política institucional: imágenes 10 MiB, documentos 20 MiB y videos de contenido 100 MiB; evidencia conserva techo total de 20 MiB (imágenes hasta 10 MiB). Un archivo por solicitud, 24 campos de hasta 64 KiB y 25 partes multipart. Nombres UUID generados por servidor con extensión canónica, escritura exclusiva sin sobrescritura.

Variables UPLOAD_IMAGE_MB, UPLOAD_DOCUMENT_MB, UPLOAD_VIDEO_MB y UPLOAD_EVIDENCE_MB: enteros positivos de 1 a 500; unidades MiB. Revisar permisos de escritura del proceso y cuotas de disco. Los tests usan un UPLOAD_ROOT temporal y no tocan los archivos instalados.


Configuración S08–S10: ver los contratos completos de [operación](08-OPERACION.md). Mantener CLIENT_URL=http://localhost:5173, PORT=3000 y DB_SSL=false para el desarrollo local. La institución definirá después despliegue, dominios y TLS; no hay proveedor seleccionado ni despliegue ejecutado.


## Verificación reproducible S12

Tras npm ci --prefix backend y npm ci --prefix frontend, configurar ECOAMIGOS_TEST_PG_BIN y ejecutar npm test, npm run check y npm run build desde raíz. Los scripts internos son Node multiplataforma; [operación](08-OPERACION.md) detalla Windows/Linux y aislamiento. No ejecutar las pruebas contra una base existente. yaml 2.9.1 se usa solo para validar el workflow; plugin React 5.2.0 corrige el conflicto de peers con Vite 8. CI implementado y validado: segundo run f21b2a6 SUCCESS informado desde GitHub Actions. S12 permanece PARCIAL exclusivamente por [riesgos de dependencias](13-AUDITORIA-DEPENDENCIAS-S12.md). EXPORT_MAX_ROWS=1000 limita la exportación, con rango 1–10000 y rechazo explícito del exceso.

## Registro central de configuración

Los valores son técnicos, no decisiones institucionales. [Operación](08-OPERACION.md) es la fuente de límites y comportamiento detallado; las plantillas son backend/.env.example y frontend/.env.example.

| Variables | Contrato |
| --- | --- |
| NODE_ENV | production exige origen explícito CORS y HTTPS para enlaces de recuperación; test pertenece a pruebas |
| PORT, JWT_SECRET | Puerto Express con respaldo 3000; secreto JWT sin respaldo, nunca público |
| CLIENT_URL, CORS_ORIGINS | CLIENT_URL único; CORS_ORIGINS debe omitirse o coincidir; credentials y cookie HttpOnly |
| DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME | Conexión local; puerto 5432 por omisión, resto requerido |
| DATABASE_URL, DB_SSL | URL no vacía prevalece; sin query/fragmento; SSL false/true, true verifica certificado |
| TRUSTED_PROXIES | Vacío: IP directa; declarar solo proxies autorizados |
| AUTH_WINDOW_MS, AUTH_LOGIN_MAX, AUTH_FORGOT_MAX, AUTH_RESET_MAX | 900000 ms y 10/5/10; enteros positivos, por IP/endpoint/proceso |
| UPLOAD_ROOT | Raíz privada, uploads relativa al cwd; usar ruta absoluta en infraestructura futura |
| UPLOAD_IMAGE_MB, UPLOAD_DOCUMENT_MB, UPLOAD_VIDEO_MB, UPLOAD_EVIDENCE_MB | 10/20/100/20 MiB; enteros 1–500; evidencia también respeta el límite de categoría |
| LOG_DIR, LOG_MAX_BYTES, LOG_MAX_FILES, LOG_QUEUE_LIMIT | logs, 5242880 bytes, 5 rotados, 1000 eventos; rangos en Operación |
| EXPORT_MAX_ROWS | 1000, entero 1–10000; inválido no habilita exportación ilimitada |
| VITE_API_URL | Pública y compilada, respaldo http://localhost:3000/api |
| ECOAMIGOS_TEST_PG_BIN | Solo pruebas; directorio de initdb/pg_ctl/psql/createdb/postgres 18 compatibles |

No configurar NODE_TLS_REJECT_UNAUTHORIZED=0: se rechaza. No hay variables SMTP, cookies o CSRF implementadas. CI/GITHUB_ACTIONS/GITHUB_STEP_SUMMARY y POSTGRES_* del workflow pertenecen al runner/servicio efímero, no a la configuración institucional de aplicación. Las variables de pruebas no deben apuntar a una BD existente.


### Actualización S02 — 2026-09-30

Sesión S02: JWT HS256 de ocho horas en cookie ecoamigos_session, HttpOnly, SameSite=Lax, Path=/api, sin Domain; Secure cuando NODE_ENV=production. El body de login ya no contiene JWT. Frontend y API deben compartir sitio y esquema (localhost con distintos puertos en desarrollo; HTTPS bajo el mismo sitio en producción). No se soporta automáticamente un frontend en un sitio distinto; no cambiar a SameSite=None sin revisar despliegue y pruebas. CLIENT_URL es el único origen permitido para CORS y CSRF. Fuera de producción, si falta, se usa http://localhost:5173; en producción es obligatorio un origen HTTPS exacto. No se admiten wildcard, lista, ruta, credenciales ni slash final. CORS_ORIGINS es una variable heredada: retirarla o mantenerla idéntica a CLIENT_URL; otro valor detiene el arranque. Axios y CORS habilitan credenciales. Los métodos mutantes exigen Origin igual a CLIENT_URL y X-Ecoamigos-Request: 1, incluso login, logout y recuperación. Logout no cambia las reglas de revocación S01: reset incrementa session_version y las peticiones siguientes rechazan cualquier JWT anterior. Se conservan autorización y límites S03. Ver evidencia de pruebas y decisión CSRF en [09](09-CALIDAD-Y-PENDIENTES.md).
