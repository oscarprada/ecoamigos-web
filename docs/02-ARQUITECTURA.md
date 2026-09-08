# Arquitectura e inventario

[Índice](00-INDICE.md)

## Componentes y comunicación

```mermaid
flowchart LR
  U[Visitante, líder o administrador] --> F[React SPA / Vite]
  F -->|Axios: JSON o multipart + Bearer JWT| B[Express /api]
  B --> A[Autenticación y autorización]
  A --> C[Controladores]
  C -->|pg: consultas parametrizadas| D[(PostgreSQL)]
  B -->|Multer| UP[uploads y uploads/content]
  F -->|URL pública| UP
  C --> L[logs/info.log y error.log]
  C --> X[ExcelJS: descarga XLSX]
```

SPA cliente sin renderizado en servidor, API REST sin ORM y almacenamiento local de archivos. No hay colas, WebSockets, servicios programados, microservicios, contenedores ni configuración CI/CD en el repositorio revisado. No hay sincronización automática de ganadores ni cierre periódico de campañas.

`frontend/src/main.jsx` monta React StrictMode, ToastProvider y App. App monta AuthProvider, BrowserRouter y rutas. El layout incluye cabecera institucional y Outlet. Las rutas privadas atraviesan ProtectedRoute; la API repite la autorización en middleware.

## Dependencias declaradas

| Paquete | Rango | Uso |
| --- | --- | --- |
| react, react-dom | ^18.3.1 | Interfaz y montaje |
| react-router-dom | ^6.23.1 | BrowserRouter, rutas, navegación |
| axios | ^1.7.2 | Cliente API e interceptor Bearer |
| vite | ^8.0.8 | Desarrollo y build |
| @vitejs/plugin-react | ^4.3.1 | Transformación React |
| express | ^4.19.2 | Servidor HTTP |
| cors | ^2.8.5 | Política de origen |
| dotenv | ^16.4.5 | Lectura de `.env` |
| pg | ^8.12.0 | Pool PostgreSQL |
| bcrypt | ^5.1.1 | Hash de contraseñas |
| jsonwebtoken | ^9.0.2 | JWT |
| multer | ^1.4.5-lts.1 | Carga de archivos |
| exceljs | ^4.4.0 | Exportación; declarado también en raíz |
| nodemon | ^3.1.0 | Reinicio backend en desarrollo |

Estas son versiones solicitadas, no necesariamente las instaladas. Cada lockfile registra sus versiones resueltas y transitivas.

## Archivos raíz y base de datos

| Ruta | Responsabilidad |
| --- | --- |
| `README.md`, `docs/` | Documentación y SQL de referencia |
| `.gitignore` | Exclusión de dependencias, entorno, build, logs, uploads y respaldos |
| `package.json`, `package-lock.json` | Paquete raíz, con ExcelJS; sin scripts ni workspaces |
| `6.png`, `ManobiMesa de trabajo.png`, `ManobiMesa de trabajo 1.png`, `ManobiMesa de trabajo 2.png` | Recursos gráficos raíz, sin imports encontrados en la aplicación |
| `database/schema.sql` | Esquema histórico simplificado; incompatible con API actual |
| `database/points_catalog_clean.csv` | 56 acciones históricas en cuatro grupos |
| `database/import_points_catalog.sql` | Importación histórica con ruta absoluta de la computadora original |
| `backend/schema.sql` | Segundo esquema histórico, más cercano al modelo actual pero incompleto |

## Inventario backend

| Ruta dentro de `backend/` | Responsabilidad |
| --- | --- |
| `package.json`, `package-lock.json` | Dependencias; scripts `dev` y `start` |
| `.env.example` | Plantilla sin secretos funcionales |
| `src/server.js` | CORS, JSON, estáticos, montaje de rutas, raíz HTTP y escucha |
| `src/config/db.js` | Pool PostgreSQL y función `query(text, params)` |
| `src/routes/authRoutes.js` | Login y sesión actual |
| `src/routes/publicRoutes.js` | Ranking, estadísticas, catálogo y categorías |
| `src/routes/recyclingRoutes.js` | Crear, historial personal, pendientes, revisados y revisión |
| `src/routes/adminRoutes.js` | Gestión y exportación; Multer de contenidos |
| `src/controllers/authController.js` | bcrypt, JWT, usuario y logging de acceso |
| `src/controllers/publicController.js` | Agregaciones públicas y contenido publicado |
| `src/controllers/recyclingController.js` | Normalización, registros, catálogo y revisión |
| `src/controllers/adminController.js` | Dashboard, creación/listado de usuarios, equipos, periodos, premios y CRUD de contenidos |
| `src/controllers/exportController.js` | Generación del archivo XLSX |
| `src/middleware/authMiddleware.js` | Firma de token y lista de roles permitidos |
| `src/middleware/uploadMiddleware.js` | Evidencias; carpeta, nombres, filtro y límite |
| `src/utils/logger.js` | Escritura síncrona a logs locales |
| `src/utils/environmentalIndicators.js` | Indicadores estimados sobre cantidades |
| `src/utils/calculatePoints.js` | Fórmula histórica exportada, no usada por controladores actuales |
| `src/seed.sql` | Equipos, periodo abril 2026, premios, admin y contenidos de ejemplo antiguos |
| `uploads/`, `uploads/content/`, `logs/` | Datos generados, no código distribuido |

## Inventario frontend

| Ruta dentro de `frontend/` | Responsabilidad |
| --- | --- |
| `index.html` | Idioma español, viewport, título y fuentes Google |
| `package.json`, `package-lock.json` | Dependencias y scripts `dev`, `build`, `preview` |
| `vite.config.js` | Plugin React y puerto 5173; no proxy ni base de subdirectorio |
| `.env.example` | URL pública de API |
| `src/main.jsx` | Montaje e importación ordenada de CSS |
| `src/App.jsx` | Árbol de rutas y proveedor de autenticación |
| `src/App.jx` | Archivo vacío, no utilizado |
| `src/api/client.js` | Axios, token y conversión de rutas de archivos a URLs |
| `src/context/AuthContext.jsx` | Usuario, carga, login y logout |
| `src/context/ToastContext.jsx` | Aviso temporal de 3500 ms |
| `src/components/ProtectedRoute.jsx` | Espera de sesión y redirección por rol |
| `src/components/Card.jsx` | Tarjeta compartida, título y children |
| `src/components/Navbar.jsx` | Navegación antigua; no la importa el árbol activo |
| `src/layouts/AppLayout.jsx` | Cabecera, logo, sesión, enlaces y Outlet |
| `src/pages/public/HomePage.jsx` | Portada, educación ambiental y aliados |
| `src/pages/public/EducationCategoryPage.jsx` | Introducciones, consulta por categoría y modal |
| `src/pages/public/RankingPage.jsx` | Periodo, podio y tabla |
| `src/pages/public/WinnersPage.jsx` | Tarjetas de ganadores; contrato pendiente |
| `src/pages/public/PrizesPage.jsx` | Tarjetas de premios |
| `src/pages/auth/LoginPage.jsx` | Formulario y redirección por rol |
| `src/pages/leader/LeaderDashboard.jsx` | Historial personal y resumen del equipo |
| `src/pages/leader/RegisterRecyclingPage.jsx` | Formulario multipart y referencia de catálogo |
| `src/pages/admin/AdminDashboard.jsx` | Indicadores, gráficos CSS, accesos y descarga XLSX |
| `src/pages/admin/AdminUsersPage.jsx` | Altas, cupo visual de 15 y listado |
| `src/pages/admin/AdminReviewsPage.jsx` | Pendientes, búsqueda, filtros y revisión |
| `src/pages/admin/AdminContentPage.jsx` | Alta, edición, borrador/publicación y eliminación |
| `src/pages/admin/AdminSettingsPage.jsx` | Equipos, periodos y premios |
| `src/styles/global.css` | Bases y componentes compartidos |
| `src/styles/pages.css` | Estilos extraídos de portada y layout |
| `src/styles/refinements.css` | Refinamientos, estados de foco y responsive |
| `src/assets/parques-logo.png`, `cleoecoamigos.png` | Logo y mascota |
| `src/assets/icons/{agua,energia,papel,residuos}.png` | Iconos de las cuatro categorías |
| `src/assets/allies/` | Logos Carvajal, ASOBOSUR, Carlos Portela y Grupo Retorna |
| `src/assets/desktop.ini` | Metadatos Windows previamente versionados; no recurso web |
| `dist/` | Build generado, excluido de Git |

## Flujo principal

```mermaid
sequenceDiagram
  participant L as Líder
  participant F as React
  participant B as API
  participant D as PostgreSQL
  participant A as Administrador
  L->>F: Iniciar sesión
  F->>B: POST /api/auth/login
  B->>D: Buscar usuario y comparar hash
  B-->>F: JWT y usuario
  L->>F: Enviar material y evidencia
  F->>B: POST /api/recycling
  B->>D: Guardar pending, puntos 0
  A->>B: PATCH /api/recycling/:id/review
  B->>D: Consultar catálogo y actualizar
  F->>B: GET /api/public/ranking
  B->>D: Sumar aprobados del periodo activo
  B-->>F: Posiciones y puntos
```

El archivo se escribe antes del INSERT: si falla la base, puede quedar huérfano. La revisión no usa una transacción ni bloqueo; el detalle está en [pendientes](09-CALIDAD-Y-PENDIENTES.md).
