# Instalación y datos: D01–D10

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

## Base existente: revisión manual, no migración automática

Obtener un respaldo y un esquema sin datos. El diagnóstico provisto es de solo lectura:

```powershell
psql -X -h localhost -U postgres -d REEMPLAZAR_BASE -f database/inspect_existing.sql
```

Decisiones necesarias antes de diseñar una migración específica:

1. **users.password:** determinar si existe y qué restricciones tiene. No copiar su contenido a password_hash suponiendo que es bcrypt válido. Si password es NOT NULL, el nuevo createUser no podrá insertar hasta resolver esa restricción mediante una migración autorizada. No se borra esta columna ni sus datos en esta tarea. La aplicación nueva solo lee/escribe password_hash.
2. **Contenido antiguo:** inventariar category faltante y tipos tip/guide/blog. La categoría correcta debe decidirse por registro; no asignar agua o convertir tipos de forma indiscriminada. Conservar URL/adjuntos y contenido durante la migración.
3. **Catálogo:** verificar tipo de evidence_required, duplicados normalizados y los catalog_* de registros existentes. Un booleano no recupera la descripción original; no reemplazar datos sin una fuente aprobada. El índice nuevo solo se puede instalar una vez revisados los duplicados existentes.
4. **Relaciones antiguas:** verificar contents/rewards/leader_id/points y sus datos antes de conciliar nombres con content_items/prizes/team_id/points_awarded. No renombrar ni borrar automáticamente.
5. **Credenciales y seed anterior:** no eliminar usuarios, periodos, equipos o contenidos ya creados por un seed. Sus responsables deben determinar cuáles son reales y cuáles de demostración.

Por ello D01 y la adopción en bases existentes de D02–D05 quedan sujetos a prueba/migración manual. La prueba de una base vacía no demuestra que una base instalada esté conciliada.

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

Verificar con database/verify_20260912_f16.sql (transacción de solo lectura). Las pruebas F16 ejecutan ambos caminos en PostgreSQL desechable, con datos previos y repetición fallida segura. No se aplicó nada sobre ecoamigos real.

No se añadieron dependencias ni variables de entorno. CLIENT_URL ya existe: debe ser el origen institucional HTTPS para construir enlaces en producción, sin fallback localhost. passwordResetDelivery.js aún no tiene proveedor; no envía emails ni imprime tokens. Implementar/configurar el adaptador institucional de entrega antes de habilitar recuperación operativa. La única captura de tokens para validar es el capturador en memoria dentro de backend/tests/f16-password-recovery.test.js; no hay modo debug HTTP.
