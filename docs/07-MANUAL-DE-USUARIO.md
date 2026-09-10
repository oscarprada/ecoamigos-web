# Manual de usuario

[Índice](00-INDICE.md)

## Antes de comenzar

En desarrollo abrir `http://localhost:5173`. Para usar datos, el backend y PostgreSQL deben estar disponibles. Una portada visible no demuestra que esos servicios funcionen. Las cuentas son creadas por administradores; no hay autorregistro ni recuperación de contraseña desde la aplicación.

## Visitante

### Explorar la campaña

1. Abrir Inicio para leer la presentación y ver la mascota.
2. Seleccionar Agua, Energía, Papel o Residuos en las tarjetas de educación ambiental.
3. Leer la introducción de la categoría.
4. Abrir un contenido del listado para consultar el detalle en un modal.
5. Usar el botón de cierre o pulsar fuera del modal para regresar al listado.

Los contenidos pueden ser texto, imagen, video o archivo descargable. Solo aparecen los publicados. Un listado vacío puede corresponder a falta de publicaciones; si se esperaba contenido, revisar disponibilidad de API. Las introducciones generales no se administran desde la pantalla de contenidos.

### Ranking

En Residuos se encuentran enlaces a Ranking e Ingresar. Las direcciones directas son `/ranking` y `/login`.

Ranking muestra el periodo activo, primeros tres equipos y tabla general. Los puntos provienen de registros aprobados. Sin periodo activo no hay clasificación. Empates se ordenan por nombre.

Los logos de aliados abren sitios externos. Regresar a Ecoamigos desde su pestaña original.

## Acceso y salida

1. Abrir `/login` o Ingresar desde Residuos.
2. Escribir correo y contraseña entregados por el administrador.
3. Pulsar Ingresar. Se abre el panel del rol correspondiente.
4. Para salir, usar Cerrar sesión en la cabecera.

La sesión dura hasta ocho horas desde su emisión y el navegador conserva el token localmente. En equipos compartidos cerrar sesión al terminar. Si aparece token inválido/expirado, salir e ingresar nuevamente. Si se olvidó la contraseña, contactar al responsable técnico: no existe enlace de restablecimiento operativo.

## Líder

### Leer el panel

El panel muestra nombre, equipo asignado, puntos, posición y conteos personales. “Mis registros recientes” contiene el historial del usuario, aunque varios líderes pertenezcan al mismo equipo. La posición corresponde al periodo activo; los conteos personales abarcan todos los periodos.

### Registrar reciclaje

1. Confirmar que tienes equipo asignado y que existe periodo activo.
2. Pulsar Registrar reciclaje.
3. Elegir material: papel/cartón, plástico, vidrio, metal u orgánico.
4. Escribir cantidad y unidad. Para coherencia con los niveles e indicadores actuales, trabajar en kg; la interfaz permite otras unidades, pero no convierte valores.
5. Seleccionar calidad alta, media o baja.
6. Revisar los criterios: limpio, seco, separado correctamente, sin contaminantes y evidencia clara. Material limpio aparece marcado inicialmente.
7. Indicar fecha, observaciones y, si corresponde, adjuntar foto o video.
8. Enviar y esperar el aviso de confirmación.
9. Consultar el historial para comprobar que figura como pendiente.

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

No hay pantalla para editar un periodo existente ni cargar catálogo. Evitar periodos duplicados: una creación fallida de periodo activo puede dejar los anteriores desactivados. Premios y ganadores están fuera del alcance actual.

### Usuarios

1. Abrir `/admin/users`.
2. Consultar registrados, administradores, líderes y cupos restantes.
3. Completar nombre, correo, contraseña y rol.
4. Para líder seleccionar equipo; para admin no se asigna equipo.
5. Crear y comprobar el nuevo usuario en el listado.

La UI permite hasta 15 cuentas totales. No hay gestión de baja, edición, cambio de clave ni activación desde esta pantalla. Entregar credenciales por un canal privado, no por comentarios o issues públicos.

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

Para editar, pulsar Editar en la tabla, cambiar datos y Actualizar contenido. Sin nuevo adjunto se conserva el anterior. Cancelar edición restaura el formulario de alta. Para eliminar, pulsar Eliminar y confirmar; se borra la fila, pero el archivo permanece en disco hasta mantenimiento técnico.

Tipos: Texto, Imagen, Video y Archivo. El selector admite imágenes, videos, PDF, DOC y DOCX; la API no valida esos tipos de manera equivalente. No subir información privada: los archivos son accesibles por URL, incluso si la fila es borrador o fue eliminada.

### Dashboard y Excel

En `/admin`, consultar conteos, actividad por equipo/material e indicadores. Las estadísticas abarcan todos los estados y periodos; no son necesariamente iguales al ranking activo. Los indicadores son estimaciones del código, no mediciones certificadas.

Pulsar la acción de exportar para descargar `Reporte_Ecoamigos.xlsx`. Incluye todos los registros y nueve columnas, con filtros y encabezado fijo. Contiene nombres de personas/equipos; almacenarlo según las reglas internas y fuera del repositorio Git.

## Solicitar soporte

Informar página, operación, fecha/hora aproximada, ID de registro si aplica y mensaje visible. No enviar contraseña, JWT, `.env`, exportaciones completas ni evidencias privadas. El responsable puede consultar logs y los [diagnósticos](08-OPERACION.md).
