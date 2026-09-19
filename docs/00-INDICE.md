# Índice, alcance y convenciones

[Volver al README](../README.md)

## Alcance

Se documentan los archivos de código y configuración, rutas HTTP y de interfaz, tablas utilizadas, reglas, recursos visuales, instalación, uso, operación, pruebas y GitHub. Se excluyen los detalles internos de dependencias de terceros y el contenido de secretos, logs, datos personales y evidencias.

La línea base es f21b2a6. La documentación distingue código inspeccionado, resultados versionados y evidencia externa informada: migraciones D01/F09/F16/S01 aplicadas/verificadas en desarrollo/QA local, segundo CI SUCCESS y smoke XLSX aprobado. Esta consolidación no conecta a BD ni certifica producción institucional.

## Guía de lectura

| Necesidad | Documentos |
| --- | --- |
| Instalar | [Instalación](01-INSTALACION.md), [Base de datos](03-BASE-DE-DATOS.md), [Pendientes](09-CALIDAD-Y-PENDIENTES.md) |
| Localizar el modelo C4 | [Contexto, contenedores y componentes](02-ARQUITECTURA.md#modelo-c4), con CI explicado aparte |
| Desarrollar | [Arquitectura](02-ARQUITECTURA.md), [API](04-API.md), [Frontend](05-FRONTEND.md), [Reglas](06-REGLAS-Y-BACKEND.md) |
| Capacitar usuarios | [Manual](07-MANUAL-DE-USUARIO.md) |
| Interpretar indicadores ambientales | [Metodología y trazabilidad F14](12-METODOLOGIA-INDICADORES.md) |
| Administrar servidor | [Operación](08-OPERACION.md), [Calidad](09-CALIDAD-Y-PENDIENTES.md) |
| Evaluar dependencias | [Auditoría S12](13-AUDITORIA-DEPENDENCIAS-S12.md) |
| Publicar código | [GitHub](10-GITHUB.md) |
| Consultar estados D/F/S y decisiones | [Trazabilidad](15-TRAZABILIDAD-Y-DECISIONES.md) |
| Entregar a Parques | [Entrega institucional](16-ENTREGA-INSTITUCIONAL.md) |
| Revisar antecedentes | [Entrega inicial D](11-CORRECCION-D01-D10.md), [incidente CI](14-CI-PRIMER-RUN.md) |

## Convenciones

- Rutas relativas a la raíz del repositorio, salvo indicación contraria.
- Comandos para PowerShell desde la raíz, excepto cambios de directorio o sesiones `psql` explícitos.
- `REEMPLAZAR_*` indica valores de ejemplo.
- **Implementado**: existe en código; no implica prueba integral.
- **Histórico**: permanece en el repositorio, pero no representa el contrato actual.
- **Resolución**: CORREGIDO, PARCIAL o PENDIENTE INSTITUCIONAL; estado autoritativo en 15.
- **Contexto**: VIGENTE, HISTÓRICO o RETIRADO POR DECISIÓN DE ALCANCE.
- **Evidencia informada**: resultado comunicado por el responsable; no equivale a una ejecución realizada durante esta consolidación.
- Fechas visibles pueden depender de UTC, PostgreSQL y zona horaria del navegador.

## Glosario

| Término | Significado |
| --- | --- |
| Visitante | Usuario de páginas públicas sin sesión |
| `leader` | Cuenta que envía registros y consulta su historial |
| `admin` | Cuenta que gestiona, revisa y exporta |
| Equipo | Dependencia a la que se atribuyen puntos |
| Periodo | Campaña con fechas y bandera de actividad |
| Registro | Material, cantidad, criterios, evidencia y referencia de catálogo |
| Evidencia | Foto o video opcional adjunto |
| `pending`, `approved`, `rejected` | Pendiente, aprobado, rechazado |
| Catálogo | Puntos por grupo, acción y nivel |
| `published`, `draft` | Publicado, borrador |
| JWT | Token HS256 con id/sv/iat/exp; ocho horas; rol/equipo actuales consultados en BD |
| SPA | Aplicación cuyo navegador resuelve las rutas de páginas |
| Build | Archivos estáticos de `frontend/dist` |
| Seed | El script actual no escribe datos; sus versiones históricas sí incluían demostración |
| `origin` | Dirección remota Git del proyecto |
| Commit, push | Guardar versión local, enviarla al remoto |

## Mantenimiento

Actualizar la API y pantallas al cambiar rutas; documentar migración y diccionario al cambiar columnas; revisar reglas y pruebas al modificar puntos; actualizar instalación y operación al cambiar variables o servicios. Registrar qué se comprobó y en qué entorno, sin datos privados.
