# Referencia completa de API

[Índice](00-INDICE.md)

## Convenciones

Base local: `http://localhost:3000/api`. JSON para operaciones normales; `multipart/form-data` para registros y contenidos. La exportación entrega binario XLSX. Las listas no están paginadas y no aceptan filtros de servidor documentados: búsquedas de revisión se hacen en el navegador.

Autenticación: `Authorization: Bearer <token>`. No son cookies de sesión. El middleware exige el esquema Bearer. Las llamadas públicas no necesitan token.

| Situación | HTTP / respuesta |
| --- | --- |
| Operación correcta | 200, salvo creación 201 |
| Token ausente | 401 `{ "message": "Sesión inválida o expirada" }` |
| Token inválido/expirado | 401 `{ "message": "Sesión inválida o expirada" }` |
| Rol no autorizado | 403 `{ "message": "No tienes permisos para esta acción" }` |
| Login incorrecto/inactivo | 401 `{ "message": "Credenciales inválidas" }` |
| Estado de revisión inválido | 400 |
| Registro o contenido a editar inexistente | 404 |
| Error SQL/controlador | Generalmente 500 `{ "message": "...", "error": "detalle técnico" }` |

El manejador final devuelve JSON genérico ante errores propagados; JSON inválido es 400 y cuerpo excesivo 413. Rutas desconocidas conservan su respuesta existente. Otros controladores que capturan errores por su cuenta requieren auditoría separada. Los errores de validación de PostgreSQL suelen llegar como 500, no 400/409.

`pg` puede serializar NUMERIC y BIGINT como cadenas. Por eso `quantity`, sumatorias o `total_points` pueden ser strings; los casts `::int` y conversiones explícitas devuelven números. No asumir que todos los números JSON tienen el mismo tipo.

## Inventario de endpoints

| Método | Ruta con prefijo `/api` | Acceso | Respuesta principal |
| --- | --- | --- | --- |
| POST | `/auth/login` | Público | token, user |
| GET | `/auth/me` | Autenticado | Usuario actual |
| GET | `/public/ranking` | Público | currentPeriod, ranking |
| GET | `/public/stats` | Público | general, status, materials, teams, periods |
| GET | `/public/points-catalog` | Público | Catálogo completo |
| GET | `/public/content/:category` | Público | Contenido publicado |
| POST | `/recycling` | leader | Registro creado; requiere equipo actual válido |
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

Fuera del prefijo: `GET /` devuelve texto de disponibilidad; las rutas antiguas /uploads ya no sirven archivos. Usar los endpoints por entidad indicados abajo. No hay endpoint separado `/health`. Las rutas de premios y ganadores fueron retiradas del alcance actual.

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

El JWT HS256 contiene `id`, `sv` (session_version), `iat` y `exp`; dura 8 h, sin refresh. No contiene rol/equipo/email. Login valida tipos y límites de email/contraseña; inexistente, inactivo o clave incorrecta reciben 401 con el mismo mensaje. Error interno: 500 genérico sin detalles. JWT antiguos sin sv requieren iniciar sesión otra vez.

### GET /auth/me

Devuelve `id, name, email, role, team_id, team_name` actuales, sin hash ni versión interna. Reutiliza la consulta del middleware. Usuario inexistente/inactivo, JWT inválido/expirado o versión revocada: 401 controlado. Falta de permisos con sesión válida: 403. Fallo de consulta: 500 genérico.

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

F13: `general.total_quantity` y `materials[].total_quantity` representan exclusivamente cantidades aprobadas declaradas en kg: `status = 'approved' AND lower(btrim(unit)) = 'kg'`. Se conservan las claves y los NUMERIC SQL como cadenas decimales. No se convierten litros, gramos, toneladas, unidades, bloques ni textos alternativos como `kilogramos`; no se infiere unidad desde material o catálogo. Los cinco materiales del esquema pueden contribuir si su fila declara kg, incluido orgánico sin interpretar la etiqueta de 5 kg. Materiales con actividad pero sin kg aprobados permanecen con `total_quantity = 0`.

Los conteos `total_records`, `materials[].total` y `status[]` siguen midiendo actividad de todos los estados, y las sumas de puntos conservan su contrato; no se filtran por unidad. No equivalen al total de kg aprobados. Todas estas métricas son históricas, sin filtro de período activo: general/materiales/equipos incluyen también registros sin período; `periods[]` agrupa solo registros asociados a cada período. Materiales se ordenan por número de registros descendente; equipos por puntos DESC, registros DESC y nombre ASC; períodos por id DESC. Las categorías de estado ausentes no necesariamente aparecen con cero.

F14: se retiró el objeto indicators completo de /public/stats, incluidos totalQuantity y los cuatro campos estimated*. No se devuelven equivalencias ni ceros sustitutos. El total permanece exclusivamente en general.total_quantity (NUMERIC SQL); los subtotales por material permanecen en materials[].total_quantity. Se conserva el SQL F13, sin conversión ni redondeo adicional. Sin registros compatibles el total real es cero. Ranking, conteos y puntos conservan su contrato. Consumidores anteriores deben usar general.total_quantity y retirar las cuatro equivalencias. Ver [motivo y trazabilidad histórica](12-METODOLOGIA-INDICADORES.md).

### Alcance administrativo autorizado en F15

Todas las rutas /admin exigen authenticateToken y authorizeRoles('admin'). Se conservan GET/POST /admin/users, /admin/teams y /admin/periods. Se añaden:

| Endpoint | Campos permitidos (actualización parcial) | Respuesta 200 |
| --- | --- | --- |
| PATCH /admin/users/:id | name, email, team_id, is_active | id, name, email, role, team_id, is_active |
| PATCH /admin/teams/:id | name, dependency | id, name, dependency |

El cuerpo debe contener al menos un campo autorizado. Nombre/email/dependencia se recortan y no admiten vacío ni longitudes superiores al esquema (usuario 120/150; equipo 100/150). Email requiere formato válido y unicidad según UNIQUE existente (no se introduce normalización de mayúsculas). team_id debe ser entero positivo existente: obligatorio no nulo para leader cuando se modifica; para admin solo null, coherente con el alta. is_active exige booleano. Se rechazan role, password, password_hash, id y cualquier campo no autorizado. Campos omitidos se conservan. GET /admin/users incorpora team_id e is_active y nunca devuelve password_hash.

Ediciones: 400 datos/ID inválidos o equipo inexistente; 404 recurso inexistente con petición válida; 409 email/nombre de equipo duplicado; 403 líder; 500 genérico sin SQL. Las FK comprueban existencia del equipo dentro de la sentencia UPDATE atómica. No se modifican registros históricos. Los códigos de creación previos se conservan (F12 409 por cupo; F09 400/409/500 controlados); no se certifican nuevas validaciones de alta.

No existen DELETE de usuarios/equipos/períodos, PUT de estas entidades ni GET administrativo por ID. PATCH de períodos tampoco existe: responde 404, con registros o vacío. Se mantiene creación/listado porque no se demostró necesidad de editar períodos vacíos; las fechas históricas no se pueden modificar desde la API. Crear un período activo conserva la transacción F09, no es editar fechas de uno existente. Contenido conserva GET/POST y PUT/DELETE por ID, sin cambios.

Desde S01, cada solicitud protegida consulta el usuario actual: existencia, is_active, role, team_id y versión de sesión. Desactivar rechaza el siguiente request; cambiar equipo afecta solicitudes nuevas sin reescribir históricos. F15 no permite editar el rol; si cambia por administración SQL autorizada, el backend usa el rol actual.

### GET /public/points-catalog

Array con `id, source_code, group_name, action_name, action_level, points, evidence_required, max_frequency`, ordenado por grupo y acción ASC. No hay agrupación JSON ni filtrado por grupo. `evidence_required` es TEXT en el esquema oficial; verificar compatibilidad antes de migrar una base histórica.

`evidence_required` y `max_frequency` son metadatos descriptivos públicos. La API no los interpreta, no lleva contadores por ventana temporal y no implementa rachas. Su presencia en la respuesta no significa que esas condiciones se validen al registrar o aprobar.

### GET /public/content/:category

Categorías del frontend: `agua`, `energia`, `papel`, `residuos`. Devuelve `id, title, category, type, description, file_url, created_at`, solo status published, orden descendente de creación. Categorías desconocidas no tienen error de validación específico: habitualmente producen `[]`. No devuelve `youtube_url`.

## Registros de reciclaje

### POST /recycling

Usa multipart. Solo role=leader puede crear: admin y cualquier otro rol (incluido supervisor, que no existe en el esquema oficial) reciben 403 antes de procesar archivos. El formulario /leader/register también está restringido a líderes.

El equipo procede de req.user.team_id, leído de PostgreSQL por el middleware S01. Debe ser válido y existir; el controlador conserva SELECT FOR KEY SHARE dentro de F10 y las defensas NOT NULL/FK. Nunca se usa team_id del body ni un claim antiguo como autoridad.

| Campo | Uso / normalización |
| --- | --- |
| material_type | papel_carton, plastico, vidrio, metal, organico; trim o null |
| quantity | Valor numérico; SQL histórico exige > 0 |
| unit | Texto; trim o null; UI inicia kg |
| quality_level | alta, media, baja; trim o null |
| criteria_count | Número de criterios marcados; no hay máximo validado en API |
| notes | Opcional; trim y vacío a null |
| period_id | Obligatorio como entero o su cadena decimal canónica; debe coincidir con el único activo consultado por backend. Se inserta el ID leído de PostgreSQL |
| record_date | Fecha de realización de la actividad, YYYY-MM-DD válido (años 0001–9999), dentro del activo y no futura; omitido/null/vacío usa CURRENT_DATE de PostgreSQL, sujeto al mismo rango |
| catalog_group_name | Grupo enviado por compatibilidad; debe coincidir con la referencia derivada por el backend |
| catalog_action_name | Acción enviada por compatibilidad; debe coincidir con la referencia derivada por el backend |
| catalog_action_level | Nivel enviado por compatibilidad; debe coincidir con la referencia derivada por el backend |
| evidence | Archivo opcional; un único campo con ese nombre |

El backend deriva grupo, acción y nivel desde `material_type` y `quantity` con la misma tabla vigente que usa el formulario. Los tres valores recibidos deben coincidir y la identidad resultante debe existir en `points_catalog`; una discrepancia o configuración ausente devuelve 400 con un mensaje controlado. La fila conserva los textos canónicos recuperados del catálogo, no los textos arbitrarios del cliente.

`user_id` y `team_id` salen del usuario actual verificado; `status` se fija pending; `points_awarded` se fija 0. Los campos `points` o `points_awarded` enviados adicionalmente no se usan. Devuelve 201 y la fila completa de recycling_records. No calcula puntos al crear ni exige evidencia aunque el catálogo la describa.

F10: fecha inválida devuelve 400; ausencia de activo devuelve 409; period_id distinto, inexistente, inactivo, omitido o manipulado devuelve 409 con indicación de actualizar el formulario. Se exige coincidencia para evitar reasignar silenciosamente un formulario abierto antes de un cambio de período. La validación F05 se conserva y también puede rechazar previamente una referencia de catálogo no configurada. Fallo interno devuelve 500 genérico sin SQL.

La creación usa BEGIN, LOCK TABLE periods IN SHARE MODE, consulta/validación del activo y fecha PostgreSQL, INSERT y COMMIT en una conexión. ROLLBACK ante fallo. El bloqueo impide que F09 cambie el activo entre consulta y confirmación. `record_date` representa la fecha de realización de la actividad de reciclaje reportada. PostgreSQL evalúa `COALESCE($1::date, CURRENT_DATE) BETWEEN start_date AND end_date` y `COALESCE($1::date, CURRENT_DATE) <= CURRENT_DATE`. Ambos extremos están incluidos; actividades anteriores se admiten solo dentro del activo. Una fecha fuera del rango o futura devuelve **400**, sin INSERT: mensaje de rango si falla el rango (también si además es futura), o mensaje de fecha futura si solo falla esa condición. Omitir la fecha no evade la validación. No se convierten fechas a timestamps; CURRENT_DATE usa la fecha de transacción y zona de sesión PostgreSQL, no la del proceso Node. F10 queda CORREGIDO.

Evidencia: campo multipart evidence, un archivo validado por extensión/MIME/firma. Máximo técnico 20 MiB, con imágenes hasta 10 MiB; límites configurables. Referencia interna nueva: /uploads/managed/evidence/<UUID>.<ext>. No es una URL pública.

### GET /recycling/mine

Filtra `user_id` del usuario autenticado. Devuelve todas las columnas del registro más `period_name`, ordenadas por created_at DESC. Es historial del usuario, no todos los registros de su equipo.

### GET /recycling/pending

Filtra pending. Fila del registro más `leader_name, team_name, period_name`. INNER JOIN a usuarios/equipos, LEFT JOIN a periodo; orden created_at ASC.

### GET /recycling/reviewed

Filtra approved/rejected. Fila del registro más `leader_name, team_name, period_name, reviewer_name`; orden reviewed_at DESC.

### PATCH /recycling/:id/review

```json
{ "status": "approved", "review_notes": "Revisión de ejemplo" }
```

`status` solo admite approved o rejected; otro valor causa 400. ID inexistente: 404. `review_notes` opcional se normaliza a null si vacío. Aprobación consulta catálogo; rechazo fija puntos 0. Guarda reviewed_by desde el usuario autenticado y reviewed_at NOW(). Devuelve fila completa.

Solo admite pending → approved/rejected. Una segunda revisión devuelve 409 con `message: "El registro ya fue revisado"`, sin sobrescribir decisión, puntos ni auditoría. Usa BEGIN, SELECT FOR UPDATE, consulta de catálogo y UPDATE en la misma conexión, y COMMIT; ante fallo, ROLLBACK. Error interno: 500 con mensaje genérico, sin SQL ni detalles PostgreSQL. No se conserva una tabla de revisiones anteriores.

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

bcrypt con costo 10; inserta únicamente password_hash; cuenta activa. Para admin fuerza team_id null; para leader utiliza el recibido. Devuelve 201 con `id, name, email, role, team_id` después de COMMIT. F12 limita a 15 cuentas totales almacenadas en toda la aplicación: cuentan admin, leader e inactivos, sin filtro de equipo o período. Desactivar/reactivar no cambia el total; no existen endpoints para esas operaciones ni para eliminar usuarios.

Con 15 o más filas devuelve 409 con `{ "message": "Se alcanzo el maximo de 15 usuarios totales", "code": "USER_LIMIT_REACHED" }`, sin modificar usuarios. El backend calcula bcrypt antes del bloqueo y ejecuta BEGIN, LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE, COUNT(*), INSERT y COMMIT en una conexión. ROLLBACK ante fallo o cupo agotado. Error interno: 500 genérico sin SQL. Dos altas con el último cupo se serializan: una obtiene 201 y la otra 409. El frontend muestra el mensaje y refresca el conteo. No se modifica el contrato de otros endpoints.

### GET y POST /admin/teams

GET: filas completas, name ASC. POST: `{ "name": "Equipo", "dependency": "Dependencia" }`; devuelve fila completa con 201. Errores de unicidad/obligatoriedad dependen de SQL y se responden como 500. No hay edición o eliminación.

### GET y POST /admin/periods

GET: filas completas, start_date DESC. POST:

```json
{ "name": "Periodo de prueba", "start_date": "2026-09-01", "end_date": "2026-09-30", "is_active": true }
```

Enviar booleanos JSON, no cadenas (estas devuelven 400). Se conserva la aceptación de is_active omitido/null como no activo. Si is_active es true, desactiva todos los períodos antes de insertar, dentro de una sola transacción con `LOCK TABLE periods IN SHARE ROW EXCLUSIVE MODE`. Devuelve la fila completa con 201 después de COMMIT. ROLLBACK conserva el anterior si falla el INSERT. Dos creaciones activas concurrentes se serializan y pueden devolver ambas 201: queda activo el período de la última operación serializada, nunca ambos. Un índice único parcial protege también las escrituras SQL externas.

Errores: 400 para campos obligatorios nulos, fechas no representables por PostgreSQL, longitud excedida o is_active de tipo inválido; 409 para unicidad (nombre duplicado o múltiples activos) o conflicto transaccional; 500 para fallo interno. Solo se devuelve message, sin detalles SQL. No existe operación por ID que requiera 404, activación de un período existente ni desactivación independiente. No se añade validación del orden de fechas ni de record_date. Cero activos sigue siendo válido.

### GET /admin/content

Todas las filas completas de content_items, incluidos borradores, created_at DESC.

### POST /admin/content y PUT /admin/content/:id

Multipart con `title, category, type, description, status` y archivo opcional `file`.

- UI usa category agua/energia/papel/residuos; type text/image/video/file; status draft/published.
- POST establece status published si falta y created_by desde JWT; devuelve 201 y fila completa.
- PUT espera los campos completos; devuelve 404 si no existe y 200 con fila completa al actualizar.
- POST sin archivo guarda file_url null; PUT sin archivo mantiene el anterior.
- El nombre almacenado es UUID + extensión canónica en uploads/managed/content; el cliente no elige la ruta.
- Extensión, MIME y firma se validan en backend; el tipo image/video/file debe corresponder al adjunto. Límites descritos abajo; accept solo orienta al usuario.
- PUT confirma el cambio antes de retirar el archivo sustituido si ya no tiene referencias; no cambia created_at/created_by ni ofrece eliminación aislada del adjunto.

### DELETE /admin/content/:id

Elimina la fila y, después del COMMIT, retira su archivo si no quedan referencias. Devuelve { "message": "Contenido eliminado correctamente" }; ID inexistente devuelve 404. Fallo de limpieza no revierte una eliminación ya confirmada.

### GET /admin/export/excel

Sin body ni parámetros de filtro implementados. MIME `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`; Content-Disposition attachment; filename `Reporte_Ecoamigos.xlsx`. Incluye todos los estados y periodos, siempre que no exceda EXPORT_MAX_ROWS (1000 predeterminado técnico configurable). Recupera como máximo límite+1: el exceso devuelve 422 JSON con code EXPORT_LIMIT_EXCEEDED y maxRows, sin adjunto XLSX ni truncamiento. La UI informa que administración técnica debe revisar el volumen/configuración; no existen filtros. Exportación simultánea en el mismo proceso: 429 EXPORT_BUSY. Errores internos: 500 genérico; si ya comenzó el envío, se interrumpe la conexión. Columnas y alcance en [reglas](06-REGLAS-Y-BACKEND.md).

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


## Recuperación de contraseña — F16

| Endpoint público | Cuerpo estricto | Respuesta |
| --- | --- | --- |
| POST /api/auth/forgot-password | {"email":"cuenta@institucion.example"} | 200 y mensaje genérico; 400 formato/cuerpo inválido |
| POST /api/auth/reset-password | {"token":"64 caracteres hexadecimales","new_password":"nueva clave"} | 200 al completar; 400 token/clave inválidos, vencidos, usados o cuenta inactiva; 500 genérico ante fallo interno |

La solicitud responde siempre «Si existe una cuenta asociada, se enviarán instrucciones de recuperación.» para emails válidos, existan o no, estén activos o no, incluso si falla emisión/entrega. No devuelve token, hash, ID, rol, equipo ni estado de entrega. Formato de email validado, trim igual a edición F15, sin lowercase: la búsqueda y UNIQUE conservan la comparación exacta del login. No se normalizan cuentas históricas.

Solo cuentas activas reciben un token aleatorio de 32 bytes (256 bits), representado en 64 caracteres hex; la BD almacena SHA-256. Expira a los 30 minutos desde emisión. Nueva solicitud invalida enlaces anteriores; reset exitoso consume el token e invalida los demás pendientes del usuario. El reset requiere exclusivamente token + new_password, sin JWT; no existe endpoint de cambio voluntario autenticado ni edición de contraseña por admin.

Contraseña: string no vacío y máximo 72 bytes UTF-8 para evitar truncamiento bcrypt. Se conserva costo 10. El alta actual no impone longitud mínima fuerte/complejidad; F16 no inventa esa política ni cambia el alta. No recorta contraseñas. Nunca devuelve password_hash.

El adaptador institucional de entrega aún no está configurado. Ningún entorno devuelve tokens por HTTP; las pruebas inyectan un capturador en memoria en su proceso aislado. El futuro envío debe usar CLIENT_URL para formar /reset-password?token=... con HTTPS en producción. No hay envío real hoy ni proveedor añadido.

Los JWT anteriores siguen vigentes según firma/expiración (S01/S02); forgot/reset necesitan protección contra abuso en S03. Respuestas públicas uniformes no equivalen a tiempo constante ni a rate limiting.


### Límites de autenticación — S03

Ventanas fijas por IP y por endpoint: login 10, forgot-password 5 y reset-password 10 solicitudes cada 15 minutos, incluidos éxitos y fallos que alcanzan la ruta. Exceso: HTTP 429, mensaje «Demasiados intentos. Intenta de nuevo más tarde.» y Retry-After en segundos. Sin reintento automático. CORS expone Retry-After; no usa credenciales/cookies. Parámetros y límites de infraestructura en Operación. Recuperación conserva mensaje genérico y nunca devuelve reset tokens.

S01: un reset exitoso incrementa session_version en la misma transacción que password_hash y consumo del enlace; los JWT anteriores reciben 401. Un rollback conserva contraseña, versión y sesiones anteriores. Logout sigue siendo local; no existe endpoint de logout ni lista de revocación individual.


## Acceso y recepción de archivos — S04–S07

| GET | Autorización | Relación consultada |
| --- | --- | --- |
| /api/files/public/content/:id | Público, solo status=published | content_items.file_url |
| /api/files/content/:id | Admin activo autenticado | content_items.file_url, incluidos borradores |
| /api/files/evidence/:id | Admin activo o líder propietario por user_id | recycling_records.evidence_url |

No hay permiso por pertenecer al mismo equipo: /recycling/mine ya delimita historial por usuario. Cambiar de equipo no elimina propiedad histórica. Un líder ajeno recibe 403; sin sesión/inactivo, 401 de S01. Archivo/fila inexistente o referencia insegura: 404; borrador por ruta pública: 404; fallo interno: 500 genérico. IDs no son rutas; no existe parámetro path.

Respuestas de archivo: MIME conocido, nosniff, Cache-Control:no-store, CSP sandbox y disposición attachment para documentos/tipos heredados no visualizables; imágenes/videos conocidos se sirven inline. Se conserva soporte Range mediante sendFile. No se emiten cookies ni tokens en URL. Un cambio posterior a borrador impide nuevas descargas públicas, pero no puede retirar copias ya descargadas.

JPEG/JPG (image/jpeg), PNG (image/png), WEBP (image/webp), MP4 (video/mp4), MOV (video/quicktime) y AVI (video/x-msvideo, video/avi, video/msvideo o video/vnd.avi). Contenido admite además PDF (application/pdf) y DOCX (application/vnd.openxmlformats-officedocument.wordprocessingml.document). No se admiten nuevas cargas DOC, SVG, GIF, ejecutables ni extensiones fuera de esta lista.

Límites técnicos configurables, no política institucional: imágenes 10 MiB, documentos 20 MiB y videos de contenido 100 MiB; evidencia conserva techo total de 20 MiB (imágenes hasta 10 MiB). Un archivo por solicitud, 24 campos de hasta 64 KiB y 25 partes multipart. Nombres UUID generados por servidor con extensión canónica, escritura exclusiva sin sobrescritura.

Recepción: 413 tamaño, 415 tipo/firma no admitidos, 400 vacío/cantidad/campo multipart/tipo de contenido incompatible, 500 almacenamiento; mensajes controlados sin rutas/SQL/stack. Archivo opcional sigue siendo opcional; no se interpretan ni cambian los requisitos de evidencia del catálogo.


## S08: contrato CORS por entorno

CORS_ORIGINS, si está definida, es una lista de orígenes exactos separados por comas; se recortan espacios. Si se omite, se usa CLIENT_URL (un único origen, también utilizado en F16). Sin ambas variables se permite solamente http://localhost:5173 fuera de producción; NODE_ENV=production exige configuración explícita. Una variable seleccionada vacía, wildcard, ruta, credenciales o slash final provoca error genérico al arrancar, sin mostrar su valor. CORS_ORIGINS no cambia el destino de enlaces de recuperación.

Origin permitido recibe el origen exacto, nunca wildcard. Origin no permitido devuelve 403 con mensaje controlado antes de ejecutar la ruta. OPTIONS permitido responde 204, habilita Authorization/Content-Type y GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS. Esto no crea endpoints nuevos. Retry-After queda expuesto. Sin Origin se permite continuar para CLI/servidor a servidor, conservando autenticación y autorización en rutas protegidas: CORS no sustituye controles de acceso ni impide clientes no navegador.

Bearer JWT sigue vigente, credentials=false y withCredentials=false; no hay cookies ni CSRF nuevos. S02 permanece PARCIAL. Un ejemplo local opcional es CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173; no representa dominios institucionales.

S10: los errores internos de consultas ya no incluyen el campo error con mensajes SQL; conservan códigos HTTP y mensajes funcionales controlados. No cambian rutas ni contratos exitosos.
