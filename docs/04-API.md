# Referencia completa de API

[Índice](00-INDICE.md)

## Convenciones

Base local: `http://localhost:3000/api`. JSON para operaciones normales; `multipart/form-data` para registros y contenidos. La exportación entrega binario XLSX. Las listas no están paginadas y no aceptan filtros de servidor documentados: búsquedas de revisión se hacen en el navegador.

Autenticación: `Authorization: Bearer <token>`. No son cookies de sesión. El middleware extrae el segundo segmento del encabezado sin validar literalmente el prefijo Bearer. Las llamadas públicas no necesitan token.

| Situación | HTTP / respuesta |
| --- | --- |
| Operación correcta | 200, salvo creación 201 |
| Token ausente | 401 `{ "message": "Token requerido" }` |
| Token inválido/expirado | 403 `{ "message": "Token inválido o expirado" }` |
| Rol no autorizado | 403 `{ "message": "No tienes permisos para esta acción" }` |
| Login incorrecto/inactivo | 401 `{ "message": "Credenciales inválidas" }` |
| Estado de revisión inválido | 400 |
| Registro o contenido a editar inexistente | 404 |
| Error SQL/controlador | Generalmente 500 `{ "message": "...", "error": "detalle técnico" }` |

No hay contrato uniforme para errores de Multer, JSON inválido o rutas desconocidas: pueden usar el manejador predeterminado de Express y devolver HTML. Los errores de validación de PostgreSQL suelen llegar como 500, no 400/409.

`pg` puede serializar NUMERIC y BIGINT como cadenas. Por eso `quantity`, sumatorias o `total_points` pueden ser strings; los casts `::int` y conversiones explícitas devuelven números. No asumir que todos los números JSON tienen el mismo tipo.

## Inventario de endpoints

| Método | Ruta con prefijo `/api` | Acceso | Respuesta principal |
| --- | --- | --- | --- |
| POST | `/auth/login` | Público | token, user |
| GET | `/auth/me` | Autenticado | Usuario actual |
| GET | `/public/ranking` | Público | currentPeriod, ranking |
| GET | `/public/stats` | Público | general, status, materials, teams, periods, indicators |
| GET | `/public/points-catalog` | Público | Catálogo completo |
| GET | `/public/content/:category` | Público | Contenido publicado |
| POST | `/recycling` | leader, admin | Registro creado |
| GET | `/recycling/mine` | leader, admin | Historial del usuario |
| GET | `/recycling/pending` | admin | Registros pendientes |
| GET | `/recycling/reviewed` | admin | Registros revisados |
| PATCH | `/recycling/:id/review` | admin | Registro actualizado |
| GET | `/admin/dashboard` | admin | Cuatro contadores |
| GET | `/admin/users` | admin | Usuarios |
| POST | `/admin/users` | admin | Usuario creado |
| GET | `/admin/teams` | admin | Equipos |
| POST | `/admin/teams` | admin | Equipo creado |
| GET | `/admin/periods` | admin | Periodos |
| POST | `/admin/periods` | admin | Periodo creado |
| GET | `/admin/content` | admin | Todos los contenidos |
| POST | `/admin/content` | admin | Contenido creado |
| PUT | `/admin/content/:id` | admin | Contenido actualizado |
| DELETE | `/admin/content/:id` | admin | Mensaje |
| GET | `/admin/export/excel` | admin | Reporte_Ecoamigos.xlsx |

Fuera del prefijo: `GET /` devuelve texto de disponibilidad; `GET /uploads/<archivo>` y `/uploads/content/<archivo>` sirven archivos sin autenticación. No hay endpoint separado `/health`. Las rutas de premios y ganadores fueron retiradas del alcance actual.

## Autenticación

### POST /auth/login

```json
{ "email": "correo@ejemplo.test", "password": "CLAVE_DE_EJEMPLO" }
```

Consulta email exacto; exige cuenta activa; compara `password_hash` con bcrypt. Éxito:

```json
{
  "message": "Inicio de sesión exitoso",
  "token": "JWT_OMITIDO",
  "user": { "id": 1, "name": "Nombre", "email": "correo@ejemplo.test", "role": "leader", "team_id": 2, "team_name": "Equipo" }
}
```

El token contiene `id`, `role`, `email`, `team_id` y claims de tiempo. Dura 8 h. No hay refresh ni recuperación de clave por API. Los cuerpos ausentes o mal tipados no tienen validación completa.

### GET /auth/me

Devuelve `id, name, email, role, team_id, team_name` desde la base. No devuelve hash. No vuelve a comprobar `is_active`; no maneja explícitamente usuario borrado, por lo que puede responder sin objeto en vez de un 404.

## Endpoints públicos

### GET /public/ranking

```json
{
  "currentPeriod": null,
  "ranking": []
}
```

Las listas del ejemplo representan una base vacía. Con datos:

- `currentPeriod`: fila completa de periods activa, primera por start_date DESC e id DESC, o null.
- `ranking[]`: `id, name, dependency, total_points, position`. Incluye equipos sin puntos cuando existe periodo activo. Solo suma aprobados de ese periodo. Empates: nombre ASC y posiciones consecutivas.
La respuesta se limita al periodo vigente y la clasificación. No consulta ni devuelve premios o ganadores.

### GET /public/stats

| Clave | Campos |
| --- | --- |
| general | total_records, total_points, total_quantity |
| status[] | status, total |
| materials[] | material_type, total, total_quantity, total_points |
| teams[] | id, name, dependency, total_records, total_points |
| periods[] | id, name, total_records, total_points |
| indicators | totalQuantity, estimatedTreesSaved, estimatedWaterSaved, estimatedCo2Reduction, estimatedEnergySaved |

Todas las consultas usan todos los estados y periodos. Materiales se ordenan por número de registros descendente; equipos por puntos DESC, registros DESC y nombre ASC; periodos por id DESC. Las categorías de estado ausentes no necesariamente aparecen con cero. Fórmulas y límites: [reglas](06-REGLAS-Y-BACKEND.md).

### GET /public/points-catalog

Array con `id, source_code, group_name, action_name, action_level, points, evidence_required, max_frequency`, ordenado por grupo y acción ASC. No hay agrupación JSON ni filtrado por grupo. `evidence_required` es TEXT en el esquema oficial; verificar compatibilidad antes de migrar una base histórica.

`evidence_required` y `max_frequency` son metadatos descriptivos públicos. La API no los interpreta, no lleva contadores por ventana temporal y no implementa rachas. Su presencia en la respuesta no significa que esas condiciones se validen al registrar o aprobar.

### GET /public/content/:category

Categorías del frontend: `agua`, `energia`, `papel`, `residuos`. Devuelve `id, title, category, type, description, file_url, created_at`, solo status published, orden descendente de creación. Categorías desconocidas no tienen error de validación específico: habitualmente producen `[]`. No devuelve `youtube_url`.

## Registros de reciclaje

### POST /recycling

Usa multipart. Los roles permitidos incluyen admin, pero un admin sin equipo no satisface `team_id NOT NULL` del esquema backend.

| Campo | Uso / normalización |
| --- | --- |
| material_type | papel_carton, plastico, vidrio, metal, organico; trim o null |
| quantity | Valor numérico; SQL histórico exige > 0 |
| unit | Texto; trim o null; UI inicia kg |
| quality_level | alta, media, baja; trim o null |
| criteria_count | Número de criterios marcados; no hay máximo validado en API |
| notes | Opcional; trim y vacío a null |
| period_id | Si no es verdadero, null; no valida que esté activo |
| record_date | Si falta, fecha actual del servidor |
| catalog_group_name | Grupo enviado por compatibilidad; debe coincidir con la referencia derivada por el backend |
| catalog_action_name | Acción enviada por compatibilidad; debe coincidir con la referencia derivada por el backend |
| catalog_action_level | Nivel enviado por compatibilidad; debe coincidir con la referencia derivada por el backend |
| evidence | Archivo opcional; un único campo con ese nombre |

El backend deriva grupo, acción y nivel desde `material_type` y `quantity` con la misma tabla vigente que usa el formulario. Los tres valores recibidos deben coincidir y la identidad resultante debe existir en `points_catalog`; una discrepancia o configuración ausente devuelve 400 con un mensaje controlado. La fila conserva los textos canónicos recuperados del catálogo, no los textos arbitrarios del cliente.

`user_id` y `team_id` salen del JWT; `status` se fija pending; `points_awarded` se fija 0. Los campos `points` o `points_awarded` enviados adicionalmente no se usan. Devuelve 201 y la fila completa de recycling_records. No calcula puntos al crear ni exige evidencia aunque el catálogo la describa.

Evidencia: hasta 20 MiB (20 × 1024 × 1024 bytes); filtro por expresión regular sobre extensión y MIME para jpeg/jpg/png/webp/mp4/mov/avi. Que una extensión esté mencionada no garantiza aceptación de todos sus MIME reales, especialmente MOV/AVI. Archivo final: `/uploads/<timestamp>-<aleatorio>.<extensión>`.

### GET /recycling/mine

Filtra `user_id` del JWT. Devuelve todas las columnas del registro más `period_name`, ordenadas por created_at DESC. Es historial del usuario, no todos los registros de su equipo.

### GET /recycling/pending

Filtra pending. Fila del registro más `leader_name, team_name, period_name`. INNER JOIN a usuarios/equipos, LEFT JOIN a periodo; orden created_at ASC.

### GET /recycling/reviewed

Filtra approved/rejected. Fila del registro más `leader_name, team_name, period_name, reviewer_name`; orden reviewed_at DESC.

### PATCH /recycling/:id/review

```json
{ "status": "approved", "review_notes": "Revisión de ejemplo" }
```

`status` solo admite approved o rejected; otro valor causa 400. ID inexistente: 404. `review_notes` opcional se normaliza a null si vacío. Aprobación consulta catálogo; rechazo fija puntos 0. Guarda reviewed_by desde JWT y reviewed_at NOW(). Devuelve fila completa.

No exige que el estado anterior sea pending. Una nueva llamada puede reemplazar la revisión y recalcular puntos con el catálogo actual. No se conserva una tabla de revisiones anteriores.

## Administración

Todos los siguientes endpoints comparten middleware de token y rol admin.

### GET /admin/dashboard

Objeto `{ "users": 0, "teams": 0, "records": 0, "pending": 0 }`, con números. Los tres primeros son totales de tablas; pending solo cuenta pendientes.

### GET y POST /admin/users

GET devuelve `id, name, email, role, team_name`, por id DESC. No incluye `team_id`, is_active ni hashes.

POST JSON:

```json
{ "name": "Líder de ejemplo", "email": "lider@ejemplo.test", "password": "CLAVE_UNICA", "role": "leader", "team_id": 2 }
```

bcrypt con costo 10; inserta únicamente password_hash; cuenta activa. Para admin fuerza team_id null; para leader utiliza el recibido. Devuelve 201 con `id, name, email, role, team_id`. El límite de 15 usuarios existe solo en UI. No hay PUT/DELETE ni desactivación por API.

### GET y POST /admin/teams

GET: filas completas, name ASC. POST: `{ "name": "Equipo", "dependency": "Dependencia" }`; devuelve fila completa con 201. Errores de unicidad/obligatoriedad dependen de SQL y se responden como 500. No hay edición o eliminación.

### GET y POST /admin/periods

GET: filas completas, start_date DESC. POST:

```json
{ "name": "Periodo de prueba", "start_date": "2026-09-01", "end_date": "2026-09-30", "is_active": true }
```

Enviar booleanos JSON, no cadenas. Si is_active es verdadero desactiva todos los periodos antes de insertar. Devuelve fila completa con 201. No hay transacción, activación de un periodo existente ni validación de orden de fechas.

### GET /admin/content

Todas las filas completas de content_items, incluidos borradores, created_at DESC.

### POST /admin/content y PUT /admin/content/:id

Multipart con `title, category, type, description, status` y archivo opcional `file`.

- UI usa category agua/energia/papel/residuos; type text/image/video/file; status draft/published.
- POST establece status published si falta y created_by desde JWT; devuelve 201 y fila completa.
- PUT espera los campos completos; devuelve 404 si no existe y 200 con fila completa al actualizar.
- POST sin archivo guarda file_url null; PUT sin archivo mantiene el anterior.
- El nombre almacenado es `<timestamp>-<nombre original>` en uploads/content.
- No hay límite de tamaño ni filtro de tipo de archivos en este Multer. La restricción `accept` de la UI no protege la API.
- PUT no borra el archivo sustituido, no cambia created_at/created_by y no ofrece eliminación aislada del adjunto.

### DELETE /admin/content/:id

Elimina la fila. Devuelve `{ "message": "Contenido eliminado correctamente" }`, incluso si el ID no existía. No elimina el archivo físico.

### GET /admin/export/excel

Sin body ni parámetros de filtro implementados. MIME `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`; Content-Disposition attachment; filename `Reporte_Ecoamigos.xlsx`. Incluye todos los estados y periodos. Columnas y alcance en [reglas](06-REGLAS-Y-BACKEND.md).

## Ejemplos PowerShell

Solo ejecutar escrituras sobre un entorno de prueba autorizado. No pegar tokens ni contraseñas en incidencias.

```powershell
$credencial = Get-Credential -Message 'Correo y contraseña de Ecoamigos'
$body = @{ email = $credencial.UserName; password = $credencial.GetNetworkCredential().Password } | ConvertTo-Json
$sesion = Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/auth/login' -ContentType 'application/json' -Body $body
$cabeceras = @{ Authorization = "Bearer $($sesion.token)" }
Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/me' -Headers $cabeceras
Invoke-RestMethod -Uri 'http://localhost:3000/api/recycling/mine' -Headers $cabeceras
```

Con cuenta admin, exportar fuera del repositorio:

```powershell
$destinoReporte = Join-Path $env:TEMP 'Reporte_Ecoamigos.xlsx'
Invoke-WebRequest -Uri 'http://localhost:3000/api/admin/export/excel' -Headers $cabeceras -OutFile $destinoReporte
Remove-Variable body, credencial, sesion, cabeceras
```

Para multipart en Windows PowerShell 5.1, utilizar el formulario web o un cliente HTTP que maneje multipart; `Invoke-RestMethod -Form` pertenece a versiones posteriores de PowerShell. No fijar manualmente un boundary incorrecto.
