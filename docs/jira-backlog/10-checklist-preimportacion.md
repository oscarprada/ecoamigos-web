# Auditoría final de preimportación — 2026-09-28

Resultado: propuesta documental consistente y preparada para aprobación. Esto no certifica una importación ejecutada ni compatibilidad comprobada con un proyecto Jira remoto. Script analizado estáticamente, **no ejecutado**, tampoco en dry-run. Sin commit ni push.

## Checklist documental comprobado

- [x] 100 elementos confirmados.
- [x] 11 Epics.
- [x] 17 Stories.
- [x] 31 Tasks.
- [x] 41 Bugs.
- [x] F1–F4 verificadas.
- [x] E1–E4 verificados.
- [x] RF/RNF contrastados.
- [x] Relaciones sin ciclos, incluyendo conjuntamente padres y dependencias.
- [x] Estados revisados: 80 Done, 3 Cancelled, 13 Partially Completed, 4 Pending Institutional Decision.
- [x] Elementos históricos revisados.
- [x] CSV válido: 100 filas, 26 columnas, IDs y títulos únicos, sin filas duplicadas.
- [x] Script PowerShell sin credenciales incorporadas; variables de entorno y simulación predeterminada.
- [x] No se crearon issues en Jira.
- [x] No se modificó código funcional.

## Evidencia y alcance de los controles

Se validaron campos obligatorios, tipos, prioridades, estados, etiquetas de fase, F1→E1/F2→E2/F3→E3/F4→E4, padres, dependencias, archivos referenciados y existencia Git de los commits. Las 100 fichas conservan correspondencia con el CSV. Se revisaron las 17 Stories: visitante, líder de equipo y administrador, con capacidades funcionales y padre Epic; no se encontraron tareas técnicas disfrazadas de Stories. Las 31 Tasks representan trabajo técnico/documental o decisiones, sin duplicados que justifiquen fusión. Las Tasks de implementación descomponen Stories y no representan esfuerzo adicional independiente.

Los 42 hallazgos D/F/S se distribuyen en 38 Bugs y 4 Tasks (D06, F06, F15, F16); BG-CI, BG-ENV y BG-UI completan los 41 Bugs. Se conserva esta clasificación sustentada, sin reducir el inventario. Los 49 commits citados existen localmente. La inspección de código, pruebas y documentación respalda los límites de autenticación, puntos, revisión, estadísticas y decisiones; no se reejecutaron pruebas de aplicación, build, migraciones ni consultas a bases de datos en una auditoría documental.

### Fuentes oficiales y ubicación real

La ruta solicitada `docs/plan-trabajo/FORMULARIO PLAN DE TRABAJO DE GRADO_V2.pdf` no existe en este workspace. Tampoco se encontraron copias DOCX/XLSX de las matrices bajo docs. **Los documentos sí están disponibles externamente** en las rutas proporcionadas y localizadas en la continuación anterior:

- Plan: `Trabajo de grado/Anteproyecto Final/FORMULARIO PLAN DE TRABAJO DE GRADO_V2.pdf`.
- Cuestionario y sus matrices: `Trabajo de grado/Preproyecto/Cuestionario de levantamiento de requisitos_ANS.docx`.
- Matriz histórica de otro alcance: `Trabajo de grado/Preproyecto/Requerimientos presentacion.docx`.

Se revalidaron sus SHA-256 contra los consignados en [04](04-trazabilidad-requisitos.md); no se copiaron al repositorio porque las escrituras autorizadas se limitan al backlog. Para revisión fuera de este workspace hay que conservar acceso a esas fuentes; no presentarlas como adjuntos versionados ni subirlas automáticamente a Jira.

Plan p.2–3: F1 S1–S2/E1 S2; F2 S2–S3/E2 S3; F3 S3–S7/E3 S7; F4 S6–S7/E4 S7. Se mantiene la diferencia con la imagen anterior p.13. Ninguna semana planificada se convierte en fecha histórica de ejecución. Git acredita versionado; no duración ni fecha de entrevista.

El cuestionario aporta 21 RF y 12 RNF trazados, con grados de cumplimiento explícitos. Los 28 requisitos de la otra matriz mantienen su fuente porque reutilizan IDs con otro significado. No hay un porcentaje de cumplimiento total acreditado. EP01 conserva estado parcial por decisiones/aceptación, no por falta de levantamiento.

### Estados y elementos históricos

| Elemento | Resultado de auditoría |
| --- | --- |
| Recuperación | TK-F16 técnico Done; ST02 parcial y TK25 pendiente de correo |
| Catálogo y registro | TK-D06 pendiente; BG-F05/BG-F07 y ST08 parciales |
| Sesión localStorage | BG-S02 parcial; no cierre por tener logout |
| Dependencias | BG-S12 parcial; CI validado no elimina riesgos |
| Pruebas manuales | TK22 parcial; automatización no sustituye aceptación visual/manual |
| Infraestructura/entrega | TK26 pendiente; producción excluida del presupuesto del Plan |
| Premios/ganadores | Origen documentado; ST15/ST16 Cancelled por retiro posterior F01–F03 |
| Equivalencias | ST17 Cancelled; BG-F14 Done acredita retiro, no validación de factores |
| Quizzes/insignias | Pregunta 12, RF-020/RF-021: opción histórica; decisión en TK02, sin implementación ni cancelación inventada |

## Inconsistencias corregidas y límites

1. La solicitud suponía fuentes ya incorporadas al repositorio: se documenta su ubicación externa real, conservando las fuentes disponibles.
2. El plan 08 todavía describía una entrega limitada a ocho archivos y ningún mecanismo elegido: se actualiza a diez artefactos con script Cloud REST v3 preparado, sin ejecución.
3. Se concreta adaptación de Task/Bug bajo Story: Epic como padre Jira y vínculo con padre lógico, sin inventar compatibilidad de subtareas.
4. Se explicitan identidad estable, registro de correspondencia, interrupciones, duplicados, mapeo de workflow y metadatos en Description.

No se cambiaron IDs, tipos, estados, jerarquía ni contenido funcional de los 100 tickets; no hubo duplicación real que justificara fusionar o eliminar. El CSV y las matrices 02–05 se conservaron.

## Pendiente exclusivamente para ejecución futura

- [ ] Recibir autorización literal `BACKLOG APROBADO. CREAR EN JIRA.`.
- [ ] Confirmar instancia/proyecto, permisos, campos obligatorios, jerarquía, tipos y prioridades reales.
- [ ] Acordar mapeo de estados, resoluciones y transiciones del workflow.
- [ ] Confirmar dirección y nombres de vínculos; visibilidad completa y único importador activo.
- [ ] Tras autorización, probar el script en el destino acordado y conciliar 100 claves; esta auditoría no sustituye esa validación.

Véase [08-plan-importacion-jira.md](08-plan-importacion-jira.md) para procedimiento, limitaciones de reanudación y referencias oficiales de API.

## Verificación final local

Parser PowerShell: cero errores de sintaxis, sin ejecutar el script. CSV/fichas coherentes (ignorando espacios finales de formato), 1.528 enlaces locales/anclas válidos y los 175 archivos rastreados conservan su huella SHA-256 previa. Se retiraron 61 espacios finales de líneas de la ficha 01, sin alterar valores semánticos del CSV. `git diff --check` pasó; además se comprobaron espacios finales directamente en los diez artefactos, porque la carpeta aún no está rastreada. No existen archivos de correspondencia ni bloqueo de ejecución.
