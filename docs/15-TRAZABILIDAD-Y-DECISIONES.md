# Trazabilidad y decisiones — fuente consolidada D/F/S

[Índice](00-INDICE.md) · [Calidad y pruebas](09-CALIDAD-Y-PENDIENTES.md) · [Entrega](16-ENTREGA-INSTITUCIONAL.md)

## Línea base y criterios

Consolidación sobre **f21b2a6**, «Corrige infraestructura PostgreSQL del CI». No modifica implementación, datos, dependencias ni decisiones de negocio. Cada fila relaciona el hallazgo original, su riesgo, decisión, cambio, fuente y evidencia. Los commits se comprobaron en el historial local; las pruebas citadas existen en el árbol. Las decisiones de alcance provienen de la corrección controlada autorizada y sus informes versionados; no se presenta este documento como un acta institucional firmada.

Las dimensiones son independientes:

| Dimensión | Valores y significado |
| --- | --- |
| Resolución | **CORREGIDO**: satisfecho el alcance técnico/funcional autorizado, incluyendo retiros; **PARCIAL**: parte mitigada con pendiente explícito; **PENDIENTE INSTITUCIONAL**: necesita definición autorizada de Parques |
| Contexto | **VIGENTE**: contrato actual; **HISTÓRICO**: evidencia de un momento anterior, no instrucción actual; **RETIRADO POR DECISIÓN DE ALCANCE**: función/cálculo quitado, sin promesa de reintroducción |

CORREGIDO no equivale a certificación de seguridad integral o a despliegue productivo. **D01/F09/F16/S01 fueron aplicados y verificados en PostgreSQL local de desarrollo/QA según evidencia informada del proyecto. No fueron desplegados en infraestructura institucional de producción.** Esta consolidación no conecta a BD ni ejecuta migraciones.

## Evidencia disponible y límites de atribución

| Código | Evidencia | Procedencia y límite |
| --- | --- | --- |
| E-CÓDIGO | Árbol e historial local f21b2a6; rutas, SQL y suites citadas | Inspección local; no prueba nueva contra la base de la aplicación |
| E-LOCAL | 199/199 backend, 49/49 frontend; build/check aprobados, 73 archivos de sintaxis | Resultado registrado en [14](14-CI-PRIMER-RUN.md), no repetición de la regresión de BD en esta consolidación |
| E-QA | D01/F09/F16/S01 aplicados y verificados localmente | Informado por el responsable del proyecto; no se inventan fechas, servidores ni evidencia de producción |
| E-CI | Segundo GitHub Actions f21b2a6 SUCCESS | Informado y validado por el usuario en la interfaz de GitHub Actions; no inspeccionado mediante API aquí. **CI IMPLEMENTADO Y VALIDADO** |
| E-XLSX | Smoke manual XLSX S11 aprobado | Informado por el usuario; no ejecución manual propia de esta consolidación |
| E-AUDIT | JSON y análisis fechado S12 | [Informe 13](13-AUDITORIA-DEPENDENCIAS-S12.md), [capturas iniciales](audits/s12-2026-09-16) y [continuación CI](audits/s12-ci-first-run); no auditoría nueva |

En las tablas, archivos de controladores/rutas sin prefijo pertenecen a backend/src; páginas JSX a frontend/src/pages; nombres de pruebas backend sin extensión pertenecen a backend/tests y los indicados como frontend a frontend/tests, con sufijo .test.js. Los SQL sin prefijo están en database. Las referencias abreviadas docs/06 y docs/12 remiten a los documentos del índice. E-CÓDIGO se aplica a todas las filas; cada prueba indica qué verifica, sin atribuir una ejecución adicional.

## Estado vigente por hallazgo

### D — Instalación y datos

| ID | Hallazgo original y riesgo | Decisión y corrección/retiro | Código/SQL relacionado | Commit y verificación disponible | Resolución | Contexto | Limitación o pendiente |
| --- | --- | --- | --- | --- | --- | --- | --- |
| D01 | Tres definiciones SQL divergentes; instalaciones incompatibles | Esquema único, alias psql y migración controlada de instalación reconocida | database/schema.sql; 20260908_d01_migrate_existing.sql; verify_20260908_d01.sql | 3b27ab6; instalación y d01-migration; E-QA | CORREGIDO | VIGENTE | Otro destino requiere inspección/respaldo; no es migrador universal |
| D02 | password y password_hash duplicados; alta incompatible | Aplicación y bootstrap solo usan password_hash; migración concilia restricciones sin borrar historia | backend/src/controllers/adminController.js; database/create_admin.sql; migración D01 | 3b27ab6; installation/d01-migration; E-QA | CORREGIDO | VIGENTE | No se inventan hashes ni se reconstruyen contraseñas |
| D03 | category/tipos de contenido incompatibles; pérdida de significado | Esquema define categorías/tipos vigentes; migración valida sin clasificar datos ambiguos arbitrariamente | database/schema.sql; migración D01; adminController.js | 3b27ab6; installation/d01-migration; E-QA | CORREGIDO | VIGENTE | Datos incompatibles en otro destino requieren decisión por registro |
| D04 | Faltan catálogo y referencias; no se puede aprobar de forma coherente | Definir points_catalog y catalog_* y preservar referencias existentes | database/schema.sql; migración D01; recyclingController.js | 3b27ab6; SQL preparado e instalación/migración; E-QA | CORREGIDO | VIGENTE | No reconstruye referencias históricas ausentes |
| D05 | evidence_required BOOLEAN contradice instrucciones CSV | Usar TEXT descriptivo, importar sin reducir instrucciones a sí/no | database/schema.sql; import_points_catalog.sql; migración D01 | 3b27ab6; installation/d01-migration; E-QA | CORREGIDO | VIGENTE | Texto no equivale a validación automática de evidencia |
| D06 | CSV sin Dependencias institucionales; formulario carece de catálogo autorizado | Conservar las 56 filas y esperar cinco referencias/puntos institucionales aprobados | database/points_catalog_clean.csv; backend/src/utils/catalogReference.js | 3b27ab6 y 8badd9f; installation/f05-catalog-validation | PENDIENTE INSTITUCIONAL | VIGENTE | Parques debe definir catálogo; no copiar puntos de Hogares |
| D07 | Hash seed no corresponde a clave anunciada; acceso inicial fallido | Retirar credenciales prefijadas; bootstrap con datos explícitos y bcrypt válido | database/create_admin.sql; backend/scripts/hash-password.js; backend/src/seed.sql | 3b27ab6; installation | CORREGIDO | VIGENTE | Responsable configura su cuenta; no se entrega una clave universal |
| D08 | Seed de demostración con período y contenido antiguos; contaminación de datos | Seed sin escrituras; base nueva vacía de datos de negocio | backend/src/seed.sql; database/schema.sql | 3b27ab6; installation | CORREGIDO | VIGENTE | Datos de instalaciones anteriores no se eliminan |
| D09 | Repetición del seed duplica datos; bootstrap podría sustituir cuentas | Seed inocuo; alta repetida aborta sin reemplazar credenciales | backend/src/seed.sql; database/create_admin.sql | 3b27ab6; installation | CORREGIDO | VIGENTE | No deduplica datos históricos |
| D10 | Importador con ruta personal/duplicados; carga no reproducible | Ruta relativa, staging, transacción, bloqueo e identidad normalizada única | database/import_points_catalog.sql; database/schema.sql | 3b27ab6; installation: repetición/conflicto/concurrencia | CORREGIDO | VIGENTE | Conflictos abortan; no se sobrescriben puntos existentes |

### F — Funcionalidad

| ID | Hallazgo original y riesgo | Decisión y corrección/retiro | Código/SQL relacionado | Commit y verificación disponible | Resolución | Contexto | Limitación o pendiente |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F01 | UI ganadores esperaba campos diferentes; contrato roto | Retirar página, navegación e imports del módulo | frontend/src/App.jsx; páginas y navegación; WinnersPage retirada | 1821e21; f01-f03-retirement; F17 catch-all | CORREGIDO | RETIRADO POR DECISIÓN DE ALCANCE | No significa implementar o reparar un módulo de ganadores |
| F02 | Agregado winners incluía equipos sin definición de ganador | Retirar agregado/ruta; conservar ranking del período activo | backend/src/controllers/publicController.js; routes/publicRoutes.js | 1821e21; f01-f03-retirement y regresiones HTTP | CORREGIDO | RETIRADO POR DECISIÓN DE ALCANCE | Tablas históricas conservadas; no limpieza destructiva |
| F03 | Premios inactivos públicos; exposición fuera de alcance | Retirar operaciones/API/UI de premios | backend/src/routes/adminRoutes.js; publicRoutes.js; AdminSettingsPage.jsx | 1821e21; f01-f03-retirement y regresiones HTTP | CORREGIDO | RETIRADO POR DECISIÓN DE ALCANCE | prizes/winner_records se conservan por compatibilidad histórica |
| F04 | calculatePoints sin uso; segunda fórmula engañosa | Eliminar utilidad y fijar points_catalog.points como fuente ejecutable única | backend/src/controllers/recyclingController.js; calculatePoints.js retirado | 0afbcc9; f04-points-source | CORREGIDO | VIGENTE | Sin coincidencia histórica aprobación obtiene 0; alta nueva valida referencia |
| F05 | Referencia cliente manipulable; asignación arbitraria de puntos | Reconstruir referencia desde material/cantidad y exigir identidad existente | backend/src/utils/catalogReference.js; controllers/recyclingController.js | 8badd9f; f05-catalog-validation | PARCIAL | VIGENTE | D06/F07 siguen abiertos; sin identidad institucional se rechaza alta, incluido orgánico |
| F06 | Frecuencia, rachas y evidencia descriptivas se confundían con automatización | Documentar metadatos informativos y revisión manual; no inventar bloqueos | database/points_catalog_clean.csv; recyclingController.js; docs/06 | 8badd9f; f06-f07-catalog-semantics | CORREGIDO | VIGENTE | Corrección de contrato; no se implementó motor de frecuencia/rachas |
| F07 | Huecos decimales y referencia orgánica fija de 5 kg; semántica ambigua | Conservar límites heredados y documentar discrepancias; no redondear arbitrariamente | backend/src/utils/catalogReference.js; RegisterRecyclingPage.jsx | 8badd9f; f06-f07-catalog-semantics | PARCIAL | VIGENTE | Decidir intervalos decimales y significado/catálogo de orgánico con D06 |
| F08 | Revisión repetible/concurrente sobrescribe puntos y auditoría | Solo pending → approved/rejected, conexión única, FOR UPDATE y rollback; repetición 409 | backend/src/controllers/recyclingController.js: reviewRecord | 4a915b2; f08-review, concurrencia y rollback | CORREGIDO | VIGENTE | Una decisión por registro; no historial inmutable ni reparación retrospectiva |
| F09 | UPDATE e INSERT separados; pérdida de activo o múltiples activos | Transacción/bloqueo de periods e índice único parcial; máximo uno, cero válido | adminController.js; database/schema.sql; 20260909_f09_periods_one_active.sql; D01 | 11eb099; f09-periods/d01-migration; E-QA | CORREGIDO | VIGENTE | Rollback mantiene anterior; no agenda automática ni edición de períodos |
| F10 | Período/fecha sin autoridad backend; registros incoherentes | Validar activo/ID y fecha inclusiva no futura bajo bloqueo compatible con F09 | recyclingController.js; backend/src/utils/recordDate.js | e511ccb; f10-record-period, concurrencia F09/F10 | CORREGIDO | VIGENTE | CURRENT_DATE depende de PostgreSQL; no reescribe históricos |
| F11 | Admin sin equipo podía registrar; identidad insuficiente | Registro solo leader con equipo existente; S01 aporta identidad vigente | recyclingRoutes.js; recyclingController.js; frontend/src/App.jsx | e359a6b y d51387d; f11-registration-access/s01-s03-auth | CORREGIDO | VIGENTE | No registro administrativo en nombre de terceros |
| F12 | Cupo solo en UI; altas concurrentes superan 15 | Máximo 15 almacenadas incluyendo admins/inactivos; bloqueo compartido por API/bootstrap | adminController.js: createUser; database/create_admin.sql | 36af9d0; f12-user-limit y concurrencia | CORREGIDO | VIGENTE | SQL administrativo arbitrario puede eludir la regla; baja lógica no libera cupo |
| F13 | Sumas de estados/unidades distintos presentadas como kg | Cantidades approved + kg normalizado, sin conversión; mantener alcance histórico | backend/src/controllers/publicController.js; AdminDashboard.jsx | 91178e0; f13-approved-stats HTTP/SQL | CORREGIDO | VIGENTE | Conteos operativos conservan estados; no todo campo de stats filtra approved |
| F14 | Factores ambientales sin trazabilidad suficiente; afirmaciones no sustentadas | Retirar cuatro cálculos, objeto indicators y tarjetas; conservar total approved + kg | publicController.js; AdminDashboard.jsx; utilidad retirada; docs/12 | fc3389a; f14-indicator-methodology/f13-approved-stats | CORREGIDO | RETIRADO POR DECISIÓN DE ALCANCE | No valida factores; reintroducción requiere fuente, unidad, material y escenario |
| F15 | Alcance de mantenimiento indefinido; borrados amenazan referencias | Autorizar PATCH limitado de usuario y equipo; períodos GET/POST; sin DELETE de esas entidades | adminRoutes.js; adminController.js; AdminUsersPage.jsx; AdminSettingsPage.jsx | fefb3fa; f15-admin-scope HTTP y regresión F09/F10/F12 | CORREGIDO | VIGENTE | Usuario: nombre/email/equipo/is_active, no rol/clave. Equipo: nombre/dependencia. Contenido conserva su CRUD |
| F16 | Sin recuperación de contraseña; dependencia de SQL excepcional | Token aleatorio hasheado, temporal y de un uso, reset transaccional; S01 revoca JWT previos | passwordRecoveryController.js; services/passwordResetDelivery.js; database/20260912_f16_password_reset.sql | 42c5643 y d51387d; f16-password-recovery; E-QA | CORREGIDO | VIGENTE | Cierre técnico autorizado; proveedor de correo pendiente, no envío real ni cambio voluntario |
| F17 | Rechazos UI sin manejo y ruta desconocida sin vista; falsos vacíos | Loading/error/empty diferenciados, reintento y mensajes controlados; catch-all | frontend/src/components/LoadState.jsx; utils/uiError.js; App.jsx; páginas | 5412992; frontend f17-ui | CORREGIDO | VIGENTE | Pruebas con host mínimo; smoke visual integral no demostrado |
| F18 | Identidad toast inestable repite efectos/consultas | useCallback y value useMemo; notificaciones sin nueva carga del período | frontend/src/context/ToastContext.jsx | dd1e55b; frontend f18-toast | CORREGIDO | VIGENTE | No rediseña política de notificaciones |
| F19 | Estado limpio pero input de archivo conservado; reenvío accidental | useRef limpia input tras éxito; fallo conserva selección | frontend/src/pages/leader/RegisterRecyclingPage.jsx | 60d8c3a; frontend f19-evidence | CORREGIDO | VIGENTE | Se verifica flujo/DOM mínimo, no todos los navegadores |
| F20 | Modal y menú con barreras de teclado/foco | Foco atrapado/restaurado, Escape y atributos/estado accesible del menú | frontend/src/utils/dialogFocus.js; layouts/AppLayout.jsx; EducationCategoryPage.jsx | 21f418e; frontend f20-accessibility | CORREGIDO | VIGENTE | No certificación integral de accesibilidad; smoke móvil/visual por registrar |

### S — Seguridad y operación

| ID | Hallazgo original y riesgo | Decisión y corrección/retiro | Código/SQL relacionado | Commit y verificación disponible | Resolución | Contexto | Limitación o pendiente |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S01 | JWT conserva rol/equipo obsoletos y vive tras reset | JWT mínimo y usuario vigente por request; session_version cambia en reset atómico | authController.js; authMiddleware.js; passwordRecoveryController.js; database/20260914_s01_session_version.sql | d51387d; s01-s03-auth, migración/rollback; E-QA | CORREGIDO | VIGENTE | Logout local no revoca copias; reactivar puede admitir JWT vigente sin cambio de versión |
| S02 | JWT en localStorage accesible a JavaScript; exposición ante XSS | Conservar Bearer y corregir manejo coherente de sesión/rechazos; diferir cambio integral de transporte | frontend/src/api/client.js; api/session.js; context/AuthContext.jsx | d51387d; frontend s02-session | PARCIAL | VIGENTE | Token sigue en localStorage; decidir topología/orígenes y migración integral, no cookies parciales |
| S03 | Login/forgot/reset sin límites; abuso de intentos | Límites por IP/endpoint, mapa acotado, proxy explícito, 429/Retry-After y errores genéricos | backend/src/middleware/authRateLimit.js; routes/authRoutes.js | d51387d; s03-rate-limit/s01-s03-auth | CORREGIDO | VIGENTE | Memoria por proceso; NAT comparte cupo y ataques distribuidos requieren otros controles |
| S04 | Cargas sin límites seguros; recursos/nombres manipulables | Un archivo, UUID, límites por formato y limpieza al rechazar | backend/src/middleware/uploadMiddleware.js; services/fileStore.js | a96aa30; s04-s07-files | CORREGIDO | VIGENTE | UPLOAD_ROOT requiere almacenamiento y permisos adecuados |
| S05 | /uploads público expone evidencias y borradores | Quitar estáticos; rutas por entidad con publicación/propiedad/rol; Blob con Bearer | routes/fileRoutes.js; controllers/fileController.js; frontend/src/components/ProtectedFile.jsx | a96aa30; s04-s07-files y frontend s05-protected-files | CORREGIDO | VIGENTE | Un proxy externo no debe republicar uploads; referencias heredadas se resuelven bajo permisos |
| S06 | Huérfanos por fallo SQL/reemplazo/borrado; pérdida de adjuntos compartidos | Coordinar transacción y cleanup, consultar ambas tablas antes de retirar archivos | backend/src/services/contentFiles.js; fileStore.js; controladores | a96aa30; s04-s07-files: fallos/referencias/concurrencia | CORREGIDO | VIGENTE | BD y filesystem no son atómicos; crash puede dejar residuos; no barrido histórico automático |
| S07 | Regex/MIME insuficientes; aceptar formato aparente | Allowlist, extensión/MIME/firma y marcadores estructurales con worker acotado | backend/src/services/fileFormats.js; fileValidation.js; fileValidationWorker.js | a96aa30; s04-s07-files | CORREGIDO | VIGENTE | Sin antivirus, sin decodificación total ni certificación de codecs/contenido activo |
| S08 | CORS fijo ignora entorno; política ambigua | Orígenes exactos, fallback controlado CLIENT_URL, error al configurar mal, sin cookies | backend/src/middleware/httpConfig.js; server.js | 294563f; s08-s10-config-logging HTTP | CORREGIDO | VIGENTE | CORS no sustituye auth; topología institucional aún por definir |
| S09 | Puerto fijo y TLS sin contrato; conexión insegura/configuración opaca | DATABASE_URL o DB_*, puerto validado y SSL con certificado verificado | backend/src/config/databaseOptions.js; db.js | 294563f; s08-s10-config-logging, constructor sin red | CORREGIDO | VIGENTE | No conectividad/TLS institucional certificada ni CA inventada |
| S10 | Logs síncronos sin rotación y datos excesivos | JSONL asíncrono, allowlist, minimización, cola y rotación acotadas | backend/src/utils/logger.js; controladores; backend/.env.example | 294563f; s08-s10-config-logging | CORREGIDO | VIGENTE | IDs vinculables; posible pérdida en crash/saturación; sin auditoría inmutable ni coordinación multiproceso |
| S11 | Exportación ilimitada en memoria; concurrencia y celdas peligrosas | EXPORT_MAX_ROWS 1000 (1–10000), LIMIT+1, 422 sin truncar, una por proceso/429, strings sin fórmulas | backend/src/controllers/exportController.js; frontend/src/utils/exportError.js; AdminDashboard.jsx | 78c0297; backend/frontend s11-export; E-XLSX | CORREGIDO | VIGENTE | Sin filtros API; memoria acotada por filas, no RSS duro ni límite distribuido |
| S12 | Sin pruebas/CI ni auditoría de locks; defectos repetibles y dependencias vulnerables | Suites, instalación reproducible, CI y reportes de riesgo; helper PostgreSQL corregido | scripts/run-tests.mjs; check*.mjs; dependency-risk-report.mjs; .github/workflows/ci.yml; tests/helpers/postgresCluster.js | 78c0297 + f21b2a6; s12-ci/ci-infrastructure; E-LOCAL/E-CI; docs/13 y JSON | PARCIAL | VIGENTE | Exclusivamente riesgos de dependencias documentados; CI IMPLEMENTADO Y VALIDADO, sin CD |

## Balance y decisiones aún abiertas

| Bloque | CORREGIDO | PARCIAL | PENDIENTE INSTITUCIONAL |
| --- | --- | --- | --- |
| D01–D10 | 9 | 0 | 1: D06 |
| F01–F20 | 18 | 2: F05, F07 | 0 |
| S01–S12 | 10 | 2: S02, S12 | 0 |
| Total | **37** | **4** | **1** |

F01/F02/F03 y F14 tienen contexto RETIRADO POR DECISIÓN DE ALCANCE; los demás hallazgos de la matriz tienen contexto VIGENTE. Las evidencias intermedias siguientes tienen contexto HISTÓRICO y no añaden hallazgos ni cambian el balance.

| Evidencia histórica conservada | Qué cambió después | Fuente actual |
| --- | --- | --- |
| [11: entrega inicial D01–D10](11-CORRECCION-D01-D10.md), D01 inicialmente parcial | Migración 3b27ab6 y aplicación/verificación local informada; D01 corregido | Esta matriz y database/README |
| [12: factores y mitigación inicial F14](12-METODOLOGIA-INDICADORES.md) | Retiro fc3389a; no existen equivalencias derivadas en API/UI | F14 y reglas 06 |
| [09: matriz original T01–T28 y cierres sucesivos](09-CALIDAD-Y-PENDIENTES.md) | Revisión 409, auth vigente, retiros, archivos y XLSX protegido | Matriz VIGENTE de 09 |
| [14: primer run 78c0297 fallido](14-CI-PRIMER-RUN.md) | Helper corregido y segundo f21b2a6 SUCCESS informado | E-CI; S12 parcial solo por dependencias |

Pendientes de decisión/ejecución posterior: catálogo institucional D06 y semántica F05/F07; proveedor/adaptador de correo F16; topología y eventual sustitución integral de localStorage S02; actualizaciones de dependencias S12 con regresión; infraestructura, HTTPS, permisos, respaldo/retención y operación que Parques defina. No se asignan responsables personales, fechas o proveedores inexistentes. El cierre técnico F16 no afirma entrega operativa de correo. Véase [entrega institucional](16-ENTREGA-INSTITUCIONAL.md).

## Evidencia utilizable posteriormente en el trabajo académico

| Área | Material disponible | Límite o material por completar |
| --- | --- | --- |
| Requisitos y alcance | Contratos de 04/06/07, decisiones D/F/S y retiros | No sustituye requisitos institucionales firmados ni define pendientes D06/F05/F07 |
| Arquitectura y datos | 02/03, diagrama de componentes/relaciones, esquema y migraciones versionadas | No inventario de infraestructura productiva |
| Implementación y versiones | Código, commits por hallazgo y guía 10 | Esta consolidación todavía no tiene commit; no se inventa uno |
| Pruebas, regresión y concurrencia | Suites, inventario 09, resultados históricos, helper PostgreSQL aislado | No convertir fixtures en datos de producción ni los 28 casos manuales en pruebas ya aprobadas |
| Seguridad e incidencias | S01–S12, límites expresos, incidente CI 14 | No pentest, certificación de accesibilidad o seguridad integral |
| Automatización del aseguramiento de calidad | Workflow, runners, checks, build y E-CI | Sin CD; falta adjuntar URL/ID/capturas del run para evidencia independiente |
| Auditoría de dependencias | 13 y JSON preservados | Captura fechada; no demuestra ausencia actual de vulnerabilidades |
| Validación manual | E-XLSX y procedimientos T01–T28 | Captura/acta del smoke no adjunta; otros smoke visuales y restauración por documentar |
| Entrega y limitaciones | 16, operación 08 y pendientes de esta matriz | No acta firmada, capacitación certificada ni recepción de infraestructura productiva |

Esta organización prepara trazabilidad verificable para un informe posterior; no redacta el informe de grado ni inventa evidencia faltante.
