# Ecoamigos Web

Plataforma de educación ambiental y registro de reciclaje de **Parques Nacionales Naturales de Colombia — Dirección Territorial Pacífico (DTPA)**. Incluye contenidos públicos, registro por líderes, validación administrativa, ranking y reportes Excel.

La funcionalidad de premios y ganadores fue retirada del alcance actual. Sus tablas históricas permanecen conservadas en PostgreSQL, pero la aplicación ya no las consulta ni expone operaciones sobre ellas.

Documentación consolidada sobre el commit **f21b2a6**. Las migraciones D01/F09/F16/S01 cuentan con aplicación y verificación en PostgreSQL local de desarrollo/QA, según evidencia informada por el responsable. No existe despliegue institucional de producción; Parques definirá posteriormente su infraestructura.

## Documentación completa

| Documento | Contenido |
| --- | --- |
| [Índice y alcance](docs/00-INDICE.md) | Guía de lectura, convenciones y glosario |
| [Instalación](docs/01-INSTALACION.md) | Requisitos, PowerShell, variables, arranque y primer administrador |
| [Arquitectura](docs/02-ARQUITECTURA.md) | Componentes, flujos, dependencias e inventario |
| [Base de datos](docs/03-BASE-DE-DATOS.md) | Diccionario, relaciones, SQL, catálogo y consultas |
| [API](docs/04-API.md) | Todos los endpoints registrados, permisos, campos, respuestas y ejemplos |
| [Frontend y diseño](docs/05-FRONTEND.md) | Todas las pantallas, navegación, estado, estilos e imágenes |
| [Reglas y backend](docs/06-REGLAS-Y-BACKEND.md) | Autenticación, puntuación real, ranking, indicadores, archivos y Excel |
| [Manual de usuario](docs/07-MANUAL-DE-USUARIO.md) | Procedimientos de visitante, líder y administrador |
| [Operación y mantenimiento](docs/08-OPERACION.md) | Hosting, respaldos, restauración, seguridad y diagnóstico |
| [Calidad y pendientes](docs/09-CALIDAD-Y-PENDIENTES.md) | Hallazgos comprobados y matriz de pruebas |
| [Git y GitHub](docs/10-GITHUB.md) | Control de versiones y revisión de cambios |
| [Trazabilidad y decisiones](docs/15-TRAZABILIDAD-Y-DECISIONES.md) | Estado vigente D/F/S y evidencia histórica |
| [Entrega institucional](docs/16-ENTREGA-INSTITUCIONAL.md) | Componentes entregados, responsabilidades y pendientes |

## Tecnologías

React 18, React Router 6, Vite 8 y Axios; Node.js, Express 4, PostgreSQL, JWT, bcrypt, Multer y ExcelJS. Los `package.json` declaran versiones y scripts; los `package-lock.json` fijan la resolución de dependencias.

Frontend y backend son aplicaciones independientes. El `package.json` raíz **no configura workspaces ni inicia la aplicación**.

## Arquitectura

Ecoamigos utiliza una SPA React construida con Vite, una API REST Node.js/Express y PostgreSQL. El backend gestiona archivos privados y aplica las reglas y permisos; el navegador consume la API. Consultar el [modelo C4: contexto, contenedores y componentes](docs/02-ARQUITECTURA.md#modelo-c4) y el [inventario y flujos de arquitectura](docs/02-ARQUITECTURA.md). CI se documenta aparte de la ejecución funcional; no existe despliegue automático.

## Antes de instalar

- El esquema oficial único es [database/schema.sql](database/schema.sql), para bases nuevas. Las rutas anteriores remiten a él; una base existente requiere [inspección y migración manual](database/README.md).
- La puntuación vigente proviene exclusivamente de `points_catalog` al aprobar y se almacena en `recycling_records.points_awarded`.
- El CSV tiene 56 filas y no incluye `Dependencias institucionales`, el grupo que envía el formulario. Importarlo por sí solo no resuelve la puntuación.
- No hay credenciales ni datos de demostración predeterminados. Crear el primer administrador con datos propios siguiendo [database/README.md](database/README.md).

## Ejecución local

Completar primero [instalación y base de datos](docs/01-INSTALACION.md). Después, en dos terminales desde la raíz:

```powershell
# Terminal 1
Set-Location backend
npm ci
npm run dev
```

```powershell
# Terminal 2
Set-Location frontend
npm ci
npm run dev
```

Frontend: `http://localhost:5173`. Backend: `http://localhost:3000`. Login: `http://localhost:5173/login`.

## Verificación

```powershell
npm --prefix frontend run build
git diff --check
```

Existen pruebas automatizadas backend/frontend, migraciones y concurrencia con PostgreSQL temporal. Ejecutar npm test con ECOAMIGOS_TEST_PG_BIN configurado, npm run check y npm run build. El workflow de GitHub Actions implementa CI, sin despliegue automático; la primera ejecución (78c0297) detectó un fallo de infraestructura de pruebas y la segunda, sobre f21b2a6, terminó SUCCESS según resultado informado por el responsable desde GitHub Actions. CI está implementado y validado. S12 permanece PARCIAL exclusivamente por riesgos de dependencias. Consultar [calidad](docs/09-CALIDAD-Y-PENDIENTES.md) y [auditoría de dependencias](docs/13-AUDITORIA-DEPENDENCIAS-S12.md). La última validación local registrada es 199/199 backend, 49/49 frontend, build y check correctos; el smoke XLSX fue informado como aprobado. No se añadió un linter completo.

## GitHub e identidad

La rama local es `main` y `origin` ya apunta a `https://github.com/oscarprada/ecoamigos-web.git`. Seguir la [guía de publicación](docs/10-GITHUB.md); no hace falta reinicializar Git.

Se conservan logos, mascota, imágenes y contenido institucional. No existe archivo de licencia: esta documentación no concede derechos de redistribución del código, marcas o material institucional. Sus responsables deben definir la autorización de publicación.
