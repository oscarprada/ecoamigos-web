# Plan condicionado de importación a Jira — no ejecutado

**Reconstrucción retrospectiva, corte 2026-09-28; HEAD local 53985bb.** Jira no se utilizó durante el desarrollo original. IDs, jerarquía, prioridades y criterios se proponen ahora a partir de evidencia; no representan tickets, sprints, reuniones o estimaciones históricas. No se crean issues ni se asigna trabajo individual a los dos estudiantes.

## Límite de autorización

Este archivo y el script 09 preparan exclusivamente la importación local; **no configuran un proyecto remoto, no crean campos ni issues y no ejecutan importaciones**. Solo una instrucción explícita **BACKLOG APROBADO. CREAR EN JIRA.** autorizará la ejecución. No se solicitan credenciales ni se prueba conectividad ahora. La compatibilidad con el proyecto destino se confirmará después de esa autorización.

## Datos a confirmar después de la autorización

Identificar proyecto/instancia, permisos, tipos de issue, jerarquía y campos del importador realmente disponibles. Confirmar si se conservarán los cuatro estados lógicos como estados del workflow o como campo separado, sin confundir Partially Completed con Done. No se inventan project keys, usuarios, responsables, resolución Jira, fechas de creación, sprints, story points o fechas límite.

## Jerarquía lógica y adaptación necesaria

El CSV admite los tipos Epic/Story/Task/Bug solicitados. Parent Internal ID es un **ID lógico local**, no una clave Jira ni una garantía de que el importador acepte ese padre. No importar a ciegas Task bajo Story o Bug bajo Story como si cualquier configuración lo soportara.

| Elemento local | Adaptación que debe verificarse |
| --- | --- |
| Epic | Crear como Epic o equivalente habilitado, conservando Internal ID |
| Story bajo Epic | Relacionar mediante la jerarquía/campo que admita el proyecto |
| Task bajo Epic | Mantener actividad técnica; no convertirla en Story artificial |
| Task lógica bajo Story | Si la configuración lo admite, convertir a tipo de subtarea autorizado; de lo contrario mantener Task bajo Epic y vínculo con Story. Conservar Issue Type original en trazabilidad |
| Bug relacionado con Story | Crear Bug y usar vínculo a Story y Epic del componente, salvo jerarquía explícitamente compatible |
| Dependencies | Traducir a vínculos orientados solo después de confirmar semántica y nombres admitidos |

Estas alternativas no cambian la naturaleza retrospectiva ni autorizan modificaciones remotas. Las relaciones actuales se consultan en 06; una relación de pertenencia no es automáticamente «bloquea».

## Campos y CSV

CSV UTF-8, separador coma, valores entre comillas dobles y escape de comillas por duplicación. Internal ID es único y estable en esta propuesta; no usarlo como clave Jira inventada. Labels, Dependencies, Relevant Files y Related Commits usan punto y coma dentro de la celda; el importador necesitará un mapeo explícito. No asumir que un campo multivalor interprete ese separador automáticamente.

| Campos de la propuesta | Tratamiento previsto |
| --- | --- |
| Summary, Description, Issue Type, Priority | Mapear tras confirmar valores admitidos; prioridad es propuesta retrospectiva |
| Internal ID, Parent Internal ID, Epic Internal ID | Preservar como identificadores externos y elaborar correspondencia a claves reales después de crear |
| Phase, Deliverable, Finding ID | Campos acordados o descripción estructurada; no confundir F1 fase con F01 hallazgo |
| User Story, Acceptance Criteria, Technical Notes | Campos de texto si existen; en otro caso secciones explícitas de Description |
| Evidence, Relevant Files, Related Commits | Conservar rutas relativas y hashes; convertir enlaces al repositorio solo con visibilidad/destino verificados |
| Closing Notes, Traceability Notes, Verification Level | Conservar límites de validación y alcance de cierre |
| Evidence Chronology, Planned Window | Texto de evidencia y calendario estimado, nunca fechas históricas de creación de issues |
| Requirement / Contract | Nombre descriptivo reconstruido, sin inventar ID institucional |
| Status | Estado lógico final; mapear conservando Cancelled, parcial e institucional pendiente diferenciados |

No incluir secretos, datos personales, .env, contenido de uploads o logs reales. Los commits y rutas no reemplazan evidencias de aceptación institucional, run de CI o actas.

## Secuencia futura, únicamente tras aprobación

1. Revisar propuesta, discrepancia de cronogramas, matrices y pendientes; confirmar alcance aprobado y configuración de Jira.
2. Validar un ejemplo mínimo en el mecanismo autorizado; evitar duplicados mediante Internal ID y un registro de correspondencia.
3. Importar agrupaciones y elementos del nivel permitido antes de relaciones subordinadas; obtener claves reales sin retrofechar.
4. Crear vínculos de pertenencia, relación y dependencia según la configuración verificada.
5. Conciliar 100 IDs, tipos adaptados, estados, 42 hallazgos, archivos/commits y matrices. Si se divide o fusiona un elemento, documentar la decisión y conservar la trazabilidad original.
6. Presentar diferencias y resultados para revisión; no declarar que Jira fue usado durante el desarrollo original.

Se prepara Jira Cloud REST API v3 mediante PowerShell 5.1 o posterior. No se ha probado contra una instancia real y no se presupone compatibilidad con Jira Data Center. Los ocho artefactos del backlog se conservan y esta auditoría agrega únicamente el script 09 y el checklist 10.

Conservar el nombre de la fuente junto a cada RF/RNF: la matriz del cuestionario y Requerimientos presentacion.docx reutilizan IDs con significados distintos. Esta actualización no crea issues ni autoriza funcionalidades adicionales.

## Procedimiento concreto del script 09

El [script preparado](09-create-jira-backlog.ps1) lee el CSV junto a él, comprueba conteos, IDs, tipos, referencias y ciclos y ordena Epic → Story → Task → Bug. Sin `-Execute`, o con `-DryRun`, devuelve una vista previa local y termina antes de leer autenticación o hacer llamadas. **Durante esta auditoría no se ejecutó, ni siquiera en simulación**: se analizó su AST con el parser de PowerShell.

Después de la autorización se revisarán los campos obligatorios y la jerarquía del proyecto, los permisos de consulta/creación/vinculación y los tipos/prioridades disponibles. El script requiere `-ConfigurationReviewed` como constancia de esa revisión. Si el proyecto impone campos adicionales, subtareas o un workflow incompatible, adaptar el script local antes de la primera creación. No crea proyectos, campos, usuarios ni workflows.

Variables de entorno requeridas solo para ejecución real:

| Variable | Contenido |
| --- | --- |
| JIRA_BASE_URL | Origen HTTPS de la instancia Cloud; sin credenciales, rutas ni parámetros |
| JIRA_EMAIL / JIRA_API_TOKEN | Autenticación local; nunca incluir valores en archivos, consola o repositorio |
| JIRA_PROJECT_KEY | Clave del proyecto autorizado |
| JIRA_TYPE_IDS_JSON | Objeto JSON: Epic, Story, Task, Bug → IDs reales de tipos estándar |
| JIRA_PRIORITY_IDS_JSON | Objeto JSON: High, Medium → IDs reales de prioridad |
| JIRA_STATUS_IDS_JSON | Objeto JSON: los cuatro estados lógicos → IDs de estados destino acordados |

`-EpicNameField` permite indicar el campo personalizado de nombre de Epic si el proyecto lo exige. El resto de los metadatos se conserva como párrafos de Description en formato ADF, con las **26 columnas completas**, incluidos Internal ID, Issue Type original, estado lógico, Phase, Deliverable, Evidence, Related Commits, Closing Notes, Traceability Notes y ambos campos de cronología. No se necesitan campos personalizados para conservarlos. Labels se separa por punto y coma; Component permanece en Description para no inventar componentes Jira.

### Identidad y reanudación

Cada issue lleva una etiqueta estable `ecoamigos-id-<internal-id-en-minúsculas>`, además del ID en Description. Antes de crear, el script consulta el proyecto por esa etiqueta; dos coincidencias causan error, una se reutiliza. Una etiqueta es identidad dentro del proyecto, no una clave Jira inventada. Se requiere visibilidad de todos los issues y una única importación activa; no se garantiza exclusión frente a otros equipos que creen issues simultáneamente.

La futura ejecución guardará `jira-key-map.json` junto al CSV: destino, SHA-256 del CSV, Internal ID → Jira Key y creación pendiente. Esos archivos de ejecución **no se generaron ahora**. La correspondencia guardada se valida contra etiqueta, proyecto y tipo remoto antes de reutilizarla. Un CSV distinto o destino distinto exige conciliación manual; no se actualizan descripciones remotas silenciosamente. Conservar y revisar el archivo antes de versionarlo; nunca contiene autenticación.

Un bloqueo de archivo local evita procesos simultáneos en esta carpeta. Antes de cada POST de creación se persiste el ID pendiente y, tras recibir la clave, se guarda la correspondencia. Ante timeout o interrupción no hay reintento automático: queda bloqueada la reanudación hasta comprobar si el issue fue creado y reparar la correspondencia. No borrar esa marca sin consultar el destino: la búsqueda puede tener retraso de indexación. No existe transacción global ni rollback automático; los issues ya creados se conservan.

### Jerarquía y vínculos elegidos para esta versión

Se conservan los tipos originales: todos los elementos estándar no Epic se crean con su Epic como `parent`. Una Task/Bug cuyo padre lógico sea una Story mantiene ese ID en Description y recibe un vínculo `Relates` con ella después de obtener las 100 claves. Esto evita convertir Tasks o Bugs en subtareas sin autorización. Confirmar soporte de `parent` a Epic y, si hace falta, adaptar al campo admitido antes de ejecutar.

Dependencies se interpreta como «el elemento actual depende de la referencia». Con `Blocks`, la referencia bloquea al elemento actual: el payload sitúa la dependencia en `inwardIssue` y el elemento actual en `outwardIssue`. Los nombres se parametrizan con `-DependencyLinkName` y `-ParentLinkName`; comprobar también sus textos direccionales antes de usar tipos personalizados. El script verifica que ambos tipos existan antes de crear issues. Los vínculos se envían sin comentarios y pueden conciliarse nuevamente sin duplicar comentarios.

### Estados y cierre de importación

| Estado lógico | Tratamiento en workflow real |
| --- | --- |
| Done | Estado final equivalente, conservando los límites de cierre técnico |
| Cancelled | Estado/resolución de cancelación acordados; nunca equiparar a implementación entregada |
| Partially Completed | Estado no final acordado; nunca convertir automáticamente en Done |
| Pending Institutional Decision | Estado pendiente/bloqueado acordado; conservar quién debe decidir sin inventar asignaciones |

La etiqueta `logical-status-*` y Description siempre conservan el estado original aunque el workflow no lo represente directamente. Si varios estados lógicos comparten un estado Jira, documentar ese mapeo y mantener su diferencia mediante estas marcas. Las transiciones y resoluciones dependen del workflow: **esta versión no las ejecuta automáticamente**. Consulta los estados remotos y falla con una lista de pendientes si no coinciden con `JIRA_STATUS_IDS_JSON`. Tras aplicar las transiciones autorizadas, reanudar la conciliación. Crear los 100 issues no significa haber completado su importación.

La aceptación final exige 100 identidades únicas, los tipos acordados, jerarquía y enlaces revisados, todas las columnas preservadas y estados/resoluciones correctos. No asignar fechas históricas de creación, sprints, puntos de historia ni responsables ficticios.

### Referencias técnicas verificadas

Se consultó documentación pública de Atlassian, sin acceder a una instancia Jira: [creación y consulta de issues](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issues/), [búsqueda JQL](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-search/) y [vínculos entre issues](https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-issue-links/). La API documenta que repetir un vínculo existente se trata como éxito; el script no añade comentarios al vínculo.
