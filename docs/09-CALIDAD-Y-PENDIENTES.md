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

F16–F20 y S01–S12 permanecen sin resolver por alcance. F10–F15 están corregidos según lo descrito abajo; la matriz T01–T28 conserva sus comprobaciones manuales con T20 actualizado para F13. Las menciones T23/T24 se conservan como registro histórico de las pruebas que evidenciaban el módulo retirado, no como funcionalidad vigente.

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

## Rol y equipo del registro — F11 CORREGIDO

Auditoría: el enum oficial/D01 contiene admin y leader; supervisor no existe como rol (la mención operativa de supervisor de procesos no es un rol de usuario). JWT conserva id/role/team_id al login y el middleware verifica firma/expiración; authorizeRoles controla rutas. Antes, POST /recycling permitía leader/admin. App.jsx permitía ambos en /leader y /leader/register; aunque la navegación admin apunta a /admin y AdminDashboard no ofrece registro, un admin podía abrir /leader directamente y usar el enlace incondicional de LeaderDashboard. ProtectedRoute redirige roles excluidos a /. Navbar solo ofrece panel líder a leader; AppLayout dirige admin a su panel. No hay selector de equipo en RegisterRecyclingPage.

createRecord toma user_id y team_id del JWT, no del body ni de auth/me. auth/me lee la identidad actual para la UI pero no modifica claims del token. Un team_id ausente llegaba al INSERT y fallaba NOT NULL con 500; uno inexistente fallaba por FK. recycling_records.team_id es INT NOT NULL con FK a teams ON DELETE CASCADE; users.team_id es nullable. El alta de usuarios fuerza null para admin; AdminUsersPage deshabilita su selector de equipo, y create_admin.sql no inserta team_id. Los seeds no aportan administradores con equipos; no se consultó la base real ni se afirma el estado de usuarios reales. No hay edición de usuarios ni registro en nombre de otro equipo.

Evidencia funcional: README dice “registro por líderes”; el manual ubica “Registrar reciclaje” bajo Líder y describe administradores sin asignación de equipo; el diagrama de secuencia de arquitectura identifica al Líder como registrador. No se encontró catálogo RF numerado ni requisito funcional que habilite registro administrativo por representación. El permiso ampliado del código y su descripción en API eran la anomalía F11, no una función de selección de equipo. Regla respaldada A: solo líder registra, con equipo válido. No hace falta una decisión funcional adicional.

Corrección: POST exige authorizeRoles('leader') antes de upload, sin cambiar permisos de otros endpoints. Admin y cualquier otro rol, incluido un claim supervisor firmado, reciben 403 incluso si tienen equipo. createRecord valida team_id JWT como entero positivo dentro de INT, devuelve 403 si falta/es inválido, y comprueba existencia con SELECT FOR KEY SHARE dentro de la transacción F10 antes de insertar. Equipo inexistente devuelve 403 y rollback; el bloqueo impide eliminarlo entre comprobación y COMMIT. No se acepta equipo del body, no se asigna ninguno automáticamente y se conservan NOT NULL/FK. La política general de claims JWT y su eventual obsolescencia no cambia en F11.

Frontend: /leader/register solo admite leader; el panel /leader conserva leader/admin y oculta su botón de registro a los demás. Navegación directa no autorizada usa el redirect existente a /. Sin rediseño ni cambios de navegación general F17. F05, validación de período/fecha y bloqueos F10 se conservan; creación sigue pending/0.

Validación: **87 pruebas aprobadas, cero fallos/omisiones**, incluidas 8 subpruebas F11 (9 contando contenedor), F01–F10, instalación, migraciones D01/F09 y concurrencia F08/F09/F10. F11 ejercita POST HTTP local con ruta, JWT, middleware y controlador reales contra PostgreSQL temporal (solo se sustituye almacenamiento de archivos, no hay adjuntos): líder válido, admin/supervisor 403, identidad sin equipo/inválida/inexistente 403, sin token 401, body sin autoridad, F05 y F10 preservados. El acceso/enlace frontend se verifica estáticamente. Las 56 filas originales de catálogo se comparan intactas; la identidad institucional adicional es fixture aislada para F05. Sintaxis de 28 archivos backend, build frontend y git diff --check correctos; build solo avisos de deprecación. Clústeres aislados detenidos. No se modificó ecoamigos real, esquema, puntos ni estados anteriores. Sin commit/push; F12–F20 fuera de alcance.

## Cupo total de usuarios — F12 CORREGIDO

Evidencia exacta: AdminUsersPage declara MAX_USERS=15, totalUsers=users.length, remainingSlots=Math.max(MAX_USERS-totalUsers,0), canCreateMore=totalUsers<MAX_USERS; detiene handleSubmit al agotarse y deshabilita el alta. listUsers consulta users sin WHERE ni filtros de actividad/equipo/rol, con LEFT JOIN teams que no excluye usuarios sin equipo. El manual especifica “15 cuentas totales”. La frase visual “habilitados para la campaña” no corresponde a un filtro de activos ni a una relación users/periods: se aclaró el texto conforme al conteo real y manual. No se encontró requisito RF numerado diferente.

Regla C: máximo 15 usuarios totales almacenados en toda la aplicación. Cuentan admins y líderes, activos e inactivos, con o sin equipo. No es por equipo, por campaña, solo líderes ni un acumulado histórico de altas eliminadas. No hay DELETE, edición, activación o reactivación de usuarios en rutas; cambios de is_active no alteran el conteo total. Un admin puede crear otro admin o líder; UI/enum admiten esos dos roles. Esquema y migraciones no tenían límite, y seeds no crean usuarios. Antes, la API aceptaba INSERT sin conteo: solicitudes directas o dos formularios obsoletos podían exceder 15. La otra vía de alta distribuida es database/create_admin.sql.

Backend: createUser calcula bcrypt costo 10 antes del bloqueo, obtiene una conexión y ejecuta BEGIN → LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE → SELECT COUNT(*)::int AS total FROM users → INSERT → COMMIT. Con total >=15 hace ROLLBACK y devuelve 409 con code USER_LIMIT_REACHED y mensaje controlado. Errores revierten y devuelven 500 genérico sin SQL; finally libera la conexión y la descarta si falla rollback. Conserva password_hash como única columna de clave, role, cuenta activa, equipo recibido para líder y null forzado para admin. El bootstrap SQL usa idéntico bloqueo/conteo dentro de su transacción y aborta al agotarse el cupo.

El bloqueo se limita a escritores de users durante conteo/INSERT; lectores y comprobaciones FK ordinarias continúan. A diferencia de un advisory lock, coordina también los escritores SQL del repositorio sin depender de una clave compartida. No se adquieren bloqueos de periods/reciclaje ni se altera F08–F11. No requiere migración/estructura nueva. SQL administrativo arbitrario que omita el control sigue pudiendo exceder el máximo; API y bootstrap quedan protegidos. Instalaciones previamente excedidas rechazan altas sin eliminar, desactivar ni cambiar usuarios. Frontend conserva su indicación preventiva y, ante 409/USER_LIMIT_REACHED, muestra el mensaje y recarga el listado para actualizar cupos.

Pruebas: **96 aprobadas, cero fallos/omisiones**, incluidas 8 subpruebas F12 (9 contando contenedor), F01–F11, instalación, migraciones D01/F09 y concurrencia F08/F09/F10. F12 usa HTTP local con router admin, JWT, middleware, controlador y bcrypt reales contra PostgreSQL temporal. Con 14 usuarios mixtos (admin/líderes e inactivos), dos POST simultáneos observaron wait_event_type='Lock': resultados 201/409 y total final exactamente 15. Se probó 15 válido/16 rechazado, rollback por unicidad y trigger diferido al COMMIT, conservación de hashes/equipos/roles, desactivación/reactivación sin cambio de cupo (fixtures SQL, no endpoints nuevos), bootstrap 14→15 y aborto posterior, y estado previo excedido sin corrección silenciosa. F05 y F08–F11 conservan protecciones y pruebas. Las 56 filas originales de points_catalog permanecieron idénticas antes/después.

Sintaxis de 29 archivos backend, build frontend y git diff --check correctos; build solo avisos de deprecación. Clústeres temporales detenidos, ninguna conexión a ecoamigos real. No se añadió migración, no se cambiaron estados anteriores, no hubo commit/push. No hace falta otra decisión funcional. F13–F20 fuera de alcance.

## Estadísticas de reciclaje aprobado — F13 CORREGIDO

### Inventario previo a la corrección

Fuentes auditadas: controladores/rutas, todas las agregaciones SUM/COUNT y reduce del frontend, dashboards, ranking público, exportación, esquema oficial/aliases/D01, seed, CSV, README, docs y pruebas. No se encontró otra estadística dinámica pública ni métrica de cumplimiento derivada de recycling_records. El texto educativo público de árboles/agua es contenido fijo, no una consulta de registros, y no se cambia en F13.

En la tabla, RR = recycling_records; “todos” los materiales son papel_carton, plastico, vidrio, metal y organico. Cantidad real = quantity expresada en unit (columna libre independiente), no kg garantizados. Todas las filas son históricas salvo donde se indica período activo.

| Nombre visible / campo API | Endpoint y consulta/campos | Estado previo (incluye pending/rejected) | Material | Unidad mostrada / unidad real de quantity | Mezcla incompatible previa | Alimenta indicadores |
| --- | --- | --- | --- | --- | --- | --- |
| Usuarios / Equipos | admin/dashboard; COUNT users / teams | No aplica | No aplica | Cuentas/equipos; sin quantity | No | No |
| Registros / Pendientes privados | admin/dashboard; COUNT RR / WHERE status=pending | Todos / solo pending | Todos | Registros; sin quantity | No | No |
| Registros / Puntos acumulados | public/stats.general; COUNT RR, SUM points_awarded | Todos, sí | Todos | Registros/puntos; sin quantity | No | No |
| Cantidad registrada (kg) / general.total_quantity | public/stats; SUM RR.quantity | Todos, sí | Todos | kg / unit libre | Sí | No directamente; duplica la base del total ambiental |
| Pendientes, Aprobados, Rechazados / Estado de validaciones | public/stats.status; COUNT RR GROUP BY status | Cada estado separado | Todos | Registros; sin quantity | No | No |
| Materiales más registrados / materials.total | public/stats; COUNT RR GROUP BY material_type | Todos, sí | Cada material | Registros; sin quantity | No | No |
| materials.total_quantity / total_points (API) | public/stats; SUM quantity / points_awarded GROUP BY material_type | Todos, sí | Cada material | Cantidad sin unidad explícita / unit libre; puntos | Sí en quantity, incluso dentro del mismo material | quantity sí |
| Ranking de equipos por puntos / teams | public/stats; teams LEFT JOIN RR, COUNT rr.id, SUM points_awarded | Todos, sí | Todos | Puntos/registros; sin quantity | No | No |
| periods (API, sin gráfico consumidor) | public/stats; periods LEFT JOIN RR, COUNT rr.id, SUM points_awarded | Todos, sí | Todos | Puntos/registros; sin quantity | No; agrupado por período, excluye filas sin período | No |
| indicators.totalQuantity (API) | public/stats → calculateEnvironmentalIndicators; suma materials.total_quantity | Todos, sí | Todos | Total interpretado en kg / unit libre | Sí | Es el total ambiental |
| Árboles salvados | public/stats.indicators; papel quantity × 0.017 | Todos, sí | Papel/cartón | Árboles estimados / quantity asumida kg | Sí | Sí |
| Agua ahorrada (L) | Mismo cálculo; papel quantity × 26.5 | Todos, sí | Papel/cartón | Litros estimados / quantity asumida kg | Sí | Sí |
| CO₂ reducido (kg) | Mismo cálculo; papel quantity × 1.0 | Todos, sí | Papel/cartón | kg CO₂ estimados / quantity asumida kg | Sí | Sí |
| Energía ahorrada (kWh) | Mismo cálculo; papel quantity × 4.1 | Todos, sí | Papel/cartón | kWh estimados / quantity asumida kg | Sí | Sí |
| Ranking público / Posición actual / Puntaje del equipo | public/ranking; SUM RR.points_awarded por team_id | Solo approved y período activo | Todos | Puntos/posición; sin quantity | No | No |
| Respaldo personal del puntaje | recycling/mine → LeaderDashboard.reduce(points_awarded) si falta equipo en ranking | Todos, sí; personal histórico | Todos | Puntos; sin quantity | No; alcance distinto ya documentado, no se cambia en F13 | No |
| Registros enviados / estados del líder | recycling/mine; filas WHERE user_id y conteos frontend | Todos o separados por status | Todos | Registros; sin suma quantity | No | No |
| Historial personal / revisión administrativa | recycling/mine, pending, reviewed; filas RR | Personal todos; revisión pending o approved/rejected | Todos | quantity junto a unit por fila | No | No |
| Excel: Cantidad, Unidad, Estado, Puntos, Período | admin/export/excel; RR JOIN users/teams LEFT JOIN periods | Todos, sí | Todos | Cantidad y unidad independientes por fila | No; no hay SUM ni total kg | No |

### Decisión e implementación

Evidencia: schema.sql declara quantity NUMERIC(10,2) positiva y unit VARCHAR(20) con default kg, sin enum de unidad. RegisterRecyclingPage tiene dos campos “Cantidad” y “Unidad”, inicia kg pero permite texto libre. createRecord conserva quantity y normaliza texto unit, sin conversión. F05 valida material/cantidad/referencia, no kg. El manual recomienda kg; los fixtures anteriores usan kg, pero ninguno demuestra que todas las filas reales sean kg. CSV ofrece actividades de distintos grupos en kg, litros, unidades, etc.; no una equivalencia universal. No se consultaron datos reales.

Para cada uno de papel/cartón, plástico, vidrio, metal y orgánico, quantity representa su cantidad declarada en unit. No existe otro material admitido por el esquema actual. No puede afirmarse que un material siempre sea kg, unidades, volumen o bloques. Orgánico no convierte la etiqueta “5 kg de abono generado en compostera” en multiplicador ni unidad: F07 y la referencia institucional faltante permanecen intactos.

Regla explícita F13: SUM(quantity) FILTER (WHERE status = 'approved' AND lower(btrim(unit)) = 'kg') en los agregados general y por material. Así los cinco materiales contribuyen únicamente por filas aprobadas que declaran kg; unit distinta, vacía o no reconocida no contribuye. Se aceptan KG y espacios exteriores como el mismo símbolo, sin convertir magnitudes ni interpretar sinónimos. Las cantidades orgánicas declaradas en kg cuentan literalmente, no como bloques de 5; las declaradas en bloques quedan excluidas. No hace falta decidir F07 para distinguir estas unidades explícitas.

Se conservan claves API, puntos, conteos de actividad, listados, ordenamientos y ranking. materials.total sigue contando todos los registros (su gráfico dice “más registrados”), mientras total_quantity expresa solo kg aprobados; un material sin kg aprobados conserva cantidad cero. general/materials/teams/indicators son históricos, incluyendo filas sin período. periods agrupa por período existente. No se impone filtro activo ni se cambian registros, revisiones, F05/F07 o catálogo. No hay migración.

Los indicadores reciben los agregados ya filtrados. Los cuatro factores siguen siendo 0.017, 26.5, 1.0 y 4.1 sobre papel/cartón; los demás materiales solo contribuyen al total compatible. F13 no cambia bibliografía ni factores (F14 sigue pendiente). SQL conserva NUMERIC; se retira toFixed del backend para no redondear prematuramente los resultados JavaScript, y el frontend formatea indicadores a dos decimales. Dashboard aclara histórico, kg declarados, unidades excluidas y base de papel/cartón. El título de equipos aclara puntos históricos. Sin rediseño.

Validación: **109 pruebas aprobadas, cero fallos/omisiones**, incluidas 13 F13 (12 subpruebas más contenedor), con router público real, HTTP local, SQL e indicadores reales en PostgreSQL temporal. Incluye estados aislados y mezclados por los cinco materiales, unidades incompatibles, orgánico sin inferencia de bloques, precisión decimal, cuatro factores originales, cero aprobados, histórico/activo/sin período, puntos/ranking y lecturas sin mutación. Caso concreto: cinco materiales con 2.75 kg approved, 100 pending y 200 rejected cada uno dejan 13.75 kg aprobados y 15 registros operativos. Cuarenta filas en otras unidades aportan cero kg. Papel 0.10 + 0.20 devuelve NUMERIC '0.30' y árboles 0.0051 sin redondeo de backend.

Regresión F01–F12, instalación, migraciones D01/F09 y concurrencias F08/F09/F09-F10/F12 aprobadas; F05 y acceso F11 preservados. Sintaxis de 30 archivos backend y build frontend correctos (solo avisos de deprecación); git diff --check correcto. Las 56 filas de points_catalog se compararon idénticas antes/después en el clúster aislado, y el CSV original no cambió. No se modificaron ranking, reglas de puntos, F05/F07, factores ni exportación. Clústeres temporales detenidos; ninguna conexión a ecoamigos real. Sin migración, commit ni push. F14 no trabajado. No queda decisión de unidad pendiente para F13: se utiliza exclusivamente la unidad declarada, con exclusión explícita de cualquier texto distinto de kg.

## Metodología de indicadores ambientales — F14 CORREGIDO por retiro

Decisión autorizada del 12 de septiembre de 2026: retirar las cuatro equivalencias, sus factores, utility e indicadores API y tarjetas. No se devuelven valores ni ceros sustitutos. Solo permanece general.total_quantity con el SQL F13 approved+kg. Cierre por eliminación del uso activo de factores no demostrados, no por validación científica. Cambio local sin commit sobre 91178e0. La metodología 12 conserva fuentes y condiciones obligatorias para reintroducción.

Validación final del retiro: **112 pruebas aprobadas, cero fallos/omisiones**, incluidas F14 estáticas y HTTP F13 con contrato sin indicators. Total mixto 42.25 kg correcto; pending/rejected y otras unidades no suman; decimales, ranking y puntos preservados. F01–F12, instalación, migraciones D01/F09 y concurrencias F08/F09/F10/F12 pasan. Sintaxis de 30 archivos, build frontend (avisos de deprecación) y git diff --check correctos. Sin coincidencias de factores equivalentes ni sus consumidores en backend/src y frontend/src; las menciones de agua/energía como categorías educativas no son cálculos. Las 56 filas del catálogo temporal permanecieron idénticas y el CSV no cambió. No hubo conexión a ecoamigos real, commit ni push.

### Auditoría histórica y primera mitigación (sustituidas por el retiro)

Auditoría completada antes de modificar comentarios/interfaz. git log --follow, blame y show identificaron da6ab9a (2026-05-12) como introducción de fórmulas preliminares y 308f070 (2026-07-09) como sustitución por 0.017, 26.5, 1.0 y 4.1 solo sobre papel. Este último añadió comentarios EPA sin fuente bibliográfica. F13 (91178e0) conservó factores. El repositorio no contenía enlaces WARM ni fuente técnica por indicador. No se puede reconstruir desde git la procedencia científica de los valores.

La [metodología completa](12-METODOLOGIA-INDICADORES.md) contiene tabla por indicador, fórmulas/unidades, ubicación de fuentes verificadas externamente, comparación con preliminares y conversiones matemáticas condicionales no implementadas. EPA/NPS divulgan equivalencias por ton para árboles/agua/energía, pero no demuestran los factores por kg actuales y su aplicabilidad a papel/cartón. WARM compara escenarios; Paper Products §3.2, Exhibit 3-7, distingue materiales y emisiones netas por short ton. Energy Impacts §7.3 exige también escenarios. No se encontró respaldo exacto al 1.0 de CO₂e. No se certificó ninguno por coincidencia temática o numérica.

Los cuatro indicadores quedan NO SUSTENTADO / pendientes de validación institucional; árboles/agua/energía tienen pistas divulgativas parciales, no trazabilidad suficiente del factor exacto. Se mantienen números y fórmulas, con cada tarjeta marcada estimación no validada y advertencia de no uso como ahorro acreditado en informes institucionales. CO₂ se etiqueta CO₂e conforme a la unidad prevista en el comentario heredado, sin afirmar que el factor esté validado. Comentarios de backend remiten a metodología y retiran atribución indebida a EPA. Contratos numéricos, filtros F13, totalQuantity, puntos/ranking y F05/F07 intactos; ninguna conversión ni migración nueva.

Pendientes concretos: fuente técnica con unidad/alcance/material que derive 0.017 árboles/kg, balance que derive 26.5 L/kg, escenario/GEI/GWP que derive 1.0 kg CO₂e/kg y proceso/energía que derive 4.1 kWh/kg (o reemplazos inequívocamente justificados), más aplicabilidad institucional. No se cierra F14 con bibliografía general.

Validación de software: **114 pruebas aprobadas, cero fallos/omisiones**, incluidas cinco F14 que congelan resultados de 0, 1, 0.25 y 80 kg y verifican las cuatro etiquetas/unidades y advertencia. F13 mantiene HTTP/SQL reales approved+kg, precisión e histórico; F01–F12, instalación, migraciones D01/F09 y concurrencias F08/F09/F10/F12 pasan. Sintaxis de 31 archivos backend, build frontend (solo avisos de deprecación) y git diff --check correctos. Estas pruebas no son validación científica. F05, ranking y puntos intactos; las 56 filas del catálogo temporal se compararon idénticas y CSV original sin cambios. Clústeres temporales detenidos; ecoamigos real no conectada ni modificada. Sin commit/push; F15 no trabajado.

## Alcance administrativo — F15 CORREGIDO

La auditoría inicial revisó README, docs 01–12, esquema/aliases, D01, seeds, rutas/controllers y pantallas. Demostró alta/listado para usuarios, equipos y períodos; contenido ya tenía edición/borrado. No encontró requisitos inequívocos de CRUD completo y quedó PARCIAL. La decisión funcional explícita posterior autoriza el mantenimiento limitado siguiente; no se deriva por simetría ni por ausencia de requisitos.

| Entidad | Operaciones finales | Fuera del alcance |
| --- | --- | --- |
| Usuarios | GET/POST /admin/users; PATCH /admin/users/:id: nombre, email, team_id, is_active; UI Editar | DELETE, cambio de rol, contraseña/recuperación (F16) |
| Equipos | GET/POST /admin/teams; PATCH /admin/teams/:id: nombre/dependencia; UI Editar | DELETE, nueva baja lógica, reasignaciones automáticas |
| Períodos | GET/POST /admin/periods con F09 | DELETE, edición de fechas/nombre, activación independiente |
| Contenido (referencia) | GET/POST /admin/content; PUT/DELETE /admin/content/:id existentes | Sin cambios F15 |

Períodos históricos y vacíos no tienen ruta de edición: no se encontró necesidad real para los vacíos. Esto protege fechas históricas desde la API; no añade restricciones a SQL externo. RR.user_id/team_id CASCADE, RR.period_id/reviewed_by SET NULL, content_items.created_by SET NULL, users.team_id SET NULL y winner_records CASCADE legado justifican excluir DELETE. teams no tiene is_active; D01 puede conservar leader_id legado distinto de users.team_id.

Ediciones con lista cerrada de campos, formato/longitud, unicidad existente y FK: 400 inválidos, 404 inexistentes, 409 duplicados, 403 líder y 500 genérico. Nunca se devuelve hash ni se acepta password/password_hash/role. UPDATE modifica únicamente la entidad destino, conserva IDs, claves y registros históricos. El listado de usuarios ahora incluye team_id/is_active. F12 cuenta inactivos y mantiene quince; login existente rechaza inactivos. Las validaciones de creación anteriores no se amplían.

Cambios administrativos de role/team/is_active pueden no reflejarse en tokens previamente emitidos; el tratamiento de sesión/token se resolverá en S01/S02.

Ranking y puntuación conservan algoritmo y valores. Los nombres se obtienen por JOIN, por lo que se actualizan etiquetas; en empates el nombre de equipo puede cambiar el orden alfabético ya existente. No se garantiza versionado de identidad ni revocación de tokens.

Pruebas: backend/tests/f15-admin-scope.test.js conserva el arnés PostgreSQL desechable y HTTP real con rutas/middleware/controller. Amplía altas/listados, permisos, campos prohibidos, duplicados, errores internos provocados sin filtrar SQL, desactivación/reactivación y login, límite quince incluyendo inactivo, reasignación sin reescritura histórica, ranking/puntos, DELETE ausentes y fechas de períodos históricos/vacíos intactas. Compara las 56 filas del catálogo antes/después. Resultado final: **123 pruebas aprobadas, cero fallos y cero omisiones**, incluidas diez subpruebas F15 y su contenedor. Pasan F01–F14, instalación (42 consultas preparadas), migraciones D01/F09 y concurrencias F08/F09/F09-F10/F12. Se adaptó la afirmación obsoleta de F12 sobre ausencia de PATCH; el límite de quince y sus pruebas de concurrencia se conservan. F09 mantiene el período anterior ante rollback; F10 valida período y fecha; F12 cuenta todas las cuentas; F13 conserva approved+kg; F14 mantiene retirados los indicadores no sustentados; F05 sigue rechazando referencias manipuladas. Sintaxis de 31 archivos backend y build frontend correctos (solo avisos de deprecación Vite); git diff --check correcto. Ranking/puntos sin cambios de algoritmo; 56 filas del catálogo temporal idénticas antes/después y CSV original sin cambios. Se usaron únicamente clústeres nuevos aislados, detenidos al finalizar; ecoamigos real no conectada ni modificada. No se ejecutaron commit/push ni trabajo de F16. F15 CORREGIDO dentro de la decisión autorizada; S01/S02 permanecen pendientes. La verificación frontend consistió en revisión del código y build, sin prueba interactiva de navegador.

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
| F11 | Admin puede registrar, pero normalmente no tiene equipo | **CORREGIDO**: POST y formulario solo líder; equipo JWT válido y existente comprobado; 403 controlado sin equipo y sin aceptar suplantación por body |
| F12 | Límite de 15 solo frontend | **CORREGIDO**: máximo 15 cuentas totales, incluidos admins/inactivos; API y bootstrap transaccionales con bloqueo, conflicto 409 y concurrencia real probada |
| F13 | Estadísticas suman todos los estados/unidades | **CORREGIDO**: cantidades e indicadores solo approved con unit kg; conteos operativos/puntos e histórico preservados; factores intactos |
| F14 | Factores ambientales sin fuente trazable en repositorio | **CORREGIDO** por retiro: cuatro equivalencias fuera de cálculo/API/UI; total approved+kg intacto; metodología histórica conservada |
| F15 | Mantenimiento administrativo limitado y autorizado | **CORREGIDO**: usuarios editables y activables; equipos editables; períodos solo alta/listado; sin borrados físicos, con referencias preservadas y pruebas HTTP/regresión aprobadas |
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
| T08 Cupo | Llegar a 15 cuentas de prueba | UI impide alta; API devuelve 409/USER_LIMIT_REACHED; dos altas con 14 dejan exactamente 15 |
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
| T20 Estadísticas | Registros de estados/unidades distintos | Kg e indicadores solo approved con unit kg; conteos de actividad conservan estados; sin conversión ni filtro de período activo |
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
