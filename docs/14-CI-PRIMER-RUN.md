# Primer run real de CI: 78c0297

## Evidencia y límite del diagnóstico

El usuario aportó backend 54 pruebas, 41 aprobadas y 13 suites padre fallidas. Instalación, binarios y servicio efímero ya pasaban. El workspace estaba limpio al iniciar esta continuación.

Las 13 suites duplicaban initdb/pg_ctl/psql. pg_ctl start descartaba stdout/stderr con stdio ignore; el assert de estado ocultaba el motivo del fallo. No se fijaba unix_socket_directories. PostgreSQL documenta un valor vacío por defecto en Windows y un directorio configurable al compilar en Unix: https://www.postgresql.org/docs/18/runtime-config-connection.html#GUC-UNIX-SOCKET-DIRECTORIES

**Hipótesis principal, no causa remota confirmada:** un socket Unix en el directorio del paquete Linux sin permisos para el usuario del runner. Los logs recibidos no contienen el error del servidor ni la etapa exacta. La consulta de Actions mediante el conector devolvió 404. No se afirma que initdb como root haya causado el fallo.

El YAML usa ubuntu-24.04, no un job container; solo apt usa sudo. Los tests no usan sudo y heredan el usuario del runner. Su identidad efectiva anterior no consta en la evidencia. El nuevo helper imprime usuario/UID y rechaza UID 0 antes de initdb. La variable Linux es exactamente /usr/lib/postgresql/18/bin. No hay Docker disponible; wsl --list informó que WSL no está instalado. La validación Linux definitiva requiere el segundo run.

## Corrección común

backend/tests/helpers/postgresCluster.js centraliza las 13 suites: D01, F08, F09, F10, F11, F12, F13, F15, F16, instalación, S01–S03, S04–S07 y S11. Solo se sustituyeron imports y preparación del clúster; se conservaron fixtures, SQL y assertions funcionales.

- Binarios mediante path.join y extensión .exe únicamente en Windows; ejecución directa sin shell. initdb, pg_ctl, psql, createdb y postgres deben ser 18 con la misma versión menor. createdb se verifica; las suites crean bases por SQL.
- PostgreSQL temporal escucha únicamente 127.0.0.1, sin sockets Unix. Configuración escrita en su propio postgresql.conf, sin quoting de rutas temporales dentro de opciones de shell. No depende de /var/run/postgresql ni cambia permisos de directorios compartidos.
- mkdtemp mantiene directorios separados; data y logs permanecen dentro de ellos. No se borran archivos ajenos. El finally de cada suite detiene solo su data directory; un arranque fallido intenta detener su propio clúster antes de propagar el error. Los directorios se conservan para inspección, igual que antes.
- Se mantiene test-concurrency=2. El kernel elige puertos libres distintos durante la reserva. Hay necesariamente una ventana entre cerrar la reserva Node y abrir PostgreSQL; se maneja con hasta cinco intentos, exclusivamente ante un error de puerto ocupado. No se afirma una transferencia atómica de sockets ni se ocultan otros fallos.
- El runner elimina PG*, DB_* y DATABASE_URL heredados, tanto para Node/pg como para subprocess. La configuración de aplicación queda en puerto 1/base ficticia; las suites conectan por host/puerto/user/database explícitos a sus clústeres. No se usa el service container para sustituir regresiones.
- Error enriquecido con suite, etapa, binario, exit/signal, spawn error, stdout/stderr y log del servidor. No se imprimen argumentos SQL ni stdin. Se redactan conexiones y secretos reconocibles y se acota la salida. pg_ctl usa archivos para capturar salida: evita pipes heredados por descendientes en Windows.

El primer intento local dentro del sandbox falló con el mensaje concreto de initdb sobre token restringido de Windows. La validación se repitió fuera del sandbox con autorización, siempre con clústeres desechables.

## QUALITY GATE y DEPENDENCY RISK REPORT

quality sigue fallando si falla instalación, regresión, build o check. dependency-audit ejecuta cuatro npm audit --json (backend/frontend, completo/omit=dev). Un exit 1 se acepta como informe completado únicamente si hay JSON audit v2 válido, sin error, con contadores y hallazgos coherentes con ese estado. Los riesgos generan warnings, tabla en GITHUB_STEP_SUMMARY y cuatro JSON descargables mediante upload-artifact. Un informe completado no significa dependencias seguras.

Errores de proceso/red, timeout, códigos distintos de 0/1, JSON inválido/incompleto o estados incoherentes hacen fallar el job. Se intentan las cuatro auditorías y se conserva el resumen incluso si una falla. No hay continue-on-error, audit fix ni || true. S12 permanece PARCIAL.

Validación local del informe: backend completo y producción 17 (4 moderados, 12 altos, 1 crítico); frontend completo 18 (3 bajos, 6 moderados, 9 altos); frontend producción 6 (4 moderados, 2 altos). Capturas de evidencia en docs/audits/s12-ci-first-run; la salida regenerable audit-results/ está ignorada por Git y se publica como artifact en CI. Ninguna dependencia o lockfile se actualizó.

## Validación final

Windows / Node 24.13.0 / PostgreSQL 18.1: npm test --prefix backend: 199/199, cero fallos/omisiones; npm test --prefix frontend: 49/49, cero fallos/omisiones; npm run build --prefix frontend aprobado; npm run check aprobado (73 archivos de sintaxis, YAML y git diff --check). Las tres pruebas nuevas verifican aislamiento de entorno, clasificación de audit y diagnóstico de binario ausente.

S11 conserva default 1000, rango 1–10000, LIMIT + 1, 422 sin truncamiento, 429 en concurrencia, liberación del lock incluso ante errores y celdas de texto frente a Excel injection. S11: CORREGIDO. S12: PARCIAL.

No se modificó código de aplicación, SQL, catálogo, ranking ni puntos. No se conectó ni modificó ecoamigos real ni sus uploads. Los controles de catálogo se ejecutan sobre copias temporales. Sin commit, push ni deploy.

## Segundo run que debe revisar el usuario

Comprobar usuario/UID no root, ruta y versiones PostgreSQL 18, arranque de las 13 suites y totales completos sin omisiones, frontend, build/check y QUALITY GATE verde. Si falla un clúster, conservar el error enriquecido (etapa y log), sin inferir la causa por actual 1/expected 0. Revisar las advertencias, resumen y cuatro artifacts JSON del informe de riesgos; si ese job falla, revisar si falló la generación del informe. El commit y push quedan a cargo del usuario.

## Archivos de esta continuación

.github/workflows/ci.yml; scripts/run-tests.mjs; scripts/check-workflow.mjs; scripts/dependency-risk-report.mjs; backend/tests/helpers/postgresCluster.js; backend/tests/ci-infrastructure.test.js; backend/tests/{d01-migration,f08-review,f09-periods,f10-record-period,f11-registration-access,f12-user-limit,f13-approved-stats,f15-admin-scope,f16-password-recovery,installation,s01-s03-auth,s04-s07-files,s11-export}.test.js; README.md; docs/08-OPERACION.md; docs/09-CALIDAD-Y-PENDIENTES.md; este informe; .gitignore; docs/audits/s12-ci-first-run/{backend-full,backend-production,frontend-full,frontend-production}.json y summary.md.
