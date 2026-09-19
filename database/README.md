# Instalación y migraciones de datos

## Fuente oficial

**`database/schema.sql` es la única definición PostgreSQL oficial.** Instala tablas vacías en una transacción. `backend/schema.sql` y `docs/sql/schema-referencia.sql` son entradas `psql` con `\ir`: no contienen otra definición. Si existe una tabla/tipo previo, la instalación falla sin reemplazarlo. No es una migración y no debe ejecutarse sobre una base existente.

El esquema almacena hashes únicamente en `users.password_hash`. Conserva `points_catalog` y las tres columnas catalog_* usadas por createRecord/reviewRecord. Contenido admite categorías agua/energia/papel/residuos y tipos text/image/video/file. `evidence_required` es texto porque las 56 filas del CSV contienen instrucciones, no booleanos. Una identidad de catálogo es grupo/acción/nivel con trim, minúsculas y null del nivel equivalente a vacío; un índice único usa exactamente esa identidad.

No se crea ningún usuario, equipo, periodo, premio ni contenido predeterminado. No se convierte un grupo histórico en institucional ni se asignan valores nuevos.

## Base nueva

Desde la raíz, sustituir el nombre de base por el elegido por el responsable:

```powershell
psql -X -h localhost -U postgres -d postgres -v ON_ERROR_STOP=1 -c 'CREATE DATABASE REEMPLAZAR_BASE;'
psql -X -h localhost -U postgres -d REEMPLAZAR_BASE -f database/schema.sql
```

No repetir la primera instrucción si ya existe. Estas instrucciones son para que el responsable prepare una base nueva; no se ejecutaron sobre la base de la aplicación en esta tarea.

## Primer administrador sin credenciales predeterminadas

Desde la raíz, generar un hash de una clave decidida por el responsable. Requiere dependencias del backend y PowerShell; la contraseña entra por stdin al script, no como argumento de proceso:

```powershell
$credencialAdmin = Get-Credential -Message 'Correo y clave del administrador que se va a crear'
$nombreAdmin = Read-Host 'Nombre del administrador'
$claveAdmin = $credencialAdmin.GetNetworkCredential().Password
$encodingAnterior = $OutputEncoding
try {
  $OutputEncoding = [System.Text.UTF8Encoding]::new($false)
  $hashAdmin = $claveAdmin | node backend/scripts/hash-password.js
  if ($LASTEXITCODE -ne 0) { throw 'No se pudo generar el hash.' }
} finally {
  $OutputEncoding = $encodingAnterior
  Remove-Variable claveAdmin -ErrorAction SilentlyContinue
}
```

Abrir `psql` sin historial, pasando solo datos explícitos y el hash; no imprimir ni publicar el hash:

```powershell
psql -X -n -h localhost -U postgres -d REEMPLAZAR_BASE -v "admin_name=$nombreAdmin" -v "admin_email=$($credencialAdmin.UserName)" -v "admin_password_hash=$hashAdmin" -f database/create_admin.sql
if ($LASTEXITCODE -ne 0) { throw 'No se creo la cuenta. Revisar el error de psql.' }
Remove-Variable credencialAdmin, nombreAdmin, hashAdmin
```

El script valida presencia de datos y formato bcrypt de costo 10. No actualiza una cuenta existente: email repetido aborta, sin cambiar nombre, rol ni contraseña. Para mantener esta propiedad no usar un upsert que reemplace credenciales. Verificar login manual con la cuenta real una vez creada. `backend/src/seed.sql` es ahora un aviso sin escrituras; ejecutarlo repetidamente no crea datos.

## Catálogo histórico optativo

Solo si el responsable desea cargar las filas distribuidas, ejecutar desde la raíz:

```powershell
psql -X -h localhost -U postgres -d REEMPLAZAR_BASE -f database/import_points_catalog.sql
```

La ruta del CSV es relativa a la raíz y no depende del nombre de usuario ni de la ubicación absoluta del proyecto. `\copy` utiliza el archivo del cliente. Se carga primero en tabla temporal, se valida y se inserta en transacción. Repetir el mismo archivo no añade filas ni cambia puntos; entradas duplicadas o diferencias con una identidad existente abortan toda la operación. No se borran duplicados ni se sobrescribe información existente. Dos importaciones se serializan con un bloqueo de tabla durante la transacción.

El CSV original no se modifica: conserva códigos (incluidos los que parecen fechas), textos, grupos y puntos. **D06 sigue pendiente:** no tiene Dependencias institucionales, requerido por el formulario. Se necesita un catálogo institucional autorizado; no copiar automáticamente valores de Hogares. Las cinco referencias exactas siguen documentadas en `docs/06-REGLAS-Y-BACKEND.md`.

## Base existente: migraciones versionadas, aplicación deliberada

El proyecto informa **aplicación y verificación de D01/F09/F16/S01 en PostgreSQL local de desarrollo/QA**. No equivale a infraestructura institucional de producción, que no se ha desplegado. Esta consolidación no ejecuta SQL. En otro destino, respaldar y consultar su estado antes de escoger scripts; no ejecutar toda la lista indiscriminadamente ni aplicar schema.sql sobre tablas existentes.

[inspect_existing.sql](inspect_existing.sql) permite diagnosticar el esquema sin datos sensibles. [20260908_d01_migrate_existing.sql](20260908_d01_migrate_existing.sql) ya existe: reconoce la instalación histórica inspeccionada, usa transacción y bloqueo, valida datos/restricciones y aborta ante incompatibilidades que no puede resolver sin inventar información. No es un migrador universal ni elimina tablas, columnas o filas. Conserva estructuras heredadas; la aplicación usa password_hash. Categorías, duplicados o referencias ambiguas requieren decisión sobre los datos antes de volver a intentar.

| Paso condicionado al destino | Aplicación | Verificación y repetición |
| --- | --- | --- |
| D01: instalación histórica reconocida | [20260908_d01_migrate_existing.sql](20260908_d01_migrate_existing.sql) | [verify_20260908_d01.sql](verify_20260908_d01.sql); comprobar compatibilidad, no usar como inicializador de base vacía |
| F09: instalación con D01 anterior al índice de período activo | [20260909_f09_periods_one_active.sql](20260909_f09_periods_one_active.sql) | Inspeccionar periods_one_active_uidx y máximo un activo; D01 actualizado y schema.sql ya lo incluyen. No repetir si existe |
| F16: instalación conciliada sin password_reset_tokens | [20260912_f16_password_reset.sql](20260912_f16_password_reset.sql) | [verify_20260912_f16.sql](verify_20260912_f16.sql); una aplicación, aborta si la tabla existe |
| S01: versión de sesión | [20260914_s01_session_version.sql](20260914_s01_session_version.sql) | [verify_s01_session_version.sql](verify_s01_session_version.sql); idempotente, conserva versiones previas |

Una instalación vacía con schema.sql actual ya incluye esas estructuras. La migración D01 no incorpora F16/S01 posteriores. F09 permite cero activos y rechaza múltiples activos preexistentes sin elegir un ganador. S01 requiere nuevo login para JWT antiguos sin sv; no volver a un backend que ignore la versión de sesión.

Ejemplo de diagnóstico, sustituyendo destino y parámetros de conexión por los autorizados:

```powershell
psql -X -h localhost -U postgres -d REEMPLAZAR_BASE -v ON_ERROR_STOP=1 -f database/inspect_existing.sql
```

Para aplicar únicamente un script cuya necesidad ya fue comprobada, usar la misma conexión con -v ON_ERROR_STOP=1 y -f seguido de su ruta en la tabla. Registrar salida y ejecutar su verificación antes de habilitar la aplicación. Las suites de instalación/migración usan clústeres temporales; no sustituyen el respaldo y la revisión de un destino nuevo. Estado consolidado: [D/F/S](../docs/15-TRAZABILIDAD-Y-DECISIONES.md).

## Premios y ganadores fuera del alcance de producto

Se conserva compatibilidad temporal, no se reactiva el módulo:

| Estructura | Dependencias y efecto de retirarla |
| --- | --- |
| prizes | Sin consultas ni rutas activas; se conserva por seguridad e historial hasta autorizar limpieza física. |
| winner_records / prize_id | Estructura histórica, sin consulta activa; relaciona teams/periods/prizes. No se borra de bases existentes. |
| rewards | Solo estaba en la antigua definición alternativa; no tiene consultas activas. El nuevo esquema no la crea. Ninguna tabla existente se elimina. |
| Código de aplicación | No hay consultas, endpoints, rutas ni pantallas activas para este módulo. |

La funcionalidad ejecutable y visible se retiró de forma controlada al resolver F01–F03. No se hizo `DROP TABLE`, `DROP COLUMN` ni migración destructiva; una limpieza física posterior requiere inventario y autorización separados.


## Instalación/migración F16 — recuperación

Una instalación vacía con schema.sql ya incluye password_reset_tokens. En una instalación existente previamente conciliada con D01/F09, revisar y ejecutar una sola vez database/20260912_f16_password_reset.sql, antes de iniciar el backend actualizado. No cambia users, registros ni catálogo; añade únicamente tabla, restricciones, secuencia e índices de recuperación. Si la tabla ya existe, aborta sin sobrescribirla: no reejecutar sobre schema nuevo. D01 sigue siendo histórico y no incorpora esta migración posterior.

Verificar con database/verify_20260912_f16.sql (transacción de solo lectura). Las pruebas F16 ejecutan ambos caminos en PostgreSQL desechable, con datos previos y repetición fallida segura. En esas pruebas se usaron clústeres desechables. El proyecto informa además aplicación/verificación local de F16 en desarrollo/QA; no en producción institucional.

No se añadieron dependencias ni variables de entorno. CLIENT_URL ya existe: debe ser el origen institucional HTTPS para construir enlaces en producción, sin fallback localhost. passwordResetDelivery.js aún no tiene proveedor; no envía emails ni imprime tokens. Implementar/configurar el adaptador institucional de entrega antes de habilitar recuperación operativa. La única captura de tokens para validar es el capturador en memoria dentro de backend/tests/f16-password-recovery.test.js; no hay modo debug HTTP.
