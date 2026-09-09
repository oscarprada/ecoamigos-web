# Operación, despliegue y mantenimiento

[Índice](00-INDICE.md)

## Estado de despliegue

El repositorio no incluye Docker, Nginx, servicio de sistema, infraestructura como código ni pipeline de despliegue. Lo siguiente es una guía de preparación, no una configuración ya aplicada. Subir código a GitHub no publica la aplicación en Internet.

Se requieren tres servicios: hosting estático para frontend, proceso Node persistente para backend y PostgreSQL. También almacenamiento persistente para uploads y logs. GitHub Pages solo serviría archivos estáticos: no ejecuta esta API ni PostgreSQL. Además, un sitio bajo `/ecoamigos-web/` necesita configurar `base` de Vite y el basename de BrowserRouter o usar dominio raíz; esos ajustes no están implementados.

## Preparación antes de producción

| Área | Trabajo necesario |
| --- | --- |
| Base de datos | Conciliar esquema real con código, versionar migración y validar restauración |
| Catálogo | Definir grupo/puntos institucionales y probar cada nivel |
| CORS | Reemplazar origen localhost por configuración controlada; CLIENT_URL hoy no tiene efecto |
| Conexión DB | Adaptar puerto/SSL si lo exige el proveedor; no basta definir DATABASE_URL |
| API pública | Decidir acceso a evidencias, borradores y estadísticas antes de exponer datos |
| HTTPS | Terminar TLS en infraestructura y usar URL HTTPS de API en frontend |
| Proceso Node | Ejecutar desde backend, reinicio supervisado y apagado/monitoreo definidos |
| Almacenamiento | Volumen persistente para uploads y protección/rotación de logs |
| Errores y seguridad | Validaciones, límites de archivos/contenido, errores sin detalles internos y protección de login |
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

`backend/logs/info.log` y `error.log` son locales si se inicia desde backend. Contienen correos e IDs. No hay rotación ni alertas integradas. Configurar retención según necesidad operativa y acceso restringido. Evitar copiar logs completos a GitHub.

## Respaldo

Respaldar **base de datos y uploads**; uno sin el otro deja referencias rotas. Conservar además configuración privada en un gestor seguro y el commit del código desplegado. No guardar secretos o copias de producción en Git.

Ejemplo desde la raíz hacia `backups/` (ignorado por Git):

```powershell
New-Item -ItemType Directory -Force backups | Out-Null
$marcaRespaldo = Get-Date -Format 'yyyyMMdd-HHmmss'
$archivoDb = "backups/ecoamigos-$marcaRespaldo.dump"
pg_dump -h localhost -U postgres -d ecoamigos -Fc -f $archivoDb
if ($LASTEXITCODE -ne 0) { throw 'El respaldo de PostgreSQL falló.' }
Compress-Archive -LiteralPath backend/uploads -DestinationPath "backups/uploads-$marcaRespaldo.zip"
```

Estos comandos escriben respaldo local; copiarlo a un destino protegido fuera de la máquina y comprobar integridad. `pg_dump` ofrece una vista consistente de PostgreSQL, pero no sincroniza los archivos de uploads: para un par coherente, detener temporalmente escrituras durante la copia. Consultar [pg_dump oficial](https://www.postgresql.org/docs/current/app-pgdump.html).

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

No existe flujo de recuperación en UI/API. Un responsable con autorización de base puede generar bcrypt y actualizar solo la cuenta indicada. Para el esquema oficial, abrir `psql -X -n -h localhost -U postgres -d ecoamigos` en una terminal privada, sin historial de psql:

```sql
BEGIN;
WITH nuevo AS (
  SELECT crypt('REEMPLAZAR_CLAVE_UNICA', gen_salt('bf', 10)) AS h
)
UPDATE users SET password_hash = nuevo.h
FROM nuevo WHERE email = 'REEMPLAZAR_CORREO'
RETURNING id, email;
-- Confirmar que el resultado corresponde exactamente a la cuenta prevista.
COMMIT;
```

Si el resultado no es el esperado, usar ROLLBACK en lugar de COMMIT. En una base existente verificar primero que dispone de password_hash y pgcrypto; no usar ni escribir password. No modificar role/is_active sin una solicitud específica. Cambiar contraseña no revoca JWT emitidos; rotar JWT_SECRET invalida todas las sesiones y exige coordinación.

## Problemas frecuentes

| Síntoma | Revisión |
| --- | --- |
| `Missing script: dev` | Se ejecutó desde raíz; usar frontend o backend |
| Puerto 5173 ocupado, Vite cambia puerto | Cerrar instancia duplicada o configurar CORS para el puerto correcto |
| CORS bloqueado | Usar localhost:5173; CLIENT_URL todavía no se aplica |
| ECONNREFUSED PostgreSQL | Servicio, DB_HOST, firewall y puerto fijo 5432 |
| Authentication failed / database does not exist | DB_USER/DB_PASSWORD/DB_NAME y existencia de base |
| Columna/relación no existe | Incompatibilidad de esquemas; comparar diccionario, no improvisar otro seed |
| No hay admin tras seed | El seed no crea cuentas; seguir bootstrap con datos explícitos del responsable |
| Alta falla por password NOT NULL heredada | El código solo escribe password_hash; la base antigua requiere migración autorizada |
| Contenido falla por category/type | Esquema histórico carece de category y admite tipos distintos |
| `ENOENT uploads/content` | Crear carpeta y arrancar desde backend |
| Imagen 404 | Revisar archivo físico, getBackendUrl y VITE_API_URL terminada en /api |
| Evidencia rechazada | Revisar tamaño, extensión y MIME reales; filtro MOV/AVI puede ser restrictivo |
| Aprobado con 0 puntos | Grupo/nivel sin coincidencia; CSV sin grupo institucional |
| No existe periodo activo tras error | Creación desactivó otros antes de INSERT fallido |
| Token expirado | Cerrar sesión e ingresar; no hay refresh |
| Recargar /admin devuelve 404 de hosting | Falta fallback SPA a index.html |
| Excel falla o tarda | Token/rol, consulta SQL, memoria y volumen de registros |
| Letras acentuadas extrañas en terminal | Revisar lectura UTF-8; no reemplazar textos basándose solo en PowerShell mal decodificado |

## Seguridad y alcance de acceso

El código parametriza consultas y utiliza hashes y autorización por rol, pero eso no constituye una auditoría de seguridad. La creación de reciclaje valida en backend su referencia contra material, cantidad y catálogo. Persisten otros hallazgos concretos: uploads públicos, límite ausente en contenido, token en localStorage, errores internos visibles en otros endpoints y autenticación sin rate limit. Prioridades detalladas en [calidad](09-CALIDAD-Y-PENDIENTES.md). Definir acceso institucional antes de un despliegue externo.
