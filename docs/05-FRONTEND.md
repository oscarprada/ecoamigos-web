# Frontend, pantallas y diseño

[Índice](00-INDICE.md)

## Rutas y contratos

| Ruta | Página | Acceso | Datos/acciones |
| --- | --- | --- | --- |
| `/` | HomePage | Público | Contenido estático, mascota, cuatro categorías y aliados |
| `/educacion/:category` | EducationCategoryPage | Público | GET public/content/category; introducción local y modal |
| `/ranking` | RankingPage | Público | GET public/ranking; podio de tres y tabla |
| `/login` | LoginPage | Público | POST auth/login |
| `/forgot-password` | PasswordRecoveryPage | Público | Solicitar recuperación, entrega institucional pendiente |
| `/reset-password` | PasswordRecoveryPage | Público | Restablecer con token de un uso |
| `*` | NotFoundPage | Público | Página 404, incluidas /winners y /prizes |
| `/leader` | LeaderDashboard | leader, admin | GET recycling/mine y public/ranking |
| `/leader/register` | RegisterRecyclingPage | leader | Periodo desde ranking; POST multipart recycling |
| `/admin` | AdminDashboard | admin | admin/dashboard y public/stats; exportación |
| `/admin/users` | AdminUsersPage | admin | Listado/creación/edición de datos permitidos y estado; consulta equipos |
| `/admin/reviews` | AdminReviewsPage | admin | Pendientes/revisados, filtros y PATCH de revisión |
| `/admin/content` | AdminContentPage | admin | CRUD de contenidos y archivos |
| `/admin/settings` | AdminSettingsPage | admin | Listado/creación/edición de equipos; listado/creación de períodos |

Existe ruta comodín de página 404 fuera de ProtectedRoute. No implica HTTP 404 del hosting. BrowserRouter requerirá fallback a index.html cuando Parques configure el servidor estático; no existe despliegue institucional actual.

## Sesión y navegación

AuthProvider consulta /auth/me al montar; user permanece solo en memoria. Axios usa withCredentials:true y añade X-Ecoamigos-Request: 1 a métodos mutantes. No lee ni guarda JWT ni construye Authorization. Solo elimina la clave heredada ecoamigos_token, sin leerla. Un 401 vigente retira el usuario; 403/500 no equivalen a logout. Una generación de peticiones impide que un 401 anterior borre un login nuevo. Login/logout se serializan en la pestaña para ordenar respuestas Set-Cookie. Logout espera POST /auth/logout; si falla, conserva la sesión visible y muestra error para reintentar. /me tardío no revive un logout. La persistencia depende de la cookie, no de almacenamiento JavaScript.

ProtectedRoute muestra “Cargando...” mientras se consulta sesión, redirige a login sin usuario y al inicio si el rol no coincide. Esta protección de interfaz no sustituye la de backend.

AppLayout contiene logo institucional, nombre, subtítulo, enlace Inicio y, con sesión, panel correspondiente y Cerrar sesión. `Navbar.jsx` no está montado. El menú móvil es operativo hasta 768 px, con aria-expanded/aria-controls. Cerrado no deja enlaces ocultos en Tab; Escape, navegación y cambios de ruta/breakpoint gestionan cierre y foco.

La entrada visible a login y ranking se encuentra en educación de residuos. No existen rutas ni enlaces activos de premios o ganadores.

## Comportamiento por módulo

### Portada y educación

La portada no consulta la API. Importa mascota e iconos, contiene textos de campaña y abre cuatro enlaces de aliados en otra pestaña con protección rel. Categorías e introducciones son constantes locales en EducationCategoryPage, no contenido editable desde admin. El listado sí viene de la base y muestra solo publicados.

El modal presenta texto, imagen, video local con controles o enlace de archivo según tipo. Usa dialog nativo modal, foco inicial, ciclo Tab/Shift+Tab, cierre por Escape/botón/fondo y restauración al disparador. No hay reproductor YouTube activo a partir de `youtube_url`.

### Ranking

Ranking maneja loading y estados vacíos, convierte puntos a Number y toma los primeros tres para podio. La funcionalidad visible de premios y ganadores fue retirada del alcance actual.

### Líder

LeaderDashboard muestra identidad/equipo, posición del ranking activo, total de registros personales, aprobados y conteos de estado. Si no encuentra puntaje del equipo, usa el acumulado personal como respaldo: no siempre representa el mismo alcance temporal. El historial incluye fecha, material, cantidad/unidad, estado, puntos, evidencia y comentario administrativo.

El formulario de registro incluye cuatro materiales (papel/cartón, plástico, vidrio y metal), cantidad numérica (min 0.1, step 0.1), unidad libre iniciada en kg, calidad alta/media/baja, cinco criterios, fecha, observaciones y archivo opcional. Empieza con Material limpio marcado. Deshabilita envío mientras carga, guarda o no hay periodo activo. La referencia de catálogo se deriva de material y cantidad mediante useMemo. Tras éxito reinicia el estado y vacía el input nativo mediante useRef. Ante fallo conserva selección y datos; el siguiente FormData usa solo la evidencia actual.

### Administración

Dashboard combina cuatro contadores privados con estadísticas públicas, hasta cinco equipos/materiales, total reciclado aprobado en kg y barras calculadas con CSS. F14 retiró las cuatro tarjetas de equivalencias ambientales. Exporta como blob, crea enlace temporal, dispara descarga y revoca URL.

Usuarios carga usuarios/equipos en paralelo; calcula administradores/líderes/cupos; exige equipo para líderes; muestra el límite de 15 cuentas totales, incluidos administradores e inactivos. El backend garantiza el cupo transaccionalmente; ante 409/USER_LIMIT_REACHED la pantalla muestra el mensaje y actualiza el listado. Permite editar nombre, email, equipo del líder y activar/desactivar; no rol, contraseña ni borrado físico.

Revisiones carga pendientes e historial en paralelo. Las pestañas, búsqueda por líder/equipo y filtro de material se resuelven localmente. Muestra evidencia, comentarios y revisor. Los botones de aprobar/rechazar aparecen solo en pendientes. Si no se escribe comentario, envía un texto predeterminado.

Contenidos trabaja con FormData; admite texto/imagen/video/archivo y borrador/publicado. Editar precarga campos y desplaza arriba; cancelar restablece el formulario. Eliminar solicita confirmación con window.confirm. El archivo opcional puede sustituirse al editar; no hay acción para quitarlo sin reemplazo.

Configuración usa formularios independientes para equipos y periodos y recarga ambas listas después de cada creación. El periodo comienza con is_active true. Permite editar nombre/dependencia de equipos. Períodos solo alta/listado, sin edición, eliminación ni activación independiente de uno existente.

## Estado, validaciones y errores

Se utilizan hooks locales y Context; no hay Redux, biblioteca de formularios ni caché de consultas. La validación HTML y algunos controles de estado son de conveniencia: no sustituyen validación de API. ToastProvider muestra un único aviso 3500 ms; no acumula una cola. LoadState separa carga, fallo persistente con Reintentar y vacío tras éxito. Usuarios reintenta localmente; otras cargas recargan la página. uiError limita mensajes mostrados y no expone detalles internos.

showToast usa useCallback y el valor del contexto useMemo; mostrar/cambiar/ocultar avisos no repite por identidad la carga de período. El efecto mantiene su dependencia showToast. StrictMode puede ejecutar efectos adicionales en desarrollo. No hay polling deliberado.

## Sistema visual

Orden en main.jsx: `global.css` → `pages.css` → `refinements.css`. Muchas páginas de administración/educación aún usan objetos inline; estos prevalecen sobre reglas normales CSS. Portada y layout usan clases `home-*` y `site-*`.

| Variable | Valor | Uso |
| --- | --- | --- |
| --green | #376b35 | Acciones y acentos |
| --turquoise | #25664e | Enlaces y acentos secundarios |
| --soft | #f1f5ee | Superficie secundaria |
| --border | #dce4d8 | Bordes |
| --text | #243028 | Texto base |
| --ink | #203d2c | Títulos en refinamientos |
| --muted | #526056 | Texto secundario |
| --surface | #f7f8f4 | Fondo |
| --accent | #adc576 | Detalles decorativos |
| --danger / --success | #c53d3d / #21804a | Estados semánticos |

Montserrat para cuerpo y Nunito Sans para títulos, cargadas desde Google Fonts en index.html. Se conservan tamaños existentes: no hay una escala tipográfica única para todas las páginas. Refactorizaciones futuras deben comparar tamaños calculados por viewport, no solo declaraciones.

Refinamientos incluyen foco visible, hover, tarjetas discretas, cuadrículas adaptables, selección de texto y respeto de prefers-reduced-motion. Breakpoints compartidos incluyen 1024/900/768/520; portada/layout añaden 1050/768/480. Las tablas anchas pueden desplazarse horizontalmente. No se certificó accesibilidad WCAG ni revisión visual móvil en esta sesión.

## Recursos y mantenimiento

No cambiar logos ni aplicarles filtros que alteren identidad. Los archivos en assets se importan con Vite y reciben nombres con hash al compilar. Los adjuntos no se empaquetan. Educación consulta /api/files/public/content/:id; ProtectedFile solicita contenido privado/evidencia por ID con cookie y Blob, cancela peticiones y revoca object URLs. Nunca se abre directamente file_url/evidence_url como ruta pública. getBackendUrl resuelve los endpoints contra el backend. Por ello no configurar VITE_API_URL con query strings o rutas incompatibles con ese cálculo.

Los PNG actuales de logo, mascota e iconos tienen varios cientos de KB. Cualquier optimización futura debe preservar apariencia y requerimientos institucionales. La documentación no reexporta ni sustituye esos activos.


### Actualización S02 — 2026-09-30

Sesión S02: JWT HS256 de ocho horas en cookie ecoamigos_session, HttpOnly, SameSite=Lax, Path=/api, sin Domain; Secure cuando NODE_ENV=production. El body de login ya no contiene JWT. Frontend y API deben compartir sitio y esquema (localhost con distintos puertos en desarrollo; HTTPS bajo el mismo sitio en producción). No se soporta automáticamente un frontend en un sitio distinto; no cambiar a SameSite=None sin revisar despliegue y pruebas. CLIENT_URL es el único origen permitido para CORS y CSRF. Fuera de producción, si falta, se usa http://localhost:5173; en producción es obligatorio un origen HTTPS exacto. No se admiten wildcard, lista, ruta, credenciales ni slash final. CORS_ORIGINS es una variable heredada: retirarla o mantenerla idéntica a CLIENT_URL; otro valor detiene el arranque. Axios y CORS habilitan credenciales. Los métodos mutantes exigen Origin igual a CLIENT_URL y X-Ecoamigos-Request: 1, incluso login, logout y recuperación. Logout no cambia las reglas de revocación S01: reset incrementa session_version y las peticiones siguientes rechazan cualquier JWT anterior. Se conservan autorización y límites S03. Ver evidencia de pruebas y decisión CSRF en [09](09-CALIDAD-Y-PENDIENTES.md).


Actualización 2026-10-05: Orgánico se retiró del selector y de su referencia de catálogo en el registro. No se retiraron contenidos educativos ni vistas de registros históricos. El backend también rechaza altas directas de ese material.
