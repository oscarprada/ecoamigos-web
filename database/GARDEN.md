# Sembrando conciencia

Base nueva: `database/schema.sql` incluye las tablas del reto.
Base existente: aplicar una sola vez `database/20261013_garden_challenge.sql` con psql y ON_ERROR_STOP, sobre la base elegida por su responsable. No ejecutar el esquema completo sobre una base existente.

Comando pendiente para la base local de pruebas, solo si faltan ambas tablas:
`psql -X -U postgres -d ecoamigos_pruebas -v ON_ERROR_STOP=1 -f database/20261013_garden_challenge.sql`

Comprobación de solo lectura, sin secretos:
`psql -X -U postgres -d ecoamigos_pruebas -c "SELECT to_regclass('public.garden_crops') AS cultivos, to_regclass('public.garden_evidence') AS evidencias;"`
Si ambas existen, no repetir la migración. Si solo existe una, revisar el esquema antes de aplicar cambios.

La migración añade tablas e índices, sin modificar ni borrar registros, grupos o catálogos. Una segunda ejecución falla y revierte su transacción.
El ranking conserva los puntos de reciclaje si todavía no existen las tablas del reto. Aplicar la migración antes de usar la huerta; sus puntos aprobados se incorporan al ranking en la siguiente consulta, sin reiniciar ni recrear cuentas, grupos o registros.
Los puntos pertenecen al periodo de cada evidencia, igual que reciclaje. Cambiar de periodo no permite premiar de nuevo la misma etapa del mismo cultivo.
Los administradores validan desde la página del reto, accesible también desde la revisión de reciclaje. Los líderes ven y registran solo cultivos de su grupo actual.
Recursos introductorios opcionales: `frontend/src/pages/public/gardenContent.js`; sin rutas configuradas no se muestra ese espacio.

Pruebas aisladas: definir ECOAMIGOS_TEST_PG_BIN y ejecutar `npm test --prefix backend`; `npm test --prefix frontend`; `npm run build --prefix frontend`.
