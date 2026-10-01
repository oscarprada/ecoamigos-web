# Operación y mantenimiento

[Índice](00-INDICE.md)

## Alcance: desarrollo/QA y futura infraestructura institucional

D01/F09/F16/S01 cuentan con aplicación y verificación en PostgreSQL local de desarrollo/QA, según evidencia informada del proyecto. No existe despliegue institucional de producción. Esta consolidación no conecta bases ni ejecuta SQL. Las instrucciones de producción siguientes son preparación para una decisión posterior de Parques.

El repositorio no incluye Dockerfile de aplicación, Nginx, servicio de sistema, infraestructura como código ni pipeline de despliegue. Existe CI de verificación en .github/workflows/ci.yml. Lo siguiente es una guía de preparación, no una configuración ya aplicada. Subir código a GitHub no publica la aplicación en Internet.

Se requieren tres servicios: hosting estático para frontend, proceso Node persistente para backend y PostgreSQL. También almacenamiento persistente para uploads y logs. GitHub Pages solo serviría archivos estáticos: no ejecuta esta API ni PostgreSQL. Además, un sitio bajo `/ecoamigos-web/` necesita configurar `base` de Vite y el basename de BrowserRouter o usar dominio raíz; esos ajustes no están implementados.

## Preparación antes de producción

| Área | Trabajo necesario |
| --- | --- |
| Base de datos | Revisar el destino futuro y las migraciones versionadas; ensayar restauración. La aplicación local/QA está informada, no la productiva |
| Catálogo | Definir grupo/puntos institucionales y probar cada nivel |
| CORS | Configurar CLIENT_URL exacto; cookies con credentials y control CSRF |
| Conexión DB | Configurar DB_PORT o DATABASE_URL y DB_SSL según la infraestructura institucional futura |
| API pública | Conservar el acceso por entidad S05; el proxy futuro no debe publicar /uploads |
| HTTPS | Terminar TLS en infraestructura y usar URL HTTPS de API en frontend |
| Proceso Node | Ejecutar desde backend, reinicio supervisado y apagado/monitoreo definidos |
| Almacenamiento | Volumen persistente para uploads y protección/rotación de logs |
| Errores y seguridad | Conservar los controles implementados S01–S11 y gestionar los riesgos S02/S12 pendientes |
| Interfaz | Probar rutas activas al recargar y mantener retirados premios/ganadores |

## Build y ejecución

En el entorno de construcción:

```powershell
npm --prefix frontend ci
npm --prefix frontend run build
```

Configurar VITE_API_URL antes del build. Publicar el contenido de `frontend/dist`, no `frontend/src`. El servidor estático debe devolver index.html para rutas de páginas desconocidas, sin convertir rutas de archivos/API en HTML. No usar `vite preview` como servicio productivo. Referencia: [despliegue estático de Vite](https://vite.dev/guide/static-deploy).

En el servidor backend, desde `backend`:

```powershell
npm ci --omit=dev
npm start
```

Esto describe el comando del proceso, no instala un supervisor. Configurar variables privadas en el servidor y acceso de escritura mínimo a uploads/logs. Backend requiere conexión PostgreSQL funcional y esquema compatible.

## Disponibilidad y logs

`GET /` comprueba que Express responde. Para comprobar conexión y parte del modelo usar `GET /api/public/ranking`; no sustituye pruebas de usuario ni revisa disco escribible. Monitorear HTTP, errores, espacio, disponibilidad de PostgreSQL y crecimiento de uploads/logs.

El logger actual usa LOG_DIR/ecoamigos-tech.jsonl con rotación acotada. Los antiguos info.log/error.log pueden contener correos: no se migraron, leyeron ni eliminaron para esta corrección. Su revisión/retención posterior requiere autorización del operador. No publicar logs en Git; logs/ está ignorado, y cualquier LOG_DIR personalizado debe quedar también fuera del repositorio.

## Respaldo

Respaldar **base de datos y uploads**; uno sin el otro deja referencias rotas. Conservar además configuración privada en un gestor seguro y el commit del código desplegado. No guardar secretos o copias de producción en Git.

Ejemplo desde la raíz hacia `backups/` (ignorado por Git):

```powershell
New-Item -ItemType Directory -Force backups | Out-Null
$marcaRespaldo = Get-Date -Format 'yyyyMMdd-HHmmss'
$archivoDb = "backups/ecoamigos-$marcaRespaldo.dump"
pg_dump -h localhost -U postgres -d ecoamigos -Fc -f $archivoDb
if ($LASTEXITCODE -ne 0) { throw 'El respaldo de PostgreSQL falló.' }
$raizUploadsRespaldo = Read-Host 'Ruta efectiva de UPLOAD_ROOT que corresponde a la base respaldada'
Compress-Archive -LiteralPath $raizUploadsRespaldo -DestinationPath "backups/uploads-$marcaRespaldo.zip"
```

Los parámetros localhost/postgres/ecoamigos son ejemplos locales: el operador debe contrastar host, puerto y base con su configuración efectiva, sin publicar credenciales. Esta documentación no ejecuta los comandos. Estos comandos escriben respaldo local; copiarlo a un destino protegido fuera de la máquina y comprobar integridad. `pg_dump` ofrece una vista consistente de PostgreSQL, pero no sincroniza los archivos de uploads: para un par coherente, detener temporalmente escrituras durante la copia. Consultar [pg_dump oficial](https://www.postgresql.org/docs/current/app-pgdump.html).

## Restauración de ensayo

Siempre ensayar en una base nueva, no sobre producción:

```powershell
psql -h localhost -U postgres -d postgres -v ON_ERROR_STOP=1 -c 'CREATE DATABASE ecoamigos_restore_test;'
pg_restore -h localhost -U postgres -d ecoamigos_restore_test --no-owner --no-privileges --exit-on-error 'backups/REEMPLAZAR_ARCHIVO.dump'
```

Comprobar códigos de salida, tablas, conteos y archivos. Extraer el ZIP en una carpeta de ensayo separada y revisar su estructura antes de usarlo como uploads. Apuntar una instancia de backend de prueba a esa base y carpeta; probar login, evidencias y exportación. No sobrescribir uploads activo para ensayar.

No hay política implementada de RPO/RTO. Los responsables deben definir frecuencia, retención, tiempo máximo de recuperación y responsables de pruebas. La carpeta backups local no reemplaza una copia externa.

## Actualización y reversión

1. Identificar commit actual, registrar versión y obtener respaldo verificable.
2. Probar cambios y migraciones en un entorno separado.
3. Coordinar ventana cuando la migración o copia de archivos lo requiera.
4. Instalar dependencias desde lockfiles, compilar y desplegar una versión identificable.
5. Ejecutar pruebas de salud y una operación funcional con datos de prueba.
6. Si falla, volver al artefacto anterior; restaurar datos solo con un plan que considere escrituras posteriores.

No usar `git reset --hard` como procedimiento rutinario ni aplicar SQL histórico a producción. No hay migraciones reversibles provistas por la aplicación.

## Recuperación administrativa de contraseña

Existe recuperación F16, con entrega institucional todavía pendiente. Este procedimiento SQL es excepcional. Un responsable con autorización de base puede generar bcrypt y actualizar solo la cuenta indicada. Para el esquema oficial, abrir `psql -X -n -h localhost -U postgres -d ecoamigos` en una terminal privada, sin historial de psql:

```sql
BEGIN;
WITH nuevo AS (
  SELECT crypt('REEMPLAZAR_CLAVE_UNICA', gen_salt('bf', 10)) AS h
)
UPDATE users SET password_hash = nuevo.h, session_version = session_version + 1
FROM nuevo WHERE email = 'REEMPLAZAR_CORREO'
RETURNING id, email;
-- Confirmar que el resultado corresponde exactamente a la cuenta prevista.
COMMIT;
```

Si el resultado no es el esperado, usar ROLLBACK en lugar de COMMIT. En una base existente verificar primero que dispone de password_hash, session_version y pgcrypto; no usar ni escribir password. No modificar role/is_active sin una solicitud específica. Con S01, toda actualización administrativa de contraseña debe incrementar session_version en la misma sentencia/transacción, como en el ejemplo; actualizar solo el hash no revoca sesiones. F16 lo hace automáticamente. Rotar JWT_SECRET invalida todas las sesiones y exige coordinación.

## Problemas frecuentes

| Síntoma | Revisión |
| --- | --- |
| `Missing script: dev` | Se ejecutó desde raíz; usar frontend o backend |
| Puerto 5173 ocupado, Vite cambia puerto | Cerrar instancia duplicada o configurar CORS para el puerto correcto |
| CORS bloqueado | Revisar CLIENT_URL, Origin exacto y cabecera X-Ecoamigos-Request |
| ECONNREFUSED PostgreSQL | Servicio, host/puerto de DATABASE_URL o DB_HOST/DB_PORT y firewall |
| Authentication failed / database does not exist | DB_USER/DB_PASSWORD/DB_NAME y existencia de base |
| Columna/relación no existe | Incompatibilidad de esquemas; comparar diccionario, no improvisar otro seed |
| No hay admin tras seed | El seed no crea cuentas; seguir bootstrap con datos explícitos del responsable |
| Alta falla por password NOT NULL heredada | El código solo escribe password_hash; la base antigua requiere migración autorizada |
| Contenido falla por category/type | Esquema histórico carece de category y admite tipos distintos |
| Error de almacenamiento | Revisar UPLOAD_ROOT y permisos; los subdirectorios managed se crean al cargar |
| Imagen/archivo inaccesible | Revisar entidad, publicación/propiedad, sesión y existencia física; usar endpoints de archivos, no /uploads |
| Evidencia rechazada | Revisar límites, extensión, MIME y firma; MOV/AVI pueden requerir reproductor compatible |
| Aprobado con 0 puntos | Grupo/nivel sin coincidencia; CSV sin grupo institucional |
| No existe período activo | Cero activos es válido; F09 conserva el anterior si falla una creación. Revisar respuesta y datos sin activar filas arbitrariamente |
| Token expirado | Cerrar sesión e ingresar; no hay refresh |
| Recargar /admin devuelve 404 de hosting | Falta fallback SPA a index.html |
| Excel falla o tarda | Token/rol, EXPORT_MAX_ROWS, exportación en curso, SQL y memoria |
| Letras acentuadas extrañas en terminal | Revisar lectura UTF-8; no reemplazar textos basándose solo en PowerShell mal decodificado |

## Seguridad y alcance de acceso

El código parametriza consultas y utiliza hashes y autorización por rol, pero eso no constituye una auditoría de seguridad. La creación de reciclaje valida en backend su referencia contra material, cantidad y catálogo. Los errores HTTP son controlados y las cargas tienen límites y comprobaciones de formato. S02 migra la sesión a cookie HttpOnly; persisten los riesgos de dependencias (S12); estas correcciones no certifican seguridad integral. Prioridades detalladas en [calidad](09-CALIDAD-Y-PENDIENTES.md). Definir acceso institucional antes de un despliegue externo.


F16 incorpora recuperación por token desde la aplicación; el envío institucional de correo aún requiere configurar el adaptador. El procedimiento SQL excepcional anterior no es un flujo de cambio voluntario de perfil ni una función de administración de contraseñas. Ver [instalación/migración F16](../database/README.md); su aplicación y verificación local de desarrollo/QA está informada por el proyecto.


## Configuración y migración S01–S03

En una instalación existente, comprobar primero si S01 ya está aplicada. Si falta, después de conciliar D01/F09/F16 y antes de iniciar este backend, aplicar database/20260914_s01_session_version.sql y revisar database/verify_s01_session_version.sql. Hacer respaldo y verificar el destino; no aplicar schema.sql a una base existente. La migración añade INTEGER NOT NULL DEFAULT 0 con CHECK no negativo, sin borrar filas; repetirla conserva versiones existentes. Los JWT anteriores sin sv requieren nuevo login. El proyecto informa aplicación y verificación de S01 en PostgreSQL local de desarrollo/QA; no en infraestructura institucional de producción. Verificar el estado del destino antes de decidir si necesita aplicación. El esquema nuevo ya incluye la columna. No revertir el backend a uno que ignore sv: volvería a aceptar sesiones revocadas.

CLIENT_URL es el único origen permitido para CORS y CSRF. Fuera de producción, si falta, se usa http://localhost:5173; en producción es obligatorio un origen HTTPS exacto. No se admiten wildcard, lista, ruta, credenciales ni slash final. CORS_ORIGINS es una variable heredada: retirarla o mantenerla idéntica a CLIENT_URL; otro valor detiene el arranque. Axios y CORS habilitan credenciales. Los métodos mutantes exigen Origin igual a CLIENT_URL y X-Ecoamigos-Request: 1, incluso login, logout y recuperación. Sesión S02: JWT HS256 de ocho horas en cookie ecoamigos_session, HttpOnly, SameSite=Lax, Path=/api, sin Domain; Secure cuando NODE_ENV=production. El body de login ya no contiene JWT. Frontend y API deben compartir sitio y esquema (localhost con distintos puertos en desarrollo; HTTPS bajo el mismo sitio en producción). No se soporta automáticamente un frontend en un sitio distinto; no cambiar a SameSite=None sin revisar despliegue y pruebas.

AUTH_WINDOW_MS=900000; AUTH_LOGIN_MAX=10; AUTH_FORGOT_MAX=5; AUTH_RESET_MAX=10. Enteros positivos; configuración inválida aborta la construcción de rutas. Ventana fija por IP/endpoint; cuentan éxitos y fallos, 429 con Retry-After y reinicio al vencer. El mapa tiene como máximo 10000 IP activas por endpoint; al saturarse rechaza IP nuevas con 429, sin crecer indefinidamente. Limpieza al recibir peticiones, sin timers permanentes. NAT comparte cupo; reiniciar proceso reinicia límites y varias instancias tienen contadores independientes. No es defensa completa frente a ataques distribuidos ni bloqueo por cuenta. Antes de escalar, coordinar límite compartido o de proxy.

TRUSTED_PROXIES vacío: conexión directa; no se confía en X-Forwarded-For. Si existe proxy, declarar solo IP/subredes reales autorizadas y verificar la IP observada; nunca confiar en cualquier cliente. Las pruebas verifican que cambiar X-Forwarded-For sin proxy no evita el límite. No se ha fijado una topología productiva.


## Almacenamiento y retención S04–S07

UPLOAD_ROOT es una raíz privada de confianza, por defecto uploads relativa al backend. En producción usar ruta absoluta persistente y permisos exclusivos del proceso. No publicar esa raíz con proxy, hosting, alias estático o CDN; quitar cualquier regla externa /uploads antes de considerar desplegada la protección S05. La aplicación ya no expone estáticos. No cambió CORS ni S02.

Nuevas cargas: managed/content y managed/evidence bajo esa raíz; se crean al recibir archivos. Los contenidos públicos y borradores permanecen en almacenamiento privado y se distinguen por estado en BD, evitando movimientos cuando cambia la publicación. El navegador solicita contenido publicado por ID; lo privado usa cookie/Blob.

Compatibilidad: referencias heredadas /uploads/<nombre> y /uploads/content/<nombre> se resuelven en su ubicación anterior, únicamente después de consultar entidad/permisos. No se movieron archivos ni se migraron URLs en BD. Rutas absolutas, externas, traversal, segmentos extra, nombres con controles, porcentaje o separadores ambiguos y enlaces fuera de la raíz se rechazan; requieren revisión individual, no conversión automática. DOC heredado puede descargarse como adjunto; no se admite carga DOC nueva. Un archivo heredado no se certifica retroactivamente por firma. Respaldar BD y raíz juntos.

Retención normal: evidencia se conserva mientras exista su registro; no hay edición/eliminación nueva. Contenido conserva adjunto hasta reemplazo/eliminación; se retira únicamente cuando ninguna de las dos tablas lo referencia. No hay retención institucional temporal inventada ni barrido automático de archivos históricos. Los archivos compartidos permanecen hasta la última referencia.

Retención excepcional: errores de BD o unlink emiten FILE_CLEANUP_PENDING y conservan lo que no puede borrarse con seguridad. Una caída abrupta puede dejar archivos nuevos no asociados o sustituidos pendientes; filesystem y PostgreSQL no son atómicos entre sí. Revisar espacio y marcador en logs del proceso. Para reconciliar: respaldar, detener escrituras, inventariar los archivos de la raíz, cruzar contra AMBAS columnas file_url/evidence_url, revisar individualmente los candidatos y resolver cada ruta dentro de la raíz antes de retirar cualquier archivo. No usar antigüedad ni nombre como prueba de que un archivo es huérfano. No se suministra ni ejecuta un borrado masivo automático. Si falla la consulta, conservar. Los huérfanos previos no fueron eliminados por esta tarea.

file-type 22.1.0 detecta firmas como indicio; los workers limitan duración a 10 segundos y heap a 64 MiB. Se añaden verificaciones de cierre JPEG/PNG/PDF, longitud RIFF para WEBP/AVI y cierre ZIP para DOCX. No decodifica imágenes, páginas, XML completo ni codecs, no elimina macros/contenido activo y no sustituye antivirus. Archivos cifrados, malformados o formatos ambiguos pueden rechazarse. Para videos se reconoce contenedor, no se certifica integridad/playback; la comprobación de truncado es parcial.


## S08: contrato CORS por entorno

CLIENT_URL es el único origen permitido para CORS y CSRF. Fuera de producción, si falta, se usa http://localhost:5173; en producción es obligatorio un origen HTTPS exacto. No se admiten wildcard, lista, ruta, credenciales ni slash final. CORS_ORIGINS es una variable heredada: retirarla o mantenerla idéntica a CLIENT_URL; otro valor detiene el arranque. Axios y CORS habilitan credenciales. Los métodos mutantes exigen Origin igual a CLIENT_URL y X-Ecoamigos-Request: 1, incluso login, logout y recuperación.

Origin permitido recibe el origen exacto, nunca wildcard. Origin no permitido devuelve 403 con mensaje controlado antes de ejecutar la ruta. OPTIONS permitido responde 204, habilita X-Ecoamigos-Request/Content-Type y GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS. Esto no crea endpoints nuevos. Retry-After queda expuesto. Sin Origin solo continúan GET/HEAD/OPTIONS. CLI y clientes servidor a servidor deben enviar el origen configurado y la cabecera CSRF para métodos mutantes, además de su cookie. CORS no sustituye autenticación ni autorización.

Sesión S02: JWT HS256 de ocho horas en cookie ecoamigos_session, HttpOnly, SameSite=Lax, Path=/api, sin Domain; Secure cuando NODE_ENV=production. El body de login ya no contiene JWT. Frontend y API deben compartir sitio y esquema (localhost con distintos puertos en desarrollo; HTTPS bajo el mismo sitio en producción). No se soporta automáticamente un frontend en un sitio distinto; no cambiar a SameSite=None sin revisar despliegue y pruebas.


## S09: contrato de conexión PostgreSQL

Una sola estrategia en src/config/databaseOptions.js, utilizada por el Pool de src/config/db.js. El constructor no lee .env ni conecta; db.js carga dotenv y crea el Pool perezoso. No se alteran scripts psql ni las conexiones explícitas de los tests temporales.

- DATABASE_URL no vacía tiene precedencia completa sobre DB_HOST, DB_PORT, DB_USER, DB_PASSWORD y DB_NAME. Admite postgres:// o postgresql:// con host, usuario, contraseña y base; puerto omitido usa 5432. Codificar caracteres reservados de credenciales. Se rechazan query y fragmento para impedir que opciones URL sustituyan la política SSL de pg.
- Sin URL (omitida o vacía), host, usuario, contraseña y base individuales son obligatorios; DB_PORT omitido/vacío usa 5432 y un valor explícito debe estar entre 1 y 65535. No se usan credenciales predeterminadas ni una conexión de prueba para validar.
- DB_SSL admite exactamente false o true, predeterminado false para PostgreSQL local. true produce ssl: { rejectUnauthorized: true }; usa la confianza TLS de Node, exige certificado válido y no degrada a una conexión insegura. No hay rejectUnauthorized:false ni desactivación TLS global. NODE_TLS_REJECT_UNAUTHORIZED=0 se rechaza.
- Configuración inválida genera un mensaje fijo sin URL, contraseña ni valor recibido. Los errores de cliente al consultar no exponen datos internos; el error del Pool se registra como DATABASE_POOL_ERROR sin objeto Error.

Ejemplo ficticio de sintaxis, no credencial ni proveedor elegido: DATABASE_URL=postgresql://USUARIO:CLAVE_CODIFICADA@HOST:5432/BASE, DB_SSL=true. La institución deberá definir host, TLS y confianza de certificados. No se inventaron certificados ni se implementó una excepción para certificados autofirmados. No se certificó conexión TLS institucional.

La separación de SSL evita la sobrescritura documentada por [node-postgres](https://node-postgres.com/features/ssl) cuando una URL incluye opciones sslmode/sslcert/sslkey/sslrootcert. Se construyen campos explícitos para pg en vez de pasar una URL capaz de sobreescribir ssl.


## S10: logs técnicos, límites y acceso

Logger pequeño sin nueva dependencia, basado en node:fs/promises y path. Un proceso serializa sus escrituras con una cola acotada. Los requests no esperan IO síncrono. Eventos JSONL con fecha ISO y niveles info/warn/error; nombres de eventos permitidos por lista explícita, texto libre desconocido convertido a APPLICATION_EVENT. El contexto solo admite IDs enteros actor_id/record_id/entity_id/team_id y status approved/rejected. Se descartan objetos anidados completos y propiedades no admitidas; no se recorren serializadores ni getters del payload.

Clasificación: se conservan IDs mínimos de actor/entidad para correlación técnica, que siguen siendo datos vinculables y requieren acceso restringido. No se conservan correos, nombres, notas, cantidades/materiales, IP, user agent, evidencias, filenames, rutas, headers, password/password_hash, JWT, Authorization, reset tokens, DB_PASSWORD ni DATABASE_URL. Error.message, stack, SQL y objeto Error no se escriben. Un evento de error identifica la operación, con menor detalle diagnóstico deliberado. No hay logging general de requests. No se afirma cumplimiento legal integral.

| Variable | Predeterminado | Significado |
| --- | --- | --- |
| LOG_DIR | logs relativo al cwd del backend | Directorio privado; admite ruta absoluta de la infraestructura futura |
| LOG_MAX_BYTES | 5242880 (5 MiB) | Máximo por archivo, de 1 a 104857600 bytes |
| LOG_MAX_FILES | 5 | Archivos rotados además del actual; de 1 a 20 |
| LOG_QUEUE_LIMIT | 1000 | Eventos pendientes máximos; de 1 a 10000 |

El archivo actual es ecoamigos-tech.jsonl y los rotados ecoamigos-tech.1.jsonl hasta el número configurado. Antes de exceder tamaño se rota y se elimina únicamente el último slot de ese namespace. Predeterminado: seis archivos, aproximadamente 30 MiB como máximo generados por el logger. Una línea mayor que el límite se descarta. Los límites pequeños usados en tests no son valores recomendados de operación. No hay retención por días. Son valores técnicos ajustables, no una política institucional.

No se enumeran ni borran archivos ajenos, info.log/error.log históricos o números fuera del rango configurado. Si se reduce el número de archivos, los slots anteriores fuera del nuevo rango requieren revisión manual; no se eliminan automáticamente. El directorio y archivos gestionados rechazan enlaces; archivos con múltiples enlaces físicos se rechazan. El operador debe controlar la raíz y sus ancestros. Se solicitan modos 0700/0600 en POSIX; en Windows deben configurarse ACL exclusivas para la cuenta del proceso y operadores autorizados. No se certificó ACL institucional ni se cambiaron permisos reales.

Ante fallo de disco/rotación o saturación se descarta el evento y se emite TECH_LOG_UNAVAILABLE una sola vez por instancia a stderr, sin ruta/error original; la operación de negocio continúa. El marcador existente FILE_CLEANUP_PENDING de S06 sigue siendo fijo, sin datos personales, en stderr. La captura/retención de stderr pertenece al supervisor futuro; no se instaló ninguno. Revisar esos marcadores y espacio disponible.

Limitaciones: cola en memoria, posible pérdida en caída abrupta o saturación, sin garantía de auditoría durable, sin coordinación multiproceso. Cada instancia futura necesita LOG_DIR independiente o colector institucional; no compartir estos archivos entre procesos. No se promete atomicidad de rotación frente a fallos físicos: puede quedar una rotación incompleta, sin afectar la transacción de negocio. flushLogs permite esperar pendientes, pero no se añade un supervisor/apagado institucional.

La auditoría funcional de revisión sigue en PostgreSQL (reviewed_by, reviewed_at, review_notes y estado). No se eliminó información funcional persistida ni se añadió historial ficticio. Logs técnicos no sustituyen una auditoría inmutable.


## S11: exportación acotada y medición

EXPORT_MAX_ROWS=1000 es un **valor técnico predeterminado configurable**, no política de Parques. Solo admite entero 1–10000; vacío, cero, negativo, decimal o excesivo falla con error controlado, nunca habilita exportación ilimitada. El controlador hace una consulta SELECT con LIMIT máximo+1, sin consulta previa ilimitada ni conteo independiente que pueda competir con el resultado. Ante exceso responde 422, no genera un libro parcial ni permite filtros inexistentes. Ajustar el límite requiere evaluación técnica de memoria; no borrar datos para hacerlo caber. Implementar filtros sería una decisión posterior, no una funcionalidad añadida aquí.

La consulta y el libro usan memoria: al menos array de filas PostgreSQL, modelo de celdas ExcelJS y buffers de serialización ZIP/XLSX; no hay un número fijo universal de copias internas. ExcelJS 4.4.0 sí ofrece writer streaming, pero no se cambió porque el límite de filas con una generación por proceso resuelve el crecimiento arbitrario con menor complejidad y mantiene formato. El control no es distribuido ni un límite duro de RSS. El trabajo de ordenación PostgreSQL puede crecer con la tabla aunque la respuesta esté acotada. No se midió carga institucional ni tráfico concurrente distribuido.

Medición sintética aproximada en Node 24.13.0, procesos nuevos con --expose-gc y filas de tamaño representativo, sin BD real:

| Caso | Filas devueltas a Node | Heap incremental muestreado | RSS incremental observado | Resultado |
| --- | --- | --- | --- | --- |
| Antes, 100 filas | 100 | 5.58 MiB | 4.90 MiB | XLSX |
| Antes, 1000 filas | 1000 | 28.08 MiB | 23.89 MiB | XLSX |
| Antes, 5000 filas | 5000 | 56.37 MiB | 114.66 MiB | XLSX |
| Después, 1000 filas | 1000 | 28.08 MiB | 24.57 MiB | XLSX |
| Después, 5000 candidatas | 1001 | 0.40 MiB | 0.01 MiB | 422, cero bytes XLSX |

Estas cifras son muestras, no máximos garantizados ni benchmarks comparables a producción. scripts/measure-export.mjs inyecta filas sintéticas, sustituye transporte y no importa db.js/.env. Reproducir con node --expose-gc backend/scripts/measure-export.mjs 1000 o 5000. El script mide el código actual; la medición anterior queda como evidencia de la auditoría previa.

Excel mantiene nueve columnas, encabezado verde, fila inmovilizada, autofiltro, nombre de hoja/archivo, unidades y estados. No exporta notas ni evidencias. Los prefijos = + - @ son strings XLSX, sin fórmula; no se añadió apóstrofo visible ni se alteró el número de puntos. NUMERIC quantity conserva la representación de texto decimal que pg/ExcelJS ya utilizaban. Una conversión futura a CSV exige su propio análisis.

## S12: comandos reproducibles y CI

Instalación desde la raíz: npm ci --prefix backend y npm ci --prefix frontend. Ambos lockfiles están versionados y se probaron con instalación limpia; no usar npm install en CI. El conflicto inicial de peers Vite/plugin React se corrigió con plugin 5.2.0, sin force ni legacy-peer-deps. Node 24.13.0 y npm 11.6.2 son la referencia.

En PowerShell, definir únicamente la ubicación de binarios de prueba:

```powershell
$env:ECOAMIGOS_TEST_PG_BIN='C:\Program Files\PostgreSQL\18\bin'
npm test --prefix backend
npm test --prefix frontend
npm run build --prefix frontend
npm run check
```

En Linux exportar ECOAMIGOS_TEST_PG_BIN=/usr/lib/postgresql/18/bin y usar los mismos comandos npm. npm test desde raíz ejecuta ambas suites; npm run test:ci es alias. El runner enumera archivos sin depender de glob del shell y rechaza la falta de binarios PostgreSQL, evitando una suite verde con migraciones omitidas. Ejecuta dos archivos de prueba a la vez, con clústeres/puertos temporales propios y pg_ctl -w esperando inicio antes de cada suite. Los finally detienen los clústeres. Las carpetas temporales de evidencia no se eliminan automáticamente.

El runner fija datos ficticios y puertos no operativos para un Pool de aplicación accidental; sobrescribe DB_*, DATABASE_URL, JWT_SECRET, CLIENT_URL, LOG_DIR y UPLOAD_ROOT. Las pruebas de integración inyectan exclusivamente sus conexiones temporales. No se inicia server.js, no se lee .env real y no se usa la base ecoamigos. Los tests unitarios de configuración construyen objetos sin red.

.github/workflows/ci.yml corre en push a main y pull_request hacia main. Usa actions/checkout@v7.0.1, actions/setup-node@v7.0.0, ubuntu-24.04, Node 24.13.0, npm 11.6.2 y permisos contents:read; no persiste credenciales. El segundo run de f21b2a6 terminó SUCCESS según la validación del usuario en la interfaz de GitHub Actions; no se inspeccionó mediante API en esta consolidación. No usa pull_request_target, secrets institucionales ni pasos de deploy.

El job quality declara un **service container postgres:18**, usuario/base ecoamigos_ci_s12 y password ficticia, puerto efímero del job 55432 y healthcheck pg_isready. check-ci-postgres.mjs verifica ese servicio y una tabla temporal, solo bajo GITHUB_ACTIONS/CI/test. Las suites históricas de migración/concurrencia necesitan además initdb/pg_ctl/psql locales: el workflow instala binarios 18 mediante el repositorio oficial PostgreSQL y conserva sus clústeres independientes. No se reinterpretan esos tests para compartir una BD y arriesgar colisiones. Ninguno usa una base institucional. Son dos comprobaciones distintas documentadas, no un service declarado sin uso.

Después ejecuta tests backend/frontend, build y check; comprueba whitespace del commit. Un job separado dependency-audit instala desde locks con scripts deshabilitados (no necesita bcrypt para auditar) y ejecuta cuatro npm audit, completos y omit=dev. No oculta fallos con continue-on-error; los hallazgos generan advertencias, resumen y JSON; solo los errores de ejecución o informes inválidos hacen fallar ese job. Consultar [clasificación y decisiones](13-AUDITORIA-DEPENDENCIAS-S12.md).

Se validó YAML con yaml 2.9.1, claves únicas, triggers, permisos, servicio/healthcheck/puerto, scripts y rutas. Se ejecutaron localmente npm ci, tests, build y check. La primera ejecución 78c0297 falló en 13 suites PostgreSQL (41/54). El segundo run f21b2a6 terminó **SUCCESS**, informado y validado por el usuario en GitHub Actions. **CI IMPLEMENTADO Y VALIDADO**. El smoke manual XLSX S11 también fue aprobado e informado por el usuario. Las pruebas locales de YAML no sustituyen esas evidencias externas. S12 sigue PARCIAL exclusivamente por dependencias. No se añadió ESLint: node --check, pruebas, build y diff forman la verificación actual, con lint completo como mejora posterior.

Ecoamigos incorpora **automatización del aseguramiento de calidad**: pruebas funcionales, regresión, seguridad, concurrencia, migraciones temporales, build y verificaciones técnicas con CI. Es integración continua; no hay despliegue automático ni CD.


### Continuación CI del commit 78c0297

El diagnóstico, aislamiento de PostgreSQL y nueva semántica de dependency-audit se documentan en [revisión del primer run](14-CI-PRIMER-RUN.md). Los totales anteriores son evidencia histórica; consultar ese informe para la validación de esta continuación. S11 sigue CORREGIDO y S12 PARCIAL exclusivamente por dependencias. El estado consolidado está en [trazabilidad](15-TRAZABILIDAD-Y-DECISIONES.md).


### Actualización S02 — 2026-09-30

Sesión S02: JWT HS256 de ocho horas en cookie ecoamigos_session, HttpOnly, SameSite=Lax, Path=/api, sin Domain; Secure cuando NODE_ENV=production. El body de login ya no contiene JWT. Frontend y API deben compartir sitio y esquema (localhost con distintos puertos en desarrollo; HTTPS bajo el mismo sitio en producción). No se soporta automáticamente un frontend en un sitio distinto; no cambiar a SameSite=None sin revisar despliegue y pruebas. CLIENT_URL es el único origen permitido para CORS y CSRF. Fuera de producción, si falta, se usa http://localhost:5173; en producción es obligatorio un origen HTTPS exacto. No se admiten wildcard, lista, ruta, credenciales ni slash final. CORS_ORIGINS es una variable heredada: retirarla o mantenerla idéntica a CLIENT_URL; otro valor detiene el arranque. Axios y CORS habilitan credenciales. Los métodos mutantes exigen Origin igual a CLIENT_URL y X-Ecoamigos-Request: 1, incluso login, logout y recuperación. Logout no cambia las reglas de revocación S01: reset incrementa session_version y las peticiones siguientes rechazan cualquier JWT anterior. Se conservan autorización y límites S03. Ver evidencia de pruebas y decisión CSRF en [09](09-CALIDAD-Y-PENDIENTES.md).
