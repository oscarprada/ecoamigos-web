# Calidad, verificaciones y pendientes

[Índice](00-INDICE.md)

## Revisión controlada D01–D10

Los diez hallazgos se contrastaron nuevamente con código, rutas, SQL, seed y CSV antes de editar. El esquema oficial único es [database/schema.sql](../database/schema.sql); las otras dos rutas solo lo incluyen. No se modificaron frontend, rutas ni reglas de puntuación. Las secciones F01–F20, S01–S12 y T01–T28 conservan exactamente el texto anterior como registro, sin reevaluarse en esta tarea.

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

Premios están fuera del alcance de producto; se conservaron estructuras de compatibilidad y código activo tras explicar sus dependencias, sin crear premios/ganadores ni borrar tablas existentes. [Detalle de archivos afectados por una futura retirada](../database/README.md).

Las secciones siguientes permanecen sin cambios por alcance y no implican resolución de F/S/T.

## Hallazgos funcionales y técnicos

| ID | Hallazgo | Consecuencia / prioridad de revisión |
| --- | --- | --- |
| F01 | WinnersPage espera id/final_score/prize_name; API entrega otros campos | Pantalla incompleta; alinear contrato antes de premiar |
| F02 | winners agrega todos los equipos aprobados, no solo ganadores | Definir ganadores y asignación de premios |
| F03 | Premios públicos incluyen is_active false | Decidir semántica de visibilidad |
| F04 | Fórmula calculatePoints sin uso | Evitar documentación/reglas contradictorias; retirar o integrar de forma deliberada |
| F05 | Grupo/acción/nivel recibidos del cliente | Backend no garantiza relación con material/cantidad |
| F06 | Frecuencia, rachas y evidencia del catálogo no se validan | No presentar esas reglas como automatizadas |
| F07 | Orgánico siempre refiere a 5 kg; decimales entre límites | Alinear referencias con condiciones verificadas |
| F08 | Revisión se puede repetir sin restricción y sin transacción | Última escritura reemplaza anteriores; falta auditoría/concurrencia |
| F09 | Crear periodo activo usa UPDATE e INSERT separados | Fallos/races pueden dejar cero o varios activos |
| F10 | Fechas/periodo activo no se validan al crear registro | API acepta escenarios bloqueados o no previstos en UI |
| F11 | Admin puede registrar, pero normalmente no tiene equipo | Puede fallar team_id NOT NULL |
| F12 | Límite de 15 solo frontend | No se cumple si se usa API directamente |
| F13 | Estadísticas suman todos los estados/unidades | Indicadores no equivalen a reciclaje aprobado en kg |
| F14 | Factores ambientales sin fuente trazable en repositorio | Requieren revisión metodológica antes de uso institucional |
| F15 | Solo contenido tiene CRUD completo | No hay edición/baja de usuarios, equipos, periodos o premios |
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
| T14 Sin coincidencia | Registro con grupo inexistente y aprobación | Approved con 0 según implementación actual |
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
