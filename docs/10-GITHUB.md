# Control de versiones y GitHub

[Índice](00-INDICE.md)

## Referencia de esta consolidación

La revisión parte de main en f21b2a6, «Corrige infraestructura PostgreSQL del CI», con árbol limpio antes de editar. La consolidación documental queda en el workspace para revisión; no hace commit, push, cambios de visibilidad ni despliegue. El historial de correcciones y sus commits está en [trazabilidad](15-TRAZABILIDAD-Y-DECISIONES.md).

## Revisión local antes de publicar cambios autorizados

Desde la raíz del repositorio:

```powershell
git status
git branch --show-current
git diff --stat
git diff --check
git ls-files -- backend/.env frontend/.env
npm run check
```

Los dos .env privados no deben aparecer como rastreados. Revisar el diff completo, incluidos archivos nuevos, antes de seleccionar rutas concretas. No añadir bases, respaldos, uploads, logs, tokens ni datos de personas. Ignorar un archivo ya rastreado no lo elimina del historial. Si hubo una exposición, se requiere revocación/rotación y tratamiento autorizado del historial; esta guía no certifica que todo el historial esté libre de secretos.

Para cambios de aplicación, consultar las suites y requisitos PostgreSQL en [calidad](09-CALIDAD-Y-PENDIENTES.md) y [operación](08-OPERACION.md). Un check de sintaxis no sustituye regresión ni build. La consolidación documental solo ejecuta comprobaciones sin conexión a bases.

## Preparación y revisión por el responsable

Comprobar identidad local con git config user.name y git config user.email. La identidad de autor no autentica con GitHub. Usar el gestor de credenciales; no incluir tokens en URLs o documentos. Visibilidad, licencia y permisos de publicación necesitan la decisión de sus responsables; no se presume una política institucional ya aprobada.

En una publicación posterior autorizada, seleccionar archivos explícitos mediante git add, revisar git diff --cached y git diff --cached --check, y solo entonces crear el commit. No usar una selección general que incluya cambios ajenos. Sincronizar según la política del repositorio, con el trabajo local conservado y revisando divergencias. No forzar push para eludir conflictos o reglas de rama. Si se requiere Pull Request, usar una rama de trabajo y las revisiones configuradas; aquí no se modifican protecciones ni permisos.

## Integración continua implementada y validada

El workflow [.github/workflows/ci.yml](../.github/workflows/ci.yml) se ejecuta en push a main y pull_request hacia main. La primera ejecución 78c0297 falló en suites PostgreSQL; la corrección f21b2a6 obtuvo **SUCCESS**, informado y validado por el usuario mediante GitHub Actions. No se inspeccionó el run por API en esta consolidación. Véase [incidente y cierre](14-CI-PRIMER-RUN.md).

quality comprueba instalación reproducible, pruebas backend/frontend, build y checks. dependency-audit publica riesgos mediante advertencias, resumen y artifacts; falla ante errores de ejecución o informes inválidos. Que ambos jobs terminen correctamente no elimina los riesgos de dependencias: S12 sigue PARCIAL por ese motivo. No hay CD ni despliegue automático. Subir código no publica la aplicación ni transfiere PostgreSQL/uploads.

## Incidencias habituales

| Situación | Acción del responsable |
| --- | --- |
| Autenticación o repositorio inaccesible | Verificar destino y permisos, renovar autenticación sin compartir secretos |
| Non-fast-forward | Revisar referencias y divergencias; integrar cambios conservando el trabajo local |
| Conflictos | Resolver por archivo y repetir comprobaciones antes de continuar |
| Bloqueo por reglas de rama | Cumplir la revisión/PR exigida; no eludir controles |
| Bloqueo por secretos | Retirar y, si se expuso, revocar el secreto; no saltar la protección |
| Quality falla | Revisar la etapa y logs sanitizados; reproducir con entorno aislado |
| Dependency-audit publica avisos | Evaluar las cadenas y pruebas de actualización en [S12](13-AUDITORIA-DEPENDENCIAS-S12.md) |

El vínculo entre requisito, decisión, implementación y prueba está en el documento 15; las responsabilidades de entrega están en el [documento 16](16-ENTREGA-INSTITUCIONAL.md).
