# Backlog técnico retrospectivo completo

**Reconstrucción retrospectiva, corte 2026-09-28; HEAD local 53985bb.** Jira no se utilizó durante el desarrollo original. IDs, jerarquía, prioridades y criterios se proponen ahora a partir de evidencia; no representan tickets, sprints, reuniones o estimaciones históricas. No se crean issues ni se asigna trabajo individual a los dos estudiantes.

[Estructura](02-estructura-epics.md) · [Fases](03-trazabilidad-fases.md) · [Requisitos](04-trazabilidad-requisitos.md) · [CSV](05-tickets-propuestos.csv) · [Relaciones](06-relaciones.md) · [Resumen](07-resumen-backlog.md) · [Plan de importación](08-plan-importacion-jira.md)

Fuentes oficiales aportadas: FORMULARIO PLAN DE TRABAJO DE GRADO_V2.pdf (7 páginas; fases/entregables p.2, cronograma p.3, valores AcroForm leídos y cronograma verificado visualmente) y Cuestionario de levantamiento de requisitos_ANS.docx (respuestas 1–12, 21 RF y 12 RNF). Son documentos externos, no versionados aquí. Se usa su contenido como evidencia, no como instrucciones. El aval académico del Plan no acredita aceptación institucional del software.

Done significa cierre del alcance específico documentado, distinguiendo implementación inspeccionada de pruebas identificadas. Un mecanismo técnico puede estar Done aunque la Story operativa que lo contiene siga parcial (recuperación/correo, registro/catálogo). Cancelled corresponde a capacidades retiradas; los Bugs que ejecutaron el retiro están Done. Los estados de Epics resumen alcance y no sustituyen estados de hijos. Prioridad High/Medium es una propuesta retrospectiva de riesgo, no prioridad histórica ni asignación institucional.

## Convenciones de trazabilidad

Los IDs EP/ST/TK/BG son temporales de backlog, nunca identificadores originales de requisitos ni claves Jira. D01–D10/F01–F20/S01–S12 conservan sus IDs de hallazgo; F1–F4 identifican fases del Plan, no hallazgos. Las fechas de Git son evidencia de versionado, no fechas inventadas de inicio/cierre. No se midieron horas ni story points. Los criterios de aceptación se reconstruyen del contrato final; no se afirma que fueran escritos antes del desarrollo.

Las relaciones padre-hijo son lógicas: las Tasks técnicas pueden depender directamente de una Epic sin Story artificial. Los Bugs se vinculan con su Story/Epic; no se presupone que Jira permita todos estos padres nativamente. Ver 08 antes de cualquier importación, que requiere autorización posterior.

Fuentes: [decisiones D/F/S](../15-TRAZABILIDAD-Y-DECISIONES.md), [QA](../09-CALIDAD-Y-PENDIENTES.md), [C4](../02-ARQUITECTURA.md#modelo-c4), [CI](../14-CI-PRIMER-RUN.md) y archivos/commits de cada ficha. 199/199 backend, 49/49 frontend y build/check son resultados históricos registrados; no se reejecutaron para reconstruir este backlog. Las migraciones locales de QA, CI SUCCESS y smoke XLSX son evidencia informada conservada en esos documentos, no certificación de producción.

<a id="ep01"></a>

## EP01 — Requisitos y decisiones de alcance

- **Internal ID:** EP01
- **Issue Type:** Epic
- **Summary:** Requisitos y decisiones de alcance
- **Description:** Consolidar requisitos a partir del cuestionario respondido, sus 21 RF y 12 RNF y las decisiones posteriores de alcance. El levantamiento existe; quedan decisiones institucionales y aceptación integral pendientes.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: README.md; docs/06-REGLAS-Y-BACKEND.md; docs/15-TRAZABILIDAD-Y-DECISIONES.md. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F1
- **Deliverable:** E1
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f1, ep01, evidencia-local
- **Component:** ep01
- **Evidence:** README.md; docs/06-REGLAS-Y-BACKEND.md; docs/15-TRAZABILIDAD-Y-DECISIONES.md; Git 73e52b0, 83ca4d6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [README.md](../../README.md); [docs/06-REGLAS-Y-BACKEND.md](../../docs/06-REGLAS-Y-BACKEND.md); [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md)
- **Related Commits:** 73e52b0, 83ca4d6
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F1 semanas 1–2; E1 semana 2; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** 73e52b0: 2026-09-07T19:58:08-05:00; 83ca4d6: 2026-09-19T15:24:35-05:00
- **Requerimiento/contrato relacionado:**

<a id="ep02"></a>

## EP02 — Arquitectura y persistencia PostgreSQL

- **Internal ID:** EP02
- **Issue Type:** Epic
- **Summary:** Arquitectura y persistencia PostgreSQL
- **Description:** Representar diseño implementado, esquema, migraciones e instalación; el modelado se reconstruye del SQL y C4, no se afirma un prototipo conceptual previo firmado.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: docs/02-ARQUITECTURA.md; docs/03-BASE-DE-DATOS.md; database/schema.sql; database/README.md. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F2
- **Deliverable:** E2
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f2, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** docs/02-ARQUITECTURA.md; docs/03-BASE-DE-DATOS.md; database/schema.sql; database/README.md; Git 3c10ac7, 3b27ab6, 83ca4d6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/02-ARQUITECTURA.md](../../docs/02-ARQUITECTURA.md); [docs/03-BASE-DE-DATOS.md](../../docs/03-BASE-DE-DATOS.md); [database/schema.sql](../../database/schema.sql); [database/README.md](../../database/README.md)
- **Related Commits:** 3c10ac7, 3b27ab6, 83ca4d6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F2 semanas 2–3; E2 semana 3; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; 3b27ab6: 2026-09-08T19:53:17-05:00; 83ca4d6: 2026-09-19T15:24:35-05:00
- **Requerimiento/contrato relacionado:**

<a id="ep03"></a>

## EP03 — Acceso, sesión y recuperación de cuentas

- **Internal ID:** EP03
- **Issue Type:** Epic
- **Summary:** Acceso, sesión y recuperación de cuentas
- **Description:** Autenticación y recuperación técnica existentes; localStorage y proveedor de correo siguen abiertos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/authController.js; backend/src/controllers/passwordRecoveryController.js; docs/15-TRAZABILIDAD-Y-DECISIONES.md. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep03, evidencia-local
- **Component:** ep03
- **Evidence:** backend/src/controllers/authController.js; backend/src/controllers/passwordRecoveryController.js; docs/15-TRAZABILIDAD-Y-DECISIONES.md; Git 3c10ac7, 42c5643, d51387d; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/authController.js](../../backend/src/controllers/authController.js); [backend/src/controllers/passwordRecoveryController.js](../../backend/src/controllers/passwordRecoveryController.js); [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md)
- **Related Commits:** 3c10ac7, 42c5643, d51387d
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; 42c5643: 2026-09-12T19:52:19-05:00; d51387d: 2026-09-14T20:03:18-05:00
- **Requerimiento/contrato relacionado:**

<a id="ep04"></a>

## EP04 — Administración de usuarios, equipos y períodos

- **Internal ID:** EP04
- **Issue Type:** Epic
- **Summary:** Administración de usuarios, equipos y períodos
- **Description:** Altas, consultas y mantenimiento expresamente autorizado; no CRUD completo de períodos ni borrados físicos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/adminController.js; frontend/src/pages/admin/AdminUsersPage.jsx; frontend/src/pages/admin/AdminSettingsPage.jsx. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep04, evidencia-local
- **Component:** ep04
- **Evidence:** backend/src/controllers/adminController.js; frontend/src/pages/admin/AdminUsersPage.jsx; frontend/src/pages/admin/AdminSettingsPage.jsx; Git 3c10ac7, c4e6208, fefb3fa; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/adminController.js](../../backend/src/controllers/adminController.js); [frontend/src/pages/admin/AdminUsersPage.jsx](../../frontend/src/pages/admin/AdminUsersPage.jsx); [frontend/src/pages/admin/AdminSettingsPage.jsx](../../frontend/src/pages/admin/AdminSettingsPage.jsx)
- **Related Commits:** 3c10ac7, c4e6208, fefb3fa
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; c4e6208: 2026-05-09T14:29:03-05:00; fefb3fa: 2026-09-12T19:26:47-05:00
- **Requerimiento/contrato relacionado:**

<a id="ep05"></a>

## EP05 — Educación ambiental y contenidos multimedia

- **Internal ID:** EP05
- **Issue Type:** Epic
- **Summary:** Educación ambiental y contenidos multimedia
- **Description:** Publicación educativa de agua, energía, papel y residuos con administración de contenidos y adjuntos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/public/EducationCategoryPage.jsx; frontend/src/pages/admin/AdminContentPage.jsx; backend/src/controllers/publicController.js. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep05, evidencia-local
- **Component:** ep05
- **Evidence:** frontend/src/pages/public/EducationCategoryPage.jsx; frontend/src/pages/admin/AdminContentPage.jsx; backend/src/controllers/publicController.js; Git 8c118e4, c4e6208, c47e38b, a123244; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/public/EducationCategoryPage.jsx](../../frontend/src/pages/public/EducationCategoryPage.jsx); [frontend/src/pages/admin/AdminContentPage.jsx](../../frontend/src/pages/admin/AdminContentPage.jsx); [backend/src/controllers/publicController.js](../../backend/src/controllers/publicController.js)
- **Related Commits:** 8c118e4, c4e6208, c47e38b, a123244
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** 8c118e4: 2026-05-09T11:44:58-05:00; c4e6208: 2026-05-09T14:29:03-05:00; c47e38b: 2026-05-10T17:02:44-05:00; a123244: 2026-06-30T13:40:50-05:00
- **Requerimiento/contrato relacionado:**

<a id="ep06"></a>

## EP06 — Registro de reciclaje, historial y evidencias

- **Internal ID:** EP06
- **Issue Type:** Epic
- **Summary:** Registro de reciclaje, historial y evidencias
- **Description:** Flujo protegido de registro e historial; la operación con catálogo institucional depende de D06/F05/F07.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/recyclingController.js; frontend/src/pages/leader/RegisterRecyclingPage.jsx; docs/06-REGLAS-Y-BACKEND.md. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** backend/src/controllers/recyclingController.js; frontend/src/pages/leader/RegisterRecyclingPage.jsx; docs/06-REGLAS-Y-BACKEND.md; Git 7bfffed, e511ccb, e359a6b, a96aa30; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [frontend/src/pages/leader/RegisterRecyclingPage.jsx](../../frontend/src/pages/leader/RegisterRecyclingPage.jsx); [docs/06-REGLAS-Y-BACKEND.md](../../docs/06-REGLAS-Y-BACKEND.md)
- **Related Commits:** 7bfffed, e511ccb, e359a6b, a96aa30
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** 7bfffed: 2026-05-08T21:23:07-05:00; e511ccb: 2026-09-09T20:13:42-05:00; e359a6b: 2026-09-09T20:22:50-05:00; a96aa30: 2026-09-15T20:36:09-05:00
- **Requerimiento/contrato relacionado:**

<a id="ep07"></a>

## EP07 — Revisión, catálogo de puntos y ranking

- **Internal ID:** EP07
- **Issue Type:** Epic
- **Summary:** Revisión, catálogo de puntos y ranking
- **Description:** Revisión única y ranking implementados; semántica y catálogo institucional abiertos. Incluye historia del módulo de reconocimiento retirado.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/recyclingController.js; backend/src/controllers/publicController.js; database/points_catalog_clean.csv. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** backend/src/controllers/recyclingController.js; backend/src/controllers/publicController.js; database/points_catalog_clean.csv; Git af9efcd, 4a915b2, 8badd9f, 1821e21; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/src/controllers/publicController.js](../../backend/src/controllers/publicController.js); [database/points_catalog_clean.csv](../../database/points_catalog_clean.csv)
- **Related Commits:** af9efcd, 4a915b2, 8badd9f, 1821e21
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** af9efcd: 2026-04-12T16:56:55-05:00; 1821e21: 2026-09-08T20:19:49-05:00; 8badd9f: 2026-09-08T21:02:29-05:00; 4a915b2: 2026-09-09T19:43:37-05:00
- **Requerimiento/contrato relacionado:**

<a id="ep08"></a>

## EP08 — Estadísticas y reportes XLSX

- **Internal ID:** EP08
- **Issue Type:** Epic
- **Summary:** Estadísticas y reportes XLSX
- **Description:** Estadísticas soportadas y exportación acotada; equivalencias ambientales canceladas no forman parte del alcance vigente.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/exportController.js; frontend/src/pages/admin/AdminDashboard.jsx; docs/12-METODOLOGIA-INDICADORES.md. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep08, evidencia-local
- **Component:** ep08
- **Evidence:** backend/src/controllers/exportController.js; frontend/src/pages/admin/AdminDashboard.jsx; docs/12-METODOLOGIA-INDICADORES.md; Git 36b367c, ae5ac63, a291519, 91178e0, fc3389a, 78c0297; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/exportController.js](../../backend/src/controllers/exportController.js); [frontend/src/pages/admin/AdminDashboard.jsx](../../frontend/src/pages/admin/AdminDashboard.jsx); [docs/12-METODOLOGIA-INDICADORES.md](../../docs/12-METODOLOGIA-INDICADORES.md)
- **Related Commits:** 36b367c, ae5ac63, a291519, 91178e0, fc3389a, 78c0297
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** 36b367c: 2026-05-12T19:05:25-05:00; ae5ac63: 2026-06-29T16:37:18-05:00; a291519: 2026-06-30T10:28:16-05:00; 91178e0: 2026-09-12T14:27:34-05:00; fc3389a: 2026-09-12T14:53:43-05:00; 78c0297: 2026-09-16T09:14:07-05:00
- **Requerimiento/contrato relacionado:**

<a id="ep09"></a>

## EP09 — Interfaz, navegación y accesibilidad

- **Internal ID:** EP09
- **Issue Type:** Epic
- **Summary:** Interfaz, navegación y accesibilidad
- **Description:** Evolución visual y correcciones de interacción verificables; no certificación integral de accesibilidad.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: frontend/src/layouts/AppLayout.jsx; frontend/src/styles/refinements.css; frontend/src/context/ToastContext.jsx. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep09, evidencia-local
- **Component:** ep09
- **Evidence:** frontend/src/layouts/AppLayout.jsx; frontend/src/styles/refinements.css; frontend/src/context/ToastContext.jsx; Git 4abd97e, 9637dd8, 73e52b0, 5412992, 21f418e; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/layouts/AppLayout.jsx](../../frontend/src/layouts/AppLayout.jsx); [frontend/src/styles/refinements.css](../../frontend/src/styles/refinements.css); [frontend/src/context/ToastContext.jsx](../../frontend/src/context/ToastContext.jsx)
- **Related Commits:** 4abd97e, 9637dd8, 73e52b0, 5412992, 21f418e
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** 4abd97e: 2026-05-09T21:03:34-05:00; 9637dd8: 2026-05-19T18:42:48-05:00; 73e52b0: 2026-09-07T19:58:08-05:00; 5412992: 2026-09-13T10:45:54-05:00; 21f418e: 2026-09-13T11:49:57-05:00
- **Requerimiento/contrato relacionado:**

<a id="ep10"></a>

## EP10 — Seguridad transversal y aseguramiento de calidad

- **Internal ID:** EP10
- **Issue Type:** Epic
- **Summary:** Seguridad transversal y aseguramiento de calidad
- **Description:** Pruebas, configuración, logging y CI existentes; dependencias vulnerables y evidencia manual incompleta impiden cierre integral.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: docs/09-CALIDAD-Y-PENDIENTES.md; docs/13-AUDITORIA-DEPENDENCIAS-S12.md; .github/workflows/ci.yml. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** docs/09-CALIDAD-Y-PENDIENTES.md; docs/13-AUDITORIA-DEPENDENCIAS-S12.md; .github/workflows/ci.yml; Git 294563f, 78c0297, f21b2a6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [docs/13-AUDITORIA-DEPENDENCIAS-S12.md](../../docs/13-AUDITORIA-DEPENDENCIAS-S12.md); [.github/workflows/ci.yml](../../.github/workflows/ci.yml)
- **Related Commits:** 294563f, 78c0297, f21b2a6
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** 294563f: 2026-09-15T21:04:17-05:00; 78c0297: 2026-09-16T09:14:07-05:00; f21b2a6: 2026-09-16T09:39:35-05:00
- **Requerimiento/contrato relacionado:**

<a id="ep11"></a>

## EP11 — Documentación y preparación de entrega institucional

- **Internal ID:** EP11
- **Issue Type:** Epic
- **Summary:** Documentación y preparación de entrega institucional
- **Description:** Documentación consolidada y guía de transferencia existentes; recepción, infraestructura y operación institucional no ejecutadas.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Los hijos conservan evidencia y estado propio; las capacidades retiradas permanecen identificadas. El cierre no presupone producción institucional.
- **Technical Notes:**  Fuentes técnicas: docs/16-ENTREGA-INSTITUCIONAL.md; docs/08-OPERACION.md; README.md. Agregación retrospectiva; consultar el grado de evidencia de cada hijo..
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** No aplica: Epic raíz
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep11, evidencia-local
- **Component:** ep11
- **Evidence:** docs/16-ENTREGA-INSTITUCIONAL.md; docs/08-OPERACION.md; README.md; Git 73e52b0, 83ca4d6, 53985bb; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/16-ENTREGA-INSTITUCIONAL.md](../../docs/16-ENTREGA-INSTITUCIONAL.md); [docs/08-OPERACION.md](../../docs/08-OPERACION.md); [README.md](../../README.md)
- **Related Commits:** 73e52b0, 83ca4d6, 53985bb
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Agregación retrospectiva; consultar el grado de evidencia de cada hijo.
- **Cronología de evidencia:** 73e52b0: 2026-09-07T19:58:08-05:00; 83ca4d6: 2026-09-19T15:24:35-05:00; 53985bb: 2026-09-19T15:39:39-05:00
- **Requerimiento/contrato relacionado:**

<a id="st01"></a>

## ST01 — Acceder a la aplicación según mi rol

- **Internal ID:** ST01
- **Issue Type:** Story
- **Summary:** Acceder a la aplicación según mi rol
- **Description:** Como líder de equipo, quiero iniciar sesión con mi cuenta y consultar mi sesión vigente, para usar las operaciones autorizadas.
- **User Story:** Como líder de equipo, quiero iniciar sesión con mi cuenta y consultar mi sesión vigente, para usar las operaciones autorizadas.
- **Acceptance Criteria:** Login activo entrega JWT; credencial inválida 401; autorización backend diferencia roles y consulta usuario actual; logout limpia sesión local.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/authController.js; backend/src/middleware/authMiddleware.js; frontend/src/context/AuthContext.jsx; backend/tests/s01-s03-auth.test.js; frontend/tests/s02-session.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP03](01-backlog-completo.md#ep03)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep03, evidencia-local
- **Component:** ep03
- **Evidence:** backend/src/controllers/authController.js; backend/src/middleware/authMiddleware.js; frontend/src/context/AuthContext.jsx; backend/tests/s01-s03-auth.test.js; frontend/tests/s02-session.test.js; Git 3c10ac7, af9efcd, d51387d; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/authController.js](../../backend/src/controllers/authController.js); [backend/src/middleware/authMiddleware.js](../../backend/src/middleware/authMiddleware.js); [frontend/src/context/AuthContext.jsx](../../frontend/src/context/AuthContext.jsx); [backend/tests/s01-s03-auth.test.js](../../backend/tests/s01-s03-auth.test.js); [frontend/tests/s02-session.test.js](../../frontend/tests/s02-session.test.js)
- **Related Commits:** 3c10ac7, af9efcd, d51387d
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; af9efcd: 2026-04-12T16:56:55-05:00; d51387d: 2026-09-14T20:03:18-05:00
- **Requerimiento/contrato relacionado:** Acceso por credenciales y roles; Cuestionario RF-001; Cuestionario RNF-003; Cuestionario RNF-004; Cuestionario RNF-005

<a id="st02"></a>

## ST02 — Recuperar acceso mediante un enlace temporal

- **Internal ID:** ST02
- **Issue Type:** Story
- **Summary:** Recuperar acceso mediante un enlace temporal
- **Description:** Como líder de equipo, quiero restablecer mi contraseña mediante un enlace enviado a mi correo, para recuperar el acceso sin solicitar cambios SQL.
- **User Story:** Como líder de equipo, quiero restablecer mi contraseña mediante un enlace enviado a mi correo, para recuperar el acceso sin solicitar cambios SQL.
- **Acceptance Criteria:** Token hasheado temporal y de un uso; reset invalida JWT previos; entrega real de correo pendiente y necesaria para cerrar el flujo completo.
- **Technical Notes:** F16 técnico CORREGIDO no equivale a correo operativo. Fuentes técnicas: backend/src/controllers/passwordRecoveryController.js; backend/src/services/passwordResetDelivery.js; frontend/src/pages/auth/PasswordRecoveryPage.jsx; backend/tests/f16-password-recovery.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP03](01-backlog-completo.md#ep03)
- **Dependencies:** [ST01](01-backlog-completo.md#st01)
- **Labels:** retrospectivo, f3, ep03, evidencia-local
- **Component:** ep03
- **Evidence:** backend/src/controllers/passwordRecoveryController.js; backend/src/services/passwordResetDelivery.js; frontend/src/pages/auth/PasswordRecoveryPage.jsx; backend/tests/f16-password-recovery.test.js; Git 42c5643, d51387d; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/passwordRecoveryController.js](../../backend/src/controllers/passwordRecoveryController.js); [backend/src/services/passwordResetDelivery.js](../../backend/src/services/passwordResetDelivery.js); [frontend/src/pages/auth/PasswordRecoveryPage.jsx](../../frontend/src/pages/auth/PasswordRecoveryPage.jsx); [backend/tests/f16-password-recovery.test.js](../../backend/tests/f16-password-recovery.test.js)
- **Related Commits:** 42c5643, d51387d
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. F16 técnico CORREGIDO no equivale a correo operativo.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 42c5643: 2026-09-12T19:52:19-05:00; d51387d: 2026-09-14T20:03:18-05:00
- **Requerimiento/contrato relacionado:** Recuperación de contraseña; Cuestionario RF-002

<a id="st03"></a>

## ST03 — Administrar cuentas y su asignación

- **Internal ID:** ST03
- **Issue Type:** Story
- **Summary:** Administrar cuentas y su asignación
- **Description:** Como administrador, quiero crear y actualizar las cuentas permitidas, para mantener responsables y equipos vigentes.
- **User Story:** Como administrador, quiero crear y actualizar las cuentas permitidas, para mantener responsables y equipos vigentes.
- **Acceptance Criteria:** Máximo 15 contando admins/inactivos; PATCH nombre/email/equipo/estado; sin edición de rol/clave o DELETE; históricos preservados.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/adminController.js; frontend/src/pages/admin/AdminUsersPage.jsx; backend/tests/f12-user-limit.test.js; backend/tests/f15-admin-scope.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP04](01-backlog-completo.md#ep04)
- **Dependencies:** [ST01](01-backlog-completo.md#st01)
- **Labels:** retrospectivo, f3, ep04, evidencia-local
- **Component:** ep04
- **Evidence:** backend/src/controllers/adminController.js; frontend/src/pages/admin/AdminUsersPage.jsx; backend/tests/f12-user-limit.test.js; backend/tests/f15-admin-scope.test.js; Git af9efcd, 36af9d0, fefb3fa; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/adminController.js](../../backend/src/controllers/adminController.js); [frontend/src/pages/admin/AdminUsersPage.jsx](../../frontend/src/pages/admin/AdminUsersPage.jsx); [backend/tests/f12-user-limit.test.js](../../backend/tests/f12-user-limit.test.js); [backend/tests/f15-admin-scope.test.js](../../backend/tests/f15-admin-scope.test.js)
- **Related Commits:** af9efcd, 36af9d0, fefb3fa
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** af9efcd: 2026-04-12T16:56:55-05:00; 36af9d0: 2026-09-12T14:12:38-05:00; fefb3fa: 2026-09-12T19:26:47-05:00
- **Requerimiento/contrato relacionado:** Administración de cuentas y límite de 15; Cuestionario RF-012

<a id="st04"></a>

## ST04 — Mantener equipos y dependencias

- **Internal ID:** ST04
- **Issue Type:** Story
- **Summary:** Mantener equipos y dependencias
- **Description:** Como administrador, quiero crear, listar y editar equipos, para organizar la participación sin perder referencias.
- **User Story:** Como administrador, quiero crear, listar y editar equipos, para organizar la participación sin perder referencias.
- **Acceptance Criteria:** Alta/listado y PATCH nombre/dependencia; no DELETE; registros previos conservan referencias.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/adminController.js; frontend/src/pages/admin/AdminSettingsPage.jsx; backend/tests/f15-admin-scope.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP04](01-backlog-completo.md#ep04)
- **Dependencies:** [ST01](01-backlog-completo.md#st01)
- **Labels:** retrospectivo, f3, ep04, evidencia-local
- **Component:** ep04
- **Evidence:** backend/src/controllers/adminController.js; frontend/src/pages/admin/AdminSettingsPage.jsx; backend/tests/f15-admin-scope.test.js; Git 3c10ac7, c4e6208, fefb3fa; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/adminController.js](../../backend/src/controllers/adminController.js); [frontend/src/pages/admin/AdminSettingsPage.jsx](../../frontend/src/pages/admin/AdminSettingsPage.jsx); [backend/tests/f15-admin-scope.test.js](../../backend/tests/f15-admin-scope.test.js)
- **Related Commits:** 3c10ac7, c4e6208, fefb3fa
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; c4e6208: 2026-05-09T14:29:03-05:00; fefb3fa: 2026-09-12T19:26:47-05:00
- **Requerimiento/contrato relacionado:** Administración de equipos; Cuestionario RF-011; Cuestionario RF-012

<a id="st05"></a>

## ST05 — Crear períodos para la campaña

- **Internal ID:** ST05
- **Issue Type:** Story
- **Summary:** Crear períodos para la campaña
- **Description:** Como administrador, quiero crear y consultar períodos, para delimitar la participación de la campaña.
- **User Story:** Como administrador, quiero crear y consultar períodos, para delimitar la participación de la campaña.
- **Acceptance Criteria:** Máximo uno activo y cero válido; sustitución atómica; rollback conserva anterior; sin edición/eliminación de períodos.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/adminController.js; database/20260909_f09_periods_one_active.sql; backend/tests/f09-periods.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP04](01-backlog-completo.md#ep04)
- **Dependencies:** [ST01](01-backlog-completo.md#st01)
- **Labels:** retrospectivo, f3, ep04, evidencia-local
- **Component:** ep04
- **Evidence:** backend/src/controllers/adminController.js; database/20260909_f09_periods_one_active.sql; backend/tests/f09-periods.test.js; Git 3c10ac7, c4e6208, 11eb099; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/adminController.js](../../backend/src/controllers/adminController.js); [database/20260909_f09_periods_one_active.sql](../../database/20260909_f09_periods_one_active.sql); [backend/tests/f09-periods.test.js](../../backend/tests/f09-periods.test.js)
- **Related Commits:** 3c10ac7, c4e6208, 11eb099
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; c4e6208: 2026-05-09T14:29:03-05:00; 11eb099: 2026-09-09T19:57:29-05:00
- **Requerimiento/contrato relacionado:** Períodos de participación; Cuestionario RF-008

<a id="st06"></a>

## ST06 — Consultar educación ambiental publicada

- **Internal ID:** ST06
- **Issue Type:** Story
- **Summary:** Consultar educación ambiental publicada
- **Description:** Como visitante, quiero consultar contenidos de agua, energía, papel y residuos, para conocer prácticas ambientales.
- **User Story:** Como visitante, quiero consultar contenidos de agua, energía, papel y residuos, para conocer prácticas ambientales.
- **Acceptance Criteria:** Cuatro categorías; solo publicados; texto/imagen/video/archivo según contenido; borradores privados.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/public/EducationCategoryPage.jsx; backend/src/controllers/publicController.js; backend/tests/s04-s07-files.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP05](01-backlog-completo.md#ep05)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep05, evidencia-local
- **Component:** ep05
- **Evidence:** frontend/src/pages/public/EducationCategoryPage.jsx; backend/src/controllers/publicController.js; backend/tests/s04-s07-files.test.js; Git 8c118e4, c47e38b, a123244, a96aa30; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/public/EducationCategoryPage.jsx](../../frontend/src/pages/public/EducationCategoryPage.jsx); [backend/src/controllers/publicController.js](../../backend/src/controllers/publicController.js); [backend/tests/s04-s07-files.test.js](../../backend/tests/s04-s07-files.test.js)
- **Related Commits:** 8c118e4, c47e38b, a123244, a96aa30
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 8c118e4: 2026-05-09T11:44:58-05:00; c47e38b: 2026-05-10T17:02:44-05:00; a123244: 2026-06-30T13:40:50-05:00; a96aa30: 2026-09-15T20:36:09-05:00
- **Requerimiento/contrato relacionado:** Educación ambiental por categoría; Cuestionario RF-004; Cuestionario RF-005; Cuestionario RF-006

<a id="st07"></a>

## ST07 — Gestionar contenidos educativos

- **Internal ID:** ST07
- **Issue Type:** Story
- **Summary:** Gestionar contenidos educativos
- **Description:** Como administrador, quiero crear, editar y retirar contenidos educativos, para mantener información publicada pertinente.
- **User Story:** Como administrador, quiero crear, editar y retirar contenidos educativos, para mantener información publicada pertinente.
- **Acceptance Criteria:** CRUD de contenido; draft/published; reemplazo seguro de adjuntos; archivos compartidos no se eliminan mientras tengan referencias.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/admin/AdminContentPage.jsx; backend/src/services/contentFiles.js; backend/tests/s04-s07-files.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP05](01-backlog-completo.md#ep05)
- **Dependencies:** [ST01](01-backlog-completo.md#st01)
- **Labels:** retrospectivo, f3, ep05, evidencia-local
- **Component:** ep05
- **Evidence:** frontend/src/pages/admin/AdminContentPage.jsx; backend/src/services/contentFiles.js; backend/tests/s04-s07-files.test.js; Git 8c118e4, c4e6208, a96aa30; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/admin/AdminContentPage.jsx](../../frontend/src/pages/admin/AdminContentPage.jsx); [backend/src/services/contentFiles.js](../../backend/src/services/contentFiles.js); [backend/tests/s04-s07-files.test.js](../../backend/tests/s04-s07-files.test.js)
- **Related Commits:** 8c118e4, c4e6208, a96aa30
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 8c118e4: 2026-05-09T11:44:58-05:00; c4e6208: 2026-05-09T14:29:03-05:00; a96aa30: 2026-09-15T20:36:09-05:00
- **Requerimiento/contrato relacionado:** Gestión de contenidos; Cuestionario RF-006; Cuestionario RF-019

<a id="st08"></a>

## ST08 — Registrar reciclaje para mi equipo

- **Internal ID:** ST08
- **Issue Type:** Story
- **Summary:** Registrar reciclaje para mi equipo
- **Description:** Como líder de equipo, quiero reportar material, cantidad, fecha y evidencia de mi actividad, para solicitar revisión de mi participación.
- **User Story:** Como líder de equipo, quiero reportar material, cantidad, fecha y evidencia de mi actividad, para solicitar revisión de mi participación.
- **Acceptance Criteria:** Solo líder con equipo actual; activo y fecha válida; pending/0; referencia canónica válida; no inventar catálogo institucional faltante.
- **Technical Notes:** Mecanismo verificado con fixtures; habilitación del grupo institucional depende de D06/F05/F07. Fuentes técnicas: frontend/src/pages/leader/RegisterRecyclingPage.jsx; backend/src/controllers/recyclingController.js; backend/tests/f10-record-period.test.js; backend/tests/f11-registration-access.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP06](01-backlog-completo.md#ep06)
- **Dependencies:** [ST01](01-backlog-completo.md#st01), [ST04](01-backlog-completo.md#st04), [ST05](01-backlog-completo.md#st05)
- **Labels:** retrospectivo, f3, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** frontend/src/pages/leader/RegisterRecyclingPage.jsx; backend/src/controllers/recyclingController.js; backend/tests/f10-record-period.test.js; backend/tests/f11-registration-access.test.js; Git af9efcd, 7bfffed, e511ccb, e359a6b, 8badd9f; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/leader/RegisterRecyclingPage.jsx](../../frontend/src/pages/leader/RegisterRecyclingPage.jsx); [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/tests/f10-record-period.test.js](../../backend/tests/f10-record-period.test.js); [backend/tests/f11-registration-access.test.js](../../backend/tests/f11-registration-access.test.js)
- **Related Commits:** af9efcd, 7bfffed, e511ccb, e359a6b, 8badd9f
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Mecanismo verificado con fixtures; habilitación del grupo institucional depende de D06/F05/F07.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** af9efcd: 2026-04-12T16:56:55-05:00; 7bfffed: 2026-05-08T21:23:07-05:00; 8badd9f: 2026-09-08T21:02:29-05:00; e511ccb: 2026-09-09T20:13:42-05:00; e359a6b: 2026-09-09T20:22:50-05:00
- **Requerimiento/contrato relacionado:** Registro de actividad de reciclaje; Cuestionario RF-013; Cuestionario RF-014

<a id="st09"></a>

## ST09 — Consultar mi historial y evidencias

- **Internal ID:** ST09
- **Issue Type:** Story
- **Summary:** Consultar mi historial y evidencias
- **Description:** Como líder de equipo, quiero consultar mis registros y sus evidencias autorizadas, para conocer su estado y las observaciones de revisión.
- **User Story:** Como líder de equipo, quiero consultar mis registros y sus evidencias autorizadas, para conocer su estado y las observaciones de revisión.
- **Acceptance Criteria:** mine filtra por usuario; estado/puntos/notas visibles; evidencia del líder propietario o admin, sin URL pública general.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/leader/LeaderDashboard.jsx; backend/src/controllers/recyclingController.js; backend/src/controllers/fileController.js; backend/tests/s04-s07-files.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP06](01-backlog-completo.md#ep06)
- **Dependencies:** [ST01](01-backlog-completo.md#st01), [ST08](01-backlog-completo.md#st08)
- **Labels:** retrospectivo, f3, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** frontend/src/pages/leader/LeaderDashboard.jsx; backend/src/controllers/recyclingController.js; backend/src/controllers/fileController.js; backend/tests/s04-s07-files.test.js; Git 3c10ac7, c4e6208, a96aa30; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/leader/LeaderDashboard.jsx](../../frontend/src/pages/leader/LeaderDashboard.jsx); [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/src/controllers/fileController.js](../../backend/src/controllers/fileController.js); [backend/tests/s04-s07-files.test.js](../../backend/tests/s04-s07-files.test.js)
- **Related Commits:** 3c10ac7, c4e6208, a96aa30
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; c4e6208: 2026-05-09T14:29:03-05:00; a96aa30: 2026-09-15T20:36:09-05:00
- **Requerimiento/contrato relacionado:** Historial personal y acceso a evidencia; Cuestionario RF-014

<a id="st10"></a>

## ST10 — Aprobar o rechazar actividades pendientes

- **Internal ID:** ST10
- **Issue Type:** Story
- **Summary:** Aprobar o rechazar actividades pendientes
- **Description:** Como administrador, quiero aprobar o rechazar actividades y dejar observaciones, para validar la participación antes de reconocer puntos.
- **User Story:** Como administrador, quiero aprobar o rechazar actividades y dejar observaciones, para validar la participación antes de reconocer puntos.
- **Acceptance Criteria:** Solo pending; aprobación usa catálogo, rechazo 0; reviewed_by/at/notes; repetición 409; concurrencia una decisión; rollback conserva datos.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/admin/AdminReviewsPage.jsx; backend/src/controllers/recyclingController.js; backend/tests/f08-review.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP07](01-backlog-completo.md#ep07)
- **Dependencies:** [ST01](01-backlog-completo.md#st01), [ST08](01-backlog-completo.md#st08)
- **Labels:** retrospectivo, f3, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** frontend/src/pages/admin/AdminReviewsPage.jsx; backend/src/controllers/recyclingController.js; backend/tests/f08-review.test.js; Git 7bfffed, a9de10c, 4a915b2; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/admin/AdminReviewsPage.jsx](../../frontend/src/pages/admin/AdminReviewsPage.jsx); [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/tests/f08-review.test.js](../../backend/tests/f08-review.test.js)
- **Related Commits:** 7bfffed, a9de10c, 4a915b2
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 7bfffed: 2026-05-08T21:23:07-05:00; a9de10c: 2026-05-09T20:08:43-05:00; 4a915b2: 2026-09-09T19:43:37-05:00
- **Requerimiento/contrato relacionado:** Revisión administrativa única; Cuestionario RF-015; Cuestionario RF-016; Cuestionario RF-017

<a id="st11"></a>

## ST11 — Consultar clasificación de equipos

- **Internal ID:** ST11
- **Issue Type:** Story
- **Summary:** Consultar clasificación de equipos
- **Description:** Como visitante, quiero consultar el ranking del período activo, para conocer la participación reconocida por puntos.
- **User Story:** Como visitante, quiero consultar el ranking del período activo, para conocer la participación reconocida por puntos.
- **Acceptance Criteria:** Suma points_awarded de approved del activo; empate por nombre; sin activo vacío; no declara ganadores ni premios.
- **Technical Notes:** Verificación con datos de prueba no aprueba puntos institucionales nuevos. Fuentes técnicas: frontend/src/pages/public/RankingPage.jsx; backend/src/controllers/publicController.js; backend/tests/f04-points-source.test.js; backend/tests/f13-approved-stats.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP07](01-backlog-completo.md#ep07)
- **Dependencies:** [ST05](01-backlog-completo.md#st05), [ST10](01-backlog-completo.md#st10)
- **Labels:** retrospectivo, f3, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** frontend/src/pages/public/RankingPage.jsx; backend/src/controllers/publicController.js; backend/tests/f04-points-source.test.js; backend/tests/f13-approved-stats.test.js; Git 3c10ac7, 7bfffed, 1821e21; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/public/RankingPage.jsx](../../frontend/src/pages/public/RankingPage.jsx); [backend/src/controllers/publicController.js](../../backend/src/controllers/publicController.js); [backend/tests/f04-points-source.test.js](../../backend/tests/f04-points-source.test.js); [backend/tests/f13-approved-stats.test.js](../../backend/tests/f13-approved-stats.test.js)
- **Related Commits:** 3c10ac7, 7bfffed, 1821e21
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Verificación con datos de prueba no aprueba puntos institucionales nuevos.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; 7bfffed: 2026-05-08T21:23:07-05:00; 1821e21: 2026-09-08T20:19:49-05:00
- **Requerimiento/contrato relacionado:** Ranking por período; Cuestionario RF-007; Cuestionario RF-008; Cuestionario RF-018

<a id="st12"></a>

## ST12 — Consultar estadísticas de seguimiento

- **Internal ID:** ST12
- **Issue Type:** Story
- **Summary:** Consultar estadísticas de seguimiento
- **Description:** Como administrador, quiero consultar conteos y cantidades de reciclaje aprobado en kg, para revisar la actividad registrada sin equivalencias no sustentadas.
- **User Story:** Como administrador, quiero consultar conteos y cantidades de reciclaje aprobado en kg, para revisar la actividad registrada sin equivalencias no sustentadas.
- **Acceptance Criteria:** Sumas approved + unit kg normalizada, sin conversión; conteos operativos con alcance documentado; sin indicators F14.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/admin/AdminDashboard.jsx; backend/src/controllers/publicController.js; backend/tests/f13-approved-stats.test.js; backend/tests/f14-indicator-methodology.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP08](01-backlog-completo.md#ep08)
- **Dependencies:** [ST10](01-backlog-completo.md#st10)
- **Labels:** retrospectivo, f3, ep08, evidencia-local
- **Component:** ep08
- **Evidence:** frontend/src/pages/admin/AdminDashboard.jsx; backend/src/controllers/publicController.js; backend/tests/f13-approved-stats.test.js; backend/tests/f14-indicator-methodology.test.js; Git 36b367c, 91178e0, fc3389a; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/admin/AdminDashboard.jsx](../../frontend/src/pages/admin/AdminDashboard.jsx); [backend/src/controllers/publicController.js](../../backend/src/controllers/publicController.js); [backend/tests/f13-approved-stats.test.js](../../backend/tests/f13-approved-stats.test.js); [backend/tests/f14-indicator-methodology.test.js](../../backend/tests/f14-indicator-methodology.test.js)
- **Related Commits:** 36b367c, 91178e0, fc3389a
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 36b367c: 2026-05-12T19:05:25-05:00; 91178e0: 2026-09-12T14:27:34-05:00; fc3389a: 2026-09-12T14:53:43-05:00
- **Requerimiento/contrato relacionado:** Estadísticas soportadas

<a id="st13"></a>

## ST13 — Descargar un reporte XLSX de registros

- **Internal ID:** ST13
- **Issue Type:** Story
- **Summary:** Descargar un reporte XLSX de registros
- **Description:** Como administrador, quiero exportar los registros a Excel, para examinar la actividad fuera de la interfaz.
- **User Story:** Como administrador, quiero exportar los registros a Excel, para examinar la actividad fuera de la interfaz.
- **Acceptance Criteria:** Nueve columnas; default 1000, rango 1–10000; 422 sin truncar; 429 concurrente por proceso; texto no fórmula; sin filtros API.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/exportController.js; frontend/src/utils/exportError.js; backend/tests/s11-export.test.js; frontend/tests/s11-export.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP08](01-backlog-completo.md#ep08)
- **Dependencies:** [ST01](01-backlog-completo.md#st01), [ST08](01-backlog-completo.md#st08)
- **Labels:** retrospectivo, f3, ep08, evidencia-local
- **Component:** ep08
- **Evidence:** backend/src/controllers/exportController.js; frontend/src/utils/exportError.js; backend/tests/s11-export.test.js; frontend/tests/s11-export.test.js; Git ae5ac63, a291519, 78c0297; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/exportController.js](../../backend/src/controllers/exportController.js); [frontend/src/utils/exportError.js](../../frontend/src/utils/exportError.js); [backend/tests/s11-export.test.js](../../backend/tests/s11-export.test.js); [frontend/tests/s11-export.test.js](../../frontend/tests/s11-export.test.js)
- **Related Commits:** ae5ac63, a291519, 78c0297
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** ae5ac63: 2026-06-29T16:37:18-05:00; a291519: 2026-06-30T10:28:16-05:00; 78c0297: 2026-09-16T09:14:07-05:00
- **Requerimiento/contrato relacionado:** Exportación XLSX

<a id="st14"></a>

## ST14 — Navegar y recibir respuestas claras de la interfaz

- **Internal ID:** ST14
- **Issue Type:** Story
- **Summary:** Navegar y recibir respuestas claras de la interfaz
- **Description:** Como líder de equipo, quiero navegar con teclado y reconocer cargas, errores y resultados de envío, para usar el sistema sin repetir operaciones por estados confusos.
- **User Story:** Como líder de equipo, quiero navegar con teclado y reconocer cargas, errores y resultados de envío, para usar el sistema sin repetir operaciones por estados confusos.
- **Acceptance Criteria:** 404 visual; error distinto de vacío; reintento; toast estable; archivo reiniciado solo tras éxito; foco/modal/menú accesibles.
- **Technical Notes:** No certifica accesibilidad integral ni todos los navegadores. Fuentes técnicas: frontend/src/components/LoadState.jsx; frontend/src/utils/dialogFocus.js; frontend/tests/f17-ui.test.js; frontend/tests/f20-accessibility.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP09](01-backlog-completo.md#ep09)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep09, evidencia-local
- **Component:** ep09
- **Evidence:** frontend/src/components/LoadState.jsx; frontend/src/utils/dialogFocus.js; frontend/tests/f17-ui.test.js; frontend/tests/f20-accessibility.test.js; Git 5e8f4c9, 5412992, dd1e55b, 60d8c3a, 21f418e; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/components/LoadState.jsx](../../frontend/src/components/LoadState.jsx); [frontend/src/utils/dialogFocus.js](../../frontend/src/utils/dialogFocus.js); [frontend/tests/f17-ui.test.js](../../frontend/tests/f17-ui.test.js); [frontend/tests/f20-accessibility.test.js](../../frontend/tests/f20-accessibility.test.js)
- **Related Commits:** 5e8f4c9, 5412992, dd1e55b, 60d8c3a, 21f418e
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. No certifica accesibilidad integral ni todos los navegadores.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 5e8f4c9: 2026-05-12T18:42:17-05:00; 5412992: 2026-09-13T10:45:54-05:00; dd1e55b: 2026-09-13T11:05:28-05:00; 60d8c3a: 2026-09-13T11:18:50-05:00; 21f418e: 2026-09-13T11:49:57-05:00
- **Requerimiento/contrato relacionado:** Usabilidad y navegación; Cuestionario RNF-001; Cuestionario RNF-002

<a id="st15"></a>

## ST15 — Consultar premios de la campaña — histórico

- **Internal ID:** ST15
- **Issue Type:** Story
- **Summary:** Consultar premios de la campaña — histórico
- **Description:** Como visitante, quiero consultar premios de la campaña, para conocer reconocimientos previstos.
- **User Story:** Como visitante, quiero consultar premios de la campaña, para conocer reconocimientos previstos.
- **Acceptance Criteria:** Criterio final de retiro: UI/API no exponen premios; rutas inexistentes; tablas conservadas.
- **Technical Notes:** Existió implementación histórica; Cancelled describe alcance final, no ausencia de trabajo. Fuentes técnicas: backend/tests/f01-f03-retirement.test.js; docs/09-CALIDAD-Y-PENDIENTES.md; database/schema.sql. Retiro comprobable en código y pruebas; no capacidad vigente.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Cancelled
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP07](01-backlog-completo.md#ep07)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep07, historico-retirado
- **Component:** ep07
- **Evidence:** backend/tests/f01-f03-retirement.test.js; docs/09-CALIDAD-Y-PENDIENTES.md; database/schema.sql; Git 3c10ac7, 1821e21; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/tests/f01-f03-retirement.test.js](../../backend/tests/f01-f03-retirement.test.js); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [database/schema.sql](../../database/schema.sql)
- **Related Commits:** 3c10ac7, 1821e21
- **Closing Notes:** Capacidad implementada históricamente y retirada por decisión de alcance; no reintroducir ni eliminar tablas históricas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Existió implementación histórica; Cancelled describe alcance final, no ausencia de trabajo. El cuestionario sí sustenta el origen: RF-010/pregunta 10 (premios), RF-009 (ganadores). Se conserva Cancelled por las decisiones posteriores F01–F03; no por ausencia de necesidad original.
- **Verificación:** Retiro comprobable en código y pruebas; no capacidad vigente
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; 1821e21: 2026-09-08T20:19:49-05:00
- **Requerimiento/contrato relacionado:** Premios — alcance retirado; Cuestionario RF-010

<a id="st16"></a>

## ST16 — Consultar ganadores anteriores — histórico

- **Internal ID:** ST16
- **Issue Type:** Story
- **Summary:** Consultar ganadores anteriores — histórico
- **Description:** Como visitante, quiero consultar ganadores anteriores, para conocer resultados reconocidos de campañas.
- **User Story:** Como visitante, quiero consultar ganadores anteriores, para conocer resultados reconocidos de campañas.
- **Acceptance Criteria:** Criterio final de retiro: ruta/página/agregado ausentes; ranking vigente no equivale a ganadores.
- **Technical Notes:**  Fuentes técnicas: backend/tests/f01-f03-retirement.test.js; docs/09-CALIDAD-Y-PENDIENTES.md; database/schema.sql. Retiro comprobable en código y pruebas; no capacidad vigente.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Cancelled
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP07](01-backlog-completo.md#ep07)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep07, historico-retirado
- **Component:** ep07
- **Evidence:** backend/tests/f01-f03-retirement.test.js; docs/09-CALIDAD-Y-PENDIENTES.md; database/schema.sql; Git 3c10ac7, af9efcd, 1821e21; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/tests/f01-f03-retirement.test.js](../../backend/tests/f01-f03-retirement.test.js); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [database/schema.sql](../../database/schema.sql)
- **Related Commits:** 3c10ac7, af9efcd, 1821e21
- **Closing Notes:** Capacidad implementada históricamente y retirada por decisión de alcance; no reintroducir ni eliminar tablas históricas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.  El cuestionario sí sustenta el origen: RF-010/pregunta 10 (premios), RF-009 (ganadores). Se conserva Cancelled por las decisiones posteriores F01–F03; no por ausencia de necesidad original.
- **Verificación:** Retiro comprobable en código y pruebas; no capacidad vigente
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; af9efcd: 2026-04-12T16:56:55-05:00; 1821e21: 2026-09-08T20:19:49-05:00
- **Requerimiento/contrato relacionado:** Ganadores — alcance retirado; Cuestionario RF-009

<a id="st17"></a>

## ST17 — Consultar equivalencias ambientales — histórico

- **Internal ID:** ST17
- **Issue Type:** Story
- **Summary:** Consultar equivalencias ambientales — histórico
- **Description:** Como administrador, quiero consultar equivalencias ambientales derivadas, para interpretar un impacto estimado.
- **User Story:** Como administrador, quiero consultar equivalencias ambientales derivadas, para interpretar un impacto estimado.
- **Acceptance Criteria:** Criterio final: cuatro tarjetas y cálculo/API retirados; total approved + kg conservado; metodología histórica preservada.
- **Technical Notes:** Historia de una capacidad no sustentada, no beneficio científicamente acreditado. Fuentes técnicas: docs/12-METODOLOGIA-INDICADORES.md; backend/tests/f14-indicator-methodology.test.js. Retiro comprobable en código y pruebas; no capacidad vigente.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Cancelled
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP08](01-backlog-completo.md#ep08)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep08, historico-retirado
- **Component:** ep08
- **Evidence:** docs/12-METODOLOGIA-INDICADORES.md; backend/tests/f14-indicator-methodology.test.js; Git da6ab9a, 712a9b3, 308f070, fc3389a; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/12-METODOLOGIA-INDICADORES.md](../../docs/12-METODOLOGIA-INDICADORES.md); [backend/tests/f14-indicator-methodology.test.js](../../backend/tests/f14-indicator-methodology.test.js)
- **Related Commits:** da6ab9a, 712a9b3, 308f070, fc3389a
- **Closing Notes:** Capacidad implementada históricamente y retirada por decisión de alcance; no reintroducir ni eliminar tablas históricas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Historia de una capacidad no sustentada, no beneficio científicamente acreditado.
- **Verificación:** Retiro comprobable en código y pruebas; no capacidad vigente
- **Cronología de evidencia:** da6ab9a: 2026-05-12T19:27:51-05:00; 712a9b3: 2026-05-14T11:07:32-05:00; 308f070: 2026-07-09T10:20:11-05:00; fc3389a: 2026-09-12T14:53:43-05:00
- **Requerimiento/contrato relacionado:** Equivalencias ambientales — alcance retirado

<a id="tk01"></a>

## TK01 — Consolidar contratos funcionales y decisiones de alcance

- **Internal ID:** TK01
- **Issue Type:** Task
- **Summary:** Consolidar contratos funcionales y decisiones de alcance
- **Description:** Reconstruir necesidades de README/API/manual y decisiones; no acreditar entrevistas sin actas.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Contratos actuales, retirados y pendientes con fuente; sin IDs RF inventados.
- **Technical Notes:**  Fuentes técnicas: README.md; docs/04-API.md; docs/06-REGLAS-Y-BACKEND.md; docs/15-TRAZABILIDAD-Y-DECISIONES.md. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F1
- **Deliverable:** E1
- **Parent Internal ID:** [EP01](01-backlog-completo.md#ep01)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f1, ep01, evidencia-local
- **Component:** ep01
- **Evidence:** README.md; docs/04-API.md; docs/06-REGLAS-Y-BACKEND.md; docs/15-TRAZABILIDAD-Y-DECISIONES.md; Git 73e52b0, 83ca4d6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución); Cuestionario de levantamiento de requisitos_ANS.docx, respuestas y matrices RF/RNF
- **Relevant Files:** [README.md](../../README.md); [docs/04-API.md](../../docs/04-API.md); [docs/06-REGLAS-Y-BACKEND.md](../../docs/06-REGLAS-Y-BACKEND.md); [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md)
- **Related Commits:** 73e52b0, 83ca4d6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F1 semanas 1–2; E1 semana 2; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 73e52b0: 2026-09-07T19:58:08-05:00; 83ca4d6: 2026-09-19T15:24:35-05:00
- **Requerimiento/contrato relacionado:** Especificación de requisitos reconstruida

<a id="tk02"></a>

## TK02 — Formalizar validación institucional de requisitos reconstruidos

- **Internal ID:** TK02
- **Issue Type:** Task
- **Summary:** Formalizar validación institucional de requisitos reconstruidos
- **Description:** Contrastar los requisitos documentados con el alcance implementado y obtener decisiones pendientes. Pregunta 12, RF-020 y RF-021 documentan quizzes opcionales e incentivos posibles (puntos o insignias), sin implementación ni decisión explícita de cancelación acreditada.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Registrar aceptación o ajustes de las diferencias RF/RNF; decidir expresamente inclusión, aplazamiento o descarte de RF-020/RF-021 sin retrofechar ni implementar funcionalidades por esta actualización documental.
- **Technical Notes:**  Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/16-ENTREGA-INSTITUCIONAL.md. Ausencia o límite documentado; sin aprobación institucional acreditada.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Pending Institutional Decision
- **Phase:** F1
- **Deliverable:** E1
- **Parent Internal ID:** [EP01](01-backlog-completo.md#ep01)
- **Dependencies:** [TK01](01-backlog-completo.md#tk01)
- **Labels:** retrospectivo, f1, ep01, pendiente-institucional
- **Component:** ep01
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/16-ENTREGA-INSTITUCIONAL.md; brecha reconocida en documentación y cronograma aportado; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución); Cuestionario de levantamiento de requisitos_ANS.docx, pregunta 12, RF-020 y RF-021
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/16-ENTREGA-INSTITUCIONAL.md](../../docs/16-ENTREGA-INSTITUCIONAL.md)
- **Related Commits:** No hay commit que acredite ejecución de la actividad pendiente.
- **Closing Notes:** No ejecutado ni aprobado; requiere decisión institucional explícita, sin fecha comprometida.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F1 semanas 1–2; E1 semana 2; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Ausencia o límite documentado; sin aprobación institucional acreditada
- **Cronología de evidencia:** Sin fecha de ejecución acreditada; pendiente identificado al corte documental.
- **Requerimiento/contrato relacionado:** Aceptación institucional y decisiones de alcance; cuestionario RF-020/RF-021; Cuestionario RF-012; Cuestionario RF-020; Cuestionario RF-021

<a id="tk03"></a>

## TK03 — Documentar arquitectura y C4 niveles 1–3

- **Internal ID:** TK03
- **Issue Type:** Task
- **Summary:** Documentar arquitectura y C4 niveles 1–3
- **Description:** Arquitectura reconstruida de SPA/API/persistencia; C4 documentado después del código.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Tres vistas reales, correo futuro y CI aparte; sin producción ficticia.
- **Technical Notes:**  Fuentes técnicas: docs/02-ARQUITECTURA.md; README.md; docs/00-INDICE.md. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F2
- **Deliverable:** E2
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f2, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** docs/02-ARQUITECTURA.md; README.md; docs/00-INDICE.md; Git 73e52b0, 83ca4d6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/02-ARQUITECTURA.md](../../docs/02-ARQUITECTURA.md); [README.md](../../README.md); [docs/00-INDICE.md](../../docs/00-INDICE.md)
- **Related Commits:** 73e52b0, 83ca4d6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F2 semanas 2–3; E2 semana 3; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 73e52b0: 2026-09-07T19:58:08-05:00; 83ca4d6: 2026-09-19T15:24:35-05:00
- **Requerimiento/contrato relacionado:** Diseño técnico y arquitectura; Cuestionario RNF-008; Cuestionario RNF-010

<a id="tk04"></a>

## TK04 — Documentar modelo relacional y restricciones PostgreSQL

- **Internal ID:** TK04
- **Issue Type:** Task
- **Summary:** Documentar modelo relacional y restricciones PostgreSQL
- **Description:** Modelo lógico/físico en SQL y diccionario; no modelo conceptual independiente firmado localizado.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Tablas/FK/tipos/índices explicados; esquema único; legacy no es funcionalidad vigente.
- **Technical Notes:**  Fuentes técnicas: database/schema.sql; docs/03-BASE-DE-DATOS.md; database/README.md. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F2
- **Deliverable:** E2
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f2, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** database/schema.sql; docs/03-BASE-DE-DATOS.md; database/README.md; Git 3c10ac7, 3b27ab6, 83ca4d6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [database/schema.sql](../../database/schema.sql); [docs/03-BASE-DE-DATOS.md](../../docs/03-BASE-DE-DATOS.md); [database/README.md](../../database/README.md)
- **Related Commits:** 3c10ac7, 3b27ab6, 83ca4d6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F2 semanas 2–3; E2 semana 3; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; 3b27ab6: 2026-09-08T19:53:17-05:00; 83ca4d6: 2026-09-19T15:24:35-05:00
- **Requerimiento/contrato relacionado:** Diseño de datos

<a id="tk05"></a>

## TK05 — Describir pantallas y flujos del diseño implementado

- **Internal ID:** TK05
- **Issue Type:** Task
- **Summary:** Describir pantallas y flujos del diseño implementado
- **Description:** Diseño reconstruido de páginas y documentación; no prototipo previo Figma demostrado.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Inventario de pantallas/roles y flujos; distinguir interfaz implementada de prototipo previo no localizado.
- **Technical Notes:**  Fuentes técnicas: docs/05-FRONTEND.md; docs/02-ARQUITECTURA.md; frontend/src/App.jsx. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F2
- **Deliverable:** E2
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f2, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** docs/05-FRONTEND.md; docs/02-ARQUITECTURA.md; frontend/src/App.jsx; Git 73e52b0, 83ca4d6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/05-FRONTEND.md](../../docs/05-FRONTEND.md); [docs/02-ARQUITECTURA.md](../../docs/02-ARQUITECTURA.md); [frontend/src/App.jsx](../../frontend/src/App.jsx)
- **Related Commits:** 73e52b0, 83ca4d6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F2 semanas 2–3; E2 semana 3; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 73e52b0: 2026-09-07T19:58:08-05:00; 83ca4d6: 2026-09-19T15:24:35-05:00
- **Requerimiento/contrato relacionado:** Diseño de interfaz

<a id="tk06"></a>

## TK06 — Integrar React/Vite, Express y conexión PostgreSQL

- **Internal ID:** TK06
- **Issue Type:** Task
- **Summary:** Integrar React/Vite, Express y conexión PostgreSQL
- **Description:** La primera versión ya incluye cliente, API y esquema; duración anterior desconocida.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Aplicaciones independientes; routers, cliente API y DB configurables.
- **Technical Notes:**  Fuentes técnicas: frontend/vite.config.js; frontend/src/api/client.js; backend/src/server.js; backend/src/config/db.js; backend/package.json; frontend/package.json. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** frontend/vite.config.js; frontend/src/api/client.js; backend/src/server.js; backend/src/config/db.js; backend/package.json; frontend/package.json; Git 3c10ac7, af9efcd; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/vite.config.js](../../frontend/vite.config.js); [frontend/src/api/client.js](../../frontend/src/api/client.js); [backend/src/server.js](../../backend/src/server.js); [backend/src/config/db.js](../../backend/src/config/db.js); [backend/package.json](../../backend/package.json); [frontend/package.json](../../frontend/package.json)
- **Related Commits:** 3c10ac7, af9efcd
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; af9efcd: 2026-04-12T16:56:55-05:00
- **Requerimiento/contrato relacionado:** Arquitectura ejecutable; Cuestionario RNF-008

<a id="tk07"></a>

## TK07 — Implementar endpoint de alta e historial de reciclaje

- **Internal ID:** TK07
- **Issue Type:** Task
- **Summary:** Implementar endpoint de alta e historial de reciclaje
- **Description:** Implementación inicial separada de correcciones F05/F10/F11; Done del mecanismo, no del catálogo institucional.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Persistir pending/0 e historial por usuario; identidad del servidor.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/recyclingController.js; backend/src/routes/recyclingRoutes.js; backend/tests/f11-registration-access.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [ST08](01-backlog-completo.md#st08)
- **Dependencies:** [ST01](01-backlog-completo.md#st01), [ST04](01-backlog-completo.md#st04), [ST05](01-backlog-completo.md#st05)
- **Labels:** retrospectivo, f3, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** backend/src/controllers/recyclingController.js; backend/src/routes/recyclingRoutes.js; backend/tests/f11-registration-access.test.js; Git 3c10ac7, af9efcd, 7bfffed; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/src/routes/recyclingRoutes.js](../../backend/src/routes/recyclingRoutes.js); [backend/tests/f11-registration-access.test.js](../../backend/tests/f11-registration-access.test.js)
- **Related Commits:** 3c10ac7, af9efcd, 7bfffed
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3c10ac7: 2026-04-12T12:29:27-05:00; af9efcd: 2026-04-12T16:56:55-05:00; 7bfffed: 2026-05-08T21:23:07-05:00
- **Requerimiento/contrato relacionado:** Registro de actividad de reciclaje

<a id="tk08"></a>

## TK08 — Implementar formulario multipart de actividad

- **Internal ID:** TK08
- **Issue Type:** Task
- **Summary:** Implementar formulario multipart de actividad
- **Description:** Material/cantidad/unidad/calidad/criterios/fecha/evidencia opcional en formulario.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Referencia derivada y envío al backend; calidad/criterios no inventan puntos.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/leader/RegisterRecyclingPage.jsx; frontend/tests/f19-evidence.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [ST08](01-backlog-completo.md#st08)
- **Dependencies:** [TK07](01-backlog-completo.md#tk07)
- **Labels:** retrospectivo, f3, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** frontend/src/pages/leader/RegisterRecyclingPage.jsx; frontend/tests/f19-evidence.test.js; Git af9efcd, 7bfffed, 5e8f4c9; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/leader/RegisterRecyclingPage.jsx](../../frontend/src/pages/leader/RegisterRecyclingPage.jsx); [frontend/tests/f19-evidence.test.js](../../frontend/tests/f19-evidence.test.js)
- **Related Commits:** af9efcd, 7bfffed, 5e8f4c9
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** af9efcd: 2026-04-12T16:56:55-05:00; 7bfffed: 2026-05-08T21:23:07-05:00; 5e8f4c9: 2026-05-12T18:42:17-05:00
- **Requerimiento/contrato relacionado:** Registro de actividad de reciclaje

<a id="tk09"></a>

## TK09 — Implementar panel de pendientes e historial administrativo

- **Internal ID:** TK09
- **Issue Type:** Task
- **Summary:** Implementar panel de pendientes e historial administrativo
- **Description:** Panel con búsqueda/filtros locales y observaciones de revisión.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Pendientes/revisados separados; revisor visible; filtros no mutan registros.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/admin/AdminReviewsPage.jsx; backend/src/routes/recyclingRoutes.js. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [ST10](01-backlog-completo.md#st10)
- **Dependencies:** [TK07](01-backlog-completo.md#tk07)
- **Labels:** retrospectivo, f3, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** frontend/src/pages/admin/AdminReviewsPage.jsx; backend/src/routes/recyclingRoutes.js; Git 7bfffed, a9de10c, 5e8f4c9; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/admin/AdminReviewsPage.jsx](../../frontend/src/pages/admin/AdminReviewsPage.jsx); [backend/src/routes/recyclingRoutes.js](../../backend/src/routes/recyclingRoutes.js)
- **Related Commits:** 7bfffed, a9de10c, 5e8f4c9
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 7bfffed: 2026-05-08T21:23:07-05:00; a9de10c: 2026-05-09T20:08:43-05:00; 5e8f4c9: 2026-05-12T18:42:17-05:00
- **Requerimiento/contrato relacionado:** Revisión administrativa única

<a id="tk10"></a>

## TK10 — Integrar lectura de catálogo y puntos aprobados

- **Internal ID:** TK10
- **Issue Type:** Task
- **Summary:** Integrar lectura de catálogo y puntos aprobados
- **Description:** Evolución a points_catalog y points_awarded; D06/F05/F07 abiertos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Aprobar consulta catálogo; alta/rechazo 0; no multiplicadores de calidad.
- **Technical Notes:**  Fuentes técnicas: backend/src/controllers/recyclingController.js; database/points_catalog_clean.csv; backend/tests/f04-points-source.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [ST10](01-backlog-completo.md#st10)
- **Dependencies:** [TK04](01-backlog-completo.md#tk04)
- **Labels:** retrospectivo, f3, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** backend/src/controllers/recyclingController.js; database/points_catalog_clean.csv; backend/tests/f04-points-source.test.js; Git af9efcd, 0afbcc9; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [database/points_catalog_clean.csv](../../database/points_catalog_clean.csv); [backend/tests/f04-points-source.test.js](../../backend/tests/f04-points-source.test.js)
- **Related Commits:** af9efcd, 0afbcc9
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** af9efcd: 2026-04-12T16:56:55-05:00; 0afbcc9: 2026-09-08T20:31:20-05:00
- **Requerimiento/contrato relacionado:** Puntos según catálogo

<a id="tk11"></a>

## TK11 — Implementar contenido multimedia y visor por categoría

- **Internal ID:** TK11
- **Issue Type:** Task
- **Summary:** Implementar contenido multimedia y visor por categoría
- **Description:** Categorías y visor desde mayo; evolución en junio/julio.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Cuatro categorías con publicados; texto/imagen/video/archivo; no presentar YouTube histórico como función vigente.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/public/EducationCategoryPage.jsx; backend/src/controllers/publicController.js. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [ST06](01-backlog-completo.md#st06)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep05, evidencia-local
- **Component:** ep05
- **Evidence:** frontend/src/pages/public/EducationCategoryPage.jsx; backend/src/controllers/publicController.js; Git 8c118e4, c47e38b, a123244, 9224718; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/public/EducationCategoryPage.jsx](../../frontend/src/pages/public/EducationCategoryPage.jsx); [backend/src/controllers/publicController.js](../../backend/src/controllers/publicController.js)
- **Related Commits:** 8c118e4, c47e38b, a123244, 9224718
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 8c118e4: 2026-05-09T11:44:58-05:00; c47e38b: 2026-05-10T17:02:44-05:00; a123244: 2026-06-30T13:40:50-05:00; 9224718: 2026-07-18T13:11:06-05:00
- **Requerimiento/contrato relacionado:** Educación ambiental por categoría; Cuestionario RF-004

<a id="tk12"></a>

## TK12 — Integrar formularios y operaciones CMS

- **Internal ID:** TK12
- **Issue Type:** Task
- **Summary:** Integrar formularios y operaciones CMS
- **Description:** CRUD previo a S04–S07, posteriormente protegido.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Crear/editar/borrar contenido admin con draft/published y adjunto opcional.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/admin/AdminContentPage.jsx; backend/src/routes/adminRoutes.js; backend/src/services/contentFiles.js. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [ST07](01-backlog-completo.md#st07)
- **Dependencies:** [ST01](01-backlog-completo.md#st01)
- **Labels:** retrospectivo, f3, ep05, evidencia-local
- **Component:** ep05
- **Evidence:** frontend/src/pages/admin/AdminContentPage.jsx; backend/src/routes/adminRoutes.js; backend/src/services/contentFiles.js; Git 8c118e4, c4e6208, a96aa30; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/admin/AdminContentPage.jsx](../../frontend/src/pages/admin/AdminContentPage.jsx); [backend/src/routes/adminRoutes.js](../../backend/src/routes/adminRoutes.js); [backend/src/services/contentFiles.js](../../backend/src/services/contentFiles.js)
- **Related Commits:** 8c118e4, c4e6208, a96aa30
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 8c118e4: 2026-05-09T11:44:58-05:00; c4e6208: 2026-05-09T14:29:03-05:00; a96aa30: 2026-09-15T20:36:09-05:00
- **Requerimiento/contrato relacionado:** Gestión de contenidos

<a id="tk13"></a>

## TK13 — Integrar descarga XLSX y errores Blob

- **Internal ID:** TK13
- **Issue Type:** Task
- **Summary:** Integrar descarga XLSX y errores Blob
- **Description:** Exportación inicial junio; manejo posterior de respuestas de límite y ocupación.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Descargar con token, liberar object URL y mostrar 422/429 sin JSON como archivo.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/admin/AdminDashboard.jsx; frontend/src/utils/exportError.js; frontend/tests/s11-export.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [ST13](01-backlog-completo.md#st13)
- **Dependencies:** [ST01](01-backlog-completo.md#st01)
- **Labels:** retrospectivo, f3, ep08, evidencia-local
- **Component:** ep08
- **Evidence:** frontend/src/pages/admin/AdminDashboard.jsx; frontend/src/utils/exportError.js; frontend/tests/s11-export.test.js; Git ae5ac63, a291519, 78c0297; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/admin/AdminDashboard.jsx](../../frontend/src/pages/admin/AdminDashboard.jsx); [frontend/src/utils/exportError.js](../../frontend/src/utils/exportError.js); [frontend/tests/s11-export.test.js](../../frontend/tests/s11-export.test.js)
- **Related Commits:** ae5ac63, a291519, 78c0297
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** ae5ac63: 2026-06-29T16:37:18-05:00; a291519: 2026-06-30T10:28:16-05:00; 78c0297: 2026-09-16T09:14:07-05:00
- **Requerimiento/contrato relacionado:** Exportación XLSX

<a id="tk14"></a>

## TK14 — Incorporar identidad visual, iconografía y aliados

- **Internal ID:** TK14
- **Issue Type:** Task
- **Summary:** Incorporar identidad visual, iconografía y aliados
- **Description:** Cambios gráficos, responsive y enlaces externos con historia Git.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Conservar identidad; cuatro iconos; aliados como enlaces, no convenios o integraciones demostrados.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/public/HomePage.jsx; frontend/src/styles/global.css; frontend/src/styles/pages.css; frontend/src/assets/cleoecoamigos.png. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP09](01-backlog-completo.md#ep09)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep09, evidencia-local
- **Component:** ep09
- **Evidence:** frontend/src/pages/public/HomePage.jsx; frontend/src/styles/global.css; frontend/src/styles/pages.css; frontend/src/assets/cleoecoamigos.png; Git 4abd97e, 9637dd8, 3e71d43, 308f070, 9224718, bcbfa07, 73e52b0; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/public/HomePage.jsx](../../frontend/src/pages/public/HomePage.jsx); [frontend/src/styles/global.css](../../frontend/src/styles/global.css); [frontend/src/styles/pages.css](../../frontend/src/styles/pages.css); [frontend/src/assets/cleoecoamigos.png](../../frontend/src/assets/cleoecoamigos.png)
- **Related Commits:** 4abd97e, 9637dd8, 3e71d43, 308f070, 9224718, bcbfa07, 73e52b0
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 4abd97e: 2026-05-09T21:03:34-05:00; 9637dd8: 2026-05-19T18:42:48-05:00; 3e71d43: 2026-06-29T20:06:47-05:00; 308f070: 2026-07-09T10:20:11-05:00; 9224718: 2026-07-18T13:11:06-05:00; bcbfa07: 2026-07-25T11:04:57-05:00; 73e52b0: 2026-09-07T19:58:08-05:00
- **Requerimiento/contrato relacionado:** Identidad visual y navegación; Cuestionario RF-003

<a id="tk15"></a>

## TK15 — Parametrizar URL pública del backend en frontend

- **Internal ID:** TK15
- **Issue Type:** Task
- **Summary:** Parametrizar URL pública del backend en frontend
- **Description:** VITE_API_URL en julio; el título del commit no demuestra despliegue.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** URL configurable sin secretos en VITE; resolución coherente de rutas.
- **Technical Notes:**  Fuentes técnicas: frontend/src/api/client.js; frontend/.env.example; docs/01-INSTALACION.md. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** frontend/src/api/client.js; frontend/.env.example; docs/01-INSTALACION.md; Git c894e77; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/api/client.js](../../frontend/src/api/client.js); [frontend/.env.example](../../frontend/.env.example); [docs/01-INSTALACION.md](../../docs/01-INSTALACION.md)
- **Related Commits:** c894e77
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** c894e77: 2026-07-26T15:01:04-05:00
- **Requerimiento/contrato relacionado:** Configuración por entorno

<a id="tk16"></a>

## TK16 — Incorporar logging y posteriormente acotarlo

- **Internal ID:** TK16
- **Issue Type:** Task
- **Summary:** Incorporar logging y posteriormente acotarlo
- **Description:** Logging de mayo evoluciona en S10; no auditoría inmutable.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Eventos minimizados, cola y rotación; diferenciar logs de revisión persistida.
- **Technical Notes:**  Fuentes técnicas: backend/src/utils/logger.js; backend/tests/s08-s10-config-logging.test.js; docs/08-OPERACION.md. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** backend/src/utils/logger.js; backend/tests/s08-s10-config-logging.test.js; docs/08-OPERACION.md; Git 7570567, 294563f; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/utils/logger.js](../../backend/src/utils/logger.js); [backend/tests/s08-s10-config-logging.test.js](../../backend/tests/s08-s10-config-logging.test.js); [docs/08-OPERACION.md](../../docs/08-OPERACION.md)
- **Related Commits:** 7570567, 294563f
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 7570567: 2026-05-19T20:27:39-05:00; 294563f: 2026-09-15T21:04:17-05:00
- **Requerimiento/contrato relacionado:** Logging técnico controlado

<a id="tk17"></a>

## TK17 — Implementar pruebas de instalación y migraciones aisladas

- **Internal ID:** TK17
- **Issue Type:** Task
- **Summary:** Implementar pruebas de instalación y migraciones aisladas
- **Description:** Pruebas D01/F09/F16/S01 y verificación de preservación.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Clústeres aislados; migración/rollback/estructura y catálogo; no base de aplicación.
- **Technical Notes:**  Fuentes técnicas: backend/tests/installation.test.js; backend/tests/d01-migration.test.js; backend/tests/f09-periods.test.js; backend/tests/f16-password-recovery.test.js; backend/tests/s01-s03-auth.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** [TK04](01-backlog-completo.md#tk04)
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** backend/tests/installation.test.js; backend/tests/d01-migration.test.js; backend/tests/f09-periods.test.js; backend/tests/f16-password-recovery.test.js; backend/tests/s01-s03-auth.test.js; Git 3b27ab6, 11eb099, 42c5643, d51387d; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/tests/installation.test.js](../../backend/tests/installation.test.js); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js); [backend/tests/f09-periods.test.js](../../backend/tests/f09-periods.test.js); [backend/tests/f16-password-recovery.test.js](../../backend/tests/f16-password-recovery.test.js); [backend/tests/s01-s03-auth.test.js](../../backend/tests/s01-s03-auth.test.js)
- **Related Commits:** 3b27ab6, 11eb099, 42c5643, d51387d
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00; 11eb099: 2026-09-09T19:57:29-05:00; 42c5643: 2026-09-12T19:52:19-05:00; d51387d: 2026-09-14T20:03:18-05:00
- **Requerimiento/contrato relacionado:** Reproducibilidad y preservación de datos; Cuestionario RNF-011

<a id="tk18"></a>

## TK18 — Implementar regresión de concurrencia y rollback

- **Internal ID:** TK18
- **Issue Type:** Task
- **Summary:** Implementar regresión de concurrencia y rollback
- **Description:** Ensayos de revisión, períodos, registros, cupo, recuperación y archivos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Una decisión gana, rollback conserva período, cupo 14→15 y consumo único.
- **Technical Notes:**  Fuentes técnicas: backend/tests/f08-review.test.js; backend/tests/f09-periods.test.js; backend/tests/f10-record-period.test.js; backend/tests/f12-user-limit.test.js; backend/tests/s04-s07-files.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** backend/tests/f08-review.test.js; backend/tests/f09-periods.test.js; backend/tests/f10-record-period.test.js; backend/tests/f12-user-limit.test.js; backend/tests/s04-s07-files.test.js; Git 4a915b2, 11eb099, e511ccb, 36af9d0, 42c5643, a96aa30; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/tests/f08-review.test.js](../../backend/tests/f08-review.test.js); [backend/tests/f09-periods.test.js](../../backend/tests/f09-periods.test.js); [backend/tests/f10-record-period.test.js](../../backend/tests/f10-record-period.test.js); [backend/tests/f12-user-limit.test.js](../../backend/tests/f12-user-limit.test.js); [backend/tests/s04-s07-files.test.js](../../backend/tests/s04-s07-files.test.js)
- **Related Commits:** 4a915b2, 11eb099, e511ccb, 36af9d0, 42c5643, a96aa30
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 4a915b2: 2026-09-09T19:43:37-05:00; 11eb099: 2026-09-09T19:57:29-05:00; e511ccb: 2026-09-09T20:13:42-05:00; 36af9d0: 2026-09-12T14:12:38-05:00; 42c5643: 2026-09-12T19:52:19-05:00; a96aa30: 2026-09-15T20:36:09-05:00
- **Requerimiento/contrato relacionado:** Consistencia transaccional; Cuestionario RNF-011

<a id="tk19"></a>

## TK19 — Implementar regresión frontend de interacción y sesión

- **Internal ID:** TK19
- **Issue Type:** Task
- **Summary:** Implementar regresión frontend de interacción y sesión
- **Description:** Tests con DOM mínimo, no certificación geométrica o navegador completo.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Siete archivos cubren error/carga, toast, input, foco, sesión, Blob y XLSX.
- **Technical Notes:**  Fuentes técnicas: frontend/tests/f17-ui.test.js; frontend/tests/f18-toast.test.js; frontend/tests/f19-evidence.test.js; frontend/tests/f20-accessibility.test.js; frontend/tests/s02-session.test.js; frontend/tests/s05-protected-files.test.js; frontend/tests/s11-export.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** frontend/tests/f17-ui.test.js; frontend/tests/f18-toast.test.js; frontend/tests/f19-evidence.test.js; frontend/tests/f20-accessibility.test.js; frontend/tests/s02-session.test.js; frontend/tests/s05-protected-files.test.js; frontend/tests/s11-export.test.js; Git 5412992, dd1e55b, 60d8c3a, 21f418e, d51387d, a96aa30, 78c0297; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/tests/f17-ui.test.js](../../frontend/tests/f17-ui.test.js); [frontend/tests/f18-toast.test.js](../../frontend/tests/f18-toast.test.js); [frontend/tests/f19-evidence.test.js](../../frontend/tests/f19-evidence.test.js); [frontend/tests/f20-accessibility.test.js](../../frontend/tests/f20-accessibility.test.js); [frontend/tests/s02-session.test.js](../../frontend/tests/s02-session.test.js); [frontend/tests/s05-protected-files.test.js](../../frontend/tests/s05-protected-files.test.js); [frontend/tests/s11-export.test.js](../../frontend/tests/s11-export.test.js)
- **Related Commits:** 5412992, dd1e55b, 60d8c3a, 21f418e, d51387d, a96aa30, 78c0297
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 5412992: 2026-09-13T10:45:54-05:00; dd1e55b: 2026-09-13T11:05:28-05:00; 60d8c3a: 2026-09-13T11:18:50-05:00; 21f418e: 2026-09-13T11:49:57-05:00; d51387d: 2026-09-14T20:03:18-05:00; a96aa30: 2026-09-15T20:36:09-05:00; 78c0297: 2026-09-16T09:14:07-05:00
- **Requerimiento/contrato relacionado:** Usabilidad y regresión de interfaz

<a id="tk20"></a>

## TK20 — Automatizar instalación, pruebas, build y checks en CI

- **Internal ID:** TK20
- **Issue Type:** Task
- **Summary:** Automatizar instalación, pruebas, build y checks en CI
- **Description:** quality y dependency-audit separados; npm ci y PostgreSQL efímero/aislado.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Push/PR main; suites/build/check y riesgos; SUCCESS informado f21b2a6, sin CD.
- **Technical Notes:**  Fuentes técnicas: .github/workflows/ci.yml; scripts/run-tests.mjs; scripts/check.mjs; scripts/dependency-risk-report.mjs; backend/tests/s12-ci.test.js; docs/14-CI-PRIMER-RUN.md. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** [TK17](01-backlog-completo.md#tk17), [TK18](01-backlog-completo.md#tk18), [TK19](01-backlog-completo.md#tk19)
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** .github/workflows/ci.yml; scripts/run-tests.mjs; scripts/check.mjs; scripts/dependency-risk-report.mjs; backend/tests/s12-ci.test.js; docs/14-CI-PRIMER-RUN.md; Git 78c0297, f21b2a6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [.github/workflows/ci.yml](../../.github/workflows/ci.yml); [scripts/run-tests.mjs](../../scripts/run-tests.mjs); [scripts/check.mjs](../../scripts/check.mjs); [scripts/dependency-risk-report.mjs](../../scripts/dependency-risk-report.mjs); [backend/tests/s12-ci.test.js](../../backend/tests/s12-ci.test.js); [docs/14-CI-PRIMER-RUN.md](../../docs/14-CI-PRIMER-RUN.md)
- **Related Commits:** 78c0297, f21b2a6
- **Closing Notes:** CI f21b2a6 SUCCESS informado y validado por usuario en GitHub Actions según docs/14; sin inspección API ni nueva ejecución remota aquí.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 78c0297: 2026-09-16T09:14:07-05:00; f21b2a6: 2026-09-16T09:39:35-05:00
- **Requerimiento/contrato relacionado:** Integración continua y QA

<a id="tk21"></a>

## TK21 — Conservar matriz manual histórica y T01–T28 vigente

- **Internal ID:** TK21
- **Issue Type:** Task
- **Summary:** Conservar matriz manual histórica y T01–T28 vigente
- **Description:** Diseño/documentación de pruebas no implica ejecución de todos los casos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** 28 filas originales y contrato vigente separado con 409, retiros, S11 y hosting futuro.
- **Technical Notes:**  Fuentes técnicas: docs/09-CALIDAD-Y-PENDIENTES.md. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** docs/09-CALIDAD-Y-PENDIENTES.md; Git 73e52b0, 83ca4d6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md)
- **Related Commits:** 73e52b0, 83ca4d6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 73e52b0: 2026-09-07T19:58:08-05:00; 83ca4d6: 2026-09-19T15:24:35-05:00
- **Requerimiento/contrato relacionado:** Plan y evidencia de pruebas

<a id="tk22"></a>

## TK22 — Completar evidencia manual de interfaz, multimedia y restauración

- **Internal ID:** TK22
- **Issue Type:** Task
- **Summary:** Completar evidencia manual de interfaz, multimedia y restauración
- **Description:** Smoke XLSX aprobado informado; pruebas manuales amplias/acta de restauración no completas.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Registrar versión/entorno/resultados de casos pertinentes; no aprobar 28 casos por tests automáticos.
- **Technical Notes:**  Fuentes técnicas: docs/09-CALIDAD-Y-PENDIENTES.md; docs/14-CI-PRIMER-RUN.md; docs/16-ENTREGA-INSTITUCIONAL.md. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** [TK21](01-backlog-completo.md#tk21)
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** docs/09-CALIDAD-Y-PENDIENTES.md; docs/14-CI-PRIMER-RUN.md; docs/16-ENTREGA-INSTITUCIONAL.md; Git 83ca4d6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [docs/14-CI-PRIMER-RUN.md](../../docs/14-CI-PRIMER-RUN.md); [docs/16-ENTREGA-INSTITUCIONAL.md](../../docs/16-ENTREGA-INSTITUCIONAL.md)
- **Related Commits:** 83ca4d6
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 83ca4d6: 2026-09-19T15:24:35-05:00
- **Requerimiento/contrato relacionado:** Validación manual y restauración; Cuestionario RNF-001; Cuestionario RNF-002; Cuestionario RNF-006; Cuestionario RNF-009; Cuestionario RNF-010; Cuestionario RNF-011

<a id="tk23"></a>

## TK23 — Consolidar manuales y trazabilidad de decisiones

- **Internal ID:** TK23
- **Issue Type:** Task
- **Summary:** Consolidar manuales y trazabilidad de decisiones
- **Description:** Documentación 00–16 y commits documentales posteriores a f21b2a6.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Separar historia/estado y evidencia informada; índice/enlaces sin secretos.
- **Technical Notes:**  Fuentes técnicas: README.md; docs/00-INDICE.md; docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/16-ENTREGA-INSTITUCIONAL.md. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP11](01-backlog-completo.md#ep11)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep11, evidencia-local
- **Component:** ep11
- **Evidence:** README.md; docs/00-INDICE.md; docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/16-ENTREGA-INSTITUCIONAL.md; Git 73e52b0, 83ca4d6, 53985bb; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [README.md](../../README.md); [docs/00-INDICE.md](../../docs/00-INDICE.md); [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/16-ENTREGA-INSTITUCIONAL.md](../../docs/16-ENTREGA-INSTITUCIONAL.md)
- **Related Commits:** 73e52b0, 83ca4d6, 53985bb
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 73e52b0: 2026-09-07T19:58:08-05:00; 83ca4d6: 2026-09-19T15:24:35-05:00; 53985bb: 2026-09-19T15:39:39-05:00
- **Requerimiento/contrato relacionado:** Documentación y transferencia

<a id="tk24"></a>

## TK24 — Documentar instalación, backup y restauración coherente

- **Internal ID:** TK24
- **Issue Type:** Task
- **Summary:** Documentar instalación, backup y restauración coherente
- **Description:** Procedimientos, no ejecución de respaldo institucional.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Base nueva/migrada diferenciada y respaldo BD/UPLOAD_ROOT hacia destinos aislados.
- **Technical Notes:**  Fuentes técnicas: docs/01-INSTALACION.md; docs/08-OPERACION.md; database/README.md. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP11](01-backlog-completo.md#ep11)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep11, evidencia-local
- **Component:** ep11
- **Evidence:** docs/01-INSTALACION.md; docs/08-OPERACION.md; database/README.md; Git 73e52b0, 3b27ab6, 83ca4d6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/01-INSTALACION.md](../../docs/01-INSTALACION.md); [docs/08-OPERACION.md](../../docs/08-OPERACION.md); [database/README.md](../../database/README.md)
- **Related Commits:** 73e52b0, 3b27ab6, 83ca4d6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 73e52b0: 2026-09-07T19:58:08-05:00; 3b27ab6: 2026-09-08T19:53:17-05:00; 83ca4d6: 2026-09-19T15:24:35-05:00
- **Requerimiento/contrato relacionado:** Operación y recuperación; Cuestionario RNF-012

<a id="tk25"></a>

## TK25 — Definir proveedor y entrega institucional de recuperación

- **Internal ID:** TK25
- **Issue Type:** Task
- **Summary:** Definir proveedor y entrega institucional de recuperación
- **Description:** Adaptador retorna false; proveedor/configuración no definidos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Decidir proveedor y verificar envío privado de enlaces sin exponer tokens.
- **Technical Notes:**  Fuentes técnicas: backend/src/services/passwordResetDelivery.js; docs/16-ENTREGA-INSTITUCIONAL.md. Ausencia o límite documentado; sin aprobación institucional acreditada.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Pending Institutional Decision
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [ST02](01-backlog-completo.md#st02)
- **Dependencies:** [ST01](01-backlog-completo.md#st01)
- **Labels:** retrospectivo, f3, ep03, pendiente-institucional
- **Component:** ep03
- **Evidence:** backend/src/services/passwordResetDelivery.js; docs/16-ENTREGA-INSTITUCIONAL.md; Git 42c5643; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/src/services/passwordResetDelivery.js](../../backend/src/services/passwordResetDelivery.js); [docs/16-ENTREGA-INSTITUCIONAL.md](../../docs/16-ENTREGA-INSTITUCIONAL.md)
- **Related Commits:** 42c5643
- **Closing Notes:** No ejecutado ni aprobado; requiere decisión institucional explícita, sin fecha comprometida.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Ausencia o límite documentado; sin aprobación institucional acreditada
- **Cronología de evidencia:** 42c5643: 2026-09-12T19:52:19-05:00
- **Requerimiento/contrato relacionado:** Recuperación de contraseña; Cuestionario RF-002

<a id="tk26"></a>

## TK26 — Definir infraestructura, custodia y recepción institucional

- **Internal ID:** TK26
- **Issue Type:** Task
- **Summary:** Definir infraestructura, custodia y recepción institucional
- **Description:** Guía preparada, sin acta ni despliegue; hosting/HTTPS/permisos/retención/responsables pendientes.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Registrar decisiones y recepción autorizadas; no provisionar ni simular producción.
- **Technical Notes:**  Fuentes técnicas: docs/08-OPERACION.md; docs/16-ENTREGA-INSTITUCIONAL.md. Ausencia o límite documentado; sin aprobación institucional acreditada. Plan p.3 excluye infraestructura de producción del alcance presupuestado; las decisiones operativas futuras no son un despliegue comprometido para E4.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Pending Institutional Decision
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP11](01-backlog-completo.md#ep11)
- **Dependencies:** [TK23](01-backlog-completo.md#tk23), [TK24](01-backlog-completo.md#tk24)
- **Labels:** retrospectivo, f4, ep11, pendiente-institucional
- **Component:** ep11
- **Evidence:** docs/08-OPERACION.md; docs/16-ENTREGA-INSTITUCIONAL.md; Git 83ca4d6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/08-OPERACION.md](../../docs/08-OPERACION.md); [docs/16-ENTREGA-INSTITUCIONAL.md](../../docs/16-ENTREGA-INSTITUCIONAL.md)
- **Related Commits:** 83ca4d6
- **Closing Notes:** No ejecutado ni aprobado; requiere decisión institucional explícita, sin fecha comprometida.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Ausencia o límite documentado; sin aprobación institucional acreditada
- **Cronología de evidencia:** 83ca4d6: 2026-09-19T15:24:35-05:00
- **Requerimiento/contrato relacionado:** Entrega y operación institucional; Cuestionario RNF-007; Cuestionario RNF-012

<a id="tk27"></a>

## TK27 — Registrar auditoría de dependencias y exposición por cadena

- **Internal ID:** TK27
- **Issue Type:** Task
- **Summary:** Registrar auditoría de dependencias y exposición por cadena
- **Description:** Capturas y análisis realizados; remediación abierta en S12.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Conservar 14 JSON; distinguir dev/producción; tar vía bcrypt; sin forzar majors.
- **Technical Notes:**  Fuentes técnicas: docs/13-AUDITORIA-DEPENDENCIAS-S12.md; docs/audits/s12-ci-first-run/summary.md; scripts/dependency-risk-report.mjs. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** docs/13-AUDITORIA-DEPENDENCIAS-S12.md; docs/audits/s12-ci-first-run/summary.md; scripts/dependency-risk-report.mjs; Git 78c0297, f21b2a6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/13-AUDITORIA-DEPENDENCIAS-S12.md](../../docs/13-AUDITORIA-DEPENDENCIAS-S12.md); [docs/audits/s12-ci-first-run/summary.md](../../docs/audits/s12-ci-first-run/summary.md); [scripts/dependency-risk-report.mjs](../../scripts/dependency-risk-report.mjs)
- **Related Commits:** 78c0297, f21b2a6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 78c0297: 2026-09-16T09:14:07-05:00; f21b2a6: 2026-09-16T09:39:35-05:00
- **Requerimiento/contrato relacionado:** Gestión de riesgos de dependencias

<a id="bg-d01"></a>

## BG-D01 — D01: Conciliar definiciones SQL e instalación histórica

- **Internal ID:** BG-D01
- **Issue Type:** Bug
- **Summary:** D01: Conciliar definiciones SQL e instalación histórica
- **Description:** Problema detectado: Tres definiciones SQL divergentes; instalaciones incompatibles. Corrección o decisión documentada: Esquema único, alias psql y migración controlada de instalación reconocida.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Esquema único, alias psql y migración controlada de instalación reconocida. Límite de aceptación: Otro destino requiere inspección/respaldo; no es migrador universal.
- **Technical Notes:** Hallazgo D01; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; instalación y d01-migration; E-QA. Limitación: Otro destino requiere inspección/respaldo; no es migrador universal. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/tests/d01-migration.test.js; database/20260908_d01_migrate_existing.sql; database/schema.sql; database/verify_20260908_d01.sql; backend/tests/installation.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/tests/d01-migration.test.js; database/20260908_d01_migrate_existing.sql; database/schema.sql; database/verify_20260908_d01.sql; backend/tests/installation.test.js; Git 3b27ab6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/schema.sql](../../backend/schema.sql); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js); [database/20260908_d01_migrate_existing.sql](../../database/20260908_d01_migrate_existing.sql); [database/schema.sql](../../database/schema.sql); [database/verify_20260908_d01.sql](../../database/verify_20260908_d01.sql); [backend/tests/installation.test.js](../../backend/tests/installation.test.js)
- **Related Commits:** 3b27ab6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo D01; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; instalación y d01-migration; E-QA. Limitación: Otro destino requiere inspección/respaldo; no es migrador universal.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00
- **Requerimiento/contrato relacionado:** Conciliar definiciones SQL e instalación histórica

<a id="bg-d02"></a>

## BG-D02 — D02: Eliminar doble escritura de password y password_hash

- **Internal ID:** BG-D02
- **Issue Type:** Bug
- **Summary:** D02: Eliminar doble escritura de password y password_hash
- **Description:** Problema detectado: password y password_hash duplicados; alta incompatible. Corrección o decisión documentada: Aplicación y bootstrap solo usan password_hash; migración concilia restricciones sin borrar historia.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Aplicación y bootstrap solo usan password_hash; migración concilia restricciones sin borrar historia. Límite de aceptación: No se inventan hashes ni se reconstruyen contraseñas.
- **Technical Notes:** Hallazgo D02; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation/d01-migration; E-QA. Limitación: No se inventan hashes ni se reconstruyen contraseñas. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/adminController.js; backend/tests/d01-migration.test.js; backend/tests/installation.test.js; database/create_admin.sql. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST03](01-backlog-completo.md#st03)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep04, evidencia-local
- **Component:** ep04
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/adminController.js; backend/tests/d01-migration.test.js; backend/tests/installation.test.js; database/create_admin.sql; Git 3b27ab6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/adminController.js](../../backend/src/controllers/adminController.js); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js); [backend/tests/installation.test.js](../../backend/tests/installation.test.js); [database/create_admin.sql](../../database/create_admin.sql)
- **Related Commits:** 3b27ab6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo D02; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation/d01-migration; E-QA. Limitación: No se inventan hashes ni se reconstruyen contraseñas.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00
- **Requerimiento/contrato relacionado:** Administración de cuentas y límite de 15; Cuestionario RNF-004

<a id="bg-d03"></a>

## BG-D03 — D03: Conciliar categorías y tipos de contenido

- **Internal ID:** BG-D03
- **Issue Type:** Bug
- **Summary:** D03: Conciliar categorías y tipos de contenido
- **Description:** Problema detectado: category/tipos de contenido incompatibles; pérdida de significado. Corrección o decisión documentada: Esquema define categorías/tipos vigentes; migración valida sin clasificar datos ambiguos arbitrariamente.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Esquema define categorías/tipos vigentes; migración valida sin clasificar datos ambiguos arbitrariamente. Límite de aceptación: Datos incompatibles en otro destino requieren decisión por registro.
- **Technical Notes:** Hallazgo D03; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation/d01-migration; E-QA. Limitación: Datos incompatibles en otro destino requieren decisión por registro. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/src/controllers/adminController.js; backend/tests/d01-migration.test.js; backend/tests/installation.test.js; database/schema.sql. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST07](01-backlog-completo.md#st07)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep05, evidencia-local
- **Component:** ep05
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/src/controllers/adminController.js; backend/tests/d01-migration.test.js; backend/tests/installation.test.js; database/schema.sql; Git 3b27ab6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/schema.sql](../../backend/schema.sql); [backend/src/controllers/adminController.js](../../backend/src/controllers/adminController.js); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js); [backend/tests/installation.test.js](../../backend/tests/installation.test.js); [database/schema.sql](../../database/schema.sql)
- **Related Commits:** 3b27ab6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo D03; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation/d01-migration; E-QA. Limitación: Datos incompatibles en otro destino requieren decisión por registro.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00
- **Requerimiento/contrato relacionado:** Gestión de contenidos

<a id="bg-d04"></a>

## BG-D04 — D04: Restituir catálogo y referencias necesarias para aprobar

- **Internal ID:** BG-D04
- **Issue Type:** Bug
- **Summary:** D04: Restituir catálogo y referencias necesarias para aprobar
- **Description:** Problema detectado: Faltan catálogo y referencias; no se puede aprobar de forma coherente. Corrección o decisión documentada: Definir points_catalog y catalog_* y preservar referencias existentes.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Definir points_catalog y catalog_* y preservar referencias existentes. Límite de aceptación: No reconstruye referencias históricas ausentes.
- **Technical Notes:** Hallazgo D04; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; SQL preparado e instalación/migración; E-QA. Limitación: No reconstruye referencias históricas ausentes. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/src/controllers/recyclingController.js; database/schema.sql; backend/tests/installation.test.js; backend/tests/d01-migration.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST10](01-backlog-completo.md#st10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/src/controllers/recyclingController.js; database/schema.sql; backend/tests/installation.test.js; backend/tests/d01-migration.test.js; Git 3b27ab6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/schema.sql](../../backend/schema.sql); [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [database/schema.sql](../../database/schema.sql); [backend/tests/installation.test.js](../../backend/tests/installation.test.js); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js)
- **Related Commits:** 3b27ab6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo D04; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; SQL preparado e instalación/migración; E-QA. Limitación: No reconstruye referencias históricas ausentes.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00
- **Requerimiento/contrato relacionado:** Revisión administrativa única

<a id="bg-d05"></a>

## BG-D05 — D05: Conservar instrucciones de evidencia como texto

- **Internal ID:** BG-D05
- **Issue Type:** Bug
- **Summary:** D05: Conservar instrucciones de evidencia como texto
- **Description:** Problema detectado: evidence_required BOOLEAN contradice instrucciones CSV. Corrección o decisión documentada: Usar TEXT descriptivo, importar sin reducir instrucciones a sí/no.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Usar TEXT descriptivo, importar sin reducir instrucciones a sí/no. Límite de aceptación: Texto no equivale a validación automática de evidencia.
- **Technical Notes:** Hallazgo D05; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation/d01-migration; E-QA. Limitación: Texto no equivale a validación automática de evidencia. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/tests/d01-migration.test.js; backend/tests/installation.test.js; database/import_points_catalog.sql; database/schema.sql. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/tests/d01-migration.test.js; backend/tests/installation.test.js; database/import_points_catalog.sql; database/schema.sql; Git 3b27ab6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/schema.sql](../../backend/schema.sql); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js); [backend/tests/installation.test.js](../../backend/tests/installation.test.js); [database/import_points_catalog.sql](../../database/import_points_catalog.sql); [database/schema.sql](../../database/schema.sql)
- **Related Commits:** 3b27ab6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo D05; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation/d01-migration; E-QA. Limitación: Texto no equivale a validación automática de evidencia.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00
- **Requerimiento/contrato relacionado:** Conservar instrucciones de evidencia como texto

<a id="tk-d06"></a>

## TK-D06 — D06: Autorizar catálogo de Dependencias institucionales

- **Internal ID:** TK-D06
- **Issue Type:** Task
- **Summary:** D06: Autorizar catálogo de Dependencias institucionales
- **Description:** Contexto: CSV sin Dependencias institucionales; formulario carece de catálogo autorizado. Decisión pendiente: Conservar las 56 filas y esperar cinco referencias/puntos institucionales aprobados.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Conservar las 56 filas y esperar cinco referencias/puntos institucionales aprobados. Límite de aceptación: Parques debe definir catálogo; no copiar puntos de Hogares.
- **Technical Notes:** Hallazgo D06; resolución original PENDIENTE INSTITUCIONAL; contexto VIGENTE. Verificación citada: 3b27ab6 y 8badd9f; installation/f05-catalog-validation. Limitación: Parques debe definir catálogo; no copiar puntos de Hogares. Los tests son evidencia de la ausencia, no aprobación de catálogo. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/utils/catalogReference.js; backend/tests/f05-catalog-validation.test.js; database/points_catalog_clean.csv. Ausencia o límite documentado; sin aprobación institucional acreditada.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Pending Institutional Decision
- **Phase:** F1
- **Deliverable:** E1
- **Parent Internal ID:** [EP01](01-backlog-completo.md#ep01)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f1, ep01, pendiente-institucional
- **Component:** ep01
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/utils/catalogReference.js; backend/tests/f05-catalog-validation.test.js; database/points_catalog_clean.csv; Git 3b27ab6, 8badd9f; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/utils/catalogReference.js](../../backend/src/utils/catalogReference.js); [backend/tests/f05-catalog-validation.test.js](../../backend/tests/f05-catalog-validation.test.js); [database/points_catalog_clean.csv](../../database/points_catalog_clean.csv)
- **Related Commits:** 3b27ab6, 8badd9f
- **Closing Notes:** No ejecutado ni aprobado; requiere decisión institucional explícita, sin fecha comprometida.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F1 semanas 1–2; E1 semana 2; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo D06; resolución original PENDIENTE INSTITUCIONAL; contexto VIGENTE. Verificación citada: 3b27ab6 y 8badd9f; installation/f05-catalog-validation. Limitación: Parques debe definir catálogo; no copiar puntos de Hogares. Los tests son evidencia de la ausencia, no aprobación de catálogo.
- **Verificación:** Ausencia o límite documentado; sin aprobación institucional acreditada
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00; 8badd9f: 2026-09-08T21:02:29-05:00
- **Requerimiento/contrato relacionado:** Autorizar catálogo de Dependencias institucionales; Cuestionario RF-017

<a id="bg-d07"></a>

## BG-D07 — D07: Sustituir credenciales seed inconsistentes por bootstrap explícito

- **Internal ID:** BG-D07
- **Issue Type:** Bug
- **Summary:** D07: Sustituir credenciales seed inconsistentes por bootstrap explícito
- **Description:** Problema detectado: Hash seed no corresponde a clave anunciada; acceso inicial fallido. Corrección o decisión documentada: Retirar credenciales prefijadas; bootstrap con datos explícitos y bcrypt válido.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Retirar credenciales prefijadas; bootstrap con datos explícitos y bcrypt válido. Límite de aceptación: Responsable configura su cuenta; no se entrega una clave universal.
- **Technical Notes:** Hallazgo D07; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation. Limitación: Responsable configura su cuenta; no se entrega una clave universal. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/scripts/hash-password.js; backend/src/seed.sql; backend/tests/installation.test.js; database/create_admin.sql; backend/tests/d01-migration.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST03](01-backlog-completo.md#st03)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep04, evidencia-local
- **Component:** ep04
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/scripts/hash-password.js; backend/src/seed.sql; backend/tests/installation.test.js; database/create_admin.sql; backend/tests/d01-migration.test.js; Git 3b27ab6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/scripts/hash-password.js](../../backend/scripts/hash-password.js); [backend/src/seed.sql](../../backend/src/seed.sql); [backend/tests/installation.test.js](../../backend/tests/installation.test.js); [database/create_admin.sql](../../database/create_admin.sql); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js)
- **Related Commits:** 3b27ab6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo D07; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation. Limitación: Responsable configura su cuenta; no se entrega una clave universal.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00
- **Requerimiento/contrato relacionado:** Administración de cuentas y límite de 15

<a id="bg-d08"></a>

## BG-D08 — D08: Retirar datos de demostración prefijados del seed

- **Internal ID:** BG-D08
- **Issue Type:** Bug
- **Summary:** D08: Retirar datos de demostración prefijados del seed
- **Description:** Problema detectado: Seed de demostración con período y contenido antiguos; contaminación de datos. Corrección o decisión documentada: Seed sin escrituras; base nueva vacía de datos de negocio.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Seed sin escrituras; base nueva vacía de datos de negocio. Límite de aceptación: Datos de instalaciones anteriores no se eliminan.
- **Technical Notes:** Hallazgo D08; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation. Limitación: Datos de instalaciones anteriores no se eliminan. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/src/seed.sql; backend/tests/installation.test.js; database/schema.sql; backend/tests/d01-migration.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/src/seed.sql; backend/tests/installation.test.js; database/schema.sql; backend/tests/d01-migration.test.js; Git 3b27ab6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/schema.sql](../../backend/schema.sql); [backend/src/seed.sql](../../backend/src/seed.sql); [backend/tests/installation.test.js](../../backend/tests/installation.test.js); [database/schema.sql](../../database/schema.sql); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js)
- **Related Commits:** 3b27ab6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo D08; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation. Limitación: Datos de instalaciones anteriores no se eliminan.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00
- **Requerimiento/contrato relacionado:** Retirar datos de demostración prefijados del seed

<a id="bg-d09"></a>

## BG-D09 — D09: Evitar duplicación o sustitución de datos al repetir bootstrap

- **Internal ID:** BG-D09
- **Issue Type:** Bug
- **Summary:** D09: Evitar duplicación o sustitución de datos al repetir bootstrap
- **Description:** Problema detectado: Repetición del seed duplica datos; bootstrap podría sustituir cuentas. Corrección o decisión documentada: Seed inocuo; alta repetida aborta sin reemplazar credenciales.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Seed inocuo; alta repetida aborta sin reemplazar credenciales. Límite de aceptación: No deduplica datos históricos.
- **Technical Notes:** Hallazgo D09; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation. Limitación: No deduplica datos históricos. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/seed.sql; backend/tests/installation.test.js; database/create_admin.sql; backend/tests/d01-migration.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/seed.sql; backend/tests/installation.test.js; database/create_admin.sql; backend/tests/d01-migration.test.js; Git 3b27ab6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/seed.sql](../../backend/src/seed.sql); [backend/tests/installation.test.js](../../backend/tests/installation.test.js); [database/create_admin.sql](../../database/create_admin.sql); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js)
- **Related Commits:** 3b27ab6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo D09; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation. Limitación: No deduplica datos históricos.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00
- **Requerimiento/contrato relacionado:** Evitar duplicación o sustitución de datos al repetir bootstrap

<a id="bg-d10"></a>

## BG-D10 — D10: Corregir importación absoluta y duplicados de catálogo

- **Internal ID:** BG-D10
- **Issue Type:** Bug
- **Summary:** D10: Corregir importación absoluta y duplicados de catálogo
- **Description:** Problema detectado: Importador con ruta personal/duplicados; carga no reproducible. Corrección o decisión documentada: Ruta relativa, staging, transacción, bloqueo e identidad normalizada única.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Ruta relativa, staging, transacción, bloqueo e identidad normalizada única. Límite de aceptación: Conflictos abortan; no se sobrescriben puntos existentes.
- **Technical Notes:** Hallazgo D10; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation: repetición/conflicto/concurrencia. Limitación: Conflictos abortan; no se sobrescriben puntos existentes. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/tests/installation.test.js; database/import_points_catalog.sql; database/schema.sql; backend/tests/d01-migration.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/tests/installation.test.js; database/import_points_catalog.sql; database/schema.sql; backend/tests/d01-migration.test.js; Git 3b27ab6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/schema.sql](../../backend/schema.sql); [backend/tests/installation.test.js](../../backend/tests/installation.test.js); [database/import_points_catalog.sql](../../database/import_points_catalog.sql); [database/schema.sql](../../database/schema.sql); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js)
- **Related Commits:** 3b27ab6
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo D10; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 3b27ab6; installation: repetición/conflicto/concurrencia. Limitación: Conflictos abortan; no se sobrescriben puntos existentes.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 3b27ab6: 2026-09-08T19:53:17-05:00
- **Requerimiento/contrato relacionado:** Corregir importación absoluta y duplicados de catálogo

<a id="bg-f01"></a>

## BG-F01 — F01: Retirar pantalla de ganadores con contrato incompatible

- **Internal ID:** BG-F01
- **Issue Type:** Bug
- **Summary:** F01: Retirar pantalla de ganadores con contrato incompatible
- **Description:** Problema detectado: UI ganadores esperaba campos diferentes; contrato roto. Corrección o decisión documentada: Retirar página, navegación e imports del módulo.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Retirar página, navegación e imports del módulo. Límite de aceptación: No significa implementar o reparar un módulo de ganadores.
- **Technical Notes:** Hallazgo F01; resolución original CORREGIDO; contexto RETIRADO POR DECISIÓN DE ALCANCE. Verificación citada: 1821e21; f01-f03-retirement; F17 catch-all. Limitación: No significa implementar o reparar un módulo de ganadores. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/tests/f01-f03-retirement.test.js; frontend/src/App.jsx. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST16](01-backlog-completo.md#st16)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/tests/f01-f03-retirement.test.js; frontend/src/App.jsx; Git 1821e21; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/tests/f01-f03-retirement.test.js](../../backend/tests/f01-f03-retirement.test.js); [frontend/src/App.jsx](../../frontend/src/App.jsx)
- **Related Commits:** 1821e21
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F01; resolución original CORREGIDO; contexto RETIRADO POR DECISIÓN DE ALCANCE. Verificación citada: 1821e21; f01-f03-retirement; F17 catch-all. Limitación: No significa implementar o reparar un módulo de ganadores.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 1821e21: 2026-09-08T20:19:49-05:00
- **Requerimiento/contrato relacionado:** Ganadores — alcance retirado

<a id="bg-f02"></a>

## BG-F02 — F02: Retirar agregado winners sin definición autorizada

- **Internal ID:** BG-F02
- **Issue Type:** Bug
- **Summary:** F02: Retirar agregado winners sin definición autorizada
- **Description:** Problema detectado: Agregado winners incluía equipos sin definición de ganador. Corrección o decisión documentada: Retirar agregado/ruta; conservar ranking del período activo.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Retirar agregado/ruta; conservar ranking del período activo. Límite de aceptación: Tablas históricas conservadas; no limpieza destructiva.
- **Technical Notes:** Hallazgo F02; resolución original CORREGIDO; contexto RETIRADO POR DECISIÓN DE ALCANCE. Verificación citada: 1821e21; f01-f03-retirement y regresiones HTTP. Limitación: Tablas históricas conservadas; no limpieza destructiva. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/publicController.js; backend/src/routes/publicRoutes.js; backend/tests/f01-f03-retirement.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST16](01-backlog-completo.md#st16)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/publicController.js; backend/src/routes/publicRoutes.js; backend/tests/f01-f03-retirement.test.js; Git 1821e21; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/publicController.js](../../backend/src/controllers/publicController.js); [backend/src/routes/publicRoutes.js](../../backend/src/routes/publicRoutes.js); [backend/tests/f01-f03-retirement.test.js](../../backend/tests/f01-f03-retirement.test.js)
- **Related Commits:** 1821e21
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F02; resolución original CORREGIDO; contexto RETIRADO POR DECISIÓN DE ALCANCE. Verificación citada: 1821e21; f01-f03-retirement y regresiones HTTP. Limitación: Tablas históricas conservadas; no limpieza destructiva.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 1821e21: 2026-09-08T20:19:49-05:00
- **Requerimiento/contrato relacionado:** Ganadores — alcance retirado

<a id="bg-f03"></a>

## BG-F03 — F03: Retirar exposición de premios inactivos y módulo de premios

- **Internal ID:** BG-F03
- **Issue Type:** Bug
- **Summary:** F03: Retirar exposición de premios inactivos y módulo de premios
- **Description:** Problema detectado: Premios inactivos públicos; exposición fuera de alcance. Corrección o decisión documentada: Retirar operaciones/API/UI de premios.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Retirar operaciones/API/UI de premios. Límite de aceptación: prizes/winner_records se conservan por compatibilidad histórica.
- **Technical Notes:** Hallazgo F03; resolución original CORREGIDO; contexto RETIRADO POR DECISIÓN DE ALCANCE. Verificación citada: 1821e21; f01-f03-retirement y regresiones HTTP. Limitación: prizes/winner_records se conservan por compatibilidad histórica. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/routes/adminRoutes.js; backend/src/routes/publicRoutes.js; backend/tests/f01-f03-retirement.test.js; frontend/src/pages/admin/AdminSettingsPage.jsx. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST15](01-backlog-completo.md#st15)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/routes/adminRoutes.js; backend/src/routes/publicRoutes.js; backend/tests/f01-f03-retirement.test.js; frontend/src/pages/admin/AdminSettingsPage.jsx; Git 1821e21; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/routes/adminRoutes.js](../../backend/src/routes/adminRoutes.js); [backend/src/routes/publicRoutes.js](../../backend/src/routes/publicRoutes.js); [backend/tests/f01-f03-retirement.test.js](../../backend/tests/f01-f03-retirement.test.js); [frontend/src/pages/admin/AdminSettingsPage.jsx](../../frontend/src/pages/admin/AdminSettingsPage.jsx)
- **Related Commits:** 1821e21
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F03; resolución original CORREGIDO; contexto RETIRADO POR DECISIÓN DE ALCANCE. Verificación citada: 1821e21; f01-f03-retirement y regresiones HTTP. Limitación: prizes/winner_records se conservan por compatibilidad histórica.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 1821e21: 2026-09-08T20:19:49-05:00
- **Requerimiento/contrato relacionado:** Premios — alcance retirado

<a id="bg-f04"></a>

## BG-F04 — F04: Eliminar fórmula de puntos obsoleta

- **Internal ID:** BG-F04
- **Issue Type:** Bug
- **Summary:** F04: Eliminar fórmula de puntos obsoleta
- **Description:** Problema detectado: calculatePoints sin uso; segunda fórmula engañosa. Corrección o decisión documentada: Eliminar utilidad y fijar points_catalog.points como fuente ejecutable única.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Eliminar utilidad y fijar points_catalog.points como fuente ejecutable única. Límite de aceptación: Sin coincidencia histórica aprobación obtiene 0; alta nueva valida referencia.
- **Technical Notes:** Hallazgo F04; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 0afbcc9; f04-points-source. Limitación: Sin coincidencia histórica aprobación obtiene 0; alta nueva valida referencia. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/tests/f04-points-source.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST10](01-backlog-completo.md#st10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/tests/f04-points-source.test.js; Git 0afbcc9; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/tests/f04-points-source.test.js](../../backend/tests/f04-points-source.test.js)
- **Related Commits:** 0afbcc9
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F04; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 0afbcc9; f04-points-source. Limitación: Sin coincidencia histórica aprobación obtiene 0; alta nueva valida referencia.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 0afbcc9: 2026-09-08T20:31:20-05:00
- **Requerimiento/contrato relacionado:** Revisión administrativa única

<a id="bg-f05"></a>

## BG-F05 — F05: Rechazar referencias de catálogo manipuladas

- **Internal ID:** BG-F05
- **Issue Type:** Bug
- **Summary:** F05: Rechazar referencias de catálogo manipuladas
- **Description:** Problema detectado: Referencia cliente manipulable; asignación arbitraria de puntos. Corrección o decisión documentada: Reconstruir referencia desde material/cantidad y exigir identidad existente.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Reconstruir referencia desde material/cantidad y exigir identidad existente. Límite de aceptación: D06/F07 siguen abiertos; sin identidad institucional se rechaza alta, incluido orgánico.
- **Technical Notes:** Hallazgo F05; resolución original PARCIAL; contexto VIGENTE. Verificación citada: 8badd9f; f05-catalog-validation. Limitación: D06/F07 siguen abiertos; sin identidad institucional se rechaza alta, incluido orgánico. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/src/utils/catalogReference.js; backend/tests/f05-catalog-validation.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST08](01-backlog-completo.md#st08)
- **Dependencies:** [TK-D06](01-backlog-completo.md#tk-d06)
- **Labels:** retrospectivo, f4, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/src/utils/catalogReference.js; backend/tests/f05-catalog-validation.test.js; Git 8badd9f; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/src/utils/catalogReference.js](../../backend/src/utils/catalogReference.js); [backend/tests/f05-catalog-validation.test.js](../../backend/tests/f05-catalog-validation.test.js)
- **Related Commits:** 8badd9f
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F05; resolución original PARCIAL; contexto VIGENTE. Verificación citada: 8badd9f; f05-catalog-validation. Limitación: D06/F07 siguen abiertos; sin identidad institucional se rechaza alta, incluido orgánico.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 8badd9f: 2026-09-08T21:02:29-05:00
- **Requerimiento/contrato relacionado:** Registro de actividad de reciclaje

<a id="tk-f06"></a>

## TK-F06 — F06: Precisar metadatos descriptivos sin automatización inventada

- **Internal ID:** TK-F06
- **Issue Type:** Task
- **Summary:** F06: Precisar metadatos descriptivos sin automatización inventada
- **Description:** Contexto: Frecuencia, rachas y evidencia descriptivas se confundían con automatización. Corrección o decisión documentada: Documentar metadatos informativos y revisión manual; no inventar bloqueos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Documentar metadatos informativos y revisión manual; no inventar bloqueos. Límite de aceptación: Corrección de contrato; no se implementó motor de frecuencia/rachas.
- **Technical Notes:** Hallazgo F06; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 8badd9f; f06-f07-catalog-semantics. Limitación: Corrección de contrato; no se implementó motor de frecuencia/rachas. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/tests/f06-f07-catalog-semantics.test.js; database/points_catalog_clean.csv. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F1
- **Deliverable:** E1
- **Parent Internal ID:** [EP01](01-backlog-completo.md#ep01)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f1, ep01, evidencia-local
- **Component:** ep01
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/tests/f06-f07-catalog-semantics.test.js; database/points_catalog_clean.csv; Git 8badd9f; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/tests/f06-f07-catalog-semantics.test.js](../../backend/tests/f06-f07-catalog-semantics.test.js); [database/points_catalog_clean.csv](../../database/points_catalog_clean.csv)
- **Related Commits:** 8badd9f
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F1 semanas 1–2; E1 semana 2; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F06; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 8badd9f; f06-f07-catalog-semantics. Limitación: Corrección de contrato; no se implementó motor de frecuencia/rachas.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 8badd9f: 2026-09-08T21:02:29-05:00
- **Requerimiento/contrato relacionado:** Precisar metadatos descriptivos sin automatización inventada; Cuestionario RF-015

<a id="bg-f07"></a>

## BG-F07 — F07: Resolver discrepancias de decimales y referencia orgánica

- **Internal ID:** BG-F07
- **Issue Type:** Bug
- **Summary:** F07: Resolver discrepancias de decimales y referencia orgánica
- **Description:** Problema detectado: Huecos decimales y referencia orgánica fija de 5 kg; semántica ambigua. Corrección o decisión documentada: Conservar límites heredados y documentar discrepancias; no redondear arbitrariamente.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Conservar límites heredados y documentar discrepancias; no redondear arbitrariamente. Límite de aceptación: Decidir intervalos decimales y significado/catálogo de orgánico con D06.
- **Technical Notes:** Hallazgo F07; resolución original PARCIAL; contexto VIGENTE. Verificación citada: 8badd9f; f06-f07-catalog-semantics. Limitación: Decidir intervalos decimales y significado/catálogo de orgánico con D06. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/utils/catalogReference.js; backend/tests/f06-f07-catalog-semantics.test.js; frontend/src/pages/leader/RegisterRecyclingPage.jsx. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP07](01-backlog-completo.md#ep07)
- **Dependencies:** [TK-D06](01-backlog-completo.md#tk-d06)
- **Labels:** retrospectivo, f4, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/utils/catalogReference.js; backend/tests/f06-f07-catalog-semantics.test.js; frontend/src/pages/leader/RegisterRecyclingPage.jsx; Git 8badd9f; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/utils/catalogReference.js](../../backend/src/utils/catalogReference.js); [backend/tests/f06-f07-catalog-semantics.test.js](../../backend/tests/f06-f07-catalog-semantics.test.js); [frontend/src/pages/leader/RegisterRecyclingPage.jsx](../../frontend/src/pages/leader/RegisterRecyclingPage.jsx)
- **Related Commits:** 8badd9f
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F07; resolución original PARCIAL; contexto VIGENTE. Verificación citada: 8badd9f; f06-f07-catalog-semantics. Limitación: Decidir intervalos decimales y significado/catálogo de orgánico con D06.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 8badd9f: 2026-09-08T21:02:29-05:00
- **Requerimiento/contrato relacionado:** Resolver discrepancias de decimales y referencia orgánica; Cuestionario RF-017

<a id="bg-f08"></a>

## BG-F08 — F08: Impedir revisiones repetidas y carreras entre revisores

- **Internal ID:** BG-F08
- **Issue Type:** Bug
- **Summary:** F08: Impedir revisiones repetidas y carreras entre revisores
- **Description:** Problema detectado: Revisión repetible/concurrente sobrescribe puntos y auditoría. Corrección o decisión documentada: Solo pending → approved/rejected, conexión única, FOR UPDATE y rollback; repetición 409.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Solo pending → approved/rejected, conexión única, FOR UPDATE y rollback; repetición 409. Límite de aceptación: Una decisión por registro; no historial inmutable ni reparación retrospectiva.
- **Technical Notes:** Hallazgo F08; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 4a915b2; f08-review, concurrencia y rollback. Limitación: Una decisión por registro; no historial inmutable ni reparación retrospectiva. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/tests/f08-review.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST10](01-backlog-completo.md#st10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep07, evidencia-local
- **Component:** ep07
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/tests/f08-review.test.js; Git 4a915b2; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/tests/f08-review.test.js](../../backend/tests/f08-review.test.js)
- **Related Commits:** 4a915b2
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F08; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 4a915b2; f08-review, concurrencia y rollback. Limitación: Una decisión por registro; no historial inmutable ni reparación retrospectiva.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 4a915b2: 2026-09-09T19:43:37-05:00
- **Requerimiento/contrato relacionado:** Revisión administrativa única

<a id="bg-f09"></a>

## BG-F09 — F09: Evitar pérdida o multiplicidad de período activo

- **Internal ID:** BG-F09
- **Issue Type:** Bug
- **Summary:** F09: Evitar pérdida o multiplicidad de período activo
- **Description:** Problema detectado: UPDATE e INSERT separados; pérdida de activo o múltiples activos. Corrección o decisión documentada: Transacción/bloqueo de periods e índice único parcial; máximo uno, cero válido.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Transacción/bloqueo de periods e índice único parcial; máximo uno, cero válido. Límite de aceptación: Rollback mantiene anterior; no agenda automática ni edición de períodos.
- **Technical Notes:** Hallazgo F09; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 11eb099; f09-periods/d01-migration; E-QA. Limitación: Rollback mantiene anterior; no agenda automática ni edición de períodos. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/src/controllers/adminController.js; backend/tests/d01-migration.test.js; backend/tests/f09-periods.test.js; database/20260909_f09_periods_one_active.sql; database/schema.sql. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST05](01-backlog-completo.md#st05)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep04, evidencia-local
- **Component:** ep04
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/schema.sql; backend/src/controllers/adminController.js; backend/tests/d01-migration.test.js; backend/tests/f09-periods.test.js; database/20260909_f09_periods_one_active.sql; database/schema.sql; Git 11eb099; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/schema.sql](../../backend/schema.sql); [backend/src/controllers/adminController.js](../../backend/src/controllers/adminController.js); [backend/tests/d01-migration.test.js](../../backend/tests/d01-migration.test.js); [backend/tests/f09-periods.test.js](../../backend/tests/f09-periods.test.js); [database/20260909_f09_periods_one_active.sql](../../database/20260909_f09_periods_one_active.sql); [database/schema.sql](../../database/schema.sql)
- **Related Commits:** 11eb099
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F09; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 11eb099; f09-periods/d01-migration; E-QA. Limitación: Rollback mantiene anterior; no agenda automática ni edición de períodos.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 11eb099: 2026-09-09T19:57:29-05:00
- **Requerimiento/contrato relacionado:** Períodos de participación

<a id="bg-f10"></a>

## BG-F10 — F10: Validar período y fecha de actividad transaccionalmente

- **Internal ID:** BG-F10
- **Issue Type:** Bug
- **Summary:** F10: Validar período y fecha de actividad transaccionalmente
- **Description:** Problema detectado: Período/fecha sin autoridad backend; registros incoherentes. Corrección o decisión documentada: Validar activo/ID y fecha inclusiva no futura bajo bloqueo compatible con F09.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Validar activo/ID y fecha inclusiva no futura bajo bloqueo compatible con F09. Límite de aceptación: CURRENT_DATE depende de PostgreSQL; no reescribe históricos.
- **Technical Notes:** Hallazgo F10; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: e511ccb; f10-record-period, concurrencia F09/F10. Limitación: CURRENT_DATE depende de PostgreSQL; no reescribe históricos. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/src/utils/recordDate.js; backend/tests/f10-record-period.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST08](01-backlog-completo.md#st08)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/src/utils/recordDate.js; backend/tests/f10-record-period.test.js; Git e511ccb; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/src/utils/recordDate.js](../../backend/src/utils/recordDate.js); [backend/tests/f10-record-period.test.js](../../backend/tests/f10-record-period.test.js)
- **Related Commits:** e511ccb
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F10; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: e511ccb; f10-record-period, concurrencia F09/F10. Limitación: CURRENT_DATE depende de PostgreSQL; no reescribe históricos.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** e511ccb: 2026-09-09T20:13:42-05:00
- **Requerimiento/contrato relacionado:** Registro de actividad de reciclaje

<a id="bg-f11"></a>

## BG-F11 — F11: Restringir registro a líderes con equipo válido

- **Internal ID:** BG-F11
- **Issue Type:** Bug
- **Summary:** F11: Restringir registro a líderes con equipo válido
- **Description:** Problema detectado: Admin sin equipo podía registrar; identidad insuficiente. Corrección o decisión documentada: Registro solo leader con equipo existente; S01 aporta identidad vigente.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Registro solo leader con equipo existente; S01 aporta identidad vigente. Límite de aceptación: No registro administrativo en nombre de terceros.
- **Technical Notes:** Hallazgo F11; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: e359a6b y d51387d; f11-registration-access/s01-s03-auth. Limitación: No registro administrativo en nombre de terceros. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/src/routes/recyclingRoutes.js; backend/tests/f11-registration-access.test.js; backend/tests/s01-s03-auth.test.js; frontend/src/App.jsx. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST08](01-backlog-completo.md#st08)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/recyclingController.js; backend/src/routes/recyclingRoutes.js; backend/tests/f11-registration-access.test.js; backend/tests/s01-s03-auth.test.js; frontend/src/App.jsx; Git e359a6b, d51387d; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/recyclingController.js](../../backend/src/controllers/recyclingController.js); [backend/src/routes/recyclingRoutes.js](../../backend/src/routes/recyclingRoutes.js); [backend/tests/f11-registration-access.test.js](../../backend/tests/f11-registration-access.test.js); [backend/tests/s01-s03-auth.test.js](../../backend/tests/s01-s03-auth.test.js); [frontend/src/App.jsx](../../frontend/src/App.jsx)
- **Related Commits:** e359a6b, d51387d
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F11; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: e359a6b y d51387d; f11-registration-access/s01-s03-auth. Limitación: No registro administrativo en nombre de terceros.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** e359a6b: 2026-09-09T20:22:50-05:00; d51387d: 2026-09-14T20:03:18-05:00
- **Requerimiento/contrato relacionado:** Registro de actividad de reciclaje

<a id="bg-f12"></a>

## BG-F12 — F12: Aplicar cupo de 15 cuentas en API y bootstrap

- **Internal ID:** BG-F12
- **Issue Type:** Bug
- **Summary:** F12: Aplicar cupo de 15 cuentas en API y bootstrap
- **Description:** Problema detectado: Cupo solo en UI; altas concurrentes superan 15. Corrección o decisión documentada: Máximo 15 almacenadas incluyendo admins/inactivos; bloqueo compartido por API/bootstrap.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Máximo 15 almacenadas incluyendo admins/inactivos; bloqueo compartido por API/bootstrap. Límite de aceptación: SQL administrativo arbitrario puede eludir la regla; baja lógica no libera cupo.
- **Technical Notes:** Hallazgo F12; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 36af9d0; f12-user-limit y concurrencia. Limitación: SQL administrativo arbitrario puede eludir la regla; baja lógica no libera cupo. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/adminController.js; backend/tests/f12-user-limit.test.js; database/create_admin.sql. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST03](01-backlog-completo.md#st03)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep04, evidencia-local
- **Component:** ep04
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/adminController.js; backend/tests/f12-user-limit.test.js; database/create_admin.sql; Git 36af9d0; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/adminController.js](../../backend/src/controllers/adminController.js); [backend/tests/f12-user-limit.test.js](../../backend/tests/f12-user-limit.test.js); [database/create_admin.sql](../../database/create_admin.sql)
- **Related Commits:** 36af9d0
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F12; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 36af9d0; f12-user-limit y concurrencia. Limitación: SQL administrativo arbitrario puede eludir la regla; baja lógica no libera cupo.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 36af9d0: 2026-09-12T14:12:38-05:00
- **Requerimiento/contrato relacionado:** Administración de cuentas y límite de 15

<a id="bg-f13"></a>

## BG-F13 — F13: Excluir estados y unidades incompatibles de cantidades en kg

- **Internal ID:** BG-F13
- **Issue Type:** Bug
- **Summary:** F13: Excluir estados y unidades incompatibles de cantidades en kg
- **Description:** Problema detectado: Sumas de estados/unidades distintos presentadas como kg. Corrección o decisión documentada: Cantidades approved + kg normalizado, sin conversión; mantener alcance histórico.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Cantidades approved + kg normalizado, sin conversión; mantener alcance histórico. Límite de aceptación: Conteos operativos conservan estados; no todo campo de stats filtra approved.
- **Technical Notes:** Hallazgo F13; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 91178e0; f13-approved-stats HTTP/SQL. Limitación: Conteos operativos conservan estados; no todo campo de stats filtra approved. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/publicController.js; backend/tests/f13-approved-stats.test.js; frontend/src/pages/admin/AdminDashboard.jsx. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST12](01-backlog-completo.md#st12)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep08, evidencia-local
- **Component:** ep08
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/publicController.js; backend/tests/f13-approved-stats.test.js; frontend/src/pages/admin/AdminDashboard.jsx; Git 91178e0; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/publicController.js](../../backend/src/controllers/publicController.js); [backend/tests/f13-approved-stats.test.js](../../backend/tests/f13-approved-stats.test.js); [frontend/src/pages/admin/AdminDashboard.jsx](../../frontend/src/pages/admin/AdminDashboard.jsx)
- **Related Commits:** 91178e0
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F13; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 91178e0; f13-approved-stats HTTP/SQL. Limitación: Conteos operativos conservan estados; no todo campo de stats filtra approved.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 91178e0: 2026-09-12T14:27:34-05:00
- **Requerimiento/contrato relacionado:** Estadísticas soportadas

<a id="bg-f14"></a>

## BG-F14 — F14: Retirar equivalencias ambientales no sustentadas

- **Internal ID:** BG-F14
- **Issue Type:** Bug
- **Summary:** F14: Retirar equivalencias ambientales no sustentadas
- **Description:** Problema detectado: Factores ambientales sin trazabilidad suficiente; afirmaciones no sustentadas. Corrección o decisión documentada: Retirar cuatro cálculos, objeto indicators y tarjetas; conservar total approved + kg.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Retirar cuatro cálculos, objeto indicators y tarjetas; conservar total approved + kg. Límite de aceptación: No valida factores; reintroducción requiere fuente, unidad, material y escenario.
- **Technical Notes:** Hallazgo F14; resolución original CORREGIDO; contexto RETIRADO POR DECISIÓN DE ALCANCE. Verificación citada: fc3389a; f14-indicator-methodology/f13-approved-stats. Limitación: No valida factores; reintroducción requiere fuente, unidad, material y escenario. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/publicController.js; backend/tests/f13-approved-stats.test.js; backend/tests/f14-indicator-methodology.test.js; frontend/src/pages/admin/AdminDashboard.jsx. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST17](01-backlog-completo.md#st17)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep08, evidencia-local
- **Component:** ep08
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/publicController.js; backend/tests/f13-approved-stats.test.js; backend/tests/f14-indicator-methodology.test.js; frontend/src/pages/admin/AdminDashboard.jsx; Git fc3389a; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/publicController.js](../../backend/src/controllers/publicController.js); [backend/tests/f13-approved-stats.test.js](../../backend/tests/f13-approved-stats.test.js); [backend/tests/f14-indicator-methodology.test.js](../../backend/tests/f14-indicator-methodology.test.js); [frontend/src/pages/admin/AdminDashboard.jsx](../../frontend/src/pages/admin/AdminDashboard.jsx)
- **Related Commits:** fc3389a
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F14; resolución original CORREGIDO; contexto RETIRADO POR DECISIÓN DE ALCANCE. Verificación citada: fc3389a; f14-indicator-methodology/f13-approved-stats. Limitación: No valida factores; reintroducción requiere fuente, unidad, material y escenario.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** fc3389a: 2026-09-12T14:53:43-05:00
- **Requerimiento/contrato relacionado:** Equivalencias ambientales — alcance retirado

<a id="tk-f15"></a>

## TK-F15 — F15: Implementar mantenimiento administrativo limitado autorizado

- **Internal ID:** TK-F15
- **Issue Type:** Task
- **Summary:** F15: Implementar mantenimiento administrativo limitado autorizado
- **Description:** Contexto: Alcance de mantenimiento indefinido; borrados amenazan referencias. Corrección o decisión documentada: Autorizar PATCH limitado de usuario y equipo; períodos GET/POST; sin DELETE de esas entidades.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Autorizar PATCH limitado de usuario y equipo; períodos GET/POST; sin DELETE de esas entidades. Límite de aceptación: Usuario: nombre/email/equipo/is_active, no rol/clave. Equipo: nombre/dependencia. Contenido conserva su CRUD.
- **Technical Notes:** Hallazgo F15; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: fefb3fa; f15-admin-scope HTTP y regresión F09/F10/F12. Limitación: Usuario: nombre/email/equipo/is_active, no rol/clave. Equipo: nombre/dependencia. Contenido conserva su CRUD. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/adminController.js; backend/src/routes/adminRoutes.js; backend/tests/f15-admin-scope.test.js; frontend/src/pages/admin/AdminSettingsPage.jsx; frontend/src/pages/admin/AdminUsersPage.jsx. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP04](01-backlog-completo.md#ep04)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep04, evidencia-local
- **Component:** ep04
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/adminController.js; backend/src/routes/adminRoutes.js; backend/tests/f15-admin-scope.test.js; frontend/src/pages/admin/AdminSettingsPage.jsx; frontend/src/pages/admin/AdminUsersPage.jsx; Git fefb3fa; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/adminController.js](../../backend/src/controllers/adminController.js); [backend/src/routes/adminRoutes.js](../../backend/src/routes/adminRoutes.js); [backend/tests/f15-admin-scope.test.js](../../backend/tests/f15-admin-scope.test.js); [frontend/src/pages/admin/AdminSettingsPage.jsx](../../frontend/src/pages/admin/AdminSettingsPage.jsx); [frontend/src/pages/admin/AdminUsersPage.jsx](../../frontend/src/pages/admin/AdminUsersPage.jsx)
- **Related Commits:** fefb3fa
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F15; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: fefb3fa; f15-admin-scope HTTP y regresión F09/F10/F12. Limitación: Usuario: nombre/email/equipo/is_active, no rol/clave. Equipo: nombre/dependencia. Contenido conserva su CRUD.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** fefb3fa: 2026-09-12T19:26:47-05:00
- **Requerimiento/contrato relacionado:** Implementar mantenimiento administrativo limitado autorizado

<a id="tk-f16"></a>

## TK-F16 — F16: Implementar mecanismo técnico de recuperación temporal

- **Internal ID:** TK-F16
- **Issue Type:** Task
- **Summary:** F16: Implementar mecanismo técnico de recuperación temporal
- **Description:** Contexto: Sin recuperación de contraseña; dependencia de SQL excepcional. Corrección o decisión documentada: Token aleatorio hasheado, temporal y de un uso, reset transaccional; S01 revoca JWT previos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Token aleatorio hasheado, temporal y de un uso, reset transaccional; S01 revoca JWT previos. Límite de aceptación: Cierre técnico autorizado; proveedor de correo pendiente, no envío real ni cambio voluntario.
- **Technical Notes:** Hallazgo F16; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 42c5643 y d51387d; f16-password-recovery; E-QA. Limitación: Cierre técnico autorizado; proveedor de correo pendiente, no envío real ni cambio voluntario. Cierre de mecanismo técnico; ST02 permanece parcial y TK25 exige proveedor. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/passwordRecoveryController.js; backend/src/services/passwordResetDelivery.js; backend/tests/f16-password-recovery.test.js; database/20260912_f16_password_reset.sql. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [ST02](01-backlog-completo.md#st02)
- **Dependencies:** [ST01](01-backlog-completo.md#st01)
- **Labels:** retrospectivo, f3, ep03, evidencia-local
- **Component:** ep03
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/passwordRecoveryController.js; backend/src/services/passwordResetDelivery.js; backend/tests/f16-password-recovery.test.js; database/20260912_f16_password_reset.sql; Git 42c5643, d51387d; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/passwordRecoveryController.js](../../backend/src/controllers/passwordRecoveryController.js); [backend/src/services/passwordResetDelivery.js](../../backend/src/services/passwordResetDelivery.js); [backend/tests/f16-password-recovery.test.js](../../backend/tests/f16-password-recovery.test.js); [database/20260912_f16_password_reset.sql](../../database/20260912_f16_password_reset.sql)
- **Related Commits:** 42c5643, d51387d
- **Closing Notes:** Mecanismo técnico F16 cerrado según alcance autorizado; recuperación completa ST02 parcial por entrega de correo TK25 pendiente.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F16; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 42c5643 y d51387d; f16-password-recovery; E-QA. Limitación: Cierre técnico autorizado; proveedor de correo pendiente, no envío real ni cambio voluntario. Cierre de mecanismo técnico; ST02 permanece parcial y TK25 exige proveedor.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 42c5643: 2026-09-12T19:52:19-05:00; d51387d: 2026-09-14T20:03:18-05:00
- **Requerimiento/contrato relacionado:** Recuperación de contraseña

<a id="bg-f17"></a>

## BG-F17 — F17: Manejar rechazos UI y rutas desconocidas

- **Internal ID:** BG-F17
- **Issue Type:** Bug
- **Summary:** F17: Manejar rechazos UI y rutas desconocidas
- **Description:** Problema detectado: Rechazos UI sin manejo y ruta desconocida sin vista; falsos vacíos. Corrección o decisión documentada: Loading/error/empty diferenciados, reintento y mensajes controlados; catch-all.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Loading/error/empty diferenciados, reintento y mensajes controlados; catch-all. Límite de aceptación: Pruebas con host mínimo; smoke visual integral no demostrado.
- **Technical Notes:** Hallazgo F17; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 5412992; frontend f17-ui. Limitación: Pruebas con host mínimo; smoke visual integral no demostrado. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; frontend/src/App.jsx; frontend/src/components/LoadState.jsx; frontend/src/utils/uiError.js; frontend/tests/f17-ui.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST14](01-backlog-completo.md#st14)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep09, evidencia-local
- **Component:** ep09
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; frontend/src/App.jsx; frontend/src/components/LoadState.jsx; frontend/src/utils/uiError.js; frontend/tests/f17-ui.test.js; Git 5412992; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [frontend/src/App.jsx](../../frontend/src/App.jsx); [frontend/src/components/LoadState.jsx](../../frontend/src/components/LoadState.jsx); [frontend/src/utils/uiError.js](../../frontend/src/utils/uiError.js); [frontend/tests/f17-ui.test.js](../../frontend/tests/f17-ui.test.js)
- **Related Commits:** 5412992
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F17; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 5412992; frontend f17-ui. Limitación: Pruebas con host mínimo; smoke visual integral no demostrado.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 5412992: 2026-09-13T10:45:54-05:00
- **Requerimiento/contrato relacionado:** Usabilidad y navegación

<a id="bg-f18"></a>

## BG-F18 — F18: Estabilizar toast para evitar repetición de efectos

- **Internal ID:** BG-F18
- **Issue Type:** Bug
- **Summary:** F18: Estabilizar toast para evitar repetición de efectos
- **Description:** Problema detectado: Identidad toast inestable repite efectos/consultas. Corrección o decisión documentada: useCallback y value useMemo; notificaciones sin nueva carga del período.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: useCallback y value useMemo; notificaciones sin nueva carga del período. Límite de aceptación: No rediseña política de notificaciones.
- **Technical Notes:** Hallazgo F18; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: dd1e55b; frontend f18-toast. Limitación: No rediseña política de notificaciones. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; frontend/src/context/ToastContext.jsx; frontend/tests/f18-toast.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST14](01-backlog-completo.md#st14)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep09, evidencia-local
- **Component:** ep09
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; frontend/src/context/ToastContext.jsx; frontend/tests/f18-toast.test.js; Git dd1e55b; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [frontend/src/context/ToastContext.jsx](../../frontend/src/context/ToastContext.jsx); [frontend/tests/f18-toast.test.js](../../frontend/tests/f18-toast.test.js)
- **Related Commits:** dd1e55b
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F18; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: dd1e55b; frontend f18-toast. Limitación: No rediseña política de notificaciones.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** dd1e55b: 2026-09-13T11:05:28-05:00
- **Requerimiento/contrato relacionado:** Usabilidad y navegación

<a id="bg-f19"></a>

## BG-F19 — F19: Vaciar input nativo de evidencia solo tras éxito

- **Internal ID:** BG-F19
- **Issue Type:** Bug
- **Summary:** F19: Vaciar input nativo de evidencia solo tras éxito
- **Description:** Problema detectado: Estado limpio pero input de archivo conservado; reenvío accidental. Corrección o decisión documentada: useRef limpia input tras éxito; fallo conserva selección.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: useRef limpia input tras éxito; fallo conserva selección. Límite de aceptación: Se verifica flujo/DOM mínimo, no todos los navegadores.
- **Technical Notes:** Hallazgo F19; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 60d8c3a; frontend f19-evidence. Limitación: Se verifica flujo/DOM mínimo, no todos los navegadores. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; frontend/src/pages/leader/RegisterRecyclingPage.jsx; frontend/tests/f19-evidence.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST08](01-backlog-completo.md#st08)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; frontend/src/pages/leader/RegisterRecyclingPage.jsx; frontend/tests/f19-evidence.test.js; Git 60d8c3a; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [frontend/src/pages/leader/RegisterRecyclingPage.jsx](../../frontend/src/pages/leader/RegisterRecyclingPage.jsx); [frontend/tests/f19-evidence.test.js](../../frontend/tests/f19-evidence.test.js)
- **Related Commits:** 60d8c3a
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F19; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 60d8c3a; frontend f19-evidence. Limitación: Se verifica flujo/DOM mínimo, no todos los navegadores.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 60d8c3a: 2026-09-13T11:18:50-05:00
- **Requerimiento/contrato relacionado:** Registro de actividad de reciclaje

<a id="bg-f20"></a>

## BG-F20 — F20: Corregir foco de modal y navegación de menú móvil

- **Internal ID:** BG-F20
- **Issue Type:** Bug
- **Summary:** F20: Corregir foco de modal y navegación de menú móvil
- **Description:** Problema detectado: Modal y menú con barreras de teclado/foco. Corrección o decisión documentada: Foco atrapado/restaurado, Escape y atributos/estado accesible del menú.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Foco atrapado/restaurado, Escape y atributos/estado accesible del menú. Límite de aceptación: No certificación integral de accesibilidad; smoke móvil/visual por registrar.
- **Technical Notes:** Hallazgo F20; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 21f418e; frontend f20-accessibility. Limitación: No certificación integral de accesibilidad; smoke móvil/visual por registrar. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; frontend/src/layouts/AppLayout.jsx; frontend/src/pages/public/EducationCategoryPage.jsx; frontend/src/utils/dialogFocus.js; frontend/tests/f20-accessibility.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST14](01-backlog-completo.md#st14)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep09, evidencia-local
- **Component:** ep09
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; frontend/src/layouts/AppLayout.jsx; frontend/src/pages/public/EducationCategoryPage.jsx; frontend/src/utils/dialogFocus.js; frontend/tests/f20-accessibility.test.js; Git 21f418e; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [frontend/src/layouts/AppLayout.jsx](../../frontend/src/layouts/AppLayout.jsx); [frontend/src/pages/public/EducationCategoryPage.jsx](../../frontend/src/pages/public/EducationCategoryPage.jsx); [frontend/src/utils/dialogFocus.js](../../frontend/src/utils/dialogFocus.js); [frontend/tests/f20-accessibility.test.js](../../frontend/tests/f20-accessibility.test.js)
- **Related Commits:** 21f418e
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo F20; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 21f418e; frontend f20-accessibility. Limitación: No certificación integral de accesibilidad; smoke móvil/visual por registrar.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 21f418e: 2026-09-13T11:49:57-05:00
- **Requerimiento/contrato relacionado:** Usabilidad y navegación

<a id="bg-s01"></a>

## BG-S01 — S01: Actualizar identidad autorizada y revocar JWT tras reset

- **Internal ID:** BG-S01
- **Issue Type:** Bug
- **Summary:** S01: Actualizar identidad autorizada y revocar JWT tras reset
- **Description:** Problema detectado: JWT conserva rol/equipo obsoletos y vive tras reset. Corrección o decisión documentada: JWT mínimo y usuario vigente por request; session_version cambia en reset atómico.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: JWT mínimo y usuario vigente por request; session_version cambia en reset atómico. Límite de aceptación: Logout local no revoca copias; reactivar puede admitir JWT vigente sin cambio de versión.
- **Technical Notes:** Hallazgo S01; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: d51387d; s01-s03-auth, migración/rollback; E-QA. Limitación: Logout local no revoca copias; reactivar puede admitir JWT vigente sin cambio de versión. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/authController.js; backend/src/controllers/passwordRecoveryController.js; backend/src/middleware/authMiddleware.js; backend/tests/s01-s03-auth.test.js; database/20260914_s01_session_version.sql. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST01](01-backlog-completo.md#st01)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep03, evidencia-local
- **Component:** ep03
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/authController.js; backend/src/controllers/passwordRecoveryController.js; backend/src/middleware/authMiddleware.js; backend/tests/s01-s03-auth.test.js; database/20260914_s01_session_version.sql; Git d51387d; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/authController.js](../../backend/src/controllers/authController.js); [backend/src/controllers/passwordRecoveryController.js](../../backend/src/controllers/passwordRecoveryController.js); [backend/src/middleware/authMiddleware.js](../../backend/src/middleware/authMiddleware.js); [backend/tests/s01-s03-auth.test.js](../../backend/tests/s01-s03-auth.test.js); [database/20260914_s01_session_version.sql](../../database/20260914_s01_session_version.sql)
- **Related Commits:** d51387d
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S01; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: d51387d; s01-s03-auth, migración/rollback; E-QA. Limitación: Logout local no revoca copias; reactivar puede admitir JWT vigente sin cambio de versión.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** d51387d: 2026-09-14T20:03:18-05:00
- **Requerimiento/contrato relacionado:** Acceso por credenciales y roles; Cuestionario RNF-005

<a id="bg-s02"></a>

## BG-S02 — S02: Mitigar manejo de sesión manteniendo abierto riesgo localStorage

- **Internal ID:** BG-S02
- **Issue Type:** Bug
- **Summary:** S02: Mitigar manejo de sesión manteniendo abierto riesgo localStorage
- **Description:** Problema detectado: JWT en localStorage accesible a JavaScript; exposición ante XSS. Corrección o decisión documentada: Conservar Bearer y corregir manejo coherente de sesión/rechazos; diferir cambio integral de transporte.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Conservar Bearer y corregir manejo coherente de sesión/rechazos; diferir cambio integral de transporte. Límite de aceptación: Token sigue en localStorage; decidir topología/orígenes y migración integral, no cookies parciales.
- **Technical Notes:** Hallazgo S02; resolución original PARCIAL; contexto VIGENTE. Verificación citada: d51387d; frontend s02-session. Limitación: Token sigue en localStorage; decidir topología/orígenes y migración integral, no cookies parciales. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; frontend/src/api/client.js; frontend/src/api/session.js; frontend/src/context/AuthContext.jsx; frontend/tests/s02-session.test.js; backend/tests/s01-s03-auth.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST01](01-backlog-completo.md#st01)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep03, evidencia-local
- **Component:** ep03
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; frontend/src/api/client.js; frontend/src/api/session.js; frontend/src/context/AuthContext.jsx; frontend/tests/s02-session.test.js; backend/tests/s01-s03-auth.test.js; Git d51387d; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [frontend/src/api/client.js](../../frontend/src/api/client.js); [frontend/src/api/session.js](../../frontend/src/api/session.js); [frontend/src/context/AuthContext.jsx](../../frontend/src/context/AuthContext.jsx); [frontend/tests/s02-session.test.js](../../frontend/tests/s02-session.test.js); [backend/tests/s01-s03-auth.test.js](../../backend/tests/s01-s03-auth.test.js)
- **Related Commits:** d51387d
- **Closing Notes:** No cerrar integralmente: persisten las limitaciones institucionales/técnicas descritas y enlazadas.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S02; resolución original PARCIAL; contexto VIGENTE. Verificación citada: d51387d; frontend s02-session. Limitación: Token sigue en localStorage; decidir topología/orígenes y migración integral, no cookies parciales.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** d51387d: 2026-09-14T20:03:18-05:00
- **Requerimiento/contrato relacionado:** Acceso por credenciales y roles; Cuestionario RNF-003

<a id="bg-s03"></a>

## BG-S03 — S03: Limitar intentos de login y recuperación por IP

- **Internal ID:** BG-S03
- **Issue Type:** Bug
- **Summary:** S03: Limitar intentos de login y recuperación por IP
- **Description:** Problema detectado: Login/forgot/reset sin límites; abuso de intentos. Corrección o decisión documentada: Límites por IP/endpoint, mapa acotado, proxy explícito, 429/Retry-After y errores genéricos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Límites por IP/endpoint, mapa acotado, proxy explícito, 429/Retry-After y errores genéricos. Límite de aceptación: Memoria por proceso; NAT comparte cupo y ataques distribuidos requieren otros controles.
- **Technical Notes:** Hallazgo S03; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: d51387d; s03-rate-limit/s01-s03-auth. Limitación: Memoria por proceso; NAT comparte cupo y ataques distribuidos requieren otros controles. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/middleware/authRateLimit.js; backend/src/routes/authRoutes.js; backend/tests/s01-s03-auth.test.js; backend/tests/s03-rate-limit.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP03](01-backlog-completo.md#ep03)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep03, evidencia-local
- **Component:** ep03
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/middleware/authRateLimit.js; backend/src/routes/authRoutes.js; backend/tests/s01-s03-auth.test.js; backend/tests/s03-rate-limit.test.js; Git d51387d; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/middleware/authRateLimit.js](../../backend/src/middleware/authRateLimit.js); [backend/src/routes/authRoutes.js](../../backend/src/routes/authRoutes.js); [backend/tests/s01-s03-auth.test.js](../../backend/tests/s01-s03-auth.test.js); [backend/tests/s03-rate-limit.test.js](../../backend/tests/s03-rate-limit.test.js)
- **Related Commits:** d51387d
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S03; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: d51387d; s03-rate-limit/s01-s03-auth. Limitación: Memoria por proceso; NAT comparte cupo y ataques distribuidos requieren otros controles.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** d51387d: 2026-09-14T20:03:18-05:00
- **Requerimiento/contrato relacionado:** Limitar intentos de login y recuperación por IP

<a id="bg-s04"></a>

## BG-S04 — S04: Acotar cargas y sustituir nombres manipulables

- **Internal ID:** BG-S04
- **Issue Type:** Bug
- **Summary:** S04: Acotar cargas y sustituir nombres manipulables
- **Description:** Problema detectado: Cargas sin límites seguros; recursos/nombres manipulables. Corrección o decisión documentada: Un archivo, UUID, límites por formato y limpieza al rechazar.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Un archivo, UUID, límites por formato y limpieza al rechazar. Límite de aceptación: UPLOAD_ROOT requiere almacenamiento y permisos adecuados.
- **Technical Notes:** Hallazgo S04; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: a96aa30; s04-s07-files. Limitación: UPLOAD_ROOT requiere almacenamiento y permisos adecuados. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/middleware/uploadMiddleware.js; backend/src/services/fileStore.js; backend/tests/s04-s07-files.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP06](01-backlog-completo.md#ep06)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/middleware/uploadMiddleware.js; backend/src/services/fileStore.js; backend/tests/s04-s07-files.test.js; Git a96aa30; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/middleware/uploadMiddleware.js](../../backend/src/middleware/uploadMiddleware.js); [backend/src/services/fileStore.js](../../backend/src/services/fileStore.js); [backend/tests/s04-s07-files.test.js](../../backend/tests/s04-s07-files.test.js)
- **Related Commits:** a96aa30
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S04; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: a96aa30; s04-s07-files. Limitación: UPLOAD_ROOT requiere almacenamiento y permisos adecuados.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** a96aa30: 2026-09-15T20:36:09-05:00
- **Requerimiento/contrato relacionado:** Acotar cargas y sustituir nombres manipulables

<a id="bg-s05"></a>

## BG-S05 — S05: Cerrar exposición estática de evidencias y borradores

- **Internal ID:** BG-S05
- **Issue Type:** Bug
- **Summary:** S05: Cerrar exposición estática de evidencias y borradores
- **Description:** Problema detectado: /uploads público expone evidencias y borradores. Corrección o decisión documentada: Quitar estáticos; rutas por entidad con publicación/propiedad/rol; Blob con Bearer.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Quitar estáticos; rutas por entidad con publicación/propiedad/rol; Blob con Bearer. Límite de aceptación: Un proxy externo no debe republicar uploads; referencias heredadas se resuelven bajo permisos.
- **Technical Notes:** Hallazgo S05; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: a96aa30; s04-s07-files y frontend s05-protected-files. Limitación: Un proxy externo no debe republicar uploads; referencias heredadas se resuelven bajo permisos. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/fileController.js; backend/src/routes/fileRoutes.js; backend/tests/s04-s07-files.test.js; frontend/src/components/ProtectedFile.jsx; frontend/tests/s05-protected-files.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST09](01-backlog-completo.md#st09)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/fileController.js; backend/src/routes/fileRoutes.js; backend/tests/s04-s07-files.test.js; frontend/src/components/ProtectedFile.jsx; frontend/tests/s05-protected-files.test.js; Git a96aa30; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/fileController.js](../../backend/src/controllers/fileController.js); [backend/src/routes/fileRoutes.js](../../backend/src/routes/fileRoutes.js); [backend/tests/s04-s07-files.test.js](../../backend/tests/s04-s07-files.test.js); [frontend/src/components/ProtectedFile.jsx](../../frontend/src/components/ProtectedFile.jsx); [frontend/tests/s05-protected-files.test.js](../../frontend/tests/s05-protected-files.test.js)
- **Related Commits:** a96aa30
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S05; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: a96aa30; s04-s07-files y frontend s05-protected-files. Limitación: Un proxy externo no debe republicar uploads; referencias heredadas se resuelven bajo permisos.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** a96aa30: 2026-09-15T20:36:09-05:00
- **Requerimiento/contrato relacionado:** Historial personal y acceso a evidencia

<a id="bg-s06"></a>

## BG-S06 — S06: Coordinar limpieza de adjuntos con transacciones y referencias

- **Internal ID:** BG-S06
- **Issue Type:** Bug
- **Summary:** S06: Coordinar limpieza de adjuntos con transacciones y referencias
- **Description:** Problema detectado: Huérfanos por fallo SQL/reemplazo/borrado; pérdida de adjuntos compartidos. Corrección o decisión documentada: Coordinar transacción y cleanup, consultar ambas tablas antes de retirar archivos.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Coordinar transacción y cleanup, consultar ambas tablas antes de retirar archivos. Límite de aceptación: BD y filesystem no son atómicos; crash puede dejar residuos; no barrido histórico automático.
- **Technical Notes:** Hallazgo S06; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: a96aa30; s04-s07-files: fallos/referencias/concurrencia. Limitación: BD y filesystem no son atómicos; crash puede dejar residuos; no barrido histórico automático. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/services/contentFiles.js; backend/src/services/fileStore.js; backend/tests/s04-s07-files.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST07](01-backlog-completo.md#st07)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep05, evidencia-local
- **Component:** ep05
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/services/contentFiles.js; backend/src/services/fileStore.js; backend/tests/s04-s07-files.test.js; Git a96aa30; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/services/contentFiles.js](../../backend/src/services/contentFiles.js); [backend/src/services/fileStore.js](../../backend/src/services/fileStore.js); [backend/tests/s04-s07-files.test.js](../../backend/tests/s04-s07-files.test.js)
- **Related Commits:** a96aa30
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S06; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: a96aa30; s04-s07-files: fallos/referencias/concurrencia. Limitación: BD y filesystem no son atómicos; crash puede dejar residuos; no barrido histórico automático.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** a96aa30: 2026-09-15T20:36:09-05:00
- **Requerimiento/contrato relacionado:** Gestión de contenidos

<a id="bg-s07"></a>

## BG-S07 — S07: Validar formato y firma además del MIME declarado

- **Internal ID:** BG-S07
- **Issue Type:** Bug
- **Summary:** S07: Validar formato y firma además del MIME declarado
- **Description:** Problema detectado: Regex/MIME insuficientes; aceptar formato aparente. Corrección o decisión documentada: Allowlist, extensión/MIME/firma y marcadores estructurales con worker acotado.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Allowlist, extensión/MIME/firma y marcadores estructurales con worker acotado. Límite de aceptación: Sin antivirus, sin decodificación total ni certificación de codecs/contenido activo.
- **Technical Notes:** Hallazgo S07; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: a96aa30; s04-s07-files. Limitación: Sin antivirus, sin decodificación total ni certificación de codecs/contenido activo. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/services/fileFormats.js; backend/src/services/fileValidation.js; backend/src/services/fileValidationWorker.js; backend/tests/s04-s07-files.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP06](01-backlog-completo.md#ep06)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep06, evidencia-local
- **Component:** ep06
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/services/fileFormats.js; backend/src/services/fileValidation.js; backend/src/services/fileValidationWorker.js; backend/tests/s04-s07-files.test.js; Git a96aa30; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/services/fileFormats.js](../../backend/src/services/fileFormats.js); [backend/src/services/fileValidation.js](../../backend/src/services/fileValidation.js); [backend/src/services/fileValidationWorker.js](../../backend/src/services/fileValidationWorker.js); [backend/tests/s04-s07-files.test.js](../../backend/tests/s04-s07-files.test.js)
- **Related Commits:** a96aa30
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S07; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: a96aa30; s04-s07-files. Limitación: Sin antivirus, sin decodificación total ni certificación de codecs/contenido activo.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** a96aa30: 2026-09-15T20:36:09-05:00
- **Requerimiento/contrato relacionado:** Validar formato y firma además del MIME declarado

<a id="bg-s08"></a>

## BG-S08 — S08: Configurar orígenes CORS por entorno

- **Internal ID:** BG-S08
- **Issue Type:** Bug
- **Summary:** S08: Configurar orígenes CORS por entorno
- **Description:** Problema detectado: CORS fijo ignora entorno; política ambigua. Corrección o decisión documentada: Orígenes exactos, fallback controlado CLIENT_URL, error al configurar mal, sin cookies.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Orígenes exactos, fallback controlado CLIENT_URL, error al configurar mal, sin cookies. Límite de aceptación: CORS no sustituye auth; topología institucional aún por definir.
- **Technical Notes:** Hallazgo S08; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 294563f; s08-s10-config-logging HTTP. Limitación: CORS no sustituye auth; topología institucional aún por definir. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/middleware/httpConfig.js; backend/src/server.js; backend/tests/s08-s10-config-logging.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/middleware/httpConfig.js; backend/src/server.js; backend/tests/s08-s10-config-logging.test.js; Git 294563f; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/middleware/httpConfig.js](../../backend/src/middleware/httpConfig.js); [backend/src/server.js](../../backend/src/server.js); [backend/tests/s08-s10-config-logging.test.js](../../backend/tests/s08-s10-config-logging.test.js)
- **Related Commits:** 294563f
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S08; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 294563f; s08-s10-config-logging HTTP. Limitación: CORS no sustituye auth; topología institucional aún por definir.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 294563f: 2026-09-15T21:04:17-05:00
- **Requerimiento/contrato relacionado:** Configurar orígenes CORS por entorno

<a id="bg-s09"></a>

## BG-S09 — S09: Parametrizar conexión PostgreSQL con TLS verificado

- **Internal ID:** BG-S09
- **Issue Type:** Bug
- **Summary:** S09: Parametrizar conexión PostgreSQL con TLS verificado
- **Description:** Problema detectado: Puerto fijo y TLS sin contrato; conexión insegura/configuración opaca. Corrección o decisión documentada: DATABASE_URL o DB_*, puerto validado y SSL con certificado verificado.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: DATABASE_URL o DB_*, puerto validado y SSL con certificado verificado. Límite de aceptación: No conectividad/TLS institucional certificada ni CA inventada.
- **Technical Notes:** Hallazgo S09; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 294563f; s08-s10-config-logging, constructor sin red. Limitación: No conectividad/TLS institucional certificada ni CA inventada. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/config/databaseOptions.js; backend/src/config/db.js; backend/tests/s08-s10-config-logging.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/config/databaseOptions.js; backend/src/config/db.js; backend/tests/s08-s10-config-logging.test.js; Git 294563f; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/config/databaseOptions.js](../../backend/src/config/databaseOptions.js); [backend/src/config/db.js](../../backend/src/config/db.js); [backend/tests/s08-s10-config-logging.test.js](../../backend/tests/s08-s10-config-logging.test.js)
- **Related Commits:** 294563f
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S09; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 294563f; s08-s10-config-logging, constructor sin red. Limitación: No conectividad/TLS institucional certificada ni CA inventada.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 294563f: 2026-09-15T21:04:17-05:00
- **Requerimiento/contrato relacionado:** Parametrizar conexión PostgreSQL con TLS verificado

<a id="bg-s10"></a>

## BG-S10 — S10: Sustituir logs síncronos y excesivos por eventos acotados

- **Internal ID:** BG-S10
- **Issue Type:** Bug
- **Summary:** S10: Sustituir logs síncronos y excesivos por eventos acotados
- **Description:** Problema detectado: Logs síncronos sin rotación y datos excesivos. Corrección o decisión documentada: JSONL asíncrono, allowlist, minimización, cola y rotación acotadas.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: JSONL asíncrono, allowlist, minimización, cola y rotación acotadas. Límite de aceptación: IDs vinculables; posible pérdida en crash/saturación; sin auditoría inmutable ni coordinación multiproceso.
- **Technical Notes:** Hallazgo S10; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 294563f; s08-s10-config-logging. Limitación: IDs vinculables; posible pérdida en crash/saturación; sin auditoría inmutable ni coordinación multiproceso. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/.env.example; backend/src/utils/logger.js; backend/tests/s08-s10-config-logging.test.js; frontend/.env.example. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/.env.example; backend/src/utils/logger.js; backend/tests/s08-s10-config-logging.test.js; frontend/.env.example; Git 294563f; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/.env.example](../../backend/.env.example); [backend/src/utils/logger.js](../../backend/src/utils/logger.js); [backend/tests/s08-s10-config-logging.test.js](../../backend/tests/s08-s10-config-logging.test.js); [frontend/.env.example](../../frontend/.env.example)
- **Related Commits:** 294563f
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S10; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 294563f; s08-s10-config-logging. Limitación: IDs vinculables; posible pérdida en crash/saturación; sin auditoría inmutable ni coordinación multiproceso.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 294563f: 2026-09-15T21:04:17-05:00
- **Requerimiento/contrato relacionado:** Sustituir logs síncronos y excesivos por eventos acotados

<a id="bg-s11"></a>

## BG-S11 — S11: Limitar exportación y proteger concurrencia y celdas XLSX

- **Internal ID:** BG-S11
- **Issue Type:** Bug
- **Summary:** S11: Limitar exportación y proteger concurrencia y celdas XLSX
- **Description:** Problema detectado: Exportación ilimitada en memoria; concurrencia y celdas peligrosas. Corrección o decisión documentada: EXPORT_MAX_ROWS 1000 (1–10000), LIMIT+1, 422 sin truncar, una por proceso/429, strings sin fórmulas.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: EXPORT_MAX_ROWS 1000 (1–10000), LIMIT+1, 422 sin truncar, una por proceso/429, strings sin fórmulas. Límite de aceptación: Sin filtros API; memoria acotada por filas, no RSS duro ni límite distribuido.
- **Technical Notes:** Hallazgo S11; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 78c0297; backend/frontend s11-export; E-XLSX. Limitación: Sin filtros API; memoria acotada por filas, no RSS duro ni límite distribuido. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/exportController.js; backend/tests/s11-export.test.js; frontend/src/pages/admin/AdminDashboard.jsx; frontend/src/utils/exportError.js; frontend/tests/s11-export.test.js. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [ST13](01-backlog-completo.md#st13)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep08, evidencia-local
- **Component:** ep08
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; backend/src/controllers/exportController.js; backend/tests/s11-export.test.js; frontend/src/pages/admin/AdminDashboard.jsx; frontend/src/utils/exportError.js; frontend/tests/s11-export.test.js; Git 78c0297; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [backend/src/controllers/exportController.js](../../backend/src/controllers/exportController.js); [backend/tests/s11-export.test.js](../../backend/tests/s11-export.test.js); [frontend/src/pages/admin/AdminDashboard.jsx](../../frontend/src/pages/admin/AdminDashboard.jsx); [frontend/src/utils/exportError.js](../../frontend/src/utils/exportError.js); [frontend/tests/s11-export.test.js](../../frontend/tests/s11-export.test.js)
- **Related Commits:** 78c0297
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S11; resolución original CORREGIDO; contexto VIGENTE. Verificación citada: 78c0297; backend/frontend s11-export; E-XLSX. Limitación: Sin filtros API; memoria acotada por filas, no RSS duro ni límite distribuido.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 78c0297: 2026-09-16T09:14:07-05:00
- **Requerimiento/contrato relacionado:** Exportación XLSX

<a id="bg-s12"></a>

## BG-S12 — S12: Resolver riesgos pendientes de dependencias conservando CI validado

- **Internal ID:** BG-S12
- **Issue Type:** Bug
- **Summary:** S12: Resolver riesgos pendientes de dependencias conservando CI validado
- **Description:** Problema detectado: Sin pruebas/CI ni auditoría de locks; defectos repetibles y dependencias vulnerables. Corrección o decisión documentada: Suites, instalación reproducible, CI y reportes de riesgo; helper PostgreSQL corregido.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Comportamiento esperado: Suites, instalación reproducible, CI y reportes de riesgo; helper PostgreSQL corregido. Límite de aceptación: Exclusivamente riesgos de dependencias documentados; CI IMPLEMENTADO Y VALIDADO, sin CD.
- **Technical Notes:** Hallazgo S12; resolución original PARCIAL; contexto VIGENTE. Verificación citada: 78c0297 + f21b2a6; s12-ci/ci-infrastructure; E-LOCAL/E-CI; docs/13 y JSON. Limitación: Exclusivamente riesgos de dependencias documentados; CI IMPLEMENTADO Y VALIDADO, sin CD. Fuentes técnicas: docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; .github/workflows/ci.yml; backend/tests/ci-infrastructure.test.js; backend/tests/helpers/postgresCluster.js; backend/tests/s12-ci.test.js; scripts/dependency-risk-report.mjs; scripts/run-tests.mjs. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** High — propuesta retrospectiva
- **Final Status:** Partially Completed
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** docs/15-TRAZABILIDAD-Y-DECISIONES.md; docs/09-CALIDAD-Y-PENDIENTES.md; .github/workflows/ci.yml; backend/tests/ci-infrastructure.test.js; backend/tests/helpers/postgresCluster.js; backend/tests/s12-ci.test.js; scripts/dependency-risk-report.mjs; scripts/run-tests.mjs; Git 78c0297, f21b2a6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [docs/15-TRAZABILIDAD-Y-DECISIONES.md](../../docs/15-TRAZABILIDAD-Y-DECISIONES.md); [docs/09-CALIDAD-Y-PENDIENTES.md](../../docs/09-CALIDAD-Y-PENDIENTES.md); [.github/workflows/ci.yml](../../.github/workflows/ci.yml); [backend/tests/ci-infrastructure.test.js](../../backend/tests/ci-infrastructure.test.js); [backend/tests/helpers/postgresCluster.js](../../backend/tests/helpers/postgresCluster.js); [backend/tests/s12-ci.test.js](../../backend/tests/s12-ci.test.js); [scripts/dependency-risk-report.mjs](../../scripts/dependency-risk-report.mjs); [scripts/run-tests.mjs](../../scripts/run-tests.mjs)
- **Related Commits:** 78c0297, f21b2a6
- **Closing Notes:** S12 parcial exclusivamente por dependencias. CI implementado y validado; no pendiente de segundo run.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Hallazgo S12; resolución original PARCIAL; contexto VIGENTE. Verificación citada: 78c0297 + f21b2a6; s12-ci/ci-infrastructure; E-LOCAL/E-CI; docs/13 y JSON. Limitación: Exclusivamente riesgos de dependencias documentados; CI IMPLEMENTADO Y VALIDADO, sin CD.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 78c0297: 2026-09-16T09:14:07-05:00; f21b2a6: 2026-09-16T09:39:35-05:00
- **Requerimiento/contrato relacionado:** Resolver riesgos pendientes de dependencias conservando CI validado

<a id="bg-ci"></a>

## BG-CI — Corregir arranque PostgreSQL de las 13 suites en GitHub Actions

- **Internal ID:** BG-CI
- **Issue Type:** Bug
- **Summary:** Corregir arranque PostgreSQL de las 13 suites en GitHub Actions
- **Description:** Primer run 78c0297: 41/54 pruebas y 13 suites fallidas. Helper común corrige aislamiento y diagnóstico; no se confirma retrospectivamente la causa exacta remota.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Segundo run f21b2a6 SUCCESS informado; helpers usan localhost, sin sockets Unix, puertos aislados, diagnóstico y limpieza. Riesgos S12 permanecen.
- **Technical Notes:** Bug relacionado con Task TK20; relación lógica, no subtarea Jira automática. Fuentes técnicas: backend/tests/helpers/postgresCluster.js; backend/tests/ci-infrastructure.test.js; scripts/run-tests.mjs; docs/14-CI-PRIMER-RUN.md. Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F4
- **Deliverable:** E4
- **Parent Internal ID:** [EP10](01-backlog-completo.md#ep10)
- **Dependencies:** [TK20](01-backlog-completo.md#tk20)
- **Labels:** retrospectivo, f4, ep10, evidencia-local
- **Component:** ep10
- **Evidence:** backend/tests/helpers/postgresCluster.js; backend/tests/ci-infrastructure.test.js; scripts/run-tests.mjs; docs/14-CI-PRIMER-RUN.md; Git 78c0297, f21b2a6; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/tests/helpers/postgresCluster.js](../../backend/tests/helpers/postgresCluster.js); [backend/tests/ci-infrastructure.test.js](../../backend/tests/ci-infrastructure.test.js); [scripts/run-tests.mjs](../../scripts/run-tests.mjs); [docs/14-CI-PRIMER-RUN.md](../../docs/14-CI-PRIMER-RUN.md)
- **Related Commits:** 78c0297, f21b2a6
- **Closing Notes:** CI f21b2a6 SUCCESS informado y validado por usuario en GitHub Actions según docs/14; sin inspección API ni nueva ejecución remota aquí.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F4 semanas 6–7; E4 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución. Bug relacionado con Task TK20; relación lógica, no subtarea Jira automática.
- **Verificación:** Implementación con pruebas automatizadas identificadas; resultados históricos en docs/09 y docs/14, no reejecutados aquí
- **Cronología de evidencia:** 78c0297: 2026-09-16T09:14:07-05:00; f21b2a6: 2026-09-16T09:39:35-05:00
- **Requerimiento/contrato relacionado:** Integración continua y QA

<a id="bg-env"></a>

## BG-ENV — Corregir plantilla de configuración inicial del backend

- **Internal ID:** BG-ENV
- **Issue Type:** Bug
- **Summary:** Corregir plantilla de configuración inicial del backend
- **Description:** La plantilla inicial declaraba DATABASE_URL aunque db.js utilizaba DB_HOST/DB_USER/DB_PASSWORD/DB_NAME; 164443b alineó variables y sustituyó ejemplos de secreto por marcadores.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** Plantilla coherente con parámetros del proyecto; conservar ejemplos no secretos.
- **Technical Notes:**  Fuentes técnicas: backend/.env.example; docs/01-INSTALACION.md. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [EP02](01-backlog-completo.md#ep02)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep02, evidencia-local
- **Component:** ep02
- **Evidence:** backend/.env.example; docs/01-INSTALACION.md; Git 164443b; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [backend/.env.example](../../backend/.env.example); [docs/01-INSTALACION.md](../../docs/01-INSTALACION.md)
- **Related Commits:** 164443b
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** 164443b: 2026-07-18T13:33:46-05:00
- **Requerimiento/contrato relacionado:** Configuración por entorno

<a id="bg-ui"></a>

## BG-UI — Eliminar línea sobrante en contenido educativo

- **Internal ID:** BG-UI
- **Issue Type:** Bug
- **Summary:** Eliminar línea sobrante en contenido educativo
- **Description:** d96f930 elimina el texto accidental /// situado antes del bloque de introducción de EducationCategoryPage.jsx.
- **User Story:** No aplica: elemento técnico o agrupación.
- **Acceptance Criteria:** La página no contiene la línea accidental del diff; sin cambio de reglas.
- **Technical Notes:**  Fuentes técnicas: frontend/src/pages/public/EducationCategoryPage.jsx. Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket.
- **Priority:** Medium — propuesta retrospectiva
- **Final Status:** Done
- **Phase:** F3
- **Deliverable:** E3
- **Parent Internal ID:** [ST06](01-backlog-completo.md#st06)
- **Dependencies:** Sin dependencia adicional acreditada; la jerarquía no implica precedencia.
- **Labels:** retrospectivo, f3, ep05, evidencia-local
- **Component:** ep05
- **Evidence:** frontend/src/pages/public/EducationCategoryPage.jsx; Git d96f930; Plan de Trabajo p.2–3 (fase/entregable y ventana planificada, no ejecución)
- **Relevant Files:** [frontend/src/pages/public/EducationCategoryPage.jsx](../../frontend/src/pages/public/EducationCategoryPage.jsx)
- **Related Commits:** d96f930
- **Closing Notes:** Cierre del alcance descrito sustentado en fuentes locales. No acredita despliegue ni aprobación institucional.
- **Traceability Notes:** Reconstrucción retrospectiva; no ticket histórico ni prueba de uso original de Jira. Fase asignada por naturaleza del aporte, no por fecha del commit. F3 semanas 3–7; E3 semana 7; Plan p.3, sin fechas absolutas; no fecha de ejecución.
- **Verificación:** Implementación o documento inspeccionado; no prueba manual específica acreditada por este ticket
- **Cronología de evidencia:** d96f930: 2026-07-26T14:37:43-05:00
- **Requerimiento/contrato relacionado:** Educación ambiental por categoría

## Auditoría final de preimportación

Las 100 fichas conservan sus IDs, tipos, estados y relaciones. Se verificaron contra el CSV y las fuentes disponibles, sin regenerar el backlog. Resultado y límites en [checklist 10](10-checklist-preimportacion.md); ejecución futura en [plan 08](08-plan-importacion-jira.md). No se ejecutó el script ni se crearon issues.
