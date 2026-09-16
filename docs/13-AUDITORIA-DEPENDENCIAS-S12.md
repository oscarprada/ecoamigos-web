# S12: auditoría separada de dependencias — 2026-09-16

Esta evaluación no es una certificación de seguridad ni un resultado de explotación. No se ejecutaron PoC contra la aplicación, audit fix, force ni overrides de versiones mayores. Los avisos se consultaron en npm y los rangos se contrastaron con advisories; el análisis de exposición se basa en el código actual. No se leyó .env ni se conectó una base real.

## Resultados registrados

| Comando | Baja | Moderada | Alta | Crítica | Total de paquetes marcados |
| --- | --- | --- | --- | --- | --- |
| npm audit --prefix backend | 0 | 4 | 12 | 1 | 17 |
| npm audit --prefix backend --omit=dev | 0 | 4 | 12 | 1 | 17 |
| npm audit --prefix frontend | 3 | 6 | 9 | 0 | 18 |
| npm audit --prefix frontend --omit=dev | 0 | 4 | 2 | 0 | 6 |

La captura anterior al ajuste de tooling tenía los mismos totales. La instalación npm ci también emite un resumen abreviado; los resultados de referencia de esta tabla son los cuatro comandos npm audit explícitos, guardados en [audits/s12-2026-09-16](audits/s12-2026-09-16). No se interpreta una diferencia de resumen/cache como una corrección. Las bases de advisories cambian con el tiempo: repetir los comandos antes de desplegar.

## tar: crítico, presente en producción

Cadena verificada con npm ls y fuentes instaladas: **bcrypt@5.1.1 → @mapbox/node-pre-gyp@1.0.11 → tar@6.2.1**. npm audit --omit=dev lo incluye; por tanto no es exclusivamente una dependencia de desarrollo.

El aviso crítico reportado por npm es [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw): descompresión/parsing TAR sin límites, rango <=7.5.18. También hay avisos altos de traversal/hardlinks/symlinks, por ejemplo [GHSA-83g3-92jg-28cx](https://github.com/advisories/GHSA-83g3-92jg-28cx), y [recursión hasta 7.5.20](https://github.com/advisories/GHSA-r292-9mhp-454m). npm view confirmó tar 7.5.22 publicado, fuera de los rangos listados en esta captura.

Uso real: bcrypt requiere node-pre-gyp.find para localizar el binding nativo. El código tar.extract está en node-pre-gyp/lib/install.js para instalar el binario; el flujo normal hash/compare no llama a ese extractor. No hay endpoint Ecoamigos que extraiga TAR de usuarios. Esto reduce la exposición HTTP observada, pero **no elimina el riesgo de instalación/cadena de suministro**: npm ci con scripts puede procesar archivos del binario nativo con permisos del instalador.

No se aplicó tar 7 a la fuerza: node-pre-gyp declara tar ^6.1.11. Sustituirlo salta un major fuera del contrato del padre; no se demostró una actualización compatible de esa cadena. bcrypt 6 es otro major y requiere revisar instalación nativa/hashes/plataformas; queda para una actualización dedicada. No se modificó autenticación S01–S03 para resolverlo. Seguimiento prioritario antes de despliegue; S12 permanece PARCIAL.

## Clasificación y decisiones por grupos

Las versiones candidatas siguientes se verificaron con npm view o se identifican expresamente como mínimos derivados del advisory. No se afirma que actualizar solo un paquete elimine toda la cadena ni que npm audit fixAvailable=false signifique ausencia universal de parche.

| Grupo y cadena | Versión afectada / alcance | Riesgo y uso real | Corrección candidata, compatibilidad y decisión |
| --- | --- | --- | --- |
| bcrypt → node-pre-gyp → tar | 5.1.1 → 1.0.11 → 6.2.1; production; crítico/alto | Instalación nativa, como se detalla arriba | tar 7.5.22 publicado, major fuera de ^6; evaluar bcrypt 6. No aplicado |
| bcrypt/node-pre-gyp y ExcelJS → archiver/archiver-utils/zip-stream/unzipper/fstream/rimraf/glob/minimatch → brace-expansion | brace-expansion 1.1.14/2.1.1; también 5.0.7 por nodemon dev; alto | Patrones glob con expansión patológica. La exportación escribe celdas, no acepta patrones glob del usuario; npm instala bibliotecas que incluyen esas rutas. No equivale a riesgo cero | GHSA-rgw5-rvv9-x895 requiere 1.1.18/2.1.4/5.0.9 según rama; 5.0.12 publicado. Actualizar por rama compatible y revisar padres en trabajo dedicado; no forzar todos a un major |
| express → body-parser/qs | express 4.22.2, body-parser 1.20.5, qs 6.15.3; production; moderado agregado | Parsers HTTP y query string, exposición de red real. El caso de límite inválido body-parser no corresponde al express.json sin límite manipulado, pero quedan avisos qs | qs 6.16.0 publicado; body-parser requiere >=1.20.6 para el aviso de límite (último publicado consultado 2.3.0, major). Revisar restricciones del padre; no sustituir transitivas arbitrariamente |
| ExcelJS → uuid | uuid 8.3.2; production; moderado | Aviso de bounds en v3/v5/v6 con buffer proporcionado. No se llama a esas funciones desde Ecoamigos; no inferir su uso solo por inclusión | Mínimo del advisory 11.1.1; último 14.0.2 publicado. Major fuera de la cadena actual, no aplicado. ExcelJS último consultado continúa 4.4.0 |
| axios → follow-redirects/form-data | axios 1.15.0, form-data 4.0.5; production frontend; alto/moderado | Axios sí lleva Bearer en navegador. Avisos HTTP adapter/proxy afectan Node, no el adaptador navegador actual; gadgets de prototype pollution requieren contaminación previa, no demostrada aquí. No se declara inmune | Axios 1.20.0 publicado, misma línea major y fuera de rangos hasta <1.18.0 de esta captura; form-data 4.0.6 y follow-redirects 1.16.0 publicados. Priorizar actualización puntual con pruebas de adaptador real/interceptores/Blob antes de despliegue; no aplicada en esta continuación para no confundir revisión con certificación de toda la cadena |
| react-router-dom → react-router/@remix-run/router | react-router-dom/react-router 6.30.3; production; moderado | SPA BrowserRouter sin SSR hydration; enlaces/navegaciones internos usan destinos definidos. No hay SSR para el aviso deserializeErrors; redirects siguen requiriendo evaluación | Se listan parches parciales 6.30.4/1.23.3 para un aviso; otros requieren 7.18.0 y react-router-dom <=6.30.5 tiene aviso propio. Último 7.18.4 publicado, major; no migrar a 7 solo para bajar el contador |
| Vite → PostCSS → nanoid | Vite 8.0.8, PostCSS 8.5.9; dev; alto | Servidor de desarrollo Windows y procesamiento CSS/sourcemaps. No forma parte del hosting estático final, pero sí afecta equipo/CI si procesa entradas hostiles | Vite 8.3.0 y PostCSS 8.5.28 publicados, fuera de rangos de esta captura; nanoid requiere 3.3.18 para todos los avisos de la rama (último 6.0.1 es major). No exponer dev server; actualizar esa cadena por separado |
| plugin React → Babel/helpers/targets → browserslist/baseline-browser-mapping | @babel/core 7.29.0, browserslist afectado <=4.28.6; dev; alto agregado, avisos individuales bajos/moderados/altos | Compilación de fuentes y sourcemaps, no procesamiento de documentos subidos. Entradas de PR se compilan en CI aislado sin secretos | Browserslist 4.29.0 publicado; baseline mínimo 2.11.0 según aviso; Babel último 8.0.5 implica major. Tooling no se declara libre de vulnerabilidades tras el ajuste del plugin |

Los avisos/rangos concretos de cada grupo y paquetes propagadores están en el inventario detallado inferior y los JSON originales. No todas las filas agregadas representan una vulnerabilidad independiente. El job dependency-audit no usa continue-on-error ni ignora resultados: se espera que falle mientras los avisos registrados sigan presentes.

## Cambios puntuales autorizados

- **yaml 2.9.1**, nueva devDependency backend: parser real para validar YAML/contrato del workflow, sin runtime de aplicación. Un paquete añadido al lock backend, sin cambiar sus dependencias de producción.
- **@vitejs/plugin-react 4.7.0 → 5.2.0**, dev frontend: npm ci fallaba con ERESOLVE por peer de Vite hasta 7. La versión 5.2.0 declara Vite 8. Se revisó el [cambio mayor 5](https://github.com/vitejs/vite-plugin-react/releases/tag/plugin-react@5.0.0): Node 24 cumple el requisito, no se usan opciones de Babel compiler ni exclude/dedupe especiales. La razón es corregir instalación reproducible, no prometer cero vulnerabilidades. Se probaron npm ci sin flags de omisión, frontend completo y build, además de regresión backend.
- El lock frontend registra react-refresh 0.17.0 → 0.18.0, @rolldown/pluginutils beta.27 → rc.3 y la resolución de dependencias opcionales WASM @emnapi realizada por npm. No se actualizaron React, Router, Axios ni Vite.
- No se usó npm audit fix (con o sin force), ni legacy-peer-deps, ni overrides de tar. Las actualizaciones de seguridad restantes están clasificadas como seguimiento, no como aplicadas.

**Estado S12: PARCIAL** por vulnerabilidades pendientes, además de primera ejecución GitHub Actions pendiente hasta commit/push del usuario. CI de calidad y auditoría están implementados; no hay despliegue automático.


## Inventario detallado devuelto por npm audit

Cada fila es un paquete marcado por npm (no una vulnerabilidad única). Un paquete puede heredar severidad por sus dependencias. Los JSON adjuntos conservan todos los avisos, rangos, nodos y fixAvailable originales.

| Paquete | Alcance | Directo | Versión instalada | Severidad agregada | Advisories directos / cadena |
| --- | --- | --- | --- | --- | --- |
| backend: @mapbox/node-pre-gyp | production | no | 1.0.11 | high | rimraf; tar |
| backend: archiver | production | no | 5.3.2 | high | archiver-utils; zip-stream |
| backend: archiver-utils | production | no | 2.1.0, 3.0.4 | high | glob |
| backend: bcrypt | production | sí | 5.1.1 | high | @mapbox/node-pre-gyp |
| backend: body-parser | production | no | 1.20.5 | moderate | [GHSA-v422-hmwv-36x6](https://github.com/advisories/GHSA-v422-hmwv-36x6); qs |
| backend: brace-expansion | production | no | 5.0.7, 1.1.14, 2.1.1 | high | [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp); [GHSA-3jxr-9vmj-r5cp](https://github.com/advisories/GHSA-3jxr-9vmj-r5cp); [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg); [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg); [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg); [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895); [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895); [GHSA-rgw5-rvv9-x895](https://github.com/advisories/GHSA-rgw5-rvv9-x895) |
| backend: exceljs | production | sí | 4.4.0 | high | archiver; unzipper; uuid |
| backend: express | production | sí | 4.22.2 | moderate | body-parser; qs |
| backend: fstream | production | no | 1.0.12 | high | rimraf |
| backend: glob | production | no | 7.2.3 | high | minimatch |
| backend: minimatch | production | no | 3.1.5 | high | brace-expansion |
| backend: qs | production | no | 6.15.3 | moderate | [GHSA-x5fp-wj9c-mxmx](https://github.com/advisories/GHSA-x5fp-wj9c-mxmx); [GHSA-4mjr-xmp4-gh2g](https://github.com/advisories/GHSA-4mjr-xmp4-gh2g) |
| backend: rimraf | production | no | 2.7.1, 3.0.2 | high | glob |
| backend: tar | production | no | 6.2.1 | critical | [GHSA-34x7-hfp2-rc4v](https://github.com/advisories/GHSA-34x7-hfp2-rc4v); [GHSA-8qq5-rm4j-mr97](https://github.com/advisories/GHSA-8qq5-rm4j-mr97); [GHSA-83g3-92jg-28cx](https://github.com/advisories/GHSA-83g3-92jg-28cx); [GHSA-qffp-2rhf-9h96](https://github.com/advisories/GHSA-qffp-2rhf-9h96); [GHSA-9ppj-qmqm-q256](https://github.com/advisories/GHSA-9ppj-qmqm-q256); [GHSA-r6q2-hw4h-h46w](https://github.com/advisories/GHSA-r6q2-hw4h-h46w); [GHSA-vmf3-w455-68vh](https://github.com/advisories/GHSA-vmf3-w455-68vh); [GHSA-w8wr-v893-vjvp](https://github.com/advisories/GHSA-w8wr-v893-vjvp); [GHSA-23hp-3jrh-7fpw](https://github.com/advisories/GHSA-23hp-3jrh-7fpw); [GHSA-8x88-c5mf-7j5w](https://github.com/advisories/GHSA-8x88-c5mf-7j5w); [GHSA-gvwx-54wh-qm9j](https://github.com/advisories/GHSA-gvwx-54wh-qm9j); [GHSA-r292-9mhp-454m](https://github.com/advisories/GHSA-r292-9mhp-454m) |
| backend: unzipper | production | no | 0.10.14 | high | fstream |
| backend: uuid | production | no | 8.3.2 | moderate | [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) |
| backend: zip-stream | production | no | 4.1.1 | high | archiver-utils |
| frontend: @babel/core | dev | no | 7.29.0 | high | @babel/helper-compilation-targets; @babel/helper-module-transforms; [GHSA-4x5r-pxfx-6jf8](https://github.com/advisories/GHSA-4x5r-pxfx-6jf8) |
| frontend: @babel/helper-compilation-targets | dev | no | 7.28.6 | high | browserslist |
| frontend: @babel/helper-module-transforms | dev | no | 7.28.6 | low | @babel/core |
| frontend: @babel/plugin-transform-react-jsx-self | dev | no | 7.27.1 | low | @babel/core |
| frontend: @babel/plugin-transform-react-jsx-source | dev | no | 7.27.1 | low | @babel/core |
| frontend: @remix-run/router | production | no | 1.23.2 | moderate | [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) |
| frontend: @vitejs/plugin-react | dev | sí | 5.2.0 | moderate | @babel/core; @babel/plugin-transform-react-jsx-self; @babel/plugin-transform-react-jsx-source; vite |
| frontend: axios | production | sí | 1.15.0 | high | [GHSA-w9j2-pvgh-6h63](https://github.com/advisories/GHSA-w9j2-pvgh-6h63); [GHSA-pmwg-cvhr-8vh7](https://github.com/advisories/GHSA-pmwg-cvhr-8vh7); [GHSA-3w6x-2g7m-8v23](https://github.com/advisories/GHSA-3w6x-2g7m-8v23); [GHSA-xhjh-pmcv-23jw](https://github.com/advisories/GHSA-xhjh-pmcv-23jw); [GHSA-445q-vr5w-6q77](https://github.com/advisories/GHSA-445q-vr5w-6q77); [GHSA-m7pr-hjqh-92cm](https://github.com/advisories/GHSA-m7pr-hjqh-92cm); [GHSA-5c9x-8gcm-mpgx](https://github.com/advisories/GHSA-5c9x-8gcm-mpgx); [GHSA-vf2m-468p-8v99](https://github.com/advisories/GHSA-vf2m-468p-8v99); [GHSA-pf86-5x62-jrwf](https://github.com/advisories/GHSA-pf86-5x62-jrwf); [GHSA-6chq-wfr3-2hj9](https://github.com/advisories/GHSA-6chq-wfr3-2hj9); [GHSA-xx6v-rp6x-q39c](https://github.com/advisories/GHSA-xx6v-rp6x-q39c); [GHSA-q8qp-cvcw-x6jj](https://github.com/advisories/GHSA-q8qp-cvcw-x6jj); [GHSA-62hf-57xw-28j9](https://github.com/advisories/GHSA-62hf-57xw-28j9); [GHSA-hfxv-24rg-xrqf](https://github.com/advisories/GHSA-hfxv-24rg-xrqf); [GHSA-777c-7fjr-54vf](https://github.com/advisories/GHSA-777c-7fjr-54vf); [GHSA-p92q-9vqr-4j8v](https://github.com/advisories/GHSA-p92q-9vqr-4j8v); [GHSA-j5f8-grm9-p9fc](https://github.com/advisories/GHSA-j5f8-grm9-p9fc); [GHSA-3g43-6gmg-66jw](https://github.com/advisories/GHSA-3g43-6gmg-66jw); [GHSA-35jp-ww65-95wh](https://github.com/advisories/GHSA-35jp-ww65-95wh); [GHSA-898c-q2cr-xwhg](https://github.com/advisories/GHSA-898c-q2cr-xwhg); [GHSA-pjwm-pj3p-43mv](https://github.com/advisories/GHSA-pjwm-pj3p-43mv); [GHSA-mmx7-hfxf-jppx](https://github.com/advisories/GHSA-mmx7-hfxf-jppx); [GHSA-pmv8-rq9r-6j72](https://github.com/advisories/GHSA-pmv8-rq9r-6j72); [GHSA-mwf2-3pr3-8698](https://github.com/advisories/GHSA-mwf2-3pr3-8698); [GHSA-7q8q-rj6j-mhjq](https://github.com/advisories/GHSA-7q8q-rj6j-mhjq); [GHSA-jqh4-m9w3-8hp9](https://github.com/advisories/GHSA-jqh4-m9w3-8hp9); [GHSA-f4gw-2p7v-4548](https://github.com/advisories/GHSA-f4gw-2p7v-4548); [GHSA-42h9-826w-cgv3](https://github.com/advisories/GHSA-42h9-826w-cgv3); follow-redirects; form-data |
| frontend: baseline-browser-mapping | dev | no | 2.10.18 | moderate | [GHSA-w5vr-8v7q-w6rv](https://github.com/advisories/GHSA-w5vr-8v7q-w6rv) |
| frontend: browserslist | dev | no | 4.28.2 | high | [GHSA-c83g-rgw3-j3cx](https://github.com/advisories/GHSA-c83g-rgw3-j3cx); [GHSA-73wf-gq98-2v4g](https://github.com/advisories/GHSA-73wf-gq98-2v4g); baseline-browser-mapping; update-browserslist-db |
| frontend: follow-redirects | production | no | 1.15.11 | moderate | [GHSA-r4q5-vmmm-2653](https://github.com/advisories/GHSA-r4q5-vmmm-2653) |
| frontend: form-data | production | no | 4.0.5 | high | [GHSA-hmw2-7cc7-3qxx](https://github.com/advisories/GHSA-hmw2-7cc7-3qxx) |
| frontend: nanoid | dev | no | 3.3.11 | high | [GHSA-28wg-ghj8-5hjv](https://github.com/advisories/GHSA-28wg-ghj8-5hjv); [GHSA-2v37-7h3g-55p8](https://github.com/advisories/GHSA-2v37-7h3g-55p8); [GHSA-xwg4-73v4-xw9w](https://github.com/advisories/GHSA-xwg4-73v4-xw9w) |
| frontend: postcss | dev | no | 8.5.9 | high | [GHSA-qx2v-qp2m-jg93](https://github.com/advisories/GHSA-qx2v-qp2m-jg93); [GHSA-6g55-p6wh-862q](https://github.com/advisories/GHSA-6g55-p6wh-862q); [GHSA-fxqj-rqcc-2cmp](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp); [GHSA-r28c-9q8g-f849](https://github.com/advisories/GHSA-r28c-9q8g-f849); nanoid |
| frontend: react-router | production | no | 6.30.3 | moderate | @remix-run/router; [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6); [GHSA-337j-9hxr-rhxg](https://github.com/advisories/GHSA-337j-9hxr-rhxg); [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) |
| frontend: react-router-dom | production | sí | 6.30.3 | moderate | @remix-run/router; [GHSA-jjmj-jmhj-qwj2](https://github.com/advisories/GHSA-jjmj-jmhj-qwj2); react-router |
| frontend: update-browserslist-db | dev | no | 1.2.3 | high | browserslist |
| frontend: vite | dev | sí | 8.0.8 | high | [GHSA-v6wh-96g9-6wx3](https://github.com/advisories/GHSA-v6wh-96g9-6wx3); [GHSA-fx2h-pf6j-xcff](https://github.com/advisories/GHSA-fx2h-pf6j-xcff); postcss |
