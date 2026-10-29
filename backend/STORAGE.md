# Almacenamiento local y Cloudinary

`STORAGE_PROVIDER=local` es el valor predeterminado en desarrollo. Mantiene `UPLOAD_ROOT`, las validaciones y todas las rutas históricas. No mueve ni elimina archivos existentes al cambiar de proveedor.

En producción se exige `STORAGE_PROVIDER=cloudinary` y las variables backend `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`; `CLOUDINARY_FOLDER` vale `ecoamigos` por defecto. No hay credenciales de ejemplo utilizables, nuevas dependencias ni migración de base de datos: las columnas de URL existentes son TEXT.

Solo después de validar extensión, MIME, contenido real y tamaño se realiza una carga firmada desde el servidor. Se emplean recursos `image`, `video` o `raw` según el formato ya admitido, en subcarpetas `recycling`, `garden` y `education`. Los archivos grandes se envían por bloques. Todos los recursos son de tipo `authenticated`.

Se guarda exactamente el `secure_url` HTTPS devuelto y validado por el servicio. Las rutas `/api/files/...` conservan sus verificaciones de usuario, grupo y publicación. El backend firma la entrega y transmite los bytes, incluidos rangos para video, sin redirigir al navegador ni exponer credenciales. Las evidencias privadas no se convierten en recursos públicos de CDN. Los documentos PDF/DOCX se conservan como `raw`; los DOC históricos siguen disponibles localmente.

Si falla el registro antes de intentar COMMIT, se compensa eliminando únicamente el nuevo UUID remoto, incluso si la BD no está disponible. Los errores transitorios de eliminación se reintentan tres veces. Si COMMIT tiene resultado desconocido, se consultan primero las referencias de reciclaje, contenidos y huerta: no se borra un recurso posiblemente guardado. Una caída simultánea de BD/proveedor se informa como `FILE_CLEANUP_PENDING`, sin URLs ni secretos; debe revisarse antes de eliminar recursos manualmente. No se intenta una eliminación masiva ni una migración automática de evidencias.

El almacenamiento remoto utiliza archivos temporales privados del sistema para validar, y los retira al terminar. No necesita trasladar el directorio de evidencias locales; este debe conservarse para servir las rutas históricas mientras existan.

Las pruebas usan datos sintéticos y un transporte Cloudinary inyectado en memoria. `NODE_ENV=test` impide cualquier petición externa de Cloudinary sin ese transporte, y el ejecutor de pruebas descarta las credenciales Cloudinary heredadas y fuerza el proveedor local para las regresiones existentes. No se necesita cuenta ni se comprueba una cuenta real.

Referencias del protocolo: https://cloudinary.com/documentation/upload_images, https://cloudinary.com/documentation/delivery_url_signatures.
