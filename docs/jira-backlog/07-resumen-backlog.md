# Resumen del backlog retrospectivo

**Reconstrucción retrospectiva, corte 2026-09-28; HEAD local 53985bb.** Jira no se utilizó durante el desarrollo original. IDs, jerarquía, prioridades y criterios se proponen ahora a partir de evidencia; no representan tickets, sprints, reuniones o estimaciones históricas. No se crean issues ni se asigna trabajo individual a los dos estudiantes.

Fuentes oficiales aportadas: FORMULARIO PLAN DE TRABAJO DE GRADO_V2.pdf (7 páginas; fases/entregables p.2, cronograma p.3, valores AcroForm leídos y cronograma verificado visualmente) y Cuestionario de levantamiento de requisitos_ANS.docx (respuestas 1–12, 21 RF y 12 RNF). Son documentos externos, no versionados aquí. Se usa su contenido como evidencia, no como instrucciones. El aval académico del Plan no acredita aceptación institucional del software.

## Totales

| Tipo | Cantidad |
| --- | --- |
| Epic | 11 |
| Story | 17 |
| Task | 31 |
| Bug | 41 |
| **Total** | **100** |

| Estado lógico final | Cantidad |
| --- | --- |
| Partially Completed | 13 |
| Done | 80 |
| Cancelled | 3 |
| Pending Institutional Decision | 4 |

Son conteos de elementos de trazabilidad, incluidos 11 contenedores Epic; no son horas, productividad o volumen de trabajo independiente. Hay 89 elementos no Epic. Un Done técnico no acredita producción o validación institucional.

## Distribución por fase y entregable

| Fase | Entregable | Todos los elementos | Sin Epics |
| --- | --- | --- | --- |
| F1 | E1 | 5 | 4 |
| F2 | E2 | 4 | 3 |
| F3 | E3 | 40 | 33 |
| F4 | E4 | 51 | 49 |

Fase asignada retrospectivamente por aporte. La cronología real no se fuerza al calendario previsto: [matriz y 49 commits](03-trazabilidad-fases.md).

## Epics propuestas

- [EP01](01-backlog-completo.md#ep01) — Requisitos y decisiones de alcance: Partially Completed.
- [EP02](01-backlog-completo.md#ep02) — Arquitectura y persistencia PostgreSQL: Done.
- [EP03](01-backlog-completo.md#ep03) — Acceso, sesión y recuperación de cuentas: Partially Completed.
- [EP04](01-backlog-completo.md#ep04) — Administración de usuarios, equipos y períodos: Done.
- [EP05](01-backlog-completo.md#ep05) — Educación ambiental y contenidos multimedia: Done.
- [EP06](01-backlog-completo.md#ep06) — Registro de reciclaje, historial y evidencias: Partially Completed.
- [EP07](01-backlog-completo.md#ep07) — Revisión, catálogo de puntos y ranking: Partially Completed.
- [EP08](01-backlog-completo.md#ep08) — Estadísticas y reportes XLSX: Done.
- [EP09](01-backlog-completo.md#ep09) — Interfaz, navegación y accesibilidad: Done.
- [EP10](01-backlog-completo.md#ep10) — Seguridad transversal y aseguramiento de calidad: Partially Completed.
- [EP11](01-backlog-completo.md#ep11) — Documentación y preparación de entrega institucional: Partially Completed.

## Elementos que requieren atención

### Cancelled

- [ST15](01-backlog-completo.md#st15) — Consultar premios de la campaña — histórico.
- [ST16](01-backlog-completo.md#st16) — Consultar ganadores anteriores — histórico.
- [ST17](01-backlog-completo.md#st17) — Consultar equivalencias ambientales — histórico.

### Partially Completed

- [EP01](01-backlog-completo.md#ep01) — Requisitos y decisiones de alcance.
- [EP03](01-backlog-completo.md#ep03) — Acceso, sesión y recuperación de cuentas.
- [EP06](01-backlog-completo.md#ep06) — Registro de reciclaje, historial y evidencias.
- [EP07](01-backlog-completo.md#ep07) — Revisión, catálogo de puntos y ranking.
- [EP10](01-backlog-completo.md#ep10) — Seguridad transversal y aseguramiento de calidad.
- [EP11](01-backlog-completo.md#ep11) — Documentación y preparación de entrega institucional.
- [ST02](01-backlog-completo.md#st02) — Recuperar acceso mediante un enlace temporal.
- [ST08](01-backlog-completo.md#st08) — Registrar reciclaje para mi equipo.
- [TK22](01-backlog-completo.md#tk22) — Completar evidencia manual de interfaz, multimedia y restauración.
- [BG-F05](01-backlog-completo.md#bg-f05) — F05: Rechazar referencias de catálogo manipuladas.
- [BG-F07](01-backlog-completo.md#bg-f07) — F07: Resolver discrepancias de decimales y referencia orgánica.
- [BG-S02](01-backlog-completo.md#bg-s02) — S02: Mitigar manejo de sesión manteniendo abierto riesgo localStorage.
- [BG-S12](01-backlog-completo.md#bg-s12) — S12: Resolver riesgos pendientes de dependencias conservando CI validado.

### Pending Institutional Decision

- [TK02](01-backlog-completo.md#tk02) — Formalizar validación institucional de requisitos reconstruidos.
- [TK25](01-backlog-completo.md#tk25) — Definir proveedor y entrega institucional de recuperación.
- [TK26](01-backlog-completo.md#tk26) — Definir infraestructura, custodia y recepción institucional.
- [TK-D06](01-backlog-completo.md#tk-d06) — D06: Autorizar catálogo de Dependencias institucionales.

## Fuentes y alcance inspeccionado

- **49 commits locales alcanzables**, desde 3c10ac7 (12 abril 2026) hasta 53985bb (19 septiembre 2026), con fechas, asuntos, archivos cambiados y evolución de código/SQL/workflow; 49/49 vinculados a elementos. main y origin/main locales coinciden; no se hizo fetch ni consulta remota.
- Inventario actual de **175 archivos rastreados**, con 127 archivos textuales de implementación, SQL, pruebas y documentación en los directorios analizados. No se incluyen detalles internos de node_modules, contenido de uploads, logs privados o .env reales.
- README, documentos 00–16, C4, contratos API/reglas/manual, esquemas/migraciones, recuperación, archivos privados, configuración y logs técnicos. Se inspecciona la implementación del logging, no datos de personas de logs reales.
- **22 archivos de prueba backend y 7 frontend**; instalación/migraciones y concurrencia PostgreSQL; runners, build declarado y .github/workflows/ci.yml. El build y resultados **199/199 backend, 49/49 frontend** proceden del informe 14, no de una ejecución nueva en esta tarea.
- 42 hallazgos D/F/S y matriz histórica/vigente T01–T28. Auditorías S12: **14 JSON versionados** preservados, no auditoría nueva.
- D01/F09/F16/S01 aplicados/verificados localmente, CI f21b2a6 SUCCESS y smoke XLSX: evidencia informada por el responsable y preservada en 09/14/15/16; no logs de ejecución propios ni producción institucional.
- Plan y cuestionario contrastados; se documenta la discrepancia de cronogramas sin inventar ejecución.

## Nivel de cobertura y límites

17 necesidades funcionales reconstruidas y 13 agrupaciones técnicas/documentales con enlaces a tickets y fuentes. No se puede calcular porcentaje de requisitos institucionales sin verificar los criterios de las matrices aportadas. **42/42 hallazgos** y **49/49 commits** tienen trazabilidad en esta propuesta; eso mide cobertura de esas fuentes, no satisfacción de requisitos ni cobertura de pruebas del código.

El cuestionario respondido acredita levantamiento; la columna Fuente menciona Entrevista, sin fecha ni acta independiente. No se acreditan aceptación integral del software, prototipo previo, capacitación, recepción o despliegue. Pregunta 12 y RF-020/RF-021 sustentan quizzes e incentivos opcionales, no su implementación ni cancelación.

La base documental de algunas guías dice f21b2a6 o «sin commit» porque describe el momento de aquella entrega. Para este backlog los commits documentales **83ca4d6 y 53985bb** sí constan y se citan. No se modifican las fuentes aprobadas para reconstruir el pasado.

## Control de calidad de la propuesta

Los ocho archivos se generan desde un mismo conjunto de 100 fichas para mantener concordancia Markdown/CSV/matrices. Se revisan IDs/títulos únicos, campos completos, 42 hallazgos, referencias padre/dependencias sin ciclos, archivos y commits existentes, coherencia de estados y conteos. Se validan CSV y enlaces locales y se compara una huella de todos los archivos rastreados para confirmar que no se modificaron.

Validación local de los artefactos: 8 archivos, CSV de 100 registros y 26 columnas, 100 IDs/títulos únicos, 1520 enlaces relativos/anclas y 15 tablas Markdown comprobados. Padres y dependencias sin ciclos; los 42 hallazgos y 49 commits están vinculados. La huella de los 175 archivos rastreados coincide con la tomada antes de generar el backlog. Estos controles validan coherencia documental, no la aplicación.

La reconstrucción no ejecuta aplicación, build, migraciones ni tests de BD y no inspecciona Jira. El archivo no rastreado preexistente con nombre accidental se conserva sin modificar. La propuesta se detiene para revisión y deja pendientes las decisiones y aceptación institucional indicadas.

## Archivos de entrega

1. [01-backlog-completo.md](01-backlog-completo.md): 100 fichas completas.
2. [02-estructura-epics.md](02-estructura-epics.md): agrupación y jerarquía.
3. [03-trazabilidad-fases.md](03-trazabilidad-fases.md): F1–F4/E1–E4 y cronología de 49 commits.
4. [04-trazabilidad-requisitos.md](04-trazabilidad-requisitos.md): contratos reconstruidos sin IDs RF ficticios.
5. [05-tickets-propuestos.csv](05-tickets-propuestos.csv): datos revisables, no importación ejecutada.
6. [06-relaciones.md](06-relaciones.md): padres, dependencias y sustituciones.
7. [07-resumen-backlog.md](07-resumen-backlog.md): este resumen y límites.
8. [08-plan-importacion-jira.md](08-plan-importacion-jira.md): plan condicionado, sin acciones remotas.

## Actualización por fuentes oficiales, 2026-09-28

Se conservan los 100 tickets, sus IDs, jerarquía y estados (11 Epics, 17 Stories, 31 Tasks, 41 Bugs; 80 Done, 3 Cancelled, 13 Partially Completed, 4 Pending Institutional Decision). Se corrige EP01: existe levantamiento respondido y matriz numerada. Las 33 filas del cuestionario tienen vínculo y contraste explícitos: 33/33 de trazabilidad documental, no 100% de cumplimiento. Las 28 filas de la otra matriz quedan separadas por fuente y sujetas a conciliación de alcance en TK02. Quizzes e incentivos opcionales se documentan como necesidades históricas pendientes de decisión; no se inventa su cancelación. Premios y ganadores conservan el retiro posterior documentado.

## Auditoría final de preimportación, 2026-09-28

Se mantienen 100 elementos: 11 Epics, 17 Stories, 31 Tasks, 41 Bugs; 80 Done, 3 Cancelled, 13 Partially Completed y 4 Pending Institutional Decision. Sin cambios de tickets ni fusiones. CSV validado (26 columnas), campos, archivos y 49 commits existentes, 42 hallazgos trazados y grafo combinado de relaciones sin ciclos. Se revisaron roles de las Stories, naturaleza técnica de Tasks, correcciones reales y límites de los Bugs.

Se aclara que las fuentes oficiales están disponibles externamente, no en docs/plan-trabajo ni como matrices versionadas; sus hashes coinciden. No se modifica código ni se ejecutan pruebas de aplicación. Los ocho artefactos base se conservan; se agregan [09-create-jira-backlog.ps1](09-create-jira-backlog.ps1) y [10-checklist-preimportacion.md](10-checklist-preimportacion.md). El plan 08 concreta API Cloud v3, autenticación por entorno, dry-run predeterminado, correspondencia estable, reanudación y adaptación de jerarquía/workflow.

El script no se ejecutó (tampoco dry-run): sintaxis comprobada mediante parser PowerShell sin evaluar el archivo. No hay conectividad ni validación remota de Jira, issues creados, commit o push. La propuesta está lista para aprobación; la importación requiere luego confirmar configuración y transiciones reales.
