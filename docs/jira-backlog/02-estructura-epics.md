# Estructura de Epics y alcance

**Reconstrucción retrospectiva, corte 2026-09-28; HEAD local 53985bb.** Jira no se utilizó durante el desarrollo original. IDs, jerarquía, prioridades y criterios se proponen ahora a partir de evidencia; no representan tickets, sprints, reuniones o estimaciones históricas. No se crean issues ni se asigna trabajo individual a los dos estudiantes.

Las Epics surgieron después de contrastar el inventario y evolución de 49 commits, los módulos funcionales, las 42 decisiones D/F/S y las fuentes de QA/entrega. No son Epics usadas históricamente. No se obliga a convertir SQL, middleware, CI o documentación en historias de usuario.

| Epic | Área real y motivo | Fase principal | Estado | Hijos directos |
| --- | --- | --- | --- | --- |
| [EP01](01-backlog-completo.md#ep01) — Requisitos y decisiones de alcance | Consolidar el alcance que se puede reconstruir de contratos y decisiones. Existe cuestionario respondido y matriz de 21 RF y 12 RNF; la aceptación integral sigue pendiente. | F1/E1 | Partially Completed | 4 |
| [EP02](01-backlog-completo.md#ep02) — Arquitectura y persistencia PostgreSQL | Representar diseño implementado, esquema, migraciones e instalación; el modelado se reconstruye del SQL y C4, no se afirma un prototipo conceptual previo firmado. | F2/E2 | Done | 11 |
| [EP03](01-backlog-completo.md#ep03) — Acceso, sesión y recuperación de cuentas | Autenticación y recuperación técnica existentes; localStorage y proveedor de correo siguen abiertos. | F3/E3 | Partially Completed | 3 |
| [EP04](01-backlog-completo.md#ep04) — Administración de usuarios, equipos y períodos | Altas, consultas y mantenimiento expresamente autorizado; no CRUD completo de períodos ni borrados físicos. | F3/E3 | Done | 4 |
| [EP05](01-backlog-completo.md#ep05) — Educación ambiental y contenidos multimedia | Publicación educativa de agua, energía, papel y residuos con administración de contenidos y adjuntos. | F3/E3 | Done | 2 |
| [EP06](01-backlog-completo.md#ep06) — Registro de reciclaje, historial y evidencias | Flujo protegido de registro e historial; la operación con catálogo institucional depende de D06/F05/F07. | F3/E3 | Partially Completed | 4 |
| [EP07](01-backlog-completo.md#ep07) — Revisión, catálogo de puntos y ranking | Revisión única y ranking implementados; semántica y catálogo institucional abiertos. Incluye historia del módulo de reconocimiento retirado. | F3/E3 | Partially Completed | 5 |
| [EP08](01-backlog-completo.md#ep08) — Estadísticas y reportes XLSX | Estadísticas soportadas y exportación acotada; equivalencias ambientales canceladas no forman parte del alcance vigente. | F3/E3 | Done | 3 |
| [EP09](01-backlog-completo.md#ep09) — Interfaz, navegación y accesibilidad | Evolución visual y correcciones de interacción verificables; no certificación integral de accesibilidad. | F3/E3 | Done | 2 |
| [EP10](01-backlog-completo.md#ep10) — Seguridad transversal y aseguramiento de calidad | Pruebas, configuración, logging y CI existentes; dependencias vulnerables y evidencia manual incompleta impiden cierre integral. | F4/E4 | Partially Completed | 13 |
| [EP11](01-backlog-completo.md#ep11) — Documentación y preparación de entrega institucional | Documentación consolidada y guía de transferencia existentes; recepción, infraestructura y operación institucional no ejecutadas. | F4/E4 | Partially Completed | 3 |

## Jerarquía lógica completa

### EP01: Requisitos y decisiones de alcance

- [TK01](01-backlog-completo.md#tk01) — Task: Consolidar contratos funcionales y decisiones de alcance — **Done**.
- [TK02](01-backlog-completo.md#tk02) — Task: Formalizar validación institucional de requisitos reconstruidos — **Pending Institutional Decision**.
- [TK-D06](01-backlog-completo.md#tk-d06) — Task: D06: Autorizar catálogo de Dependencias institucionales — **Pending Institutional Decision**.
- [TK-F06](01-backlog-completo.md#tk-f06) — Task: F06: Precisar metadatos descriptivos sin automatización inventada — **Done**.

### EP02: Arquitectura y persistencia PostgreSQL

- [TK03](01-backlog-completo.md#tk03) — Task: Documentar arquitectura y C4 niveles 1–3 — **Done**.
- [TK04](01-backlog-completo.md#tk04) — Task: Documentar modelo relacional y restricciones PostgreSQL — **Done**.
- [TK05](01-backlog-completo.md#tk05) — Task: Describir pantallas y flujos del diseño implementado — **Done**.
- [TK06](01-backlog-completo.md#tk06) — Task: Integrar React/Vite, Express y conexión PostgreSQL — **Done**.
- [TK15](01-backlog-completo.md#tk15) — Task: Parametrizar URL pública del backend en frontend — **Done**.
- [BG-D01](01-backlog-completo.md#bg-d01) — Bug: D01: Conciliar definiciones SQL e instalación histórica — **Done**.
- [BG-D05](01-backlog-completo.md#bg-d05) — Bug: D05: Conservar instrucciones de evidencia como texto — **Done**.
- [BG-D08](01-backlog-completo.md#bg-d08) — Bug: D08: Retirar datos de demostración prefijados del seed — **Done**.
- [BG-D09](01-backlog-completo.md#bg-d09) — Bug: D09: Evitar duplicación o sustitución de datos al repetir bootstrap — **Done**.
- [BG-D10](01-backlog-completo.md#bg-d10) — Bug: D10: Corregir importación absoluta y duplicados de catálogo — **Done**.
- [BG-ENV](01-backlog-completo.md#bg-env) — Bug: Corregir plantilla de configuración inicial del backend — **Done**.

### EP03: Acceso, sesión y recuperación de cuentas

- [ST01](01-backlog-completo.md#st01) — Story: Acceder a la aplicación según mi rol — **Done**.
  - [BG-S01](01-backlog-completo.md#bg-s01) — Bug: S01: Actualizar identidad autorizada y revocar JWT tras reset — **Done**.
  - [BG-S02](01-backlog-completo.md#bg-s02) — Bug: S02: Mitigar manejo de sesión manteniendo abierto riesgo localStorage — **Partially Completed**.
- [ST02](01-backlog-completo.md#st02) — Story: Recuperar acceso mediante un enlace temporal — **Partially Completed**.
  - [TK25](01-backlog-completo.md#tk25) — Task: Definir proveedor y entrega institucional de recuperación — **Pending Institutional Decision**.
  - [TK-F16](01-backlog-completo.md#tk-f16) — Task: F16: Implementar mecanismo técnico de recuperación temporal — **Done**.
- [BG-S03](01-backlog-completo.md#bg-s03) — Bug: S03: Limitar intentos de login y recuperación por IP — **Done**.

### EP04: Administración de usuarios, equipos y períodos

- [ST03](01-backlog-completo.md#st03) — Story: Administrar cuentas y su asignación — **Done**.
  - [BG-D02](01-backlog-completo.md#bg-d02) — Bug: D02: Eliminar doble escritura de password y password_hash — **Done**.
  - [BG-D07](01-backlog-completo.md#bg-d07) — Bug: D07: Sustituir credenciales seed inconsistentes por bootstrap explícito — **Done**.
  - [BG-F12](01-backlog-completo.md#bg-f12) — Bug: F12: Aplicar cupo de 15 cuentas en API y bootstrap — **Done**.
- [ST04](01-backlog-completo.md#st04) — Story: Mantener equipos y dependencias — **Done**.
- [ST05](01-backlog-completo.md#st05) — Story: Crear períodos para la campaña — **Done**.
  - [BG-F09](01-backlog-completo.md#bg-f09) — Bug: F09: Evitar pérdida o multiplicidad de período activo — **Done**.
- [TK-F15](01-backlog-completo.md#tk-f15) — Task: F15: Implementar mantenimiento administrativo limitado autorizado — **Done**.

### EP05: Educación ambiental y contenidos multimedia

- [ST06](01-backlog-completo.md#st06) — Story: Consultar educación ambiental publicada — **Done**.
  - [TK11](01-backlog-completo.md#tk11) — Task: Implementar contenido multimedia y visor por categoría — **Done**.
  - [BG-UI](01-backlog-completo.md#bg-ui) — Bug: Eliminar línea sobrante en contenido educativo — **Done**.
- [ST07](01-backlog-completo.md#st07) — Story: Gestionar contenidos educativos — **Done**.
  - [TK12](01-backlog-completo.md#tk12) — Task: Integrar formularios y operaciones CMS — **Done**.
  - [BG-D03](01-backlog-completo.md#bg-d03) — Bug: D03: Conciliar categorías y tipos de contenido — **Done**.
  - [BG-S06](01-backlog-completo.md#bg-s06) — Bug: S06: Coordinar limpieza de adjuntos con transacciones y referencias — **Done**.

### EP06: Registro de reciclaje, historial y evidencias

- [ST08](01-backlog-completo.md#st08) — Story: Registrar reciclaje para mi equipo — **Partially Completed**.
  - [TK07](01-backlog-completo.md#tk07) — Task: Implementar endpoint de alta e historial de reciclaje — **Done**.
  - [TK08](01-backlog-completo.md#tk08) — Task: Implementar formulario multipart de actividad — **Done**.
  - [BG-F05](01-backlog-completo.md#bg-f05) — Bug: F05: Rechazar referencias de catálogo manipuladas — **Partially Completed**.
  - [BG-F10](01-backlog-completo.md#bg-f10) — Bug: F10: Validar período y fecha de actividad transaccionalmente — **Done**.
  - [BG-F11](01-backlog-completo.md#bg-f11) — Bug: F11: Restringir registro a líderes con equipo válido — **Done**.
  - [BG-F19](01-backlog-completo.md#bg-f19) — Bug: F19: Vaciar input nativo de evidencia solo tras éxito — **Done**.
- [ST09](01-backlog-completo.md#st09) — Story: Consultar mi historial y evidencias — **Done**.
  - [BG-S05](01-backlog-completo.md#bg-s05) — Bug: S05: Cerrar exposición estática de evidencias y borradores — **Done**.
- [BG-S04](01-backlog-completo.md#bg-s04) — Bug: S04: Acotar cargas y sustituir nombres manipulables — **Done**.
- [BG-S07](01-backlog-completo.md#bg-s07) — Bug: S07: Validar formato y firma además del MIME declarado — **Done**.

### EP07: Revisión, catálogo de puntos y ranking

- [ST10](01-backlog-completo.md#st10) — Story: Aprobar o rechazar actividades pendientes — **Done**.
  - [TK09](01-backlog-completo.md#tk09) — Task: Implementar panel de pendientes e historial administrativo — **Done**.
  - [TK10](01-backlog-completo.md#tk10) — Task: Integrar lectura de catálogo y puntos aprobados — **Done**.
  - [BG-D04](01-backlog-completo.md#bg-d04) — Bug: D04: Restituir catálogo y referencias necesarias para aprobar — **Done**.
  - [BG-F04](01-backlog-completo.md#bg-f04) — Bug: F04: Eliminar fórmula de puntos obsoleta — **Done**.
  - [BG-F08](01-backlog-completo.md#bg-f08) — Bug: F08: Impedir revisiones repetidas y carreras entre revisores — **Done**.
- [ST11](01-backlog-completo.md#st11) — Story: Consultar clasificación de equipos — **Done**.
- [ST15](01-backlog-completo.md#st15) — Story: Consultar premios de la campaña — histórico — **Cancelled**.
  - [BG-F03](01-backlog-completo.md#bg-f03) — Bug: F03: Retirar exposición de premios inactivos y módulo de premios — **Done**.
- [ST16](01-backlog-completo.md#st16) — Story: Consultar ganadores anteriores — histórico — **Cancelled**.
  - [BG-F01](01-backlog-completo.md#bg-f01) — Bug: F01: Retirar pantalla de ganadores con contrato incompatible — **Done**.
  - [BG-F02](01-backlog-completo.md#bg-f02) — Bug: F02: Retirar agregado winners sin definición autorizada — **Done**.
- [BG-F07](01-backlog-completo.md#bg-f07) — Bug: F07: Resolver discrepancias de decimales y referencia orgánica — **Partially Completed**.

### EP08: Estadísticas y reportes XLSX

- [ST12](01-backlog-completo.md#st12) — Story: Consultar estadísticas de seguimiento — **Done**.
  - [BG-F13](01-backlog-completo.md#bg-f13) — Bug: F13: Excluir estados y unidades incompatibles de cantidades en kg — **Done**.
- [ST13](01-backlog-completo.md#st13) — Story: Descargar un reporte XLSX de registros — **Done**.
  - [TK13](01-backlog-completo.md#tk13) — Task: Integrar descarga XLSX y errores Blob — **Done**.
  - [BG-S11](01-backlog-completo.md#bg-s11) — Bug: S11: Limitar exportación y proteger concurrencia y celdas XLSX — **Done**.
- [ST17](01-backlog-completo.md#st17) — Story: Consultar equivalencias ambientales — histórico — **Cancelled**.
  - [BG-F14](01-backlog-completo.md#bg-f14) — Bug: F14: Retirar equivalencias ambientales no sustentadas — **Done**.

### EP09: Interfaz, navegación y accesibilidad

- [ST14](01-backlog-completo.md#st14) — Story: Navegar y recibir respuestas claras de la interfaz — **Done**.
  - [BG-F17](01-backlog-completo.md#bg-f17) — Bug: F17: Manejar rechazos UI y rutas desconocidas — **Done**.
  - [BG-F18](01-backlog-completo.md#bg-f18) — Bug: F18: Estabilizar toast para evitar repetición de efectos — **Done**.
  - [BG-F20](01-backlog-completo.md#bg-f20) — Bug: F20: Corregir foco de modal y navegación de menú móvil — **Done**.
- [TK14](01-backlog-completo.md#tk14) — Task: Incorporar identidad visual, iconografía y aliados — **Done**.

### EP10: Seguridad transversal y aseguramiento de calidad

- [TK16](01-backlog-completo.md#tk16) — Task: Incorporar logging y posteriormente acotarlo — **Done**.
- [TK17](01-backlog-completo.md#tk17) — Task: Implementar pruebas de instalación y migraciones aisladas — **Done**.
- [TK18](01-backlog-completo.md#tk18) — Task: Implementar regresión de concurrencia y rollback — **Done**.
- [TK19](01-backlog-completo.md#tk19) — Task: Implementar regresión frontend de interacción y sesión — **Done**.
- [TK20](01-backlog-completo.md#tk20) — Task: Automatizar instalación, pruebas, build y checks en CI — **Done**.
- [TK21](01-backlog-completo.md#tk21) — Task: Conservar matriz manual histórica y T01–T28 vigente — **Done**.
- [TK22](01-backlog-completo.md#tk22) — Task: Completar evidencia manual de interfaz, multimedia y restauración — **Partially Completed**.
- [TK27](01-backlog-completo.md#tk27) — Task: Registrar auditoría de dependencias y exposición por cadena — **Done**.
- [BG-S08](01-backlog-completo.md#bg-s08) — Bug: S08: Configurar orígenes CORS por entorno — **Done**.
- [BG-S09](01-backlog-completo.md#bg-s09) — Bug: S09: Parametrizar conexión PostgreSQL con TLS verificado — **Done**.
- [BG-S10](01-backlog-completo.md#bg-s10) — Bug: S10: Sustituir logs síncronos y excesivos por eventos acotados — **Done**.
- [BG-S12](01-backlog-completo.md#bg-s12) — Bug: S12: Resolver riesgos pendientes de dependencias conservando CI validado — **Partially Completed**.
- [BG-CI](01-backlog-completo.md#bg-ci) — Bug: Corregir arranque PostgreSQL de las 13 suites en GitHub Actions — **Done**.

### EP11: Documentación y preparación de entrega institucional

- [TK23](01-backlog-completo.md#tk23) — Task: Consolidar manuales y trazabilidad de decisiones — **Done**.
- [TK24](01-backlog-completo.md#tk24) — Task: Documentar instalación, backup y restauración coherente — **Done**.
- [TK26](01-backlog-completo.md#tk26) — Task: Definir infraestructura, custodia y recepción institucional — **Pending Institutional Decision**.

## Delimitación de elementos próximos

- Story describe una capacidad de visitante, líder o administrador; Task recoge el trabajo técnico que la soporta; Bug registra una anomalía real y su corrección, no una nueva funcionalidad inventada.
- TK07/TK08 cubren integración inicial de registro; BG-F05/F10/F11/F19 representan defectos/correcciones posteriores. No se contabilizan como cuatro implementaciones iniciales.
- TK27 cierra el análisis de dependencias, BG-S12 mantiene abierta su remediación, TK20 cierra CI y BG-CI registra el incidente del primer run.
- TK-F16 es el mecanismo técnico; ST02 continúa parcial por TK25, entrega institucional pendiente.
- ST15/ST16/ST17 conservan funcionalidades históricas canceladas. BG-F01/F02/F03/F14 registran retiros ejecutados, no capacidades vigentes.
- No se generan tickets de cuestionarios o insignias: no se encontró evidencia funcional en el historial inspeccionado. Clases CSS badge son etiquetas visuales, no un sistema de recompensas.

[Backlog completo](01-backlog-completo.md) · [Reglas de importación](08-plan-importacion-jira.md)

## EP01 contrastada con las fuentes oficiales

El levantamiento existe: cuestionario respondido y matrices de 21 RF y 12 RNF. EP01 sigue Partially Completed por decisiones y aceptación pendientes, no por ausencia de requisitos. TK01 conserva Done para su consolidación; TK02 incorpora la decisión de alcance de RF-020/RF-021. No se crean tickets duplicados.
