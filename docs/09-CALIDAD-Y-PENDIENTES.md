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

S01 y S03 corregidos según el bloque final; S02 parcial. S04–S07 corregidos según el bloque de archivos al final; S08–S10 corregidos según el cierre de configuración; S11–S12 permanecen sin cierre. F20 está corregido según su bloque final, con smoke visual pendiente. F19 está corregido según su bloque final. F18 está corregido según su verificación formal. F17 está corregido según su bloque final. F16 se detalla en su bloque de recuperación. F10–F15 están corregidos según lo descrito abajo; la matriz T01–T28 conserva sus comprobaciones manuales con T20 actualizado para F13. Las menciones T23/T24 se conservan como registro histórico de las pruebas que evidenciaban el módulo retirado, no como funcionalidad vigente.

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
| F16 | Recuperación de contraseña | **CORREGIDO técnicamente**: token temporal hasheado de un uso, bcrypt y flujo público; sin cambio voluntario. Entrega de correo institucional pendiente |
| F17 | Promesas UI y 404 SPA | **CORREGIDO**: errores persistentes separados de vacío/carga, reintento, mensajes controlados y catch-all; pruebas aprobadas, smoke visual pendiente |
| F18 | Identidad del toast y consultas por efectos | **CORREGIDO**: useCallback de F17 verificado con ReactDOM; value estabilizado con useMemo en F18; avisos no repiten carga del período |
| F19 | Evidencia del registro: estado e input nativo | **CORREGIDO**: useRef limpia el input solo tras éxito; fallo conserva selección y FormData no reutiliza evidencia |
| F20 | CORREGIDO: modal con foco/Escape y menú móvil accesible | 5 pruebas F20 aprobadas; smoke visual en navegador pendiente |

## Seguridad y operación

| ID | Evidencia | Acción pendiente |
| --- | --- | --- |
| S01 | CORREGIDO: usuario actual y revocación tras reset | JWT mínimo, una consulta por request, session_version transaccional |
| S02 | PARCIAL: token continúa en localStorage | Rechazo de sesión coherente; decisión institucional cookies/orígenes pendiente |
| S03 | CORREGIDO: límites y errores de autenticación | Login/forgot/reset por IP; 429/Retry-After; errores genéricos |
| S04 | Multer contenido sin límite/filtro | **CORREGIDO: límites explícitos, un archivo, UUID y rechazo con limpieza**; ver cierre S04–S07 |
| S05 | Evidencias y borradores disponibles por URL pública | **CORREGIDO: acceso por entidad y autorización; sin publicación estática de uploads**; ver cierre S04–S07 |
| S06 | Archivos huérfanos al fallar SQL, editar o borrar | **CORREGIDO: limpieza transaccional con referencias; residuos físicos documentados**; ver cierre S04–S07 |
| S07 | Filtro de evidencia regex/MIME limitado | **CORREGIDO: allowlist y firma con file-type; limitaciones expresas**; ver cierre S04–S07 |
| S08 | CORS fijo y CLIENT_URL ignorada | **CORREGIDO: CORS_ORIGINS/CLIENT_URL, política explícita y HTTP probado**; ver cierre S08–S10 |
| S09 | Puerto DB fijo, sin SSL parametrizable | **CORREGIDO: configuración pura local/URL/puerto/TLS verificado, sin conexión real**; ver cierre S08–S10 |
| S10 | Logs síncronos sin rotación | **CORREGIDO: logger asíncrono acotado, minimización y rotación probadas**; ver cierre S08–S10 |
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
| T05 Autorización | Sin token / JWT vencido / líder en admin | 401 / 401 / 403 |
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


## Recuperación de contraseña — F16 CORREGIDO técnicamente

Estado previo: solo login/me, password_hash y bcrypt costo 10; login sin revocación de JWT ni rate limit, UI sin recuperación y soporte SQL excepcional. No se encontró proveedor de correo ni política fuerte de contraseñas. La decisión autoriza recuperación, no cambio voluntario de contraseña ni asignación directa por admin.

Se implementan forgot/reset públicos, cuerpo cerrado, email validado con trim y comparación exacta como login, respuesta genérica independiente de cuenta/actividad/entrega. Token crypto.randomBytes(32), SHA-256 persistido, 30 minutos, un uso y reemplazo de enlaces anteriores. Reset usa transacción y bloqueos users→token; consume token y cambia solo password_hash con bcrypt 10. Inactivos no emiten ni consumen tokens. Contraseñas no vacías hasta 72 bytes UTF-8 evitan truncamiento; política fuerte pendiente de seguridad.

Nueva tabla y migración incremental separada de D01, FK restrictiva y verificación de lectura. Frontend añade enlace login y pantallas públicas mínimas; no muestra cuenta ni tokens y no añade cambio de clave desde perfil. El adaptador de entrega está desacoplado y sin proveedor: **no hay envío real de correo**. Ningún token se devuelve por HTTP, tampoco en desarrollo/producción; la captura existe solo como dependencia inyectada por el test aislado. CLIENT_URL existente construirá enlaces HTTPS en producción; no se añaden variables ni credenciales.

Límites abiertos: S01/S02 (JWT previos siguen válidos después del reset, comprobado), S03 (sin límite de intentos/emisión ni garantía de tiempo constante), configuración institucional de correo y política robusta de contraseñas. No se certifica resolución de estos hallazgos. No se añade limpieza automática de tokens ni se ejecuta migración real.

Pruebas F16: HTTP con authRoutes/controladores reales y PostgreSQL temporal; cuentas existentes/inexistentes/inactivas, validaciones, aleatoriedad/hash/expiración, enlace anterior/reutilización, login nuevo/anterior, bcrypt, datos privados ausentes, rollback diferido, consumo simultáneo, producción sin token, entrega fallida, migración con datos previos/repetición segura/FK/índices y catálogo intacto. Resultado final: **135 pruebas aprobadas, cero fallos y cero omisiones**, incluidas once subpruebas F16 y su contenedor. Pasan F01–F15, instalación (51 consultas SQL preparadas), D01, migración F09, concurrencias F08/F09/F09-F10/F12 y migración F16. La prueba de FK se ajustó al SQLSTATE RESTRICT de PostgreSQL, sin cambiar la restricción. Sintaxis de 34 archivos backend correcta, build frontend correcto (solo avisos Vite de deprecación), git diff --check correcto. La UI se verificó por revisión de código/build, no mediante navegador interactivo. F15 sigue correcto; F12 conserva quince cuentas; F09 mantiene el período anterior ante rollback; F10 valida período/fecha; F13 approved+kg y F14 sin indicadores no sustentados. Algoritmo de ranking/puntos y catálogo original sin cambios; 56 filas del catálogo aislado idénticas antes/después. Solo clústeres temporales, detenidos al finalizar; ecoamigos real no conectada ni modificada. F16 se cierra técnicamente según el criterio autorizado, con entrega automática institucional aún pendiente. No se trabajó F17, ni se hizo commit/push.


## Promesas UI y 404 SPA — F17 CORREGIDO

Auditoría completa de frontend/src: dashboard admin, contenidos, configuración, ranking, panel líder (dos peticiones) y educación tenían cargas con rechazos sin tratamiento; creación de períodos tampoco los capturaba. Usuarios, revisión y registro capturaban errores, pero podían mostrar vacíos, ceros o ausencia de período después de una carga fallida. Faltaba catch-all. Se conservó el diff correcto de la ejecución interrumpida.

Se protegen nueve cargas de página y la creación de períodos. LoadState presenta loading o error persistente con acción de reintento; devuelve null sin ambos estados, dejando empty a las páginas tras éxito. No borra datos previos para representar error. Usuarios reintenta su carga local; los demás botones recargan la página de forma explícita, sin bucles automáticos. Las mutaciones mantienen sus formularios ante rechazo; solo muestran éxito después de la escritura exitosa. Fallos de recarga posteriores a guardar se muestran como error de carga. uiError permite únicamente mensajes literales funcionales auditados en respuestas 4xx; el resto usa texto genérico, sin SQL, stack ni error Axios.

Clasificación final:

| Clase | Casos | Tratamiento |
| --- | --- | --- |
| A: manejado | Cargas de nueve páginas; crear/editar/borrar contenido, equipos, períodos, usuarios, revisión, registro, login, recuperación | catch explícito y aviso; finally para estados de carga/envío existentes o añadidos. Sin rechazo presentado como empty |
| A: manejado | auth/me | catch elimina token como antes y ahora avisa de fallo de verificación; finally termina carga |
| A: manejado | Exportación | Conserva try/catch, console.error acompañado de alerta genérica. No era tratamiento solo por consola |
| B: propagado intencionalmente | AuthContext.login; interceptor de petición Axios | El formulario captura login; los consumidores de API capturan rechazos. No se añaden catches redundantes |
| C: no relevante | Helpers síncronos, render, enlaces, archivos sin llamadas asíncronas | Sin promesa de red que corregir; no se refactorizan |
| D: pendiente real de promesas UI | Ninguno identificado en los flujos ejecutables auditados | Limitaciones visuales y de infraestructura separadas abajo |

Educación descarta respuestas de una categoría anterior al cambiar categoría/desmontar; no se aplica cancelación global. En ToastContext el único cambio incidental es useCallback para estabilizar showToast, dependencia del efecto de carga de período. Impide que un aviso provoque otra carga por cambio de identidad. **Al cerrar F17, F18 no se había trabajado formalmente ni se declaró corregido**. La verificación posterior está en el bloque F18; se conserva este antecedente sin atribuir ese cierre a F17.

NotFoundPage usa clases existentes y enlace al inicio. path="*" se encuentra dentro de AppLayout, fuera de grupos ProtectedRoute: rutas inexistentes públicas, /admin y /leader muestran 404, igual que /winners y /prizes. Las rutas válidas conservan sus permisos: sin sesión → /login, sin rol autorizado → /. Navbar, AppLayout y ProtectedRoute sin cambios. No se añadió ErrorBoundary: no se identificó un crash de render que exigiera ampliarlo para F17. No se modifica servidor/hosting ni se restaura funcionalidad retirada.

Validación: **26 pruebas F17 aprobadas**, con el transformador JSX de Vite existente, handlers/efectos reales bajo un arnés de hooks controlado y render React/React Router para routing. Incluyen carga→éxito/empty/error, nueve rechazos de carga, reintento exitoso de usuarios sin bucle, POST período rechazado, PATCH con formulario/listado conservados, mensajes técnicos ocultos y funcionales visibles, login/forgot/reset, rutas retiradas/404, enlaces y ProtectedRoute. El arnés se corrigió para excluir nombres de exports de interoperabilidad no válidos como parámetros JavaScript; no era un fallo de la aplicación. No había otra suite frontend; no se añadieron dependencias.

Regresión completa: **135 pruebas backend aprobadas**, cero fallos/omisiones (161 sumando F17). Incluye F01–F16, instalación con 51 consultas preparadas, D01 y migraciones/concurrencias F08/F09/F09-F10/F12/F16. F15 y forgot/reset intactos; F12 mantiene 15 cuentas; F09 preserva el activo anterior ante rollback; F10 valida período/fecha; F13 approved+kg; F14 sin equivalencias retiradas. Backend y base/migraciones no tienen cambios F17. Algoritmo de ranking y puntos conservado. Las 56 filas del catálogo temporal se comparan idénticas y el original no cambia. Clústeres temporales detenidos, sin conexión ni modificación de ecoamigos real. Sintaxis de 36 archivos JS (34 backend + utilidad/prueba frontend), build Vite y git diff --check correctos; solo avisos de deprecación Vite.

Smoke manual pendiente: apariencia responsive de 404/errores, clics en navegador real, recarga completa y estados con red interrumpida, navegación rápida entre categorías. Routing automatizado usa páginas sustitutas para las rutas válidas y un layout Outlet; no valida visualmente Navbar/AppLayout. Los efectos se prueban con hooks controlados, no un DOM de navegador. El hosting debe servir index.html al abrir URLs SPA directamente; la 404 React no configura ese fallback ni cambia el código HTTP del servidor. Sin commit/push; detenido antes de F18.


## Identidad del toast y efectos — F18 CORREGIDO

F17 ya había corregido la causa de las consultas repetidas: showToast usa useCallback con [], y solo captura setToast (setter estable). Usa sus argumentos actuales, sin leer estado toast ni capturar valores obsoletos. No existen otras funciones públicas equivalentes en el contexto. Duración 3500 ms, API y estilos originales conservados.

F18 requirió un ajuste adicional mínimo: value={{ showToast }} creaba un objeto en cada render de ToastProvider, notificando innecesariamente a consumidores aunque la función fuera estable. Se añadió useMemo(() => ({ showToast }), [showToast]). Esto estabiliza el objeto de contexto; no es un cambio necesario para detener el GET original, que F17 ya había estabilizado, sino para evitar propagación innecesaria demostrada en la prueba. Ninguna dependencia fue eliminada y no se añadieron librerías.

| Consumidor | Clasificación | Efectos/consultas |
| --- | --- | --- |
| RegisterRecyclingPage | A: avisos de éxito/error del handler de registro; B: showToast en efecto de carga | useEffect [showToast], GET /public/ranking para obtener currentPeriod; catch informa fallo. El efecto mantiene exactamente su dependencia |
| AdminReviewsPage | A: éxito/error del handler de revisión; D: aviso dentro de load, invocado al montar y tras revisar | Efecto de montaje [] existente; GET /recycling/pending y /recycling/reviewed. No depende del objeto de contexto ni se repite por avisos |
| Contexto | C: función pública memorizada; D: temporizador de ocultación | showToast con useCallback []; value con useMemo [showToast]. No hace HTTP |

La búsqueda completa de useToast/showToast y useEffect no encontró más consumidores ni otro efecto vulnerable. Ranking público y paneles consultan en sus efectos de montaje y no consumen este contexto. El único efecto cuyo array incluye showToast está en frontend/src/pages/leader/RegisterRecyclingPage.jsx. Antes una actualización del estado del aviso recreaba la función y repetía ese GET; ahora solo mostrar, actualizar u ocultar el toast no cambia la dependencia.

Prueba conductual con React y ReactDOM reales: frontend/tests/f18-toast.test.js compila el Provider y RegisterRecyclingPage del workspace mediante Vite, los monta y ejecuta sus hooks/efectos con act. frontend/tests/helpers/minimalDom.js aporta únicamente el host DOM mínimo; no simula useState/useEffect/useCallback. API sustituida por un contador de invocaciones GET y temporizadores controlados (se comprueba 3500 ms). No se conecta a la aplicación real.

| Variante probada | Montaje | Mostrar | Cambiar texto | Ocultar | Rerender del Provider |
| --- | --- | --- | --- | --- | --- |
| Conducta anterior a F17 reconstruida sin useCallback | 1 | 2 | 3 | 4 | 5 |
| F17: función estable, value nuevo | 1 | 1 | 1 | 1 | 1 |
| F18: función y value estables | 1 | 1 | 1 | 1 | 1 |

Cifras acumuladas de llamadas a GET /public/ranking sin StrictMode. En esa secuencia F17 genera cinco objetos de contexto distintos; F18 solo uno. Las identidades de función permanecen únicas en F17/F18. Un consumidor de prueba con dependencia funcional periodKey demuestra que React vuelve a ejecutar el efecto cuando esta cambia; no se añade esa propiedad al formulario real, cuyo efecto depende solo de showToast. Los montajes/remontajes reales pueden consultar y la doble ejecución de desarrollo de StrictMode no se elimina ni se confunde con este defecto.

El toast aparece con el texto solicitado, se actualiza y se oculta al ejecutar su temporizador. Un rechazo de la carga del período muestra aviso y error persistente F17 con Reintentar, termina loading y mantiene una sola petición incluso al ocultar el aviso/rerenderizar. No se amplió gestión de temporizadores ni se añadió cierre manual: se mantiene el comportamiento previo.

Resultados: **4 pruebas F18 y 26 F17 aprobadas** (30 frontend), **135 pruebas F01–F16/backend aprobadas**, cero fallos/omisiones; total 165. Incluye instalación, D01, migraciones y concurrencias existentes. F17 conserva 404, errores y reintento exitoso probado; F16/forgot/reset intactos. Build Vite correcto, solo avisos de deprecación; sintaxis de los archivos nuevos y git diff --check correctos. Backend, bases/migraciones, registro/revisión, cálculo de ranking/puntos y catálogo distribuido sin modificaciones F18. Las 56 filas del catálogo temporal se comparan idénticas antes/después. Clústeres aislados detenidos; ecoamigos real no conectada ni modificada.

El navegador integrado no estaba disponible (lista de navegadores vacía); no se certifica prueba visual en navegador. El host DOM de prueba comprueba contenido y ejecución React, no geometría, accesibilidad o interacción nativa. Archivos cambiados: ToastContext.jsx, f18-toast.test.js, helpers/minimalDom.js y este documento. No se trabajó F19 ni se ejecutaron commit/push.


## Evidencia del registro — F19 CORREGIDO

Auditoría: RegisterRecyclingPage guarda el File en form.evidence y lo adjunta condicionalmente a un FormData nuevo en cada submit. Tras éxito ya reiniciaba evidence a null junto con los campos actuales, pero no tenía ref ni vaciaba el input nativo. Esto dejaba el nombre anterior visible aunque el siguiente payload no llevara archivo; la selección consecutiva del mismo archivo podía no emitir change. No hay preview ni nombre personalizado: solo la presentación nativa del input. Ante error el estado ya se conservaba.

Cambio mínimo: useRef(null), ref sobre el input y fileInputRef.current.value = '' después del POST exitoso y del reset existente. No se asigna FileList ni se cambia payload, accept, validaciones, fechas, puntos o criterios. Ante respuesta pendiente o rechazada no se limpia el input ni el File. Después del éxito el estado no conserva el File, el input está vacío y puede elegirse otra vez el mismo archivo. Cada nuevo FormData refleja exclusivamente la selección actual.

Otros inputs auditados: solo se encontró AdminContentPage además del registro. Allí resetForm/cancelar y handleEdit reinician form.file sin ref, por lo que cancelar/cambiar edición puede dejar una selección nativa desalineada; se reporta como seguimiento de ese módulo, sin modificarlo dentro de F19. Tras guardado exitoso, la carga F17 desmonta temporalmente el formulario y recrea el input. No se localizaron otros inputs de evidencias administrativas.

Pruebas: frontend/tests/f19-evidence.test.js ejecuta RegisterRecyclingPage con hooks/refs ReactDOM reales, host DOM mínimo existente y File/FormData de Node. Tres pruebas cubren selección y reemplazo, payload correcto, ausencia de reset antes de respuesta, éxito con estado/input vacíos, siguiente envío sin evidencia, mismo archivo consecutivo, fallo que conserva selección/datos y reintento con el File conservado. La selección se modela en el host de prueba y llama al handler real; no se certifica diálogo nativo ni etiqueta visual de un navegador. El FileList no se asigna desde código de aplicación. Queda smoke visual del selector nativo, sin necesidad de una nueva librería de pruebas.

Se adaptó únicamente el arnés F17 para admitir useRef. **33 pruebas frontend aprobadas: 3 F19, 4 F18 y 26 F17**, cero fallos/omisiones. F18 mantiene una sola consulta al período al mostrar/actualizar/ocultar avisos; F17 conserva 404, manejo de errores y reintento. Build Vite, sintaxis de prueba y git diff --check correctos (solo avisos de deprecación Vite). Registro/FormData probado con API sustituida, sin escrituras reales. No se repitió backend porque no cambió ningún contrato ni código backend. F10 permanece conceptualmente intacto; ranking/puntos, backend, esquema y catálogo sin cambios. ecoamigos real no conectada ni modificada. No se trabajó F20; sin commit/push.


## Modal y navegación móvil — F20 CORREGIDO

Auditoría de frontend/src: el único modal de aplicación está en EducationCategoryPage, abierto por «Ver contenido completo». Antes usaba dos div con overlay, cierre por botón/fondo, sin nombre semántico, foco inicial, trap, Escape ni restauración; el fondo seguía accesible por teclado. AppLayout es la navegación activa; Navbar.jsx es un componente sin uso y no se modifica. No se encontraron otros drawers/modales propios; las confirmaciones nativas del navegador permanecen intactas.

El modal usa dialog nativo con showModal, aria-modal y aria-labelledby al título. El fondo queda inerte por modalidad nativa y el diálogo usa la capa superior del navegador. activateDialog enfoca el primer control visible/habilitado (Cerrar), recalcula controles para Tab/Shift+Tab, envuelve ambos extremos y contempla uno o ningún control. Solo intercepta Escape y los límites de Tab; los demás eventos internos siguen su curso. Escape se previene para evitar el cancel nativo duplicado; onCancel también maneja cancelación nativa. Botón, Escape y clic exterior cierran; cleanup quita el listener, cierra el diálogo y enfoca el disparador si sigue conectado. No hay listener global permanente ni librería nueva.

El botón del menú antes permanecía display:none incluso en móvil. Ahora se muestra hasta 768 px, con nombre accesible, aria-expanded y aria-controls hacia site-navigation; nav tiene nombre accesible. El menú móvil cerrado usa hidden y no renderiza enlaces/botones internos, por lo que no deja controles invisibles en Tab. Abierto permite navegación normal, sin trap de modal. Escape dentro de la cabecera, selección de enlace y cambio de ruta lo cierran. Se devuelve foco al botón cuando desaparece un enlace enfocado. El cambio de breakpoint restablece el estado cerrado; al pasar a desktop desde el botón enfocado se enfoca el primer enlace visible y al pasar a móvil desde la navegación se enfoca el botón. El listener de matchMedia se limpia. Rutas y condiciones de rol conservadas.

Responsive revisado en código: ancho del diálogo limitado al viewport con margen de 16 px, altura máxima 90vh y scroll interno; texto largo puede partirse. Menú móvil ocupa una fila del contenedor, con ancho máximo 100%; escritorio conserva sus enlaces. Botones reales con texto/nombre accesible, sin controles nuevos basados en div. No se rediseñaron colores, rutas ni animaciones.

Validación: 5 pruebas F20 aprobadas y 38 frontend totales (26 F17, 4 F18, 3 F19), cero fallos/omisiones. Cubren helper de foco con DOM controlado y montaje ReactDOM real de AppLayout con matchMedia/host DOM mínimo; verifican ARIA, ausencia de enlaces ocultos, apertura, Escape, navegación, cambios de ruta/breakpoint y cleanup. La integración semántica del dialog y sus estilos se comprueban estáticamente. F17 mantiene 404 —incluidas winners/prizes— y ProtectedRoute; F18 conserva identidad del toast y consultas estables; F19 conserva reset del archivo tras éxito y selección ante error. Build Vite, sintaxis JS y git diff --check correctos; solo avisos de deprecación de Vite y avisos SSR del arnés de routing.

Smoke manual pendiente: navegador integrado sin instancias disponibles. Comprobar con mouse/teclado apertura/cierre, Tab/Shift+Tab, Escape, foco restaurado, fondo inerte nativo, controles de video, menú móvil y navegación posterior, viewport angosto y transición a escritorio. Las pruebas no certifican geometría ni interacción nativa real.

Archivos F20: AppLayout.jsx, EducationCategoryPage.jsx, refinements.css, utils/dialogFocus.js, tests/f20-accessibility.test.js y documentos 07/09. Backend, esquema, migraciones, ranking/puntos y catálogo distribuido sin cambios. No se conectó ni modificó ecoamigos real; no se repitieron pruebas backend ni conteo SQL del catálogo en F20. No se trabajó S01 ni otro hallazgo de seguridad, sin commit/push.


## Autenticación y sesión — S01 CORREGIDO / S02 PARCIAL / S03 CORREGIDO

Este bloque sustituye las limitaciones S01–S03 descritas históricamente en F11/F15/F16; esos apartados conservan evidencia de su fecha. No se trabajó S04 ni se certifican los demás hallazgos, incluido S08 pese al ajuste CORS necesario para S02.

Auditoría previa: JWT HS256 de ocho horas contenía id, role, email y team_id; authenticateToken copiaba claims a req.user y authorizeRoles/controladores confiaban en ellos. No había consulta de estado en solicitudes protegidas. /me consultaba la fila, sin validar is_active/existencia ni actualizar claims. Desactivar, cambiar equipo o resetear contraseña no retiraba acceso. El equipo antiguo podía usarse para nuevos registros. Frontend guardaba solo ecoamigos_token en localStorage (user ya estaba en memoria), Axios lo adjuntaba como Bearer, logout lo eliminaba localmente. Me fallido eliminaba token, pero 403 de JWT expirado en otras solicitudes no cerraba la sesión de interfaz. Login usaba mensaje genérico para cuenta inexistente/inactiva o clave incorrecta, pero devolvía error.message de PostgreSQL y registraba email/detalles internos. F16 ya ocultaba errores y tokens; faltaban límites en los tres endpoints. Express tenía CORS fijo localhost:5173 con credentials:true y manejador predeterminado para errores propagados. Se auditaron rutas admin/recycling, todos los usos req.user, recuperación, ProtectedRoute y clientes/variables de entorno antes de cambiar código.

S01: se eligió identidad mínima id/sv más iat/exp, conservando duración, Bearer y respuesta token/user. No existe consumidor funcional que necesite decodificar role/team/email del JWT. Middleware fija HS256, verifica firma/expiración e identidad/versiones válidas; consulta users/teams una vez, rechaza inexistente/inactivo/version distinta con 401 y solo coloca datos públicos actuales en req.user. /me reutiliza esa consulta; permisos insuficientes siguen siendo 403. Errores de consulta fallan cerrados con 500 genérico. F15 no habilita edición de rol; una modificación SQL autorizada toma efecto en la siguiente consulta igual que team/is_active. La autorización refleja el estado leído al inicio del request, no cancela operaciones ya en curso. React puede conservar una vista de rol/equipo hasta recargar; eso no concede autoridad al cliente.

Se añadió session_version INTEGER NOT NULL DEFAULT 0 CHECK >=0: comprobar solo is_active no revocaría JWT tras reset de una cuenta activa. La migración 20260914_s01_session_version.sql es incremental/idempotente; schema.sql incluye la columna y verify_s01_session_version.sql verifica sin escribir. F16 incrementa versión en la misma transacción que contraseña y consumo del enlace: éxito revoca todos los JWT previos; rollback conserva versión, contraseña y validez previa. JWT antiguos sin sv requieren login. Desactivar bloquea mientras la cuenta esté inactiva; reactivar puede volver a admitir JWT no vencidos si no cambió su versión. Logout es local y no revoca una copia del token. Nada se aplicó a ecoamigos real.

Comparación S02 para React/Vite y API Express separadas:

| Alternativa | XSS / CSRF | CORS, persistencia y complejidad |
| --- | --- | --- |
| Bearer en localStorage, actual provisional | JavaScript puede leer/sustraer token; no se elimina XSS. El navegador no adjunta Bearer automáticamente a requests de otro sitio | Persistencia actual, Authorization con preflight; sin credentials/cookies. Logout local no invalida copias |
| Cookie HttpOnly/Secure/SameSite, preferida para despliegue definido | HttpOnly impide lectura del token por JS, pero XSS aún puede actuar en la sesión. Requiere defensa CSRF para operaciones autenticadas | Orígenes distintos no siempre son sitios distintos: definir dominios/HTTPS; cross-site puede exigir SameSite=None/Secure y verse afectado por bloqueo de cookies de terceros. Requiere credentials, CORS exacto, emisión/borrado y política CSRF completos |
| Memoria o sessionStorage | Memoria reduce persistencia; sessionStorage sigue siendo legible por JS; ninguna elimina XSS | Memoria pierde sesión al recargar salvo nuevo mecanismo; sessionStorage cambia comportamiento entre pestañas. No justifican por sí solas cerrar S02 |

Se conserva Bearer sin migración parcial ni token duplicado. No se asume que cookies sean inviables técnicamente: falta decidir mismo sitio/sitios distintos, dominios HTTPS y proxy institucional para certificar y probar su configuración. S02 sigue PARCIAL; no se presenta localStorage como almacenamiento seguro. Referencia: [OWASP HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage). La eliminación del riesgo de lectura por JavaScript queda pendiente de una migración completa. No se amplió el trabajo a CSP, uploads ni auditoría XSS general.

Mitigaciones S02: sesión centralizada, token únicamente en localStorage, user exclusivamente en memoria. Login conserva persistencia; /me reconstruye UI desde backend. Un 401 del token enviado limpia token/user y ProtectedRoute pide login; 403 no equivale a sesión expirada y no provoca logout. Me fallido por red/500 no autoriza UI y termina loading, conservando token para recarga. Un 401 antiguo no elimina token posterior y una respuesta me tardía no revive logout; suscripciones se limpian al desmontar. CORS_ORIGINS permite solo orígenes exactos, sin credentials en cliente/servidor, sin cookie ni endpoint de logout nuevo. CORS no sustituye autenticación ni se declara mitigación XSS.

S03: límites independientes por IP de conexión y endpoint, ventanas fijas de 15 minutos: login 10, forgot 5, reset 10. Cuenta solicitudes que llegan a la ruta, exitosas o fallidas. Exceso 429 con mensaje controlado y Retry-After (expuesto por CORS); mensaje permitido por uiError, sin reintentos automáticos. Variables AUTH_WINDOW_MS/AUTH_LOGIN_MAX/AUTH_FORGOT_MAX/AUTH_RESET_MAX admiten enteros positivos. Mapa en memoria acotado a 10000 IP activas por endpoint: al saturarse rechaza nuevas claves en vez de crecer. Reiniciar proceso reinicia contadores; varias instancias requieren coordinación externa. NAT comparte cupo; ataques distribuidos pueden eludir un límite por IP. No se añadió bloqueo de cuenta, CAPTCHA ni sistema distribuido. TRUSTED_PROXIES exige IP/subredes concretas; por defecto se ignora X-Forwarded-For para identificar cliente.

Login valida tipos/límites y usa bcrypt también para cuentas inexistentes mediante hash ficticio, reduciendo diferencias evidentes sin prometer tiempo constante. Inexistente/inactivo/contraseña incorrecta devuelven idéntico mensaje funcional; recuperación sigue genérica incluso ante fallo de emisión/entrega. Auth/login/me no devuelven SQL, hashes ni stacks y no registran solicitudes, contraseñas, JWT o reset tokens. El manejador final controla errores propagados (JSON mal formado 400, exceso de cuerpo 413, otros 500). No se corrigieron los controladores ajenos a autenticación que capturan y exponen sus propios errores. Referencia: [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

Validación final: **148 pruebas backend y 42 frontend aprobadas (190 total), cero fallos/omisiones**. Backend incluye 9 subpruebas HTTP S01–S03 más contenedor y 2 de límites/proxy (12), F01–F16, instalación con 50 consultas preparadas, D01/F09/F16 y migración/verificación S01. Frontend añade 4 pruebas de sesión a las 38 anteriores. Una prueba adicional F11 demuestra equipo actual en nuevo registro e históricos intactos. Se actualizaron fixtures F11/F12/F15 para usar cuentas reales en PostgreSQL y F16 para esperar revocación después de reset; no se omite autorización. Tests inyectan únicamente conexiones a clústeres desechables, no cargan db.js/.env de aplicación. F16 eleva explícitamente cuotas en su proceso para probar recuperación; S03 prueba límites reales por separado y ventanas con reloj controlado.

Se demostraron JWT válido/inactivo/inexistente/expirado/alterado/legacy/algoritmo distinto, role/team antiguos sin autoridad, /me con una consulta, reset y rollback, errores SQL simulados sin detalles ni logs sensibles, CORS/preflight, 429 en tres rutas, IP falsificada sin proxy, reinicio de ventana y saturación. La primera ejecución se bloqueó por un arnés F12 que interceptaba connect sin soportar callbacks de pool.query; se corrigió el arnés y se detuvieron esa prueba y su clúster temporal identificado. Otro fixture omitía dependency del equipo y se corrigió. La ejecución final completa pasa. El sandbox impedía initdb; se ejecutaron únicamente tests aislados con permisos externos autorizados.

Regresión expresa: F08 revisión transaccional; F09 conserva activo anterior ante rollback; F10 valida fecha/período; F11 solo líder y equipo actual; F12 límite 15 y concurrencia 201/409; F13 approved + kg; F14 indicadores retirados; F15 administración/referencias; F16 recuperación/consumo único; F17 errores/404; F18 toast estable; F19 reset de archivo; F20 foco/menú conservados. Winners/prizes siguen 404 y ProtectedRoute no cambia. Ranking/puntos sin cambios de algoritmo. Las 56 filas de points_catalog en clústeres temporales se compararon intactas y el catálogo distribuido no cambió. No se conectó ni modificó ecoamigos real.

Build Vite y sintaxis correctos; git diff --check sin errores. Sin nuevas dependencias ni cambios de lockfiles. Smoke manual de login/logout/expiración en navegador y topología institucional pendiente; las pruebas frontend usan ReactDOM con host mínimo y API sustituida, no certifican cookies ni geometría de navegador. La implementación no constituye un despliegue; la base real todavía no recibió migración. No se trabajó S04, sin commit/push.

Archivos de aplicación: backend/.env.example; controllers/authController.js y passwordRecoveryController.js; middleware/authMiddleware.js, authRateLimit.js y httpConfig.js; routes/authRoutes.js; server.js. Base: database/schema.sql, 20260914_s01_session_version.sql y verify_s01_session_version.sql. Frontend: api/client.js, api/session.js, context/AuthContext.jsx y utils/uiError.js. Pruebas: d01-migration, f11-registration-access, f12-user-limit, f15-admin-scope, f16-password-recovery, helpers/authModule, s01-s03-auth, s03-rate-limit y frontend/tests/s02-session.test.js. Documentación: 01, 02, 04, 05, 06, 07, 08 y 09. Se usaron los nombres reales del repositorio: arquitectura está en 02-ARQUITECTURA.md, reglas backend en 06-REGLAS-Y-BACKEND.md y despliegue/operación en 08-OPERACION.md.


## Cierre controlado S04–S07: archivos y compatibilidad

Estado individual: **S04 CORREGIDO; S05 CORREGIDO; S06 CORREGIDO; S07 CORREGIDO** en código y pruebas aisladas. No supone despliegue, análisis antivirus ni validación de archivos reales. S02 permanece PARCIAL, sin modificaciones a su implementación. S08 y posteriores no se trabajaron.

### S04: recepción y almacenamiento

Antes: evidencia opcional del líder en POST /api/recycling usaba regex de extensión/MIME y 20 MiB, con inconsistencias MOV/AVI; contenido administrativo en POST/PUT /api/admin/content no tenía filtro ni límite. Los nombres usaban timestamp/Math.random para evidencia y timestamp-originalname para contenido. Ambos flujos escribían bajo uploads publicado estáticamente.

Ahora Multer admite un archivo por solicitud (evidence o file), hasta 24 campos, 25 partes y 64 KiB por campo. Escribe mediante streaming a disco, sin memoryStorage. Genera randomUUID más extensión normalizada, abre con wx y permisos 0600; nunca utiliza originalname como ruta. Rechaza directorios enlazados bajo la raíz y rutas fuera del almacenamiento. El directorio configurado es de confianza y debe estar bajo control del operador. Colisiones no sobrescriben ni borran el archivo previo. El máximo de recepción de contenido es el mayor límite de categoría; luego se comprueba el límite específico. Evidencia aplica también su tope propio. Rechazos limpian el archivo nuevo; fallos físicos conservan residuo controlado, como se explica en S06.

Errores uniformes: 400 vacío/multipart/tipo de contenido incompatible, 413 tamaño, 415 extensión/MIME/firma y 500 almacenamiento sin ruta interna. Las extensiones constructor y __proto__ se rechazan igual que cualquier extensión ajena; la tabla de formatos no hereda propiedades de Object.

### S05: acceso por entidad y frontend

Se retiró express.static de uploads y no existe otra publicación del directorio en el servidor. GET /uploads/... devuelve 404. Endpoints GET actuales:

- /api/files/evidence/:id: autenticación S01 vigente; admin o líder propietario del registro. Pertenecer al mismo equipo no concede lectura. Otro líder, usuario inactivo con JWT previo y solicitud anónima se rechazan.
- /api/files/content/:id: admin autenticado, incluidos borradores.
- /api/files/public/content/:id: público únicamente si el contenido está publicado; borrador, ID inexistente o archivo ausente devuelve 404.

El servidor obtiene la ruta desde la entidad, no desde una ruta enviada por el cliente; limita formatos legacy esperados y verifica contención real/directorios sin enlaces. Añade nosniff, no-store y CSP sandbox; documentos se descargan como adjuntos. No se añadió supervisor ni token en query string.

ProtectedFile usa el cliente Axios existente con Bearer, responseType blob y AbortController. Crea Object URLs únicamente para respuestas vigentes, revoca al sustituir/desmontar e ignora respuestas tardías; error y reintento son controlados. AdminContentPage, AdminReviewsPage y LeaderDashboard lo consumen. EducationCategoryPage usa el endpoint público por ID mediante elementos HTML, sin Bearer. No queda concatenación backendBase + file_url para leer archivos privados.

Compatibilidad demostrada con fixtures temporales: evidencia /uploads/timestamp-random.jpg, contenido /uploads/content/old-name.pdf y DOC /uploads/content/timestamp-nombre.doc, publicado y borrador. Los bytes y la ubicación se conservan, sin moverlos. Ausentes dan 404. DOC era un formato previo: el accept de AdminContentPage en HEAD incluía .doc y el middleware de contenido no lo filtraba; también estaba documentado en el manual. DOC legacy sigue descargable como application/msword, pero una nueva carga DOC se rechaza con 415. El fixture DOC prueba transporte de bytes heredados, no decodificación de Word.

### S06: transacciones, referencias y residuos

Antes no se compensaban archivos nuevos ante SQL fallido ni se limpiaban reemplazos/eliminaciones. Ahora INSERT o validación fallidos limpian el nuevo; UPDATE fallido conserva el anterior y limpia el nuevo. UPDATE/DELETE bloquean la entidad con SELECT FOR UPDATE y limpian el anterior solo después de COMMIT, liberando primero la conexión. Antes de borrar se consultan ambas referencias: content_items.file_url y recycling_records.evidence_url. Un archivo todavía referenciado se conserva; ENOENT es seguro. No se añadió eliminación de evidencias ni operación funcional nueva.

Pruebas incluyen fallo SQL de INSERT/UPDATE, COMMIT diferido fallido, dos reemplazos concurrentes, referencia compartida con evidencia, ENOENT y fallo real simulado de fs.promises.unlink tras COMMIT de UPDATE y DELETE. Si unlink falla, la operación confirmada responde éxito y conserva la nueva referencia; registra solo FILE_CLEANUP_PENDING, sin ruta interna. Un fallo de consulta de referencias también conserva el archivo. El reintento posterior elimina únicamente el antiguo sin referencias.

No existe atomicidad distribuida entre PostgreSQL y disco: caída del proceso o fallo físico pueden dejar residuos. No se revierte ficticiamente un COMMIT ni se declara limpieza absoluta. No se eliminan huérfanos históricos automáticamente ni se aplica retención por antigüedad. La revisión futura exige copia de seguridad, detener escrituras y cotejar ambas columnas antes de retirar residuos; procedimiento en 08-OPERACION. No se ejecutó esa operación sobre archivos reales.

### S07: formatos y alcance de la firma

Dependencia nueva exacta file-type 22.1.0, ESM, Node >=22; validada con Node 24.13.0. Solo backend/package.json y backend/package-lock.json cambian dependencias (nueve paquetes transitivos añadidos). No hay nueva dependencia frontend. Se ejecuta detección en worker con 10 segundos de plazo y heap de 64 MiB; no es un límite de memoria total del proceso. Extensión normalizada, MIME declarado permitido y extensión detectada deben concordar.

Límites predeterminados en MiB (1024² bytes):

| Flujo | Extensiones nuevas | MIME | Firma validada | Límite |
| --- | --- | --- | --- | --- |
| Evidencia y contenido | jpg, jpeg | image/jpeg | JPEG + marcador final EOI | 10 MiB |
| Evidencia y contenido | png | image/png | PNG + marcador final IEND | 10 MiB |
| Evidencia y contenido | webp | image/webp | WebP/RIFF + tamaño del contenedor | 10 MiB |
| Evidencia y contenido | mp4 | video/mp4 | Contenedor MP4 | Evidencia 20; contenido 100 MiB |
| Evidencia y contenido | mov | video/quicktime | Contenedor QuickTime | Evidencia 20; contenido 100 MiB |
| Evidencia y contenido | avi | video/x-msvideo; alias video/avi, video/msvideo, video/vnd.avi | AVI/RIFF + tamaño del contenedor | Evidencia 20; contenido 100 MiB |
| Solo contenido | pdf | application/pdf | PDF + cierre %%EOF | 20 MiB |
| Solo contenido | docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document | ZIP/estructura OOXML detectada + EOCD | 20 MiB |

Variables nuevas: UPLOAD_ROOT, UPLOAD_IMAGE_MB=10, UPLOAD_DOCUMENT_MB=20, UPLOAD_VIDEO_MB=100, UPLOAD_EVIDENCE_MB=20. Los cuatro límites admiten enteros 1–500; evidencia toma además el menor límite aplicable por categoría. No se amplían formatos. Documentos nuevos solo PDF/DOCX; DOC únicamente lectura heredada.

Se probaron JPEG y PNG reales de 1 píxel, PDF de una página con xref y DOCX ZIP con relaciones/documento; texto renombrado jpg/png/pdf, MZ/bytes arbitrarios, MIME/extensión falsos, vacío, truncados y doble extensión. Un PNG real con nombre doble que termina en .png se admite con UUID seguro; archivo .png.exe o ejecutable renombrado .exe.png se rechaza. Las muestras MP4/MOV/AVI comprueban detección de contenedor, no reproducción ni códecs.

file-type ofrece identificación por firma de mejor esfuerzo, no antivirus ni garantía de seguridad interna. Los marcadores adicionales detectan ciertos truncamientos, no toda corrupción; no se decodifican imágenes/videos completos ni se certifican documentos libres de contenido activo. La lectura de archivos legacy no aplica retroactivamente el filtro de nuevas cargas. El smoke con archivos reales representativos queda pendiente en entorno autorizado.

### Verificación y alcance de esta continuación

Regresión completa: 166 pruebas backend y 47 frontend aprobadas, cero fallos/omisiones (213 en total). El bloque S04–S07 comprende 17 subpruebas backend más contenedor; frontend aporta cinco pruebas Blob/consumidores. Repetición final del bloque tras el último ajuste de extensiones: 18/18 aprobadas. Sintaxis de 58 archivos JavaScript y git diff --check correctos; JSX cubierto por build Vite aprobado. Las pruebas backend crean PostgreSQL y UPLOAD_ROOT temporales, inyectan sus conexiones y no cargan db.js/.env de la aplicación.

En esta continuación se completaron pruebas de legacy, unlink fallido tras UPDATE confirmado, directorios enlazados y respuestas Blob tardías; se mejoraron fixtures JPEG/PNG/PDF/DOCX y se corrigieron únicamente defensas de archivos y documentación relacionadas con el bloque. Los arneses F08/F09/F10/F11/F12/F15 resuelven los nuevos imports conservando controladores y autorización reales.

Regresión expresa: S01 CORREGIDO y S03 CORREGIDO; S02 PARCIAL y sin cambios. F09 conserva el período anterior ante rollback; F10 valida fecha/período; F12 conserva el límite de 15; F13 approved + kg; F14 indicadores retirados. F16 recuperación, F17 errores, F18 toast, F19 registro/reset de archivo y F20 foco/menú permanecen protegidos. Registro y contenido educativo pasan sus pruebas. ProtectedRoute no cambia; winners/prizes siguen 404. Ranking/puntos sin cambios de algoritmo. Las 56 filas originales de points_catalog se comparan intactas en las bases temporales y database no tiene diff.

No se conectó ni modificó ecoamigos real; no se movieron, borraron, modificaron ni migraron uploads reales. Sin commit ni push. Pendiente smoke manual de previsualización/descarga, videos con códecs reales, móvil y expiración durante descarga; también verificar en un despliegue autorizado que el proxy no publique uploads por fuera de Express. Estas verificaciones no se presentan como ejecutadas.

Archivos modificados o nuevos del bloque:

- Backend: .env.example, package.json, package-lock.json; src/server.js; controllers/adminController.js, recyclingController.js, fileController.js; middleware/uploadMiddleware.js; routes/adminRoutes.js, fileRoutes.js; services/contentFiles.js, fileFormats.js, fileStore.js, fileValidation.js, fileValidationWorker.js.
- Pruebas backend: f08-review.test.js, f09-periods.test.js, f10-record-period.test.js, f11-registration-access.test.js, f12-user-limit.test.js, f15-admin-scope.test.js, s04-s07-files.test.js, fixtures/files.js.
- Frontend: components/ProtectedFile.jsx; pages/admin/AdminContentPage.jsx, AdminReviewsPage.jsx; pages/leader/LeaderDashboard.jsx, RegisterRecyclingPage.jsx; pages/public/EducationCategoryPage.jsx; utils/uiError.js; tests/s05-protected-files.test.js.
- Documentación: 01-INSTALACION.md, 02-ARQUITECTURA.md, 04-API.md, 06-REGLAS-Y-BACKEND.md, 07-MANUAL-DE-USUARIO.md, 08-OPERACION.md y este 09-CALIDAD-Y-PENDIENTES.md.


## Cierre controlado S08–S10: configuración y logging

**S08 CORREGIDO; S09 CORREGIDO; S10 CORREGIDO**, con alcance de código y pruebas locales aisladas. No certifica un despliegue institucional, una conexión TLS real ni cumplimiento legal integral. Estado inicial: git status --short vacío; los cambios S04–S07 ya estaban en HEAD y se conservaron. No se trabajaron S11/S12.

### Auditoría antes de implementar

| Área | Mapa encontrado | Decisión aplicada |
| --- | --- | --- |
| HTTP | server.js usa corsOptions; S02 ya había añadido CORS_ORIGINS, lista exacta sin cookies. CLIENT_URL solo formaba enlaces F16; origen ajeno no recibía cabecera pero podía ejecutar ruta | Mantener Bearer y lista, añadir fallback CLIENT_URL, rechazar origen ajeno antes de ruta y explicitar OPTIONS/métodos/headers |
| PostgreSQL | Único Pool de aplicación en config/db.js, dotenv, DB_HOST/USER/PASSWORD/NAME, puerto 5432 literal; sin URL ni SSL. Tests crean Pool/Client temporales explícitos | Constructor puro databaseOptions.js y Pool único consumidor; no alterar conexiones de tests |
| Logger | utils/logger.js ejecutaba mkdirSync al importar, appendFileSync por evento y console.log duplicado; info.log/error.log ilimitados relativos al cwd | Cola asíncrona acotada, archivos JSONL nuevos y rotación por tamaño; no tocar históricos |
| Datos registrados | Altas incluían email, nombre/dependencia/equipo, actor; registros incluían material/cantidad y revisión; errores interpolaban error.message SQL | Eventos permitidos y IDs mínimos; no texto libre ni errores originales |
| Otras salidas | Exportación hacía console.error(error); inicio mostraba puerto; S06 usa marcador fijo FILE_CLEANUP_PENDING; no logging general de requests, IP, user agent ni headers | Exportación e inicio con eventos técnicos; conservar marcador S06 sin datos sensibles |
| Respuestas | Diversos catch de admin/reciclaje/público/exportación adjuntaban error.message a JSON | Retirar solo detalles internos; mantener mensajes, estados, reglas y contratos exitosos |
| Auditoría funcional | reviewed_by/reviewed_at/review_notes/status en PostgreSQL, no historial inmutable en archivos | Conservar íntegra; no confundir retención de logs con retención funcional |
| Dependencias/entorno | pg/cors/dotenv existentes, ningún logger especializado; .env ignorado | Sin dependencias ni cambios de lockfile; no leer/copiar .env real |

Se revisaron package.json y lockfile, variables, rutas, servicios, consola, filesystem y documentación. La búsqueda no encontró otra configuración de conexión de la aplicación. No se introducen proveedor, dominio institucional o certificado inventados.

### S08

CORS_ORIGINS prevalece sobre CLIENT_URL; permite lista separada por comas con espacios recortados. CLIENT_URL conserva un único origen para F16. Si ambas faltan, únicamente http://localhost:5173 fuera de producción; producción exige definición explícita. Vacío, wildcard y origen inválido fallan de forma controlada. Un origen ajeno recibe 403 genérico sin llegar a la operación. Sin Origin se continúa para CLI/servidores, sin omitir autorización. OPTIONS válido devuelve 204; Authorization/Content-Type, métodos GET/HEAD/POST/PUT/PATCH/DELETE/OPTIONS y Retry-After explícitos. credentials=false, frontend withCredentials=false y Bearer sin cambios; S02 permanece PARCIAL, sin cookies ni CSRF.

Pruebas HTTP cubren localhost, origen de lista, precedencia, espacios, origen ajeno (incluido POST sin ejecutar handler), preflight permitido/rechazado, Authorization y ausencia de Origin. Configuración vacía, inválida, wildcard y falta en producción rechazada. No se añadieron rutas de negocio.

### S09

Modo local: DB_HOST/DB_USER/DB_PASSWORD/DB_NAME requeridos, DB_PORT configurable 1–65535 o 5432 por omisión. DATABASE_URL no vacía prevalece completamente y se descompone en campos explícitos; admite postgres/postgresql y credenciales escapadas. Se rechazan query/fragmento para evitar ambigüedad con las opciones SSL de pg. URL vacía selecciona modo local. DB_SSL=false predeterminado; true exige verificación TLS mediante rejectUnauthorized:true. No hay modo inseguro; NODE_TLS_REJECT_UNAUTHORIZED=0 falla. Errores de configuración fijos sin secretos; DATABASE_POOL_ERROR no incluye Error original.

Pruebas sin red comprueban ambos modos, puerto personalizado/fallback, precedencia, decodificación, faltantes, URLs inválidas, SSL false/true y configuración efectiva de pg.Client sin connect(). No se utilizó ecoamigos real ni infraestructura externa. Certificados privados/CA y conectividad institucional quedan para la infraestructura que defina Parques Nacionales, sin desactivar verificación.

### S10

Un logger asíncrono propio y pequeño utiliza node:fs/promises, sin nuevas dependencias. Niveles info/warn/error, fecha UTC, evento de una lista cerrada y contexto permitido: IDs enteros actor_id/record_id/entity_id/team_id, estado approved/rejected. Los IDs conservan capacidad de correlación y se tratan como datos vinculables; no se promete anonimización. Se descartan datos personales de texto, IP/user agent, notas/evidencias/rutas/nombres de archivos, secretos, headers, errores completos y objetos anidados. No se serializan getters ni toJSON del payload.

LOG_DIR=logs; LOG_MAX_BYTES=5242880; LOG_MAX_FILES=5 archivos rotados además del actual; LOG_QUEUE_LIMIT=1000. Namespace ecoamigos-tech.jsonl y ecoamigos-tech.1.jsonl...5.jsonl, hasta aproximadamente 30 MiB generados por defecto. Retención por cantidad/tamaño, no días; valores técnicos ajustables, no política institucional. Los históricos y archivos ajenos permanecen intactos. Configuración inválida se detecta al arrancar; .gitignore incluye logs/ para no publicar JSONL.

La cola serializa escrituras de una instancia. Saturación/fallo de escritura/rotación descartan el evento, emiten TECH_LOG_UNAVAILABLE una vez y no interrumpen el request ni revierten negocio confirmado. Los marcadores de stderr requieren retención del futuro supervisor. Sin garantía de auditoría durable, sin coordinación multiproceso y con pérdida posible ante caída abrupta. Reducir LOG_MAX_FILES no borra slots históricos fuera del nuevo rango: revisión manual. Directorio/archivos enlazados se rechazan; acceso Windows depende de ACL del operador. No se tocaron ACL ni logs históricos reales.

Pruebas con directorios temporales y fixtures pequeños: tres niveles, secretos en campos/anidados/errores/texto libre, getters no ejecutados, rotación real/retención acotada y archivos ajenos preservados, cola saturada, fallo de directorio, appendFile y rename; promesas resueltas sin tumbar HTTP. Controladores reales con query sustituida fallan por SQL ficticio y devuelven solo mensaje controlado; logs no contienen el secreto de prueba. No se añadieron validaciones funcionales de S11.

### Archivos y comprobaciones

Modificados: .gitignore; backend/.env.example; backend/src/config/db.js; backend/src/middleware/httpConfig.js; backend/src/utils/logger.js; backend/src/server.js; controllers/adminController.js, recyclingController.js, publicController.js y exportController.js. Nuevos: backend/src/config/databaseOptions.js y backend/tests/s08-s10-config-logging.test.js. Documentación: 01-INSTALACION, 02-ARQUITECTURA, 04-API, 06-REGLAS-Y-BACKEND, 08-OPERACION y este 09. Sin cambios en frontend, database, catálogo, autenticación, recuperación ni servicios de archivos S04–S07. Los controladores públicos solo pierden el campo de error interno: SQL de ranking/puntos intacto.

Variables nuevas consumidas: DB_PORT, DATABASE_URL, DB_SSL, LOG_DIR, LOG_MAX_BYTES, LOG_MAX_FILES y LOG_QUEUE_LIMIT. CLIENT_URL y CORS_ORIGINS conservadas con precedencia documentada. .env.example usa placeholders y .env sigue ignorado por Git. Sin cambios de package.json ni lockfiles.

Regresión: S01 CORREGIDO, S02 PARCIAL sin cambio de estrategia, S03 y S04–S07 CORREGIDOS. F16 recuperación, F17 errores, F18 toast, F19 registro y F20 foco/menú intactos. ProtectedRoute, contenido educativo, registro, acceso S05 y firma S07 pasan regresión. Winners/prizes siguen 404. Ranking/puntos sin cambio de consultas ni cálculo; las 56 filas originales del catálogo se comparan intactas en PostgreSQL temporal, sin cambiar los archivos de database.

No se inició conexión a ecoamigos real ni se modificó esa base; no se ejecutaron migraciones reales ni operaciones sobre uploads reales. Los tests de conexión solo construyen configuración y las regresiones usan clústeres desechables. No hubo deploy, proveedor elegido, commit ni push. Smoke manual de navegador local (login, preflight, registro, contenido y archivos protegidos) pendiente; conectividad/TLS/ACL/supervisor institucional pendientes para la futura infraestructura, sin certificarlos aquí.

Validación final S08–S10: **178 pruebas backend y 47 frontend aprobadas (225 total), cero fallos ni omisiones**. Las 12 pruebas específicas nuevas están incluidas en backend. Build Vite correcto (solo avisos de deprecación existentes), sintaxis de 60 archivos JavaScript correcta, JSX cubierto por build y git diff --check correcto. Se ejecutó la suite completa final después del ajuste de CLIENT_URL y la prueba adicional de fallo de appendFile/rotación. No se reinstalaron dependencias ni se cambiaron lockfiles.
