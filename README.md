# Ecoamigos Web

Plataforma de educación ambiental y registro de reciclaje de **Parques Nacionales Naturales de Colombia — Dirección Territorial Pacífico (DTPA)**. Incluye contenidos públicos, registro por líderes, validación administrativa, ranking y reportes Excel.

Documentación revisada contra el código local el **7 de septiembre de 2026**. Describe lo implementado y sus limitaciones; no certifica un despliegue ni una base de datos existente.

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
| [Operación y despliegue](docs/08-OPERACION.md) | Hosting, respaldos, restauración, seguridad y diagnóstico |
| [Calidad y pendientes](docs/09-CALIDAD-Y-PENDIENTES.md) | Hallazgos comprobados y matriz de pruebas |
| [Subir a GitHub](docs/10-GITHUB.md) | Pasos para este repositorio, autenticación, conflictos y actualizaciones |

## Tecnologías

React 18, React Router 6, Vite 8 y Axios; Node.js, Express 4, PostgreSQL, JWT, bcrypt, Multer y ExcelJS. Los `package.json` declaran versiones y scripts; los `package-lock.json` fijan la resolución de dependencias.

Frontend y backend son aplicaciones independientes. El `package.json` raíz **no configura workspaces ni inicia la aplicación**.

## Antes de instalar

- Los dos esquemas SQL históricos no coinciden con el backend actual. Para una base nueva se incluye un [esquema de referencia](docs/sql/schema-referencia.sql) derivado del código, pendiente de prueba de integración. No aplicarlo a una base existente.
- La puntuación vigente proviene de `points_catalog` al aprobar. La fórmula antigua de materiales y calidad permanece en una utilidad sin uso en ese flujo.
- El CSV tiene 56 filas y no incluye `Dependencias institucionales`, el grupo que envía el formulario. Importarlo por sí solo no resuelve la puntuación.
- La contraseña anunciada en el seed no coincide con su hash. Seguir el procedimiento de primer administrador.
- La vista de ganadores espera campos que la API no devuelve. Estos hallazgos se documentan, no se corrigen con esta entrega.

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

No existen scripts de pruebas automatizadas ni lint. Compilar no verifica PostgreSQL ni los flujos funcionales. Consultar la [matriz de pruebas](docs/09-CALIDAD-Y-PENDIENTES.md).

## GitHub e identidad

La rama local es `main` y `origin` ya apunta a `https://github.com/oscarprada/ecoamigos-web.git`. Seguir la [guía de publicación](docs/10-GITHUB.md); no hace falta reinicializar Git.

Se conservan logos, mascota, imágenes y contenido institucional. No existe archivo de licencia: esta documentación no concede derechos de redistribución del código, marcas o material institucional. Sus responsables deben definir la autorización de publicación.
