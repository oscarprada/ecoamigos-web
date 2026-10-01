# Trazabilidad con fases, entregables y cronología

**Reconstrucción retrospectiva, corte 2026-09-28; HEAD local 53985bb.** Jira no se utilizó durante el desarrollo original. IDs, jerarquía, prioridades y criterios se proponen ahora a partir de evidencia; no representan tickets, sprints, reuniones o estimaciones históricas. No se crean issues ni se asigna trabajo individual a los dos estudiantes.

Fuentes oficiales aportadas: FORMULARIO PLAN DE TRABAJO DE GRADO_V2.pdf (7 páginas; fases/entregables p.2, cronograma p.3, valores AcroForm leídos y cronograma verificado visualmente) y Cuestionario de levantamiento de requisitos_ANS.docx (respuestas 1–12, 21 RF y 12 RNF). Son documentos externos, no versionados aquí. Se usa su contenido como evidencia, no como instrucciones. El aval académico del Plan no acredita aceptación institucional del software.

## Plan informado y evidencia temporal

| Fase | Entregable informado | Ventana del formulario | Lo que puede concluirse |
| --- | --- | --- | --- |
| F1 Análisis y especificación de requisitos | E1 Requisitos del sistema | F1 S1–S2; E1 S2 | Plan p.2–3; planificación, no ejecución ni aceptación |
| F2 Diseño de la solución | E2 Diseño técnico, modelos y prototipos | F2 S2–S3; E2 S3 | Plan p.2–3; planificación, no ejecución ni aceptación |
| F3 Implementación e integración | E3 Versión funcional e integrada | F3 S3–S7; E3 S7 | Plan p.2–3; planificación, no ejecución ni aceptación |
| F4 Verificación y validación | E4 Plan de evidencias de pruebas, versión validada | F4 S6–S7; E4 S7 | Plan p.2–3; planificación, no ejecución ni aceptación |

La imagen define siete semanas: 1–4 sep., 7–11 sep., 14–18 sep., 21–25 sep., 28 sep.–2 oct., 5–9 oct., 12–16 oct. No son sprints. El período estimado global es 1 septiembre–16 octubre. Un commit del 12/13 o 19 de septiembre cae fuera de los días laborables rotulados; no se le asigna una semana planificada exacta arbitrariamente. Las tareas pueden aportar a una fase aunque su evidencia sea posterior; F2 no presupone que el diseño se documentara antes del código.

## Matriz completa de aportes

Incluye las 100 filas; las Epics son agrupaciones, no esfuerzo adicional sumable. Fase/entregable son clasificación retrospectiva principal; el orden de ejecución se obtiene de Git y dependencias, no de ordenar F1–F4.

| Fase | Entregable | Epic | Story/Task/Bug o agrupación | Evidencia | Estado |
| --- | --- | --- | --- | --- | --- |
| F1 | E1 | EP01 | [EP01](01-backlog-completo.md#ep01) — Requisitos y decisiones de alcance | 73e52b0, 83ca4d6; README.md | Partially Completed |
| F2 | E2 | EP02 | [EP02](01-backlog-completo.md#ep02) — Arquitectura y persistencia PostgreSQL | 3c10ac7, 3b27ab6, 83ca4d6; docs/02-ARQUITECTURA.md | Done |
| F3 | E3 | EP03 | [EP03](01-backlog-completo.md#ep03) — Acceso, sesión y recuperación de cuentas | 3c10ac7, 42c5643, d51387d; backend/src/controllers/authController.js | Partially Completed |
| F3 | E3 | EP04 | [EP04](01-backlog-completo.md#ep04) — Administración de usuarios, equipos y períodos | 3c10ac7, c4e6208, fefb3fa; backend/src/controllers/adminController.js | Done |
| F3 | E3 | EP05 | [EP05](01-backlog-completo.md#ep05) — Educación ambiental y contenidos multimedia | 8c118e4, c4e6208, c47e38b, a123244; frontend/src/pages/public/EducationCategoryPage.jsx | Done |
| F3 | E3 | EP06 | [EP06](01-backlog-completo.md#ep06) — Registro de reciclaje, historial y evidencias | 7bfffed, e511ccb, e359a6b, a96aa30; backend/src/controllers/recyclingController.js | Partially Completed |
| F3 | E3 | EP07 | [EP07](01-backlog-completo.md#ep07) — Revisión, catálogo de puntos y ranking | af9efcd, 4a915b2, 8badd9f, 1821e21; backend/src/controllers/recyclingController.js | Partially Completed |
| F3 | E3 | EP08 | [EP08](01-backlog-completo.md#ep08) — Estadísticas y reportes XLSX | 36b367c, ae5ac63, a291519, 91178e0, fc3389a, 78c0297; backend/src/controllers/exportController.js | Done |
| F3 | E3 | EP09 | [EP09](01-backlog-completo.md#ep09) — Interfaz, navegación y accesibilidad | 4abd97e, 9637dd8, 73e52b0, 5412992, 21f418e; frontend/src/layouts/AppLayout.jsx | Done |
| F4 | E4 | EP10 | [EP10](01-backlog-completo.md#ep10) — Seguridad transversal y aseguramiento de calidad | 294563f, 78c0297, f21b2a6; docs/09-CALIDAD-Y-PENDIENTES.md | Partially Completed |
| F4 | E4 | EP11 | [EP11](01-backlog-completo.md#ep11) — Documentación y preparación de entrega institucional | 73e52b0, 83ca4d6, 53985bb; docs/16-ENTREGA-INSTITUCIONAL.md | Partially Completed |
| F3 | E3 | EP03 | [ST01](01-backlog-completo.md#st01) — Acceder a la aplicación según mi rol | 3c10ac7, af9efcd, d51387d; backend/src/controllers/authController.js | Done |
| F3 | E3 | EP03 | [ST02](01-backlog-completo.md#st02) — Recuperar acceso mediante un enlace temporal | 42c5643, d51387d; backend/src/controllers/passwordRecoveryController.js | Partially Completed |
| F3 | E3 | EP04 | [ST03](01-backlog-completo.md#st03) — Administrar cuentas y su asignación | af9efcd, 36af9d0, fefb3fa; backend/src/controllers/adminController.js | Done |
| F3 | E3 | EP04 | [ST04](01-backlog-completo.md#st04) — Mantener equipos y dependencias | 3c10ac7, c4e6208, fefb3fa; backend/src/controllers/adminController.js | Done |
| F3 | E3 | EP04 | [ST05](01-backlog-completo.md#st05) — Crear períodos para la campaña | 3c10ac7, c4e6208, 11eb099; backend/src/controllers/adminController.js | Done |
| F3 | E3 | EP05 | [ST06](01-backlog-completo.md#st06) — Consultar educación ambiental publicada | 8c118e4, c47e38b, a123244, a96aa30; frontend/src/pages/public/EducationCategoryPage.jsx | Done |
| F3 | E3 | EP05 | [ST07](01-backlog-completo.md#st07) — Gestionar contenidos educativos | 8c118e4, c4e6208, a96aa30; frontend/src/pages/admin/AdminContentPage.jsx | Done |
| F3 | E3 | EP06 | [ST08](01-backlog-completo.md#st08) — Registrar reciclaje para mi equipo | af9efcd, 7bfffed, e511ccb, e359a6b, 8badd9f; frontend/src/pages/leader/RegisterRecyclingPage.jsx | Partially Completed |
| F3 | E3 | EP06 | [ST09](01-backlog-completo.md#st09) — Consultar mi historial y evidencias | 3c10ac7, c4e6208, a96aa30; frontend/src/pages/leader/LeaderDashboard.jsx | Done |
| F3 | E3 | EP07 | [ST10](01-backlog-completo.md#st10) — Aprobar o rechazar actividades pendientes | 7bfffed, a9de10c, 4a915b2; frontend/src/pages/admin/AdminReviewsPage.jsx | Done |
| F3 | E3 | EP07 | [ST11](01-backlog-completo.md#st11) — Consultar clasificación de equipos | 3c10ac7, 7bfffed, 1821e21; frontend/src/pages/public/RankingPage.jsx | Done |
| F3 | E3 | EP08 | [ST12](01-backlog-completo.md#st12) — Consultar estadísticas de seguimiento | 36b367c, 91178e0, fc3389a; frontend/src/pages/admin/AdminDashboard.jsx | Done |
| F3 | E3 | EP08 | [ST13](01-backlog-completo.md#st13) — Descargar un reporte XLSX de registros | ae5ac63, a291519, 78c0297; backend/src/controllers/exportController.js | Done |
| F3 | E3 | EP09 | [ST14](01-backlog-completo.md#st14) — Navegar y recibir respuestas claras de la interfaz | 5e8f4c9, 5412992, dd1e55b, 60d8c3a, 21f418e; frontend/src/components/LoadState.jsx | Done |
| F3 | E3 | EP07 | [ST15](01-backlog-completo.md#st15) — Consultar premios de la campaña — histórico | 3c10ac7, 1821e21; backend/tests/f01-f03-retirement.test.js | Cancelled |
| F3 | E3 | EP07 | [ST16](01-backlog-completo.md#st16) — Consultar ganadores anteriores — histórico | 3c10ac7, af9efcd, 1821e21; backend/tests/f01-f03-retirement.test.js | Cancelled |
| F3 | E3 | EP08 | [ST17](01-backlog-completo.md#st17) — Consultar equivalencias ambientales — histórico | da6ab9a, 712a9b3, 308f070, fc3389a; docs/12-METODOLOGIA-INDICADORES.md | Cancelled |
| F1 | E1 | EP01 | [TK01](01-backlog-completo.md#tk01) — Consolidar contratos funcionales y decisiones de alcance | 73e52b0, 83ca4d6; README.md | Done |
| F1 | E1 | EP01 | [TK02](01-backlog-completo.md#tk02) — Formalizar validación institucional de requisitos reconstruidos | Brecha documentada; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Pending Institutional Decision |
| F2 | E2 | EP02 | [TK03](01-backlog-completo.md#tk03) — Documentar arquitectura y C4 niveles 1–3 | 73e52b0, 83ca4d6; docs/02-ARQUITECTURA.md | Done |
| F2 | E2 | EP02 | [TK04](01-backlog-completo.md#tk04) — Documentar modelo relacional y restricciones PostgreSQL | 3c10ac7, 3b27ab6, 83ca4d6; database/schema.sql | Done |
| F2 | E2 | EP02 | [TK05](01-backlog-completo.md#tk05) — Describir pantallas y flujos del diseño implementado | 73e52b0, 83ca4d6; docs/05-FRONTEND.md | Done |
| F3 | E3 | EP02 | [TK06](01-backlog-completo.md#tk06) — Integrar React/Vite, Express y conexión PostgreSQL | 3c10ac7, af9efcd; frontend/vite.config.js | Done |
| F3 | E3 | EP06 | [TK07](01-backlog-completo.md#tk07) — Implementar endpoint de alta e historial de reciclaje | 3c10ac7, af9efcd, 7bfffed; backend/src/controllers/recyclingController.js | Done |
| F3 | E3 | EP06 | [TK08](01-backlog-completo.md#tk08) — Implementar formulario multipart de actividad | af9efcd, 7bfffed, 5e8f4c9; frontend/src/pages/leader/RegisterRecyclingPage.jsx | Done |
| F3 | E3 | EP07 | [TK09](01-backlog-completo.md#tk09) — Implementar panel de pendientes e historial administrativo | 7bfffed, a9de10c, 5e8f4c9; frontend/src/pages/admin/AdminReviewsPage.jsx | Done |
| F3 | E3 | EP07 | [TK10](01-backlog-completo.md#tk10) — Integrar lectura de catálogo y puntos aprobados | af9efcd, 0afbcc9; backend/src/controllers/recyclingController.js | Done |
| F3 | E3 | EP05 | [TK11](01-backlog-completo.md#tk11) — Implementar contenido multimedia y visor por categoría | 8c118e4, c47e38b, a123244, 9224718; frontend/src/pages/public/EducationCategoryPage.jsx | Done |
| F3 | E3 | EP05 | [TK12](01-backlog-completo.md#tk12) — Integrar formularios y operaciones CMS | 8c118e4, c4e6208, a96aa30; frontend/src/pages/admin/AdminContentPage.jsx | Done |
| F3 | E3 | EP08 | [TK13](01-backlog-completo.md#tk13) — Integrar descarga XLSX y errores Blob | ae5ac63, a291519, 78c0297; frontend/src/pages/admin/AdminDashboard.jsx | Done |
| F3 | E3 | EP09 | [TK14](01-backlog-completo.md#tk14) — Incorporar identidad visual, iconografía y aliados | 4abd97e, 9637dd8, 3e71d43, 308f070, 9224718, bcbfa07, 73e52b0; frontend/src/pages/public/HomePage.jsx | Done |
| F3 | E3 | EP02 | [TK15](01-backlog-completo.md#tk15) — Parametrizar URL pública del backend en frontend | c894e77; frontend/src/api/client.js | Done |
| F3 | E3 | EP10 | [TK16](01-backlog-completo.md#tk16) — Incorporar logging y posteriormente acotarlo | 7570567, 294563f; backend/src/utils/logger.js | Done |
| F4 | E4 | EP10 | [TK17](01-backlog-completo.md#tk17) — Implementar pruebas de instalación y migraciones aisladas | 3b27ab6, 11eb099, 42c5643, d51387d; backend/tests/installation.test.js | Done |
| F4 | E4 | EP10 | [TK18](01-backlog-completo.md#tk18) — Implementar regresión de concurrencia y rollback | 4a915b2, 11eb099, e511ccb, 36af9d0, 42c5643, a96aa30; backend/tests/f08-review.test.js | Done |
| F4 | E4 | EP10 | [TK19](01-backlog-completo.md#tk19) — Implementar regresión frontend de interacción y sesión | 5412992, dd1e55b, 60d8c3a, 21f418e, d51387d, a96aa30, 78c0297; frontend/tests/f17-ui.test.js | Done |
| F4 | E4 | EP10 | [TK20](01-backlog-completo.md#tk20) — Automatizar instalación, pruebas, build y checks en CI | 78c0297, f21b2a6; .github/workflows/ci.yml | Done |
| F4 | E4 | EP10 | [TK21](01-backlog-completo.md#tk21) — Conservar matriz manual histórica y T01–T28 vigente | 73e52b0, 83ca4d6; docs/09-CALIDAD-Y-PENDIENTES.md | Done |
| F4 | E4 | EP10 | [TK22](01-backlog-completo.md#tk22) — Completar evidencia manual de interfaz, multimedia y restauración | 83ca4d6; docs/09-CALIDAD-Y-PENDIENTES.md | Partially Completed |
| F4 | E4 | EP11 | [TK23](01-backlog-completo.md#tk23) — Consolidar manuales y trazabilidad de decisiones | 73e52b0, 83ca4d6, 53985bb; README.md | Done |
| F4 | E4 | EP11 | [TK24](01-backlog-completo.md#tk24) — Documentar instalación, backup y restauración coherente | 73e52b0, 3b27ab6, 83ca4d6; docs/01-INSTALACION.md | Done |
| F3 | E3 | EP03 | [TK25](01-backlog-completo.md#tk25) — Definir proveedor y entrega institucional de recuperación | 42c5643; backend/src/services/passwordResetDelivery.js | Pending Institutional Decision |
| F4 | E4 | EP11 | [TK26](01-backlog-completo.md#tk26) — Definir infraestructura, custodia y recepción institucional | 83ca4d6; docs/08-OPERACION.md | Pending Institutional Decision |
| F4 | E4 | EP10 | [TK27](01-backlog-completo.md#tk27) — Registrar auditoría de dependencias y exposición por cadena | 78c0297, f21b2a6; docs/13-AUDITORIA-DEPENDENCIAS-S12.md | Done |
| F4 | E4 | EP02 | [BG-D01](01-backlog-completo.md#bg-d01) — D01: Conciliar definiciones SQL e instalación histórica | 3b27ab6; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP04 | [BG-D02](01-backlog-completo.md#bg-d02) — D02: Eliminar doble escritura de password y password_hash | 3b27ab6; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP05 | [BG-D03](01-backlog-completo.md#bg-d03) — D03: Conciliar categorías y tipos de contenido | 3b27ab6; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP07 | [BG-D04](01-backlog-completo.md#bg-d04) — D04: Restituir catálogo y referencias necesarias para aprobar | 3b27ab6; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP02 | [BG-D05](01-backlog-completo.md#bg-d05) — D05: Conservar instrucciones de evidencia como texto | 3b27ab6; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F1 | E1 | EP01 | [TK-D06](01-backlog-completo.md#tk-d06) — D06: Autorizar catálogo de Dependencias institucionales | 3b27ab6, 8badd9f; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Pending Institutional Decision |
| F4 | E4 | EP04 | [BG-D07](01-backlog-completo.md#bg-d07) — D07: Sustituir credenciales seed inconsistentes por bootstrap explícito | 3b27ab6; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP02 | [BG-D08](01-backlog-completo.md#bg-d08) — D08: Retirar datos de demostración prefijados del seed | 3b27ab6; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP02 | [BG-D09](01-backlog-completo.md#bg-d09) — D09: Evitar duplicación o sustitución de datos al repetir bootstrap | 3b27ab6; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP02 | [BG-D10](01-backlog-completo.md#bg-d10) — D10: Corregir importación absoluta y duplicados de catálogo | 3b27ab6; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP07 | [BG-F01](01-backlog-completo.md#bg-f01) — F01: Retirar pantalla de ganadores con contrato incompatible | 1821e21; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP07 | [BG-F02](01-backlog-completo.md#bg-f02) — F02: Retirar agregado winners sin definición autorizada | 1821e21; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP07 | [BG-F03](01-backlog-completo.md#bg-f03) — F03: Retirar exposición de premios inactivos y módulo de premios | 1821e21; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP07 | [BG-F04](01-backlog-completo.md#bg-f04) — F04: Eliminar fórmula de puntos obsoleta | 0afbcc9; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP06 | [BG-F05](01-backlog-completo.md#bg-f05) — F05: Rechazar referencias de catálogo manipuladas | 8badd9f; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Partially Completed |
| F1 | E1 | EP01 | [TK-F06](01-backlog-completo.md#tk-f06) — F06: Precisar metadatos descriptivos sin automatización inventada | 8badd9f; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP07 | [BG-F07](01-backlog-completo.md#bg-f07) — F07: Resolver discrepancias de decimales y referencia orgánica | 8badd9f; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Partially Completed |
| F4 | E4 | EP07 | [BG-F08](01-backlog-completo.md#bg-f08) — F08: Impedir revisiones repetidas y carreras entre revisores | 4a915b2; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP04 | [BG-F09](01-backlog-completo.md#bg-f09) — F09: Evitar pérdida o multiplicidad de período activo | 11eb099; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP06 | [BG-F10](01-backlog-completo.md#bg-f10) — F10: Validar período y fecha de actividad transaccionalmente | e511ccb; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP06 | [BG-F11](01-backlog-completo.md#bg-f11) — F11: Restringir registro a líderes con equipo válido | e359a6b, d51387d; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP04 | [BG-F12](01-backlog-completo.md#bg-f12) — F12: Aplicar cupo de 15 cuentas en API y bootstrap | 36af9d0; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP08 | [BG-F13](01-backlog-completo.md#bg-f13) — F13: Excluir estados y unidades incompatibles de cantidades en kg | 91178e0; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP08 | [BG-F14](01-backlog-completo.md#bg-f14) — F14: Retirar equivalencias ambientales no sustentadas | fc3389a; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F3 | E3 | EP04 | [TK-F15](01-backlog-completo.md#tk-f15) — F15: Implementar mantenimiento administrativo limitado autorizado | fefb3fa; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F3 | E3 | EP03 | [TK-F16](01-backlog-completo.md#tk-f16) — F16: Implementar mecanismo técnico de recuperación temporal | 42c5643, d51387d; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP09 | [BG-F17](01-backlog-completo.md#bg-f17) — F17: Manejar rechazos UI y rutas desconocidas | 5412992; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP09 | [BG-F18](01-backlog-completo.md#bg-f18) — F18: Estabilizar toast para evitar repetición de efectos | dd1e55b; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP06 | [BG-F19](01-backlog-completo.md#bg-f19) — F19: Vaciar input nativo de evidencia solo tras éxito | 60d8c3a; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP09 | [BG-F20](01-backlog-completo.md#bg-f20) — F20: Corregir foco de modal y navegación de menú móvil | 21f418e; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP03 | [BG-S01](01-backlog-completo.md#bg-s01) — S01: Actualizar identidad autorizada y revocar JWT tras reset | d51387d; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP03 | [BG-S02](01-backlog-completo.md#bg-s02) — S02: Mitigar manejo de sesión manteniendo abierto riesgo localStorage | d51387d; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Partially Completed |
| F4 | E4 | EP03 | [BG-S03](01-backlog-completo.md#bg-s03) — S03: Limitar intentos de login y recuperación por IP | d51387d; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP06 | [BG-S04](01-backlog-completo.md#bg-s04) — S04: Acotar cargas y sustituir nombres manipulables | a96aa30; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP06 | [BG-S05](01-backlog-completo.md#bg-s05) — S05: Cerrar exposición estática de evidencias y borradores | a96aa30; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP05 | [BG-S06](01-backlog-completo.md#bg-s06) — S06: Coordinar limpieza de adjuntos con transacciones y referencias | a96aa30; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP06 | [BG-S07](01-backlog-completo.md#bg-s07) — S07: Validar formato y firma además del MIME declarado | a96aa30; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP10 | [BG-S08](01-backlog-completo.md#bg-s08) — S08: Configurar orígenes CORS por entorno | 294563f; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP10 | [BG-S09](01-backlog-completo.md#bg-s09) — S09: Parametrizar conexión PostgreSQL con TLS verificado | 294563f; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP10 | [BG-S10](01-backlog-completo.md#bg-s10) — S10: Sustituir logs síncronos y excesivos por eventos acotados | 294563f; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP08 | [BG-S11](01-backlog-completo.md#bg-s11) — S11: Limitar exportación y proteger concurrencia y celdas XLSX | 78c0297; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Done |
| F4 | E4 | EP10 | [BG-S12](01-backlog-completo.md#bg-s12) — S12: Resolver riesgos pendientes de dependencias conservando CI validado | 78c0297, f21b2a6; docs/15-TRAZABILIDAD-Y-DECISIONES.md | Partially Completed |
| F4 | E4 | EP10 | [BG-CI](01-backlog-completo.md#bg-ci) — Corregir arranque PostgreSQL de las 13 suites en GitHub Actions | 78c0297, f21b2a6; backend/tests/helpers/postgresCluster.js | Done |
| F3 | E3 | EP02 | [BG-ENV](01-backlog-completo.md#bg-env) — Corregir plantilla de configuración inicial del backend | 164443b; backend/.env.example | Done |
| F3 | E3 | EP05 | [BG-UI](01-backlog-completo.md#bg-ui) — Eliminar línea sobrante en contenido educativo | d96f930; frontend/src/pages/public/EducationCategoryPage.jsx | Done |

## Cronología completa del historial accesible

Ramas inspeccionadas: main y referencia local origin/main, ambas en 53985bb; sin otras ramas locales/remotas almacenadas. No se realizó fetch: no se afirma cobertura de ramas eliminadas, historial remoto nuevo o trabajo sin commit. Las 49 fechas de autor y committer coinciden en la metadata local. No prueban duración, autoría compartida ni validación institucional.

| Commit | Fecha registrada con zona | Cambio registrado | Elementos relacionados |
| --- | --- | --- | --- |
| 3c10ac7 | 2026-04-12T12:29:27-05:00 | Initial Commit- Ecoamigos web platform | [EP02](01-backlog-completo.md#ep02), [EP03](01-backlog-completo.md#ep03), [EP04](01-backlog-completo.md#ep04), [ST01](01-backlog-completo.md#st01), [ST04](01-backlog-completo.md#st04), [ST05](01-backlog-completo.md#st05), [ST09](01-backlog-completo.md#st09), [ST11](01-backlog-completo.md#st11), [ST15](01-backlog-completo.md#st15), [ST16](01-backlog-completo.md#st16), [TK04](01-backlog-completo.md#tk04), [TK06](01-backlog-completo.md#tk06), [TK07](01-backlog-completo.md#tk07) |
| af9efcd | 2026-04-12T16:56:55-05:00 | feat: sistema completo ecoamigos con autenticación, puntos y panel admin | [EP07](01-backlog-completo.md#ep07), [ST01](01-backlog-completo.md#st01), [ST03](01-backlog-completo.md#st03), [ST08](01-backlog-completo.md#st08), [ST16](01-backlog-completo.md#st16), [TK06](01-backlog-completo.md#tk06), [TK07](01-backlog-completo.md#tk07), [TK08](01-backlog-completo.md#tk08), [TK10](01-backlog-completo.md#tk10) |
| 7bfffed | 2026-05-08T21:23:07-05:00 | feat: flujo completo de reciclaje, validación y ranking funcional | [EP06](01-backlog-completo.md#ep06), [ST08](01-backlog-completo.md#st08), [ST10](01-backlog-completo.md#st10), [ST11](01-backlog-completo.md#st11), [TK07](01-backlog-completo.md#tk07), [TK08](01-backlog-completo.md#tk08), [TK09](01-backlog-completo.md#tk09) |
| 8c118e4 | 2026-05-09T11:44:58-05:00 | feat: módulo educativo dinámico con contenidos multimedia y categorías ambientales | [EP05](01-backlog-completo.md#ep05), [ST06](01-backlog-completo.md#st06), [ST07](01-backlog-completo.md#st07), [TK11](01-backlog-completo.md#tk11), [TK12](01-backlog-completo.md#tk12) |
| c4e6208 | 2026-05-09T14:29:03-05:00 | feat: cms educativo completo con edicion eliminacion dashboards y configuracion administrativa | [EP04](01-backlog-completo.md#ep04), [EP05](01-backlog-completo.md#ep05), [ST04](01-backlog-completo.md#st04), [ST05](01-backlog-completo.md#st05), [ST07](01-backlog-completo.md#st07), [ST09](01-backlog-completo.md#st09), [TK12](01-backlog-completo.md#tk12) |
| a9de10c | 2026-05-09T20:08:43-05:00 | feat: historial administrativo y validacion avanzada de reciclajes | [ST10](01-backlog-completo.md#st10), [TK09](01-backlog-completo.md#tk09) |
| 4abd97e | 2026-05-09T21:03:34-05:00 | feat: responsive institucional y mejoras visuales generales | [EP09](01-backlog-completo.md#ep09), [TK14](01-backlog-completo.md#tk14) |
| c47e38b | 2026-05-10T17:02:44-05:00 | feat: multimedia educativa con miniaturas y visor modal | [EP05](01-backlog-completo.md#ep05), [ST06](01-backlog-completo.md#st06), [TK11](01-backlog-completo.md#tk11) |
| 5e8f4c9 | 2026-05-12T18:42:17-05:00 | feat: mejoras UX institucionales y validación avanzada | [ST14](01-backlog-completo.md#st14), [TK08](01-backlog-completo.md#tk08), [TK09](01-backlog-completo.md#tk09) |
| 36b367c | 2026-05-12T19:05:25-05:00 | feat: dashboard ejecutivo y estadísticas institucionales | [EP08](01-backlog-completo.md#ep08), [ST12](01-backlog-completo.md#st12) |
| da6ab9a | 2026-05-12T19:27:51-05:00 | feat: indicadores ambientales y analítica institucional | [ST17](01-backlog-completo.md#st17) |
| 712a9b3 | 2026-05-14T11:07:32-05:00 | feat: indicadores ambientales y dashboard ejecutivo institucional | [ST17](01-backlog-completo.md#st17) |
| 9637dd8 | 2026-05-19T18:42:48-05:00 | style: rediseño visual del home y nueva identidad ecoamigos | [EP09](01-backlog-completo.md#ep09), [TK14](01-backlog-completo.md#tk14) |
| 7570567 | 2026-05-19T20:27:39-05:00 | feat: sistema de logs y trazabilidad institucional | [TK16](01-backlog-completo.md#tk16) |
| ae5ac63 | 2026-06-29T16:37:18-05:00 | feat: agregar exportación de reportes Excel | [EP08](01-backlog-completo.md#ep08), [ST13](01-backlog-completo.md#st13), [TK13](01-backlog-completo.md#tk13) |
| 3e71d43 | 2026-06-29T20:06:47-05:00 | feat: actualizar iconografía y orden de categorías ambientales | [TK14](01-backlog-completo.md#tk14) |
| a291519 | 2026-06-30T10:28:16-05:00 | feat: implementar exportación de reportes con ExcelJS | [EP08](01-backlog-completo.md#ep08), [ST13](01-backlog-completo.md#st13), [TK13](01-backlog-completo.md#tk13) |
| a123244 | 2026-06-30T13:40:50-05:00 | feat: mejorar educación ambiental y exportación de reportes | [EP05](01-backlog-completo.md#ep05), [ST06](01-backlog-completo.md#st06), [TK11](01-backlog-completo.md#tk11) |
| 308f070 | 2026-07-09T10:20:11-05:00 | feat: agregar sección de aliados institucionales en la página principal | [ST17](01-backlog-completo.md#st17), [TK14](01-backlog-completo.md#tk14) |
| 9224718 | 2026-07-18T13:11:06-05:00 | Actualiza diseño y contenido educativo | [TK11](01-backlog-completo.md#tk11), [TK14](01-backlog-completo.md#tk14) |
| 164443b | 2026-07-18T13:33:46-05:00 | Corrige plantilla de configuracion del backend | [BG-ENV](01-backlog-completo.md#bg-env) |
| bcbfa07 | 2026-07-25T11:04:57-05:00 | Reubica accesos de Ecoamigos en la sección de residuos | [TK14](01-backlog-completo.md#tk14) |
| d96f930 | 2026-07-26T14:37:43-05:00 | Elimina línea sobrante en contenido educativo | [BG-UI](01-backlog-completo.md#bg-ui) |
| c894e77 | 2026-07-26T15:01:04-05:00 | Prepara frontend para URL de backend en producción | [TK15](01-backlog-completo.md#tk15) |
| 73e52b0 | 2026-09-07T19:58:08-05:00 | Documenta Ecoamigos y actualiza estilos | [EP01](01-backlog-completo.md#ep01), [EP09](01-backlog-completo.md#ep09), [EP11](01-backlog-completo.md#ep11), [TK01](01-backlog-completo.md#tk01), [TK03](01-backlog-completo.md#tk03), [TK05](01-backlog-completo.md#tk05), [TK14](01-backlog-completo.md#tk14), [TK21](01-backlog-completo.md#tk21), [TK23](01-backlog-completo.md#tk23), [TK24](01-backlog-completo.md#tk24) |
| 3b27ab6 | 2026-09-08T19:53:17-05:00 | Corrige esquema y migracion segura D01-D10 | [EP02](01-backlog-completo.md#ep02), [TK04](01-backlog-completo.md#tk04), [TK17](01-backlog-completo.md#tk17), [TK24](01-backlog-completo.md#tk24), [BG-D01](01-backlog-completo.md#bg-d01), [BG-D02](01-backlog-completo.md#bg-d02), [BG-D03](01-backlog-completo.md#bg-d03), [BG-D04](01-backlog-completo.md#bg-d04), [BG-D05](01-backlog-completo.md#bg-d05), [TK-D06](01-backlog-completo.md#tk-d06), [BG-D07](01-backlog-completo.md#bg-d07), [BG-D08](01-backlog-completo.md#bg-d08), [BG-D09](01-backlog-completo.md#bg-d09), [BG-D10](01-backlog-completo.md#bg-d10) |
| 1821e21 | 2026-09-08T20:19:49-05:00 | Retira funcionalidad de premios y ganadores F01-F03 | [EP07](01-backlog-completo.md#ep07), [ST11](01-backlog-completo.md#st11), [ST15](01-backlog-completo.md#st15), [ST16](01-backlog-completo.md#st16), [BG-F01](01-backlog-completo.md#bg-f01), [BG-F02](01-backlog-completo.md#bg-f02), [BG-F03](01-backlog-completo.md#bg-f03) |
| 0afbcc9 | 2026-09-08T20:31:20-05:00 | Elimina calculo de puntos obsoleto F04 | [TK10](01-backlog-completo.md#tk10), [BG-F04](01-backlog-completo.md#bg-f04) |
| 8badd9f | 2026-09-08T21:02:29-05:00 | Valida catalogo y documenta reglas F05-F07 | [EP07](01-backlog-completo.md#ep07), [ST08](01-backlog-completo.md#st08), [TK-D06](01-backlog-completo.md#tk-d06), [BG-F05](01-backlog-completo.md#bg-f05), [TK-F06](01-backlog-completo.md#tk-f06), [BG-F07](01-backlog-completo.md#bg-f07) |
| 4a915b2 | 2026-09-09T19:43:37-05:00 | Protege revision transaccional de registros F08 | [EP07](01-backlog-completo.md#ep07), [ST10](01-backlog-completo.md#st10), [TK18](01-backlog-completo.md#tk18), [BG-F08](01-backlog-completo.md#bg-f08) |
| 11eb099 | 2026-09-09T19:57:29-05:00 | Asegura gestion atomica del periodo activo F09 | [ST05](01-backlog-completo.md#st05), [TK17](01-backlog-completo.md#tk17), [TK18](01-backlog-completo.md#tk18), [BG-F09](01-backlog-completo.md#bg-f09) |
| e511ccb | 2026-09-09T20:13:42-05:00 | Valida periodo y fecha de registros F10 | [EP06](01-backlog-completo.md#ep06), [ST08](01-backlog-completo.md#st08), [TK18](01-backlog-completo.md#tk18), [BG-F10](01-backlog-completo.md#bg-f10) |
| e359a6b | 2026-09-09T20:22:50-05:00 | Restringe registro de reciclaje a lideres F11 | [EP06](01-backlog-completo.md#ep06), [ST08](01-backlog-completo.md#st08), [BG-F11](01-backlog-completo.md#bg-f11) |
| 36af9d0 | 2026-09-12T14:12:38-05:00 | Protege limite maximo de usuarios F12 | [ST03](01-backlog-completo.md#st03), [TK18](01-backlog-completo.md#tk18), [BG-F12](01-backlog-completo.md#bg-f12) |
| 91178e0 | 2026-09-12T14:27:34-05:00 | Corrige estadisticas por estado y unidad F13 | [EP08](01-backlog-completo.md#ep08), [ST12](01-backlog-completo.md#st12), [BG-F13](01-backlog-completo.md#bg-f13) |
| fc3389a | 2026-09-12T14:53:43-05:00 | Retira indicadores ambientales no sustentados F14 | [EP08](01-backlog-completo.md#ep08), [ST12](01-backlog-completo.md#st12), [ST17](01-backlog-completo.md#st17), [BG-F14](01-backlog-completo.md#bg-f14) |
| fefb3fa | 2026-09-12T19:26:47-05:00 | Completa administracion segura F15 | [EP04](01-backlog-completo.md#ep04), [ST03](01-backlog-completo.md#st03), [ST04](01-backlog-completo.md#st04), [TK-F15](01-backlog-completo.md#tk-f15) |
| 42c5643 | 2026-09-12T19:52:19-05:00 | Implementa recuperacion segura de contrasena F16 | [EP03](01-backlog-completo.md#ep03), [ST02](01-backlog-completo.md#st02), [TK17](01-backlog-completo.md#tk17), [TK18](01-backlog-completo.md#tk18), [TK25](01-backlog-completo.md#tk25), [TK-F16](01-backlog-completo.md#tk-f16) |
| 5412992 | 2026-09-13T10:45:54-05:00 | Mejora manejo de errores y rutas 404 F17 | [EP09](01-backlog-completo.md#ep09), [ST14](01-backlog-completo.md#st14), [TK19](01-backlog-completo.md#tk19), [BG-F17](01-backlog-completo.md#bg-f17) |
| dd1e55b | 2026-09-13T11:05:28-05:00 | Estabiliza notificaciones y evita consultas repetidas F18 | [ST14](01-backlog-completo.md#st14), [TK19](01-backlog-completo.md#tk19), [BG-F18](01-backlog-completo.md#bg-f18) |
| 60d8c3a | 2026-09-13T11:18:50-05:00 | Corrige reinicio del archivo de evidencia F19 | [ST14](01-backlog-completo.md#st14), [TK19](01-backlog-completo.md#tk19), [BG-F19](01-backlog-completo.md#bg-f19) |
| 21f418e | 2026-09-13T11:49:57-05:00 | Mejora manejo de interfaz y accesibilidad F17-F20 | [EP09](01-backlog-completo.md#ep09), [ST14](01-backlog-completo.md#st14), [TK19](01-backlog-completo.md#tk19), [BG-F20](01-backlog-completo.md#bg-f20) |
| d51387d | 2026-09-14T20:03:18-05:00 | Refuerza autenticacion y sesiones S01-S03 | [EP03](01-backlog-completo.md#ep03), [ST01](01-backlog-completo.md#st01), [ST02](01-backlog-completo.md#st02), [TK17](01-backlog-completo.md#tk17), [TK19](01-backlog-completo.md#tk19), [BG-F11](01-backlog-completo.md#bg-f11), [TK-F16](01-backlog-completo.md#tk-f16), [BG-S01](01-backlog-completo.md#bg-s01), [BG-S02](01-backlog-completo.md#bg-s02), [BG-S03](01-backlog-completo.md#bg-s03) |
| a96aa30 | 2026-09-15T20:36:09-05:00 | Protege archivos y evidencias S04-S07 | [EP06](01-backlog-completo.md#ep06), [ST06](01-backlog-completo.md#st06), [ST07](01-backlog-completo.md#st07), [ST09](01-backlog-completo.md#st09), [TK12](01-backlog-completo.md#tk12), [TK18](01-backlog-completo.md#tk18), [TK19](01-backlog-completo.md#tk19), [BG-S04](01-backlog-completo.md#bg-s04), [BG-S05](01-backlog-completo.md#bg-s05), [BG-S06](01-backlog-completo.md#bg-s06), [BG-S07](01-backlog-completo.md#bg-s07) |
| 294563f | 2026-09-15T21:04:17-05:00 | Configura entorno y logging seguro S08-S10 | [EP10](01-backlog-completo.md#ep10), [TK16](01-backlog-completo.md#tk16), [BG-S08](01-backlog-completo.md#bg-s08), [BG-S09](01-backlog-completo.md#bg-s09), [BG-S10](01-backlog-completo.md#bg-s10) |
| 78c0297 | 2026-09-16T09:14:07-05:00 | Optimiza exportaciones e incorpora CI S11-S12 | [EP08](01-backlog-completo.md#ep08), [EP10](01-backlog-completo.md#ep10), [ST13](01-backlog-completo.md#st13), [TK13](01-backlog-completo.md#tk13), [TK19](01-backlog-completo.md#tk19), [TK20](01-backlog-completo.md#tk20), [TK27](01-backlog-completo.md#tk27), [BG-S11](01-backlog-completo.md#bg-s11), [BG-S12](01-backlog-completo.md#bg-s12), [BG-CI](01-backlog-completo.md#bg-ci) |
| f21b2a6 | 2026-09-16T09:39:35-05:00 | Corrige infraestructura PostgreSQL del CI | [EP10](01-backlog-completo.md#ep10), [TK20](01-backlog-completo.md#tk20), [TK27](01-backlog-completo.md#tk27), [BG-S12](01-backlog-completo.md#bg-s12), [BG-CI](01-backlog-completo.md#bg-ci) |
| 83ca4d6 | 2026-09-19T15:24:35-05:00 | Consolida documentación técnica y modelo C4 | [EP01](01-backlog-completo.md#ep01), [EP02](01-backlog-completo.md#ep02), [EP11](01-backlog-completo.md#ep11), [TK01](01-backlog-completo.md#tk01), [TK03](01-backlog-completo.md#tk03), [TK04](01-backlog-completo.md#tk04), [TK05](01-backlog-completo.md#tk05), [TK21](01-backlog-completo.md#tk21), [TK22](01-backlog-completo.md#tk22), [TK23](01-backlog-completo.md#tk23), [TK24](01-backlog-completo.md#tk24), [TK26](01-backlog-completo.md#tk26) |
| 53985bb | 2026-09-19T15:39:39-05:00 | Aclara línea base de la documentación | [EP11](01-backlog-completo.md#ep11), [TK23](01-backlog-completo.md#tk23) |

## Lectura de la evolución

Abril: estructura, autenticación, administración y catálogo. Mayo: flujo de reciclaje/ranking, CMS, revisión, multimedia, dashboard, equivalencias ambientales y logging. Junio/julio: XLSX, iconografía/aliados, navegación y configuración. Septiembre: documentación/auditoría, D01–D10, F01–F20 y S01–S12, corrección del CI y consolidación C4. El último commit disponible es del 19 de septiembre. No se inventa trabajo realizado del 20 de septiembre al 16 de octubre. La reconstrucción del backlog se fecha al 27 de septiembre y no altera fechas de trabajo original.

## Discrepancia entre fuentes

El formulario p.3 marca F3 S3–S7 y F4 S6–S7, sin fechas absolutas; E3 y E4 están en S7. La imagen anterior p.13 muestra F3 S3–S6 y no muestra F4. Sus fechas 1 septiembre–16 octubre de 2026 se conservan como referencia de esa imagen, sin trasladarlas automáticamente al formulario. Las fichas y CSV utilizan el formulario; los commits conservan sus fechas reales desde abril. No se inventan fechas de levantamiento a partir de propiedades de archivo.
