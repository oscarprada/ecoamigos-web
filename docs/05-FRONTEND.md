# Frontend, pantallas y diseño

[Índice](00-INDICE.md)

## Rutas y contratos

| Ruta | Página | Acceso | Datos/acciones |
| --- | --- | --- | --- |
| `/` | HomePage | Público | Contenido estático, mascota, cuatro categorías y aliados |
| `/educacion/:category` | EducationCategoryPage | Público | GET public/content/category; introducción local y modal |
| `/ranking` | RankingPage | Público | GET public/ranking; podio de tres y tabla |
| `/winners` | WinnersPage | Público | winners de public/ranking; contrato incompatible |
| `/prizes` | PrizesPage | Público | prizes de public/ranking |
| `/login` | LoginPage | Público | POST auth/login |
| `/leader` | LeaderDashboard | leader, admin | GET recycling/mine y public/ranking |
| `/leader/register` | RegisterRecyclingPage | leader, admin | Periodo desde ranking; POST multipart recycling |
| `/admin` | AdminDashboard | admin | admin/dashboard y public/stats; exportación |
| `/admin/users` | AdminUsersPage | admin | Listado/creación de usuarios y consulta equipos |
| `/admin/reviews` | AdminReviewsPage | admin | Pendientes/revisados, filtros y PATCH de revisión |
| `/admin/content` | AdminContentPage | admin | CRUD de contenidos y archivos |
| `/admin/settings` | AdminSettingsPage | admin | Listado/creación de equipos, periodos y premios |

No hay ruta comodín de página 404. BrowserRouter exige fallback a index.html en el servidor estático para recargar rutas internas.

## Sesión y navegación

AuthProvider consulta `/auth/me` al montar si hay `ecoamigos_token` en localStorage. Ante error elimina el token y finaliza loading. Login almacena token y user; logout limpia ambos. Axios añade el token a cada solicitud. No hay interceptor global de respuesta para cerrar sesión cuando otra llamada recibe 403.

ProtectedRoute muestra “Cargando...” mientras se consulta sesión, redirige a login sin usuario y al inicio si el rol no coincide. Esta protección de interfaz no sustituye la de backend.

AppLayout contiene logo institucional, nombre, subtítulo, enlace Inicio y, con sesión, panel correspondiente y Cerrar sesión. `Navbar.jsx` no está montado. Existe estado menuOpen y un botón de menú, pero su estilo base es `display: none`; la navegación se adapta por envoltura, no por un menú móvil desplegable operativo. No documentar el botón oculto como una función visible.

La entrada visible a login, ranking y ganadores se encuentra en educación de residuos. Premios tiene ruta directa aunque el encabezado activo no la enlaza.

## Comportamiento por módulo

### Portada y educación

La portada no consulta la API. Importa mascota e iconos, contiene textos de campaña y abre cuatro enlaces de aliados en otra pestaña con protección rel. Categorías e introducciones son constantes locales en EducationCategoryPage, no contenido editable desde admin. El listado sí viene de la base y muestra solo publicados.

El modal presenta texto, imagen, video local con controles o enlace de archivo según tipo. Se cierra con su botón o al pulsar el fondo. No implementa trampa de foco ni cierre por Escape. No hay reproductor YouTube activo a partir de `youtube_url`.

### Ranking, ganadores y premios

Ranking maneja loading y estados vacíos, convierte puntos a Number y toma los primeros tres para podio. WinnersPage espera id/final_score/prize_name ausentes en la respuesta actual: pueden faltar puntos y aparecer claves React no únicas. PrizesPage lista todos los premios recibidos, sin filtrar is_active.

### Líder

LeaderDashboard muestra identidad/equipo, posición del ranking activo, total de registros personales, aprobados y conteos de estado. Si no encuentra puntaje del equipo, usa el acumulado personal como respaldo: no siempre representa el mismo alcance temporal. El historial incluye fecha, material, cantidad/unidad, estado, puntos, evidencia y comentario administrativo.

El formulario de registro incluye cinco materiales, cantidad numérica (min 0.1, step 0.1), unidad libre iniciada en kg, calidad alta/media/baja, cinco criterios, fecha, observaciones y archivo opcional. Empieza con Material limpio marcado. Deshabilita envío mientras carga, guarda o no hay periodo activo. La referencia de catálogo se deriva de material y cantidad mediante useMemo. Tras éxito reinicia el estado; el input de archivo no tiene un reseteo DOM explícito.

### Administración

Dashboard combina cuatro contadores privados con estadísticas públicas, hasta cinco equipos/materiales, indicadores ambientales y barras calculadas con CSS. Exporta como blob, crea enlace temporal, dispara descarga y revoca URL.

Usuarios carga usuarios/equipos en paralelo; calcula administradores/líderes/cupos; exige equipo para líderes; fija límite de 15 solamente en frontend. No permite editar ni borrar usuarios.

Revisiones carga pendientes e historial en paralelo. Las pestañas, búsqueda por líder/equipo y filtro de material se resuelven localmente. Muestra evidencia, comentarios y revisor. Los botones de aprobar/rechazar aparecen solo en pendientes. Si no se escribe comentario, envía un texto predeterminado.

Contenidos trabaja con FormData; admite texto/imagen/video/archivo y borrador/publicado. Editar precarga campos y desplaza arriba; cancelar restablece el formulario. Eliminar solicita confirmación con window.confirm. El archivo opcional puede sustituirse al editar; no hay acción para quitarlo sin reemplazo.

Configuración usa tres formularios independientes y recarga las tres listas después de cada creación. Periodo y premio comienzan con is_active true. No hay pantallas de edición/eliminación de estas entidades ni activación de un periodo ya creado.

## Estado, validaciones y errores

Se utilizan hooks locales y Context; no hay Redux, biblioteca de formularios ni caché de consultas. La validación HTML y algunos controles de estado son de conveniencia: no sustituyen validación de API. ToastProvider muestra un único aviso 3500 ms; no acumula una cola. Algunas páginas no capturan rechazos de red, por lo que un vacío no garantiza ausencia de datos.

El proveedor recrea showToast al renderizar; el formulario de reciclaje lo incluye como dependencia del efecto de periodo, que puede repetirse cuando cambian avisos. StrictMode puede ejecutar efectos adicionales en desarrollo. No hay polling deliberado.

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

No cambiar logos ni aplicarles filtros que alteren identidad. Los archivos en assets se importan con Vite y reciben nombres con hash al compilar. Las imágenes de contenidos y evidencias no se empaquetan: getBackendUrl elimina el sufijo `/api` y las resuelve contra el backend. Por ello no configurar VITE_API_URL con query strings o rutas incompatibles con ese cálculo.

Los PNG actuales de logo, mascota e iconos tienen varios cientos de KB. Cualquier optimización futura debe preservar apariencia y requerimientos institucionales. La documentación no reexporta ni sustituye esos activos.
