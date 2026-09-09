# Reglas de negocio y backend

[Índice](00-INDICE.md)

## Servidor y persistencia

Express monta CORS con origen fijo `http://localhost:5173` y credentials true, express.json, estáticos uploads y cuatro routers. Escucha en PORT o 3000. No configura host de escucha, TLS, proxy de confianza, límites de tasa, manejador global de errores ni cierre ordenado del pool. La raíz de salud no consulta PostgreSQL.

`pg.Pool` usa DB_HOST, DB_USER, DB_PASSWORD y DB_NAME; puerto 5432 fijo. No configura SSL, tamaño/tiempos del pool ni DATABASE_URL. `query` delega directamente. Las consultas usan placeholders para valores de usuario; no hay ORM, capa de servicios ni sistema de migraciones.

## Autenticación y roles

Login busca email exacto, exige is_active, compara bcrypt y firma JWT por ocho horas. Crear usuario utiliza costo bcrypt 10 y guarda únicamente password_hash. El token conserva equipo y rol al momento de iniciar sesión.

Middleware verifica firma/expiración y roles incluidos, sin consultar cuenta en cada petición. Cambiar equipo, desactivar o cambiar rol en base no invalida un JWT ya emitido. `/auth/me` obtiene información actual, pero tampoco verifica is_active. Logout solo elimina token del cliente, sin revocación de servidor. No hay registro público, refresh, MFA ni recuperación de contraseña.

## Ciclo de registro

```mermaid
stateDiagram-v2
  [*] --> pending: Crear, puntos 0
  pending --> approved: Admin aprueba, consulta catálogo
  pending --> rejected: Admin rechaza, puntos 0
  approved --> approved: API permite volver a revisar
  approved --> rejected: API permite reemplazar revisión
  rejected --> approved: API permite reemplazar revisión
```

La UI muestra acciones solo en pendientes; la API acepta revisiones posteriores. Guarda únicamente la última revisión. Normaliza ciertos textos con trim y convierte vacíos a null; no verifica toda la coherencia entre material, cantidad, catálogo, fecha y periodo.

## Puntuación vigente

Al aprobar, el backend busca un catálogo que coincida con:

```text
LOWER(TRIM(group_name)) = grupo del registro normalizado
LOWER(TRIM(action_name)) = acción del registro normalizada
LOWER(TRIM(COALESCE(action_level, ''))) = nivel normalizado o vacío
```

Se usa la primera fila por id ASC. Sin grupo/acción o sin coincidencia devuelve **0**, sin error. Rechazo siempre devuelve 0. No multiplica por cantidad, calidad ni criterios; la cantidad solo influye en la referencia elegida por el frontend.

Referencias enviadas por RegisterRecyclingPage, siempre grupo `Dependencias institucionales`:

| Condición de interfaz | Acción | Nivel exacto |
| --- | --- | --- |
| material organico, cualquier cantidad aceptada | Ciclo orgánico | 5 kg de abono generado en compostera |
| Otros materiales, cantidad <= 5 | Entrega acopio | Nivel 1: Volumen bajo (1 a 5 kg) |
| Otros, > 5 y <= 15 | Entrega acopio | Nivel 2: Volumen medio (6 a 15 kg) |
| Otros, > 15 y <= 30 | Entrega acopio | Nivel 3: Volumen alto (16 a 30 kg) |
| Otros, > 30 | Entrega acopio | Nivel 4: Volumen masivo (+30 kg) |

La interfaz admite decimales: 5.1 corresponde al segundo nivel aunque el texto diga 6. Para orgánico no verifica que se hayan producido 5 kg de abono. El backend confía en los tres textos enviados; no reconstruye el nivel a partir de quantity.

El CSV distribuido no incluye ese grupo. Se necesitan valores institucionales aprobados y coherencia de catálogo antes de validar puntajes reales. `evidence_required` y `max_frequency` se exponen como información, sin cumplimiento automático de evidencia, frecuencia o rachas. Modificar catálogo no recalcula registros ya aprobados salvo nueva revisión manual por API.

## Fuente única de puntos

F04 retiró la utilidad obsoleta `calculatePoints.js`, que no tenía imports ni participaba en rutas. La única fuente ejecutable es `points_catalog.points`: `reviewRecord` la consulta al aprobar y guarda el resultado en `recycling_records.points_awarded`. El registro nace con cero, el rechazo asigna cero y el ranking suma `points_awarded` de aprobados del periodo activo. `quality_level` y `criteria_count` se conservan como información del registro, pero no intervienen en este cálculo.

## Ranking y periodos

Ranking elige periodo is_active por fecha inicial DESC e id DESC, sin comprobar que hoy esté dentro de las fechas. Sin activo devuelve ranking vacío. Incluye todos los equipos con suma de aprobados del periodo; empates por nombre y posiciones consecutivas, no compartidas.

Crear periodo activo primero desactiva todos y después inserta, sin transacción. Si el INSERT falla puede no quedar ninguno activo; solicitudes simultáneas pueden dejar estados inconsistentes. Premios y ganadores no forman parte de la API actual; sus tablas históricas no participan en este cálculo.

## Estadísticas e indicadores

`getPublicStats` suma todos los estados y periodos. No convierte unidades. Aunque la UI suele usar kg, unit es editable y la suma de quantity puede mezclar magnitudes.

| Indicador | Cálculo implementado |
| --- | --- |
| totalQuantity | Suma quantity de todos los materiales |
| estimatedTreesSaved | papel_carton × 0.017 |
| estimatedWaterSaved | papel_carton × 26.5 |
| estimatedCo2Reduction | papel_carton × 1.0 |
| estimatedEnergySaved | papel_carton × 4.1 |

Se redondea a dos decimales. Los comentarios del código atribuyen factores a EPA, pero el repositorio no aporta una fuente técnica verificable ni validación metodológica; aquí se documenta la fórmula, no se certifica su precisión ambiental. Plástico, vidrio y metal se acumulan en variables internas sin alimentar esos cuatro factores. Orgánico solo contribuye al total.

## Archivos

| Aspecto | Evidencias | Contenidos |
| --- | --- | --- |
| Campo multipart | evidence | file |
| Ubicación | backend/uploads | backend/uploads/content |
| Creación de carpeta | Automática desde middleware | Manual |
| Nombre | Fecha + aleatorio + extensión | Fecha + nombre original |
| Límite | 20 MiB | Sin límite explícito |
| Filtro | Regex extensión y MIME | Sin filtro de servidor |
| Acceso | Público bajo /uploads | Público bajo /uploads/content |

Multer escribe antes del controlador. No hay antivirus, inspección de contenido real, limpieza de huérfanos ni eliminación de adjuntos al borrar filas. En varios servidores se necesitaría almacenamiento compartido/persistente y una estrategia de nombres y permisos.

## Exportación Excel

GET admin/export/excel requiere admin. Consulta todos los registros con usuario/equipo existentes y periodo opcional, orden record_date DESC. Crea libro en memoria con autor Ecoamigos, compañía institucional y fecha actual; una hoja “Reporte Ecoamigos”.

Columnas: Fecha, Líder, Equipo, Material, Cantidad, Unidad, Estado, Puntos, Período. Encabezado verde #71B956 con texto blanco, filtro A1:I1 y primera fila inmovilizada. Descarga Reporte_Ecoamigos.xlsx. No incluye evidencia, criterios, catálogo ni comentarios; no tiene filtros ni varias hojas. El volumen aumenta uso de memoria y duración de respuesta.

## Logs y gestión de errores

`logger.js` crea logs relativos al directorio de trabajo y escribe de forma síncrona a info.log/error.log con fecha ISO. Registra accesos, IDs, correos, altas y revisiones. No es una auditoría inmutable, no rota archivos y no cubre todas las consultas públicas/exportaciones. La exportación usa console.error; numerosos controladores devuelven error.message al cliente. No publicar logs en GitHub.
