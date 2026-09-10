# Calidad, verificaciones y pendientes

[Índice](00-INDICE.md)

## Revisión controlada D01–D10

Los diez hallazgos se contrastaron nuevamente con código, rutas, SQL, seed y CSV antes de editar. El esquema oficial único es [database/schema.sql](../database/schema.sql); las otras dos rutas solo lo incluyen. Durante esa entrega D01–D10 no se modificaron frontend, rutas ni reglas de puntuación.

Se ejecutaron seis pruebas aprobadas en un cluster PostgreSQL 18.1 nuevo, temporal y aislado, sin leer .env ni conectar a la base de la aplicación. Se prepararon 39 consultas estáticas de controladores, se comprobó la instalación vacía, seed sin escrituras, importación de 56 filas repetida sin cambios, conflictos sin sobrescrituras, restricciones de contenido, bcrypt y alta con solo password_hash. Los únicos usuarios creados fueron fixtures de prueba en ese cluster, que quedó detenido. Ver [procedimiento](../database/README.md) y [reporte](11-CORRECCION-D01-D10.md).

## Hallazgos de instalación y datos

CORREGIDO se refiere al código y la instalación nueva probados, no a una base existente migrada. No se ejecutó ninguna migración ni se borraron datos existentes.

| ID | Verificación previa | Estado y evidencia posterior |
| --- | --- | --- |
| D01 | Tres definiciones SQL divergentes, contando docs/sql | **PARCIAL**: única definición oficial y 39 consultas preparadas correctamente. La conciliación de una base existente requiere su esquema real y decisiones de datos; no se ofrece migración ciega. |
| D02 | createUser duplicaba hash en password y password_hash | **CORREGIDO en código/base nueva**: esquema, controlador y bootstrap solo escriben password_hash; INSERT real y bcrypt verificados. Una columna password NOT NULL heredada requiere migración antes de usar este código allí. |
| D03 | category ausente y tipos antiguos en backend/schema | **CORREGIDO en base nueva**: cuatro categorías y cuatro tipos actuales; restricciones verificadas contra frontend y SQL preparado. Clasificar contenido antiguo sigue siendo una decisión manual. |
| D04 | Faltaban catálogo/referencias en esquemas históricos | **CORREGIDO en base nueva**: points_catalog y tres catalog_* definidos; SQL de crear/revisar preparado. No se infieren referencias para registros antiguos. |
| D05 | CSV de evidencia descriptiva contra BOOLEAN | **CORREGIDO en base nueva**: evidence_required TEXT; 56 filas originales importadas. Una base con BOOLEAN necesita conciliación manual, sin conversión inventada. |
| D06 | CSV sin Dependencias institucionales | **PENDIENTE DE DECISIÓN**: CSV intacto; no se inventan acciones/grupos/puntos institucionales. Se necesitan valores autorizados para las cinco referencias del formulario. |
| D07 | Hash seed no coincidía con clave anunciada, comprobado otra vez | **CORREGIDO**: seed sin credenciales; bootstrap exige datos explícitos, bcrypt verificable y no sustituye cuentas. Alta probada en cluster aislado; crear/verificar admin real queda para instalación manual. |
| D08 | Seed con periodo abril 2026, video de demostración y tipos antiguos | **CORREGIDO en instalación**: seed sin escrituras ni datos prefijados. Filas de instalaciones anteriores permanecen intactas. |
| D09 | Repetir seed podía duplicar premios/contenidos | **CORREGIDO en instalación**: seed ejecutado dos veces sin escrituras; bootstrap repetido aborta sin cambiar cuenta. Duplicados anteriores requieren revisión manual. |
| D10 | Importación absoluta y sin control de duplicados | **CORREGIDO**: ruta relativa desde raíz, staging, transacción y bloqueo; segunda carga no cambia filas, conflicto aborta y el índice de identidad evita duplicados nuevos. |

## Retiro controlado de premios y ganadores — F01–F03

Premios y ganadores están fuera del alcance actual del producto. Se retiraron sus páginas, rutas, enlaces, llamadas, controladores y endpoints, y `GET /public/ranking` volvió a limitarse a `currentPeriod` y `ranking`. No se modificó el cálculo de posiciones o puntos. Las tablas `prizes`, `winner_records` y `rewards` permanecen deliberadamente como legado; no se ejecutó SQL destructivo ni se modificaron datos.

F11–F20, S01–S12 y T01–T28 permanecen sin resolver por alcance. F10 está corregido según la regla autorizada descrita abajo. Las menciones T23/T24 se conservan como registro histórico de las pruebas que evidenciaban el módulo retirado, no como funcionalidad vigente.

## Fuente única de puntuación — F04

La utilidad `calculatePoints.js` era código muerto: ninguna ruta o controlador la importaba y aplicaba una fórmula distinta al flujo vigente. Se eliminó sin integrarla. La fuente actual continúa siendo `points_catalog.points`, consultada durante la aprobación y almacenada en `recycling_records.points_awarded`; el ranking continúa sumando ese campo para registros aprobados del periodo activo.

## Autoridad de referencias de catálogo — F05

El formulario conserva los tres campos `catalog_*` para compatibilidad, pero dejaron de ser autoridad. Al crear un registro, el backend deriva la referencia vigente a partir de `material_type` y `quantity`, comprueba que los tres valores enviados coincidan y exige que la identidad exista en `points_catalog`. Una combinación manipulada, incoherente o no configurada devuelve 400; el INSERT utiliza los textos canónicos leídos del catálogo y fija `points_awarded` en cero.

La aprobación no cambió: `reviewRecord` obtiene `points_catalog.points`, el rechazo asigna cero y el ranking suma `points_awarded` de aprobados. No se aceptan `points` ni `points_awarded` del cliente. La protección contra referencias manipuladas está implementada, pero F05 queda **PARCIAL** porque la identidad orgánica ofrecida por la interfaz no existe en el catálogo y ahora se rechaza de forma segura. Cerrar el flujo sin regresión requiere definición funcional y valores institucionales autorizados.

## Metadatos descriptivos del catálogo — F06

Las 56 filas contienen `evidence_required` no vacío, con 53 instrucciones distintas que pueden exigir fotos, videos, enlaces, GPS, documentos o validaciones de sistema/historial. `max_frequency` contiene diez expresiones textuales: `Ilimitado`, `Mensual`, `Semanal`, `Trimestral`, `Semestral`, `Única vez`, `1 por visita`, `2 al mes`, `2 por semana` y `3 por semana`. No se definen ventanas, sujeto del conteo, visitas ni procedimiento de comprobación. No existe lógica ejecutable de rachas.

No se implementó una interpretación incompleta. API, reglas y manual dejan explícito que evidencia de catálogo, frecuencia y rachas son metadatos informativos y no participan en creación, revisión, aprobación o puntos. Bajo el alcance original —no presentarlas como automatizadas— F06 queda **CORREGIDO**; automatizarlas sería una regla institucional futura, no una corrección deducible.

## Rangos y referencia orgánica — F07

Frontend y backend conservan los límites heredados `q <= 5`, `5 < q <= 15`, `15 < q <= 30` y `q > 30`. El catálogo solo aporta etiquetas descriptivas: no determina cómo tratar 5.1–5.9 ni 15.1–15.9, aunque `step="0.1"` los permite. Tampoco aclara si los 5 kg orgánicos son valor exacto, mínimo, bloque, frecuencia o descripción. La fila semejante de `Hogares` no autoriza su uso para `Dependencias institucionales`.

Se documentaron y probaron estos hechos sin cambiar límites, redondear, reutilizar 40 puntos ni crear catálogo. F07 queda **PARCIAL**: la caracterización técnica está cerrada, pero requiere definición institucional de decimales y orgánico. Con F05 activo, orgánico continúa rechazado cuando su identidad no existe.

## Revisión administrativa atómica — F08

Auditoría previa: `AdminReviewsPage` envía PATCH `/api/recycling/:id/review`; `recyclingRoutes` aplica `authenticateToken` (firma y expiración JWT) y `authorizeRoles('admin')` antes de `reviewRecord`. La UI solo ofrece decisiones sobre pendientes, pero el controlador permitía todas las combinaciones entre pending, approved y rejected: SELECT sin bloqueo, consulta de catálogo al aprobar y UPDATE independiente. Aprobar repetidamente recalculaba puntos; aprobar/rechazar invertía decisiones y sustituía administrador, fecha y notas. Dos solicitudes podían completar con última escritura ganadora. `getCatalogPoints` y UPDATE no compartían transacción.

Ahora una conexión obtenida con `pool.connect()` ejecuta BEGIN, SELECT por ID FOR UPDATE, comprobación de pending, lectura del catálogo al aprobar, UPDATE y COMMIT antes de responder. El bloqueo se mantiene hasta terminar la transacción: otra revisión espera y comprueba el estado ya confirmado, devolviendo 409. Inexistente devuelve 404; decisión distinta de approved/rejected, 400; fallo interno, 500 sin detalles SQL. Los caminos de abandono transaccional ejecutan ROLLBACK; la conexión se libera en finally y se descarta si falla el rollback.

Auditoría disponible: el esquema oficial y la migración D01 contienen `status`, `reviewed_by`, `reviewed_at`, `review_notes` y `points_awarded`; no existe `rejection_reason` separado ni tabla de historial de revisiones. `review_notes` conserva el comentario o motivo, `reviewed_by` procede del JWT y `reviewed_at` de NOW(). La prueba D01 verifica la equivalencia de columnas y restricciones de una instalación migrada temporal frente al esquema oficial. No se inspeccionó ni modificó la base real durante F08. Solo se conserva una decisión por registro; los logs de archivos no son auditoría inmutable y la FK permite perder reviewed_by si se elimina al usuario. No se reconstruyen decisiones históricas sobrescritas ni se crea una tabla nueva.

Puntuación y compatibilidad: creación continúa pending con cero; aprobación conserva la consulta y normalización existentes de `points_catalog.points` (incluido el retorno cero heredado si falta referencia); rechazo fija cero. Se ignoran points/points_awarded del cliente. No se modificaron catálogo, ranking, publicController, frontend ni F05–F07. El frontend ya muestra el mensaje de error recibido para un conflicto 409.

Validación: `node --test backend/tests/*.test.js` con `ECOAMIGOS_TEST_PG_BIN` apuntando a PostgreSQL 18 aprobó 45 pruebas, sin fallos ni omisiones, incluidas F01–F07, instalación y migración temporales. F08 aporta 12 subpruebas (13 contando el contenedor): transiciones, auditoría persistida, entradas manipuladas, 400/404/409/500 y error de trigger diferido después de UPDATE que revierte la decisión completa al fallar COMMIT. En cuatro combinaciones concurrentes se observó `wait_event_type='Lock'` en PostgreSQL: una respuesta 200 y otra 409, conservando exactamente la fila de la primera revisión. Las 56 filas del catálogo temporal se compararon antes/después sin diferencias. Clústeres temporales detenidos; ninguna conexión a ecoamigos.

También pasaron sintaxis de los 24 archivos JavaScript del backend, build frontend (solo avisos de deprecación de Vite) y git diff --check. El test de instalación solo se adaptó para excluir BEGIN/COMMIT/ROLLBACK de PREPARE, que admite consultas preparables y no órdenes de transacción. Sin commit ni push. F09–F20 fuera de alcance.

## Regla comprobada antes de corregir F09

La regla existente es máximo un período activo, con cero permitido: el esquema instala vacío y usa false como valor predeterminado; POST permite crear inactivos; getRanking devuelve currentPeriod null y ranking vacío sin activo. AdminSettingsPage solo crea/lista períodos; no existen endpoints de activación de períodos existentes, edición ni desactivación independiente. Crear uno activo desactiva los anteriores. Las fechas no activan ni vencen períodos automáticamente. El formulario de reciclaje consume currentPeriod desde ranking y bloquea el envío sin activo; el backend de registros acepta period_id o null, asunto que permanece para F10.

Antes de F09, createPeriod ejecuta UPDATE de todos los períodos y luego INSERT mediante consultas independientes. Un INSERT fallido deja el anterior inactivo y las solicitudes concurrentes pueden dejar varios activos. Ni schema.sql ni D01 incluyen unicidad parcial de is_active. Ranking oculta esa multiplicidad con ORDER BY y LIMIT 1; la interfaz de ranking y el formulario de registro dependen de ese resultado único.

### Resultado F09 — CORREGIDO

`POST /api/admin/periods`, protegido por JWT y rol admin, es la única ruta que escribe períodos. Ahora utiliza una conexión dedicada con BEGIN, LOCK TABLE periods IN SHARE ROW EXCLUSIVE MODE, UPDATE si se crea activo, INSERT y COMMIT. Ante fallo ejecuta ROLLBACK; finally libera la conexión y la descarta si falla el rollback. No se agregaron endpoints. Los logs no condicionan una confirmación ya persistida. Se conserva 201 y la fila creada; errores controlados 400/409/500, sin SQL al cliente. No corresponde 404 porque no hay operación sobre un período existente por ID.

El bloqueo serializa los escritores incluso cuando no hay filas, sin bloquear lecturas ordinarias. El índice único parcial `periods_one_active_uidx` sobre is_active WHERE is_active = true impide más de un activo incluso desde SQL externo. Cero activos continúa permitido. schema.sql y D01 actualizado incluyen la misma definición. Para instalaciones ya migradas con D01 anterior se preparó `database/20260909_f09_periods_one_active.sql`, de una sola aplicación. Ambas migraciones detectan múltiples activos bajo bloqueo y abortan toda la transacción sin reconciliar datos. No se ejecutaron sobre ecoamigos real.

Validación F09: 10 subpruebas específicas (11 contando su contenedor) en PostgreSQL 18 temporal comprueban creación activa/inactiva, reemplazo, cero activos, errores 400/409/500, rollback después de desactivar, protección de INSERT/UPDATE SQL, migración compatible y aborto ante múltiples activos. Dos pruebas concurrentes —tabla vacía y con activo previo— observaron espera real `wait_event_type='Lock'`: ambas solicitudes respondieron 201 en orden serializado y solo el segundo período quedó activo. Durante la pausa posterior al UPDATE, getRanking siguió leyendo el estado confirmado anterior. La prueba D01 adicional verifica aborto íntegro por múltiples activos y la comparación de índices confirma equivalencia con la instalación nueva.

Suite completa `node --test backend/tests/*.test.js`, con `ECOAMIGOS_TEST_PG_BIN` definido: **57 pruebas aprobadas, cero fallos y cero omisiones**, incluidas F01–F08, instalación y migración. F08 conserva sus cuatro pruebas concurrentes y rollback. Sintaxis de 25 archivos JavaScript del backend, build frontend y git diff --check correctos; build solo emitió avisos de deprecación de Vite. Las 56 filas del catálogo temporal permanecieron idénticas antes/después de F09 y su CSV no cambió. Clústeres aislados detenidos. Sin cambios en ranking, reciclaje, puntos, indicadores ni reglas F05–F07; sin commit ni push. F10–F20 permanecen fuera de alcance.

## Autoridad del período y fecha de actividad — F10 CORREGIDO

Auditoría previa: POST `/api/recycling` aplica JWT, roles leader/admin, upload.single('evidence') y createRecord. RegisterRecyclingPage envía material_type, quantity, unit, quality_level, criteria_count, notes, period_id, record_date, los tres catalog_* y evidence opcional. period_id procede de currentPeriod de GET `/public/ranking`, sin selector de períodos. record_date se iniciaba/reiniciaba con new Date().toISOString().slice(0,10) y un input date editable, sin min/max. El manual pide indicar la fecha y el diccionario la llama fecha declarada; created_at conserva separadamente el momento de creación.

createRecord validaba material/cantidad/referencia de catálogo (F05), normalizaba textos y fijaba pending/0, pero insertaba period_id recibido o null y record_date recibido o new Date(). Una llamada directa podía enviar cualquier período existente, incluido inactivo, omitirlo o declarar una fecha arbitraria aceptada por PostgreSQL; uno inexistente fallaba por FK con 500. La UI bloqueaba el envío sin activo y el backend no. El esquema oficial y D01 tienen record_date DATE NOT NULL DEFAULT CURRENT_DATE, period_id nullable con FK ON DELETE SET NULL y start_date/end_date NOT NULL, sin check de rango ni orden. F09 protege máximo un activo; no vincula la bandera al día actual. Los otros relojes (NOW de created_at/reviewed_at, logs ISO y Date del libro exportado) no demuestran reglas adicionales para la fecha declarada.

Regla funcional aprobada: `record_date` representa la fecha en la que se realizó la actividad de reciclaje reportada. Debe existir un activo, el ID recibido debe coincidir con él, y la fecha debe ser calendario válido, cumplir `start_date <= record_date <= end_date` y `record_date <= CURRENT_DATE`. Ambos extremos son inclusivos. Una actividad pasada es válida dentro del activo; una fecha futura se rechaza aunque pertenezca al rango. La decisión autorizada resuelve la ambigüedad que mantenía F10 PARCIAL. end_date no admite NULL en el esquema oficial/migrado.

Implementación: backend consulta el activo bajo BEGIN y LOCK TABLE periods IN SHARE MODE. Exige exactamente una fila y coincidencia estricta del ID recibido, como número o cadena decimal canónica; inserta el ID consultado. Sin activo o ID distinto/omitido/manipulado: 409; fecha inválida, fuera de rango o futura: 400; fallo interno: 500 genérico. Fecha YYYY-MM-DD se valida como calendario real, años 0001–9999 y bisiestos. PostgreSQL evalúa `COALESCE($1::date, CURRENT_DATE) BETWEEN start_date AND end_date AS in_period` y `COALESCE($1::date, CURRENT_DATE) <= CURRENT_DATE AS not_future` al consultar el activo. Si alguna condición falla, ejecuta ROLLBACK y no inserta; si ambas fallan, prioriza el mensaje de rango. Omitido/null/vacío usa CURRENT_DATE y pasa por ambas condiciones. La autoridad temporal es PostgreSQL (fecha de transacción, zona de sesión), sin conversiones a timestamp ni Date de Node. El formulario conserva la sugerencia local editable; no necesita cambios adicionales para imponer esta regla desde backend.

Concurrencia: F10 bloquea periods antes de consultar e insertar; F09 toma primero su SHARE ROW EXCLUSIVE, incompatible con SHARE. Las altas pueden coexistir y ninguna modifica periods ni necesita elevar el bloqueo; no se introduce inversión de orden con F09. F10 mantiene el bloqueo hasta COMMIT/ROLLBACK. Si F10 llega primero, el registro se confirma asociado al activo de ese instante; luego F09 puede desactivarlo legítimamente. Si F09 llega primero, F10 ve el nuevo activo y rechaza el ID anterior sin INSERT. Ante fallo se revierte y libera la conexión (se descarta si falla rollback). F05 y su consulta de catálogo conservan la lógica anterior; F08, F09, ranking y puntos no se modifican. No se cambió el esquema ni se migraron registros históricos.

Validación: 20 subpruebas F10 (21 contando el contenedor) en PostgreSQL 18 temporal prueban ausencia de activo, IDs inexistentes/inactivos/otros/manipulados, alta pending/0, fechas inválidas/imposibles, inicio inclusivo, interior, fin inclusivo pasado/hoy, antes/después del rango, futuras dentro/fuera/en extremos y bisiesto válido pasado. Los períodos y actividades de estas comparaciones se construyen respecto de CURRENT_DATE de PostgreSQL; el bisiesto se obtiene de un año anterior calculado por PostgreSQL. No dependen de una campaña fija que envejezca. Se conserva la prueba CURRENT_DATE con TZ Node distinta, el fallo diferido en COMMIT con rollback íntegro y concurrencia F09↔F10 en ambos órdenes. Se observó wait_event_type='Lock': alta primero devuelve 201 y permite después el cambio; cambio primero devuelve 201 y el alta obsoleta 409, sin insertar. La prueba usa una identidad institucional sintética exclusivamente en el clúster descartable para pasar F05 y compara intactas las 56 filas originales antes/después.

Suite completa: **78 pruebas aprobadas, cero fallos/omisiones**, incluidas F01–F09, instalación y migraciones D01/F09; F08 y F09 mantienen sus pruebas concurrentes y rollback. Sintaxis de 27 archivos JavaScript backend, build frontend (solo avisos de deprecación Vite) y git diff --check correctos. Clústeres temporales detenidos. Sin conexión ni modificación de ecoamigos real, sin cambios al CSV/catálogo distribuido, sin commit/push. F11–F20 fuera de alcance.

F10: **CORREGIDO**. La regla funcional autorizada está implementada y probada desde backend con comparación DATE y CURRENT_DATE de PostgreSQL. Los estados de F05/F06/F07/F08/F09 se conservan.

## Hallazgos funcionales y técnicos

| ID | Hallazgo | Consecuencia / prioridad de revisión |
| --- | --- | --- |
| F01 | WinnersPage espera id/final_score/prize_name; API entrega otros campos | **CORREGIDO mediante retiro controlado**: WinnersPage, su ruta, imports y enlaces fueron eliminados |
| F02 | winners agrega todos los equipos aprobados, no solo ganadores | **CORREGIDO mediante retiro controlado**: la agregación `winners` fue eliminada; ranking conserva únicamente el periodo activo y sus posiciones |
| F03 | Premios públicos incluyen is_active false | **CORREGIDO mediante retiro controlado**: premios ya no se consultan ni exponen en API o frontend; tablas históricas conservadas |
| F04 | Fórmula calculatePoints sin uso | **CORREGIDO**: utilidad obsoleta eliminada; documentada y probada `points_catalog.points` como única fuente vigente |
| F05 | Grupo/acción/nivel recibidos del cliente | **PARCIAL**: referencias manipuladas se rechazan, pero orgánico perdió el flujo anterior porque su identidad institucional no existe; cierre depende de D06/F07 |
| F06 | Frecuencia, rachas y evidencia del catálogo no se validan | **CORREGIDO en contrato/documentación**: se demostró que son textos informativos ambiguos y que no existe automatización; no se inventaron bloqueos |
| F07 | Orgánico siempre refiere a 5 kg; decimales entre límites | **PARCIAL**: límites heredados conservados y discrepancias documentadas/probadas; faltan definiciones institucionales para decimales y orgánico |
| F08 | Revisión se puede repetir sin restricción y sin transacción | **CORREGIDO**: solo pending, transacción en una conexión, SELECT FOR UPDATE, COMMIT/ROLLBACK y auditoría existente; concurrencia comprobada en PostgreSQL aislado |
| F09 | Crear periodo activo usa UPDATE e INSERT separados | **CORREGIDO**: transacción, bloqueo de escritores, rollback e índice único parcial; cero activos permitido, schema/D01/migración incremental probados en PostgreSQL aislado |
| F10 | Fechas/periodo activo no se validan al crear registro | **CORREGIDO**: activo e ID protegidos frente a F09; fecha de actividad válida dentro del rango inclusivo y no posterior a CURRENT_DATE, comprobada por PostgreSQL |
| F11 | Admin puede registrar, pero normalmente no tiene equipo | Puede fallar team_id NOT NULL |
| F12 | Límite de 15 solo frontend | No se cumple si se usa API directamente |
| F13 | Estadísticas suman todos los estados/unidades | Indicadores no equivalen a reciclaje aprobado en kg |
| F14 | Factores ambientales sin fuente trazable en repositorio | Requieren revisión metodológica antes de uso institucional |
| F15 | Solo contenido tiene CRUD completo | No hay edición/baja de usuarios, equipos o periodos |
| F16 | Sin endpoint de recuperación/cambio de contraseña | Soporte requiere intervención autorizada |
| F17 | Algunas promesas UI sin catch y sin 404 SPA | Errores pueden verse como vacíos o páginas sin contenido |
| F18 | showToast cambia identidad, depende efecto de registro | Posibles consultas repetidas al actualizar avisos |
| F19 | Input file no se limpia explícitamente tras registro | Revisar coherencia visual entre archivo elegido y estado reiniciado |
| F20 | Modal sin focus trap/Escape; menú oculto | Accesibilidad y navegación móvil requieren QA |

## Seguridad y operación

| ID | Evidencia | Acción pendiente |
| --- | --- | --- |
| S01 | JWT conserva role/team_id; me no valida is_active | Definir revocación y comprobación actualizada de permisos |
| S02 | Token en localStorage | Evaluar estrategia de sesión y mitigación XSS |
| S03 | Login sin límite de intentos; errores SQL visibles | Endurecer autenticación y manejo uniforme de errores |
| S04 | Multer contenido sin límite/filtro | Aplicar validación de contenido, tamaño y nombres |
| S05 | Evidencias y borradores disponibles por URL pública | Definir autorización real de archivos |
| S06 | Archivos huérfanos al fallar SQL, editar o borrar | Implementar limpieza consistente y política de retención |
| S07 | Filtro de evidencia regex/MIME limitado | Probar MIME reales y validar contenido del archivo |
| S08 | CORS fijo y CLIENT_URL ignorada | Configuración por entorno antes de desplegar |
| S09 | Puerto DB fijo, sin SSL parametrizable | Adaptar a infraestructura seleccionada |
| S10 | Logs síncronos sin rotación | Controlar disco, retención y acceso a datos personales |
| S11 | Exportación completa en memoria | Medir límites y considerar volumen/paginación |
| S12 | No pruebas/CI, lockfiles sin auditoría en esta tarea | Añadir verificaciones y evaluar dependencias por separado |

Esta lista deriva del código; no es un escaneo de vulnerabilidades ni una afirmación de explotación. No se modificó la lógica para corregir estos puntos en la entrega de documentación.

## Matriz de pruebas manuales

Usar base aislada, dos roles y datos ficticios. Registrar resultado, fecha, entorno y evidencia sin secretos. “Esperado” indica el contrato implementado o el fallo conocido que debe detectarse, no una prueba ya aprobada.

| Caso | Procedimiento | Resultado esperado |
| --- | --- | --- |
| T01 Build | npm --prefix frontend run build | dist generado; registrar warnings |
| T02 Salud | GET / y GET public/ranking | Express responde; consulta SQL válida con esquema compatible |
| T03 Login válido | Cuenta activa y bcrypt válido | JWT 8h; redirección según rol |
| T04 Login inválido/inactivo | Clave incorrecta o cuenta inactiva | 401 sin sesión |
| T05 Autorización | Sin token / JWT vencido / líder en admin | 401 / 403 / 403 |
| T06 Persistencia | Recargar con JWT válido, luego cerrar sesión | Recupera usuario; logout limpia token |
| T07 Alta de equipo/líder | Crear equipo y usuario vinculado | 201 y visible en listado; comprobar columnas hash |
| T08 Cupo | Llegar a 15 cuentas de prueba | UI impide alta; documentar ausencia de control API |
| T09 Periodo | Crear activo; consultar ranking | Nuevo activo seleccionado y anterior inactivo |
| T10 Sin periodo | Formulario con ranking sin activo | Botón enviar deshabilitado |
| T11 Registro | Material válido con evidencia PNG pequeña | 201 pending, puntos 0, archivo accesible |
| T12 Validación | Cantidad cero, tipo inválido, archivo >20 MiB | Registrar rechazo y formato real del error; no asumir 400 uniforme |
| T13 Catálogo | Crear referencias de prueba aprobadas para cinco niveles | Cada nivel asigna exactamente sus puntos configurados |
| T14 Sin coincidencia | Intentar crear registro con grupo inexistente | 400 controlado; no se crea ni llega a aprobación |
| T15 Límites | Cantidades 5, 5.1, 15, 15.1, 30, 30.1 y orgánico | Referencias según tabla de reglas |
| T16 Rechazo | Revisar pending como rejected | 0 puntos, revisor, fecha y notas |
| T17 Revisión repetida | API vuelve a revisar un aprobado | Reemplaza revisión; no hay historial inmutable |
| T18 Historial personal | Dos líderes de mismo equipo | mine solo devuelve registros del usuario actual |
| T19 Ranking | Aprobados/pending de dos periodos y empate | Solo aprobados del activo; empate por nombre |
| T20 Estadísticas | Registros de estados/unidades distintos | Suma global; dejar constancia de limitación |
| T21 Contenido | Crear cuatro tipos por categoría, draft/published | Público solo devuelve publicados |
| T22 Editar/eliminar | Editar sin/con archivo, después borrar | Conserva/sustituye URL; archivo viejo permanece |
| T23 Ganadores | Consultar winners con datos | Detectar incompatibilidad de campos y alcance |
| T24 Premios | Crear premio inactivo | API pública también lo devuelve |
| T25 Excel | Descargar con admin y comprobar filas/columnas | XLSX de 9 columnas, todos los registros consultados |
| T26 Responsive | 360, 768 y 1440 px; teclado | Sin recortes de formularios; tablas desplazables; foco visible |
| T27 Navegación directa | Recargar /educacion/agua y /admin en hosting | Fallback SPA; rol sigue protegido por API |
| T28 Restauración | Restaurar dump/uploads a entorno aislado | Datos y evidencias coherentes; login/exportación operativos |

## Comandos disponibles

```powershell
npm --prefix frontend run build
node --check backend/src/server.js
git diff --check
```

El control de sintaxis no ejecuta consultas. Vite emitió avisos de deprecación por opciones usadas por el plugin React; el build finalizó. Cualquier actualización de dependencias debe tratarse como una tarea independiente con pruebas, no como parte implícita de la documentación.
