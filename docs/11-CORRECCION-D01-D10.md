# Entrega controlada: instalación y datos D01–D10

> **HISTÓRICO: entrega inicial D01–D10.** Las limitaciones y estados del cuerpo reflejan ese momento. Posteriormente se incorporó la migración D01 (3b27ab6); D01 está CORREGIDO y D06 permanece PENDIENTE INSTITUCIONAL. El retiro funcional de premios/ganadores ocurrió después (1821e21), conservando tablas históricas. El proyecto informa aplicación y verificación de D01/F09/F16/S01 en PostgreSQL local de desarrollo/QA; no hubo despliegue institucional. Las pruebas aisladas relatadas aquí no niegan esa aplicación posterior. Estado vigente: [trazabilidad y decisiones](15-TRAZABILIDAD-Y-DECISIONES.md).

## Alcance y verificación previa

Se partió de un árbol de trabajo limpio. Se revisaron nuevamente rutas, controladores, configuración, SQL, seed, CSV y consumidores frontend; se inspeccionó el inventario de 42 archivos de fuente/estilos. Los diez hallazgos seguían vigentes. Se confirmó nuevamente con bcrypt que el hash del seed no correspondía a su contraseña comentada.

No se tocaron F01–F20, S01–S12 ni T01–T28. Sus secciones en el documento de calidad conservan exactamente el texto de HEAD. No se cambió el frontend, sus estilos, rutas HTTP, cálculo de puntos ni reglas de revisión. No se hizo commit ni push.

## Decisiones

- **Esquema oficial único:** `database/schema.sql`, solo base vacía. Los otros dos archivos son entradas de compatibilidad `psql` con `\ir`, sin definiciones duplicadas.
- **Hashes:** únicamente password_hash en esquema, createUser y bootstrap. `password` sigue siendo el campo de entrada del formulario/API, nunca una columna escrita por el código nuevo.
- **Catálogo:** conservados points_catalog y los tres catalog_* porque creación y aprobación los usan. evidence_required TEXT conserva las descripciones originales; índice de identidad coincide con la normalización de getCatalogPoints.
- **Contenido:** categorías agua/energia/papel/residuos; tipos text/image/video/file. No se asignan categorías a contenido histórico ni se convierten registros existentes.
- **Seed:** sin escrituras y sin datos de demostración. Administrador requiere datos explícitos del responsable, no una cuenta o clave inventada.
- **CSV:** se conserva exactamente el archivo de origen. Importación optativa desde raíz, transaccional, sin duplicar ni sobrescribir. D06 no se resuelve inventando grupos o tomando los puntos de Hogares.
- **Bases existentes:** solo se ofrece inspección de estructura de lectura y procedimiento de conciliación. No se ejecutó migración ni se borró tabla, columna o fila de la aplicación.

## Premios y ganadores

Se explicó el impacto antes de editar. Aunque premios salió del alcance de producto, el código todavía consulta `prizes` dentro de ranking y tiene rutas/formularios asociados. Se conserva `prizes` por compatibilidad y `winner_records` como estructura histórica; no se incluyen datos para ellas. `rewards` desaparece únicamente de la definición alternativa sustituida, sin ejecutar DROP sobre ninguna base.

Una retirada posterior afecta `backend/src/controllers/publicController.js`, `adminController.js`, `backend/src/routes/adminRoutes.js`, `frontend/src/App.jsx`, `frontend/src/pages/admin/AdminSettingsPage.jsx`, `frontend/src/pages/public/PrizesPage.jsx`, `WinnersPage.jsx`, `EducationCategoryPage.jsx`, `frontend/src/components/Navbar.jsx`, esquema y documentación de módulos. No se retira ese código en esta tarea.

## Resultados por hallazgo

| Hallazgo | Estado | Límite |
| --- | --- | --- |
| D01 | **PARCIAL** | Esquema y consultas conciliados para base nueva; falta migración específica de la base existente. |
| D02 | **CORREGIDO en código/base nueva** | Se probó INSERT real usando solo password_hash; bases con password NOT NULL necesitan migración autorizada. |
| D03 | **CORREGIDO en base nueva** | SQL y restricciones actuales comprobados; clasificación de contenido antiguo es manual. |
| D04 | **CORREGIDO en base nueva** | Catálogo/referencias presentes y consultas preparadas; no se reconstruyen referencias históricas. |
| D05 | **CORREGIDO en base nueva** | CSV descriptivo importado como TEXT; conversión desde BOOLEAN existente requiere decisión. |
| D06 | **PENDIENTE DE DECISIÓN** | Faltan datos institucionales autorizados. |
| D07 | **CORREGIDO** | Sin credenciales defectuosas/default; bootstrap probado. Crear cuenta real y verificar login queda para instalación. |
| D08 | **CORREGIDO en instalación** | Ningún dato de ejemplo se siembra; datos antiguos no eliminados. |
| D09 | **CORREGIDO en instalación** | Seed repetido sin escrituras; bootstrap repetido aborta, sin sustituir cuenta. No se deduplican datos anteriores. |
| D10 | **CORREGIDO** | Importación repetida conserva filas; conflictos abortan sin sobrescribir; índice evita nuevas identidades repetidas. |

Ningún estado se fundamenta únicamente en compilación. “Base nueva” no implica que una instalación existente esté ya migrada.

## Comprobaciones

Se utilizó PostgreSQL 18.1 en un **cluster temporal nuevo**, con puerto local separado y sin cargar .env. Solo se usaron el CSV suministrado y fixtures explícitas de prueba en ese cluster; no se creó información de negocio en la base real. El cluster temporal quedó detenido y sus archivos se conservaron en la carpeta temporal del sistema para inspección.

Resultado: **6 pruebas aprobadas, 0 fallidas, 0 omitidas**, incluyendo el contenedor de pruebas. Se comprobó:

1. Instalación vacía, columna password ausente, password_hash presente, evidencia TEXT, tres catalog_* y tipos/categorías coincidentes con frontend.
2. **39 consultas estáticas** de controladores preparadas por PostgreSQL contra el esquema oficial, sin ejecutar flujos de negocio reales.
3. Reinstalación aborta; seed ejecutado dos veces no escribe; diagnóstico de estructura de solo lectura.
4. CSV de 56 filas importado dos veces sin cambios, texto con comas/comillas preservado, grupo institucional ausente, conflicto de metadatos abortado sin sobrescribir y duplicado normalizado rechazado por el índice.
5. Bootstrap sin parámetros rechazado, hash generado validado con bcrypt, alta SQL con solo password_hash y segundo bootstrap rechazado sin modificar la cuenta. También se ejecutó el INSERT extraído de createUser con fixture aislada.

Durante la primera ejecución se detectó que `\quit 1` no entregaba el error esperado de psql; se sustituyó por excepción explícita con ON_ERROR_STOP y la repetición pasó. El sandbox de Windows impidió inicialmente iniciar initdb; la prueba se ejecutó con permiso fuera del sandbox, siempre en cluster separado.

Repetición de la prueba (requiere binarios PostgreSQL y dependencias del backend):

```powershell
$env:ECOAMIGOS_TEST_PG_BIN = 'C:/Program Files/PostgreSQL/18/bin'
node --test backend/tests/installation.test.js
```

Sin esa variable la prueba se omite expresamente; una omisión no es aprobación. El script no acepta una URL de una base existente. Los archivos temporales no se eliminan automáticamente.

Además: comprobación de sintaxis JavaScript del backend/scripts/tests; build del frontend exitoso, con los avisos de deprecación ya existentes del plugin Vite; diff sin errores de espacios; enlaces documentales y conservación de las secciones protegidas y CSV verificados. No se probaron navegador, migración histórica ni login real.

## Archivos modificados y añadidos

Modificados (14):

```text
README.md
backend/schema.sql
backend/src/controllers/adminController.js
backend/src/seed.sql
database/import_points_catalog.sql
database/schema.sql
docs/01-INSTALACION.md
docs/02-ARQUITECTURA.md
docs/03-BASE-DE-DATOS.md
docs/04-API.md
docs/06-REGLAS-Y-BACKEND.md
docs/08-OPERACION.md
docs/09-CALIDAD-Y-PENDIENTES.md
docs/sql/schema-referencia.sql
```

Añadidos (6):

```text
backend/scripts/hash-password.js
backend/tests/installation.test.js
database/README.md
database/create_admin.sql
database/inspect_existing.sql
docs/11-CORRECCION-D01-D10.md
```

Los cambios documentales adicionales eliminan instrucciones contradictorias de instalación/hash. `frontend/dist` fue regenerado por build y permanece ignorado por Git. No se modificaron dependencias, lockfiles, CSV ni archivos fuente frontend.
