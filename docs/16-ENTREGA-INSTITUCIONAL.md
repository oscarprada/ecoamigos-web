# Guía de entrega institucional de Ecoamigos

[Índice](00-INDICE.md) · [Trazabilidad vigente](15-TRAZABILIDAD-Y-DECISIONES.md)

## Qué se entrega y en qué estado

Se entrega una base de software y documentación de Ecoamigos para Parques Nacionales Naturales de Colombia — Dirección Territorial Pacífico, consolidada sobre **f21b2a6**. Incluye educación ambiental pública, registro de reciclaje por líderes, revisión administrativa, ranking y exportación XLSX. Esta guía organiza la transferencia técnica; **no es un acta de recepción firmada ni acredita despliegue institucional**.

El proyecto cuenta con aplicación/verificación de D01/F09/F16/S01 en PostgreSQL local de desarrollo/QA, según lo informado por su responsable. Eso es distinto de una instalación en infraestructura institucional de producción: esta última no ocurrió dentro del proyecto. Esta consolidación documental no conecta ni modifica bases, archivos cargados o dependencias.

| Componente entregado en el repositorio | Fuente de uso/mantenimiento |
| --- | --- |
| SPA React/Vite, páginas y recursos visuales existentes | [Frontend](05-FRONTEND.md), [manual](07-MANUAL-DE-USUARIO.md) |
| API Express/Node, autorización, revisión y acceso a archivos | [API](04-API.md), [reglas](06-REGLAS-Y-BACKEND.md) |
| Esquema PostgreSQL oficial, migraciones y verificaciones | [Diccionario](03-BASE-DE-DATOS.md), [procedimiento SQL](../database/README.md) |
| CSV histórico de 56 filas y cargador controlado | database/points_catalog_clean.csv; no equivale a catálogo institucional aprobado |
| Pruebas backend/frontend, concurrencia, scripts y workflow CI | [Calidad](09-CALIDAD-Y-PENDIENTES.md), [incidente CI cerrado](14-CI-PRIMER-RUN.md) |
| Guías operativas, evidencia de auditoría y decisiones | [Operación](08-OPERACION.md), [S12](13-AUDITORIA-DEPENDENCIAS-S12.md), [trazabilidad](15-TRAZABILIDAD-Y-DECISIONES.md) |

No se incluyen credenciales reales, respaldo de datos personales, uploads reales, proveedor de correo configurado ni un servicio productivo instalado. No hay cuentas predeterminadas. Se conservan los recursos institucionales existentes; licencia, derechos de publicación y acceso al repositorio deben ser definidos por sus responsables.

## Arquitectura y contratos que deben preservarse

El navegador ejecuta una SPA independiente; Axios llama a la API y transmite Bearer JWT. Express consulta PostgreSQL y administra una raíz privada de archivos. Frontend y backend tienen package.json/lockfiles independientes; no son npm workspaces. La arquitectura e inventario detallados están en [02](02-ARQUITECTURA.md).

Los registros solo los crea leader con equipo vigente: nacen pending y con 0 puntos. La revisión permite únicamente pending → approved/rejected; una repetición devuelve 409. Los puntos proceden de points_catalog.points; el ranking suma aprobados del período activo. Se permite como máximo un período activo y también cero. El límite es 15 cuentas almacenadas, incluyendo administradores e inactivos.

Premios/ganadores y las equivalencias ambientales F14 están retirados; sus antecedentes no deben reactivarse al instalar. Las cantidades de reciclaje aprobadas en kg siguen disponibles, sin conversiones inventadas. Las tablas históricas de premios se conservan sin operaciones de producto. Usuarios y equipos tienen edición limitada autorizada; períodos mantienen alta/listado. No hay eliminación física de estas tres entidades por API.

## Requisitos e instalación

Referencia comprobada del proyecto: Node 24.13.0, npm 11.6.2 y PostgreSQL 18; la última regresión local registrada utilizó PostgreSQL 18.1. No se certifican otras combinaciones por inferencia. Se requieren conexión PostgreSQL compatible y directorios privados escribibles para uploads y logs. Para las suites de integración, los binarios initdb, pg_ctl, psql, createdb y postgres deben estar disponibles en la misma versión 18 mediante ECOAMIGOS_TEST_PG_BIN; son recursos de pruebas aisladas, no la conexión de aplicación.

Seguir [01: instalación](01-INSTALACION.md), con dependencias desde lockfiles mediante npm ci, configuración privada y creación explícita del primer administrador. El build de frontend genera archivos estáticos. El arranque local sirve para desarrollo/QA; no configura supervisión, HTTPS o un hosting institucional.

### Base nueva o existente

- **Nueva:** database/schema.sql es la definición única, para destino vacío. Incluye las estructuras actuales y no crea datos de negocio predeterminados.
- **Existente:** inspección, respaldo, selección de migración necesaria y verificación según [database/README](../database/README.md). No ejecutar schema.sql ni todos los scripts de manera indiscriminada.
- **D01/F09:** compatibilidad histórica y unicidad de período activo; D01 actualizado ya incluye el índice F09. La migración F09 separada solo corresponde a destinos antiguos que carezcan de él.
- **F16/S01:** tokens de recuperación y versión de sesión; verificar presencia/compatibilidad. F16 aborta si ya existe su tabla; S01 es idempotente y conserva versiones.
- **Catálogo:** conservar las 56 filas distribuidas. Importarlas no aporta las identidades institucionales faltantes D06. No usar fixtures de pruebas como datos autorizados.

La aplicación local de esas migraciones está informada; un futuro destino institucional exige su propia revisión y evidencia de instalación. No hay ejecución automática de migraciones al arrancar ni plan automático de reversión de datos.

## Configuración y servicios por definir

La fuente principal de variables es [01](01-INSTALACION.md); sus contratos y límites están en [08](08-OPERACION.md). backend/.env.example contiene solo ejemplos, no valores productivos. La configuración real se conserva fuera de Git.

| Área | Configuración/decisión requerida |
| --- | --- |
| API y navegador | PORT, VITE_API_URL, CLIENT_URL y CORS_ORIGINS según orígenes exactos; producción exige configuración explícita |
| PostgreSQL | DATABASE_URL o DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME; DB_SSL según el servicio, con verificación de certificado cuando se habilita |
| Sesión y abuso | JWT_SECRET privado; AUTH_*; TRUSTED_PROXIES solo para proxies realmente autorizados |
| Archivos | UPLOAD_ROOT persistente y privado, límites UPLOAD_* según contrato; jamás publicar /uploads por proxy/hosting |
| Logs | LOG_DIR y límites LOG_*; permisos/ACL del operador, retención y captura de stderr por definir |
| Excel | EXPORT_MAX_ROWS default técnico 1000, rango 1–10000; no representa política institucional |
| Correo | Proveedor y adaptación institucional de passwordResetDelivery.js aún pendientes; no se han definido credenciales SMTP ni otro proveedor |

F16 es recuperación de contraseña, no cambio voluntario de perfil. El backend implementa tokens temporales hasheados y de un uso, pero **actualmente no envía correo**. Habilitar una entrega operativa requiere trabajo posterior autorizado y verificación sin exponer tokens. S02 conserva Bearer JWT en localStorage; no se entregan cookies/CSRF ni una migración de sesión parcialmente configurada.

## Respaldo, restauración y operación

Respaldar conjuntamente PostgreSQL y la raíz efectiva UPLOAD_ROOT; conservar también la versión del código y configuración privada en un medio seguro. El snapshot de pg_dump no sincroniza archivos: coordinar la suspensión de escrituras o el mecanismo que se adopte. Ensayar la restauración hacia una base y carpeta separadas, verificando login, relaciones, acceso a evidencias y XLSX. [08](08-OPERACION.md) contiene el procedimiento; esta entrega no ejecuta ni certifica una restauración institucional.

Parques deberá definir responsables, frecuencia, retención, ubicación protegida, RPO/RTO, monitoreo y permisos. No se eligen esos valores aquí. La limpieza S06 respeta referencias; una caída abrupta puede dejar archivos pendientes porque PostgreSQL y filesystem no son una transacción única. La reconciliación requiere inventario/revisión, no borrado automático por antigüedad. Los logs técnicos no son auditoría inmutable y pueden perder eventos ante saturación o caída.

## QA e integración continua

| Evidencia disponible | Resultado y procedencia |
| --- | --- |
| Regresión local registrada | 199/199 backend y 49/49 frontend, cero fallos/omisiones; build y check aprobados. Ver 14; no repetida contra BD durante esta consolidación |
| Cobertura | Instalación, D01/F09/F16/S01, concurrencia F08/F09/F10/F12, auth, archivos, configuración/logging, UI y XLSX; inventario en 09 |
| CI | **IMPLEMENTADO Y VALIDADO**: segundo run f21b2a6 SUCCESS informado y validado por el usuario en GitHub Actions; sin inspección API propia aquí |
| XLSX | Smoke manual S11 aprobado e informado por el usuario |
| Dependencias | Capturas fechadas y evaluación en 13; riesgos abiertos, no auditoría nueva |
| Manuales | T01–T28 vigentes separados del original histórico; ejecutar/registrar los casos que correspondan en QA autorizado |

El workflow en push/PR hacia main separa quality de dependency-audit. El primero falla ante problemas de instalación, tests, build o checks. El segundo publica vulnerabilidades como riesgos y falla si la auditoría no puede ejecutarse o no entrega informes válidos. Un CI verde no elimina vulnerabilidades. **S12 permanece PARCIAL exclusivamente por los riesgos de dependencias documentados.**

No hay CD ni despliegue automático. Faltan URL/ID/capturas del segundo run y acta/capturas del smoke para adjuntarlos como evidencia independiente; esto no invalida el resultado informado ni convierte CI en una tarea sin validar. Quedan por registrar smoke visuales más amplios, reproducción multimedia real y restauración; los tests con DOM mínimo no los sustituyen.

## Riesgos y pendientes institucionales

| Pendiente/límite | Decisión o trabajo posterior necesario |
| --- | --- |
| D06; F05/F07 | Autorizar catálogo institucional, puntos e intervalos decimales y semántica de orgánico. Sin identidad válida, el alta se rechaza; no desactivar F05 para permitirla |
| F16: entrega | Elegir/configurar proveedor y completar adaptador de correo; probar entrega/recuperación sin exponer secretos |
| S02 | Definir topología, dominios/HTTPS y una eventual migración integral del transporte/almacenamiento de sesión; localStorage continúa expuesto a JavaScript |
| S12 | Planificar actualizaciones por cadena con instalación/regresión y nueva auditoría; incluye riesgo crítico tar vía instalación bcrypt/node-pre-gyp en la captura, sin afirmar explotación HTTP |
| S03/S11 | Límites por proceso, no distribuidos; evaluar coordinación si se despliegan varias instancias |
| S07 | Firma no equivale a antivirus o validación completa de codecs/documentos; evaluar protección adicional y probar formatos reales |
| S06/S10 | Reconciliación de residuos, permisos y retención; archivos/logs no proporcionan atomicidad distribuida ni auditoría inmutable |
| Infraestructura futura | Host frontend con fallback SPA, proceso Node supervisado, PostgreSQL, HTTPS, proxy confiable, almacenamiento privado/persistente, respaldos y monitoreo |
| Recepción y mantenimiento | Designar custodios de repositorio/configuración/datos, soporte, capacitación y revisión de evidencias, sin asignar personas o fechas no acordadas |

Balance vigente: **37 CORREGIDOS, 4 PARCIALES y 1 PENDIENTE INSTITUCIONAL**. La fuente autoritativa por ID es [15](15-TRAZABILIDAD-Y-DECISIONES.md); corregido dentro del alcance no elimina sus limitaciones expresas.

## Recepción posterior y fuentes principales

Para formalizar la recepción, el responsable deberá registrar la versión efectivamente entregada, evidencias disponibles, pendientes aceptados o por resolver, custodios y condiciones de operación. Esta guía no presume aceptación de riesgos por Parques ni firmas/fechas que no existen. Tampoco redacta el informe académico: el documento 15 organiza el material y los vacíos para elaborarlo posteriormente.

| Tema | Fuente principal |
| --- | --- |
| Navegación y alcance | 00 y README |
| Instalación/configuración | 01; aplicación SQL en database/README |
| Arquitectura/diccionario | 02/03 |
| Contratos de API/reglas/interfaz | 04/06/05 |
| Uso | 07 |
| Operación, backups y límites técnicos | 08 |
| Pruebas y QA | 09 |
| Versiones y revisión | 10 |
| Antecedentes preservados | 11/12/14; JSON de auditoría intactos |
| Dependencias | 13 |
| Resolución y decisiones D/F/S | 15 |
| Transferencia y responsabilidades futuras | Este documento |

El alcance termina en software y documentación para revisión. **No se ha desplegado Ecoamigos en infraestructura institucional de producción.**
