# Índice, alcance y convenciones

[Volver al README](../README.md)

## Alcance

Se documentan los archivos de código y configuración, rutas HTTP y de interfaz, tablas utilizadas, reglas, recursos visuales, instalación, uso, operación, pruebas y GitHub. Se excluyen los detalles internos de dependencias de terceros y el contenido de secretos, logs, datos personales y evidencias.

La fuente principal es el árbol de trabajo actual, incluyendo ajustes visuales sin confirmar en Git. No se inspeccionó la base en ejecución. La documentación diferencia implementación, comprobaciones realizadas y propuestas.

## Guía de lectura

| Necesidad | Documentos |
| --- | --- |
| Instalar | [Instalación](01-INSTALACION.md), [Base de datos](03-BASE-DE-DATOS.md), [Pendientes](09-CALIDAD-Y-PENDIENTES.md) |
| Desarrollar | [Arquitectura](02-ARQUITECTURA.md), [API](04-API.md), [Frontend](05-FRONTEND.md), [Reglas](06-REGLAS-Y-BACKEND.md) |
| Capacitar usuarios | [Manual](07-MANUAL-DE-USUARIO.md) |
| Interpretar indicadores ambientales | [Metodología y trazabilidad F14](12-METODOLOGIA-INDICADORES.md) |
| Administrar servidor | [Operación](08-OPERACION.md), [Calidad](09-CALIDAD-Y-PENDIENTES.md) |
| Publicar código | [GitHub](10-GITHUB.md) |

## Convenciones

- Rutas relativas a la raíz del repositorio, salvo indicación contraria.
- Comandos para PowerShell desde la raíz, excepto cambios de directorio o sesiones `psql` explícitos.
- `REEMPLAZAR_*` indica valores de ejemplo.
- **Implementado**: existe en código; no implica prueba integral.
- **Histórico**: permanece en el repositorio, pero no representa el contrato actual.
- **Referencia propuesta**: material nuevo de documentación, no una migración ejecutada.
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
| JWT | Token firmado con identidad y rol; duración de ocho horas |
| SPA | Aplicación cuyo navegador resuelve las rutas de páginas |
| Build | Archivos estáticos de `frontend/dist` |
| Seed | Datos de ejemplo; el histórico no corresponde al modelo actual |
| `origin` | Dirección remota Git del proyecto |
| Commit, push | Guardar versión local, enviarla al remoto |

## Mantenimiento

Actualizar la API y pantallas al cambiar rutas; documentar migración y diccionario al cambiar columnas; revisar reglas y pruebas al modificar puntos; actualizar instalación y operación al cambiar variables o servicios. Registrar qué se comprobó y en qué entorno, sin datos privados.
