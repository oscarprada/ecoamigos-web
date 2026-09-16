# Manual de usuario

[Índice](00-INDICE.md)

## Antes de comenzar

En desarrollo abrir `http://localhost:5173`. Para usar datos, el backend y PostgreSQL deben estar disponibles. Una portada visible no demuestra que esos servicios funcionen. Las cuentas son creadas por administradores; no hay autorregistro. La recuperación F16 está disponible como flujo, con entrega de correo pendiente de configuración institucional.

## Visitante

### Explorar la campaña

1. Abrir Inicio para leer la presentación y ver la mascota.
2. Seleccionar Agua, Energía, Papel o Residuos en las tarjetas de educación ambiental.
3. Leer la introducción de la categoría.
4. Abrir un contenido del listado para consultar el detalle en un modal.
5. Usar el botón de cierre o pulsar fuera del modal para regresar al listado.

Los contenidos pueden ser texto, imagen, video o archivo descargable. Solo aparecen los publicados. Un listado vacío indica que la consulta terminó correctamente sin publicaciones. Si falla la API se muestra un error, no un listado vacío. Las introducciones generales no se administran desde la pantalla de contenidos.

### Ranking

En Residuos se encuentran enlaces a Ranking e Ingresar. Las direcciones directas son `/ranking` y `/login`.

Ranking muestra el periodo activo, primeros tres equipos y tabla general. Los puntos provienen de registros aprobados. Sin periodo activo no hay clasificación. Empates se ordenan por nombre.

Los logos de aliados abren sitios externos. Regresar a Ecoamigos desde su pestaña original.

## Acceso y salida

1. Abrir `/login` o Ingresar desde Residuos.
2. Escribir correo y contraseña entregados por el administrador.
3. Pulsar Ingresar. Se abre el panel del rol correspondiente.
4. Para salir, usar Cerrar sesión en la cabecera.

La sesión dura hasta ocho horas desde su emisión y el navegador conserva el token localmente. En equipos compartidos cerrar sesión al terminar. Si la API rechaza la sesión por expiración, desactivación o reset, se limpia la sesión del navegador y las páginas protegidas dirigen a login. Si se olvidó la contraseña, usar «¿Olvidaste tu contraseña?»; consultar la limitación de envío descrita abajo.

## Líder

### Leer el panel

El panel muestra nombre, equipo asignado, puntos, posición y conteos personales. “Mis registros recientes” contiene el historial del usuario, aunque varios líderes pertenezcan al mismo equipo. La posición corresponde al periodo activo; los conteos personales abarcan todos los periodos.

### Registrar reciclaje

1. Confirmar que tienes equipo asignado y que existe periodo activo.
2. Pulsar Registrar reciclaje.
3. Elegir material: papel/cartón, plástico, vidrio, metal u orgánico.
4. Escribir cantidad y unidad. Para coherencia con los niveles y el total aprobado actual, trabajar en kg; la interfaz permite otras unidades, pero no convierte valores.
5. Seleccionar calidad alta, media o baja.
6. Revisar los criterios: limpio, seco, separado correctamente, sin contaminantes y evidencia clara. Material limpio aparece marcado inicialmente.
7. Indicar fecha, observaciones y, si corresponde, adjuntar foto o video.
8. Enviar y esperar el aviso de confirmación.
9. Consultar el historial para comprobar que figura como pendiente.

Solo el líder puede registrar. El administrador gestiona y revisa, pero no registra en nombre de un equipo; supervisor no es un rol disponible. Si no tienes equipo válido asignado, el servidor rechaza el alta: solicita revisar tu asignación y vuelve a iniciar sesión para obtener la identidad actualizada. No puedes seleccionar otro equipo modificando la solicitud; el equipo procede de tu sesión autenticada.

El servidor exige un período activo. Si cambió mientras completabas el formulario, el envío se rechaza: actualiza la página y comprueba el período antes de reenviar. No puedes asociar un registro a otro período modificando la solicitud.

Indica la fecha en la que realizaste la actividad de reciclaje reportada. Debe ser una fecha real YYYY-MM-DD, dentro del período activo incluyendo inicio y fin, y no posterior al día actual de PostgreSQL. Puedes reportar una actividad anterior si pertenece al activo. Una fecha futura se rechaza aunque esté dentro del período; una fecha de otro período también se rechaza. El formulario sugiere el día local y permite editarlo, pero el servidor valida. Si se deja vacía usa CURRENT_DATE de PostgreSQL y comprueba igualmente el rango.

La evidencia es opcional en la aplicación, aunque una política de campaña podría requerirla. Las descripciones de evidencia, frecuencia y racha del catálogo no son controles automáticos: el sistema no comprueba su contenido, no limita repeticiones y no calcula rachas. El límite técnico de evidencia es 20 MiB. Si un video falla, probar un formato admitido por extensión y MIME o solicitar revisión técnica. No enviar repetidamente sin consultar historial: no hay deduplicación automática.

Los niveles actuales conservan límites técnicos `<= 5`, `> 5 y <= 15`, `> 15 y <= 30`, y `> 30`. Como la interfaz permite décimas, 5.1–5.9 y 15.1–15.9 no coinciden literalmente con los textos “6 a 15” y “16 a 30”. No redondear ni asumir una interpretación distinta sin indicación institucional. Orgánico requiere una definición y referencia institucional autorizadas; mientras falten, su registro puede ser rechazado como catálogo no configurado.

Los puntos se asignan al aprobar. Calidad y criterios quedan registrados, pero no agregan puntos por sí solos en el cálculo actual. Si un aprobado queda con cero, pedir revisar la coincidencia con el catálogo institucional.

### Consultar resultado

Estados: Pendiente, Aprobado y Rechazado. El historial muestra comentario administrativo y enlace de evidencia. No hay edición, eliminación ni reenvío automático del mismo registro desde el panel. Si hubo un error, comunicar el ID al administrador y acordar cómo corregirlo sin duplicar actividad.

## Administrador

### Preparar una campaña

1. Entrar a `/admin/settings` desde el panel.
2. Crear los equipos con nombre y dependencia.
3. Crear un periodo con nombre, fecha inicial/final y activo cuando corresponda. Crear uno activo desactiva los demás.
4. Entrar a Usuarios y crear líderes asociados a sus equipos.
5. Pedir al responsable de datos que confirme el catálogo institucional antes de aprobar registros.

No hay pantalla para editar un período existente ni cargar catálogo. Crear un período activo reemplaza al anterior de forma transaccional; si falla, F09 conserva el estado anterior. No hay controles para activar uno existente, desactivarlo por separado, cambiar sus fechas o eliminarlo. Premios y ganadores están fuera del alcance actual.

### Usuarios

1. Abrir `/admin/users`.
2. Consultar registrados, administradores, líderes y cupos restantes.
3. Completar nombre, correo, contraseña y rol.
4. Para líder seleccionar equipo; para admin no se asigna equipo.
5. Crear y comprobar el nuevo usuario en el listado.

Se permiten hasta 15 cuentas totales almacenadas en toda la aplicación, incluidos administradores e inactivos. Desactivar o reactivar no cambia el cupo. El servidor también lo comprueba: si otro administrador ocupa el último lugar mientras completas el formulario, el alta se rechaza con un mensaje y la pantalla actualiza el conteo. La edición permite actualizar datos y activar/desactivar; no hay eliminación ni cambio de clave. Entregar credenciales por un canal privado, no por comentarios o issues públicos.

### Editar usuarios y equipos

En Usuarios, pulsa Editar junto a una cuenta. Actualiza nombre, correo y equipo del líder; marca o desmarca Cuenta activa y pulsa Guardar cambios. Cancelar descarta el formulario. Los errores del servidor se muestran en la pantalla y el listado se recarga al guardar. El rol y la contraseña no se editan. Desactivar impide nuevos ingresos, conserva la cuenta y su historial, y sigue ocupando uno de los 15 cupos.

En Configuración, pulsa Editar junto a un equipo. Modifica nombre/dependencia y pulsa Guardar equipo; Cancelar edición vuelve al alta. Cambiar un nombre conserva su ID. Cambiar el equipo actual de una cuenta no cambia el equipo de actividades anteriores.

Períodos permite crear y listar. No hay edición de fechas ni eliminación de períodos históricos; tampoco se habilita edición de períodos vacíos, porque el flujo actual no la necesita. No hay botones de eliminación para usuarios, equipos o períodos. La recuperación excepcional de clave descrita en [Operación](08-OPERACION.md) permanece fuera de F15.

Desde S01, cada solicitud protegida consulta el usuario actual: existencia, is_active, role, team_id y versión de sesión. Desactivar rechaza el siguiente request; cambiar equipo afecta solicitudes nuevas sin reescribir históricos. F15 no permite editar el rol; si cambia por administración SQL autorizada, el backend usa el rol actual.

### Validar registros

1. Abrir `/admin/reviews` y pestaña Pendientes.
2. Buscar equipo/líder o filtrar material.
3. Revisar cantidad, periodo, observaciones y evidencia.
4. Escribir comentario administrativo si se necesita; sin comentario se envía uno predeterminado.
5. Aprobar o Rechazar y esperar confirmación.
6. Consultar Historial para verificar estado, puntos y revisor.
7. Recargar Ranking para comprobar el efecto en el periodo activo.

Los filtros no modifican registros. Historial es de lectura en la interfaz. La API admite cambiar una revisión, pero reemplaza la anterior; no equivale a una auditoría completa. Registrar decisiones institucionales por el procedimiento que corresponda.

### Gestionar contenidos

1. Abrir `/admin/content`.
2. Indicar título, categoría, tipo y estado.
3. Escribir descripción y adjuntar archivo si corresponde.
4. Guardar como Borrador para ocultarlo de listados públicos o Publicado para mostrarlo.
5. Verificar la categoría pública correspondiente.

Para editar, pulsar Editar en la tabla, cambiar datos y Actualizar contenido. Sin nuevo adjunto se conserva el anterior. Cancelar edición restaura el formulario de alta. Para eliminar, pulsar Eliminar y confirmar; se borra la fila y se retira el archivo cuando ya no tiene referencias. Si hay fallo de disco, soporte debe revisar la limpieza pendiente.

Tipos: Texto, Imagen, Video y Archivo. Las cargas nuevas admiten JPG/JPEG, PNG, WEBP, MP4, MOV, AVI, PDF y DOCX; selecciona el tipo que corresponda. Convierte DOC antiguo a PDF/DOCX antes de subir; SVG/GIF no se admiten en nuevas cargas. Solo los adjuntos de publicaciones son públicos; borradores requieren sesión admin.

### Dashboard y Excel

En `/admin`, los conteos de registros, estados y materiales muestran actividad histórica de todos los estados. Los puntos por equipo también son históricos; no equivalen al ranking del período activo. “Cantidad total reciclada aprobada (kg)” suma únicamente filas aprobadas cuya unidad sea kg, incluidos los cinco materiales; admite mayúsculas y espacios exteriores. Otras unidades no se convierten ni se suman a kg. En orgánico solo se usa la cantidad/unidad declarada, nunca se deducen bloques de 5 kg desde el catálogo; F07 sigue pendiente.

La cantidad total reciclada aprobada (kg) abarca todos los períodos, incluso registros sin período. Solo suma registros aprobados declarados en kg. Si no hay filas compatibles, el total es cero.

Los indicadores ambientales equivalentes se encuentran en revisión metodológica y no se muestran hasta contar con factores técnicamente validados. Las cuatro tarjetas fueron retiradas, sin valores ni ceros sustitutos. La [metodología histórica](12-METODOLOGIA-INDICADORES.md) explica la decisión; no se muestran fórmulas antiguas en el dashboard.

Pulsar la acción de exportar para descargar `Reporte_Ecoamigos.xlsx`. Incluye todos los registros y nueve columnas, con filtros y encabezado fijo. Contiene nombres de personas/equipos; almacenarlo según las reglas internas y fuera del repositorio Git.

## Solicitar soporte

Informar página, operación, fecha/hora aproximada, ID de registro si aplica y mensaje visible. No enviar contraseña, JWT, `.env`, exportaciones completas ni evidencias privadas. El responsable puede consultar logs y los [diagnósticos](08-OPERACION.md).


## Recuperar una contraseña olvidada — F16

1. En Iniciar sesión, pulsa «¿Olvidaste tu contraseña?».
2. Introduce el correo de la cuenta y solicita recuperación. El mensaje es genérico y no confirma si la cuenta existe o está activa.
3. Cuando la institución configure entrega de correo, abre el enlace recibido en /reset-password?token=... dentro de sus 30 minutos de vigencia.
4. Escribe una nueva contraseña no vacía (máximo 72 bytes UTF-8) y pulsa Restablecer contraseña.
5. Inicia sesión con la clave nueva. La anterior deja de funcionar y el enlace ya no puede usarse. Solicitar otro enlace invalida los anteriores.

**Limitación actual:** no hay proveedor de correo configurado; solicitar recuperación no envía un email todavía. El envío institucional debe habilitarse antes de ofrecer este servicio como operativo. La aplicación no muestra tokens ni ofrece un atajo de administrador para asignar contraseñas. Las cuentas inactivas no pueden recuperar acceso por este flujo.

No hay «Cambiar contraseña» en perfil/dashboard. Restablecer invalida las sesiones anteriores: su próxima solicitud protegida pedirá iniciar sesión otra vez. No compartas enlaces, tokens o contraseñas; no los pegues en incidencias. El procedimiento SQL excepcional de Operación continúa reservado a soporte autorizado, no es parte de esta pantalla.


## Carga, errores y páginas inexistentes — F17

Mientras se consultan datos aparece Cargando. Si la consulta termina sin elementos se conserva el mensaje normal de lista vacía; si falla, aparece un mensaje de error con Reintentar. Ranking, estadísticas, contenido y paneles no representan un fallo como cero o ausencia de registros.

Reintentar vuelve a cargar usuarios dentro de la pantalla; en las demás cargas recarga la página. La recarga puede descartar cambios de formulario sin guardar. No hay reintentos automáticos. Si falla guardar, crear un período o editar, se muestra un error controlado y no un mensaje de éxito; el formulario conserva sus valores. Si se guardó pero falló la actualización del listado, se informa del fallo de carga.

Las direcciones inexistentes muestran «404 — Página no encontrada» dentro del diseño habitual, con Volver al inicio. /winners y /prizes también muestran 404: sus funciones no se restauraron. Una ruta protegida válida sigue solicitando login cuando no hay sesión; un rol sin permiso vuelve al inicio. Una dirección inexistente, incluso bajo /admin o /leader, muestra 404.

La recuperación mantiene su mensaje genérico para no revelar cuentas. Los errores inesperados no muestran detalles técnicos; las validaciones funcionales conocidas sí pueden mostrarse.


## Contenido y menú con teclado — F20

Al abrir «Ver contenido completo», el foco pasa a Cerrar. Tab y Shift+Tab recorren los controles del diálogo; Escape o Cerrar lo cierran y devuelven el foco al botón de apertura. El contenido largo se desplaza dentro del diálogo.

En pantallas de hasta 768 px, pulsa Menú para mostrar la navegación. Puedes recorrer sus enlaces con Tab; Escape desde la cabecera o seleccionar un enlace cierra el menú. En escritorio la navegación permanece visible.


## Intentos y cierre de sesión — S01–S03

Si aparece «Demasiados intentos. Intenta de nuevo más tarde.», espera antes de volver a iniciar sesión o solicitar/restablecer contraseña; no hay reintento automático. El límite se comparte entre equipos que salgan por la misma IP. Cerrar sesión elimina la sesión guardada en ese navegador; no revoca una copia del token en otro dispositivo. Restablecer la contraseña sí invalida todos los JWT anteriores de la cuenta.


## Ver y subir archivos — S04–S07

Evidencias: JPG/JPEG, PNG, WEBP, MP4, MOV o AVI; máximo 20 MiB, con imágenes hasta 10 MiB. Contenido educativo: imágenes hasta 10 MiB, documentos PDF/DOCX hasta 20 MiB y videos hasta 100 MiB, salvo configuración técnica distinta. Un archivo por operación. Cambiar extensión no convierte un archivo y el sistema puede rechazar contenido truncado o que no coincida con su formato.

En historial, revisión y administración de contenido, pulsa Ver archivo/Ver evidencia. Se carga con tu sesión, muestra imagen/video cuando es compatible y ofrece Descargar archivo. Ante fallo puedes reintentar. Los formatos de video pueden requerir descarga/reproductor compatible; validar firma no garantiza codec reproducible en navegador. La evidencia solo puede consultarla su líder propietario o un admin; cambiar equipo no cambia la propiedad de registros antiguos. Las direcciones antiguas /uploads dejan de abrir directamente; usa el enlace de la aplicación.
