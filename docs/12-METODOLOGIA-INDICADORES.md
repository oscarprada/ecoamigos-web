# Metodología de indicadores ambientales

**Estado F14 CORREGIDO por retiro autorizado; factores RETIRADOS, no validados.** Fecha de retiro: 12 de septiembre de 2026, cambio local sin commit sobre HEAD 91178e02f62fee614934b06b168af767a6510456. No existe hash del retiro porque se solicitó no hacer commit. Se retiraron cálculo, objeto indicators de API, utilidad y cuatro tarjetas; no hay valores ni ceros sustitutos. General.total_quantity conserva el SQL F13 sin duplicación.

El cierre significa que se eliminó del producto activo el uso de factores sin trazabilidad suficiente. La siguiente auditoría se conserva como **documentación histórica del estado anterior al retiro**; sus menciones de factores activos, conservación provisional y F14 PARCIAL describen esa etapa, no el contrato vigente.

## Condición obligatoria para reintroducción

Solo se podrán reactivar equivalencias con metodología verificable que defina material específico, unidad, factor, fuente técnica, ubicación exacta en la fuente, escenario de comparación, conversión matemática reproducible y aplicabilidad a Ecoamigos. WARM distingue categorías concretas y escenarios de gestión; no se interpreta como factor genérico por kg. No se recuperan automáticamente las fórmulas preliminares.

## Auditoría histórica previa al retiro

## A. Evidencia del repositorio e historial local

Implementación: environmentalIndicators.js (archivo retirado; recuperable en los commits indicados), función calculateEnvironmentalIndicators. Consumidor: [publicController.js](../backend/src/controllers/publicController.js), getPublicStats. Presentación: [AdminDashboard.jsx](../frontend/src/pages/admin/AdminDashboard.jsx).

| Commit accesible | Fecha local del commit | Evidencia |
| --- | --- | --- |
| da6ab9ad543e806bbefa67fd4bdbb85577b3afe4 | 2026-05-12 19:27:51 -0500 | Introdujo la función y las cuatro fórmulas preliminares, sin bibliografía en ella. Mensaje: feat: indicadores ambientales y analítica institucional. |
| 308f07079f665a4e993e4f2fff51b6d3e5fa88ee | 2026-07-09 10:20:11 -0500 | Sustituyó las cuatro fórmulas por 0.017, 26.5, 1.0 y 4.1, solo sobre papel. Añadió comentarios EPA, sin título, URL, versión, tabla o página. Mensaje: feat: agregar sección de aliados institucionales en la página principal. |
| 91178e02f62fee614934b06b168af767a6510456 | 2026-09-12 14:27:34 -0500 | F13 conservó los factores, filtró la base y retiró redondeo prematuro. No añadió respaldo metodológico. |

Se contrastaron git log --follow, git blame, git show de ambos cambios y búsquedas de factores/fuentes en código, tests, README, docs, archivos distribuidos e historial local. Antes de F14 no se encontraron enlaces WARM ni bibliografía ambiental verificable incorporada; los documentos advertían falta de trazabilidad. Las páginas WARM solicitadas por el usuario se revisaron como evidencia externa, no como referencias preexistentes. Los commits demuestran la procedencia del código, **no de los números científicos**. No puede determinarse quién o qué documento originó los valores fuera del repositorio.

## Alcance y unidades vigentes

Sea P la suma histórica de quantity de papel_carton aprobado con lower(btrim(unit))='kg'. Incluye todos los períodos y filas sin período. Se conserva F13: no se convierten otras unidades, no se infieren bloques orgánicos, no se alteran ranking, puntos o catálogo. Los otros materiales no alimentan los cuatro factores. totalQuantity es un agregado de kg declarados aprobados de los cinco materiales, no una equivalencia ambiental, y no necesita estos factores.

La salida CO₂e es la **unidad prevista por el comentario heredado**, no una validación del factor. El frontend decía CO₂ y ahora explicita CO₂e. Los números siguen siendo estimaciones no validadas; no son inventarios de emisiones, ahorros medidos ni evidencia de cumplimiento institucional. El uso ilustrativo no permite clasificarlos como ESTIMACIÓN EDUCATIVA sustentada: falta evidencia técnica de la simplificación.

## Tabla de trazabilidad por indicador

Ubicación local anterior a F14: environmentalIndicators.js en HEAD 91178e0, líneas 42–53; comentarios EPA y expresiones. No había fuente bibliográfica local con ubicación verificable. Las referencias E1–E7 siguientes fueron verificadas externamente en esta revisión.

| Indicador | Fórmula y factor actual | Material / entrada → salida prevista | Fuente citada previamente / ubicación | Evidencia externa y ubicación exacta | ¿Contiene el factor exacto? | ¿Permite la operación actual? / naturaleza | Trazabilidad y clasificación |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Árboles | P × 0.017; árboles/kg | Papel/cartón; kg → árboles equivalentes estimados | “EPA”; comentario líneas 42–44, sin documento | E1, sección Less Pressure on Landfills and More Natural Resources for Future Generations; E2, Appendix 3, Flash Facts 6 y 17, páginas PDF 59 y 81 | Aparece 17 por ton, no 0.017 por kg | No demuestra conversión a tonelada métrica ni aplicación uniforme a papel/cartón; equivalencia divulgativa directa, no escenario definido | PARCIAL como pista documental; factor exacto NO DEMOSTRADO / NO SUSTENTADO |
| Agua | P × 26.5; L/kg | Papel/cartón; kg → L estimados | “EPA”; comentario líneas 46–47, sin documento | E1, misma sección; E2, Flash Fact 17, página PDF 81 | Aparece 7,000 gallons por ton, no 26.5 L/kg | Solo coincide aproximadamente bajo supuestos no demostrados sobre ton y gallon; divulgación sin balance de agua/metodología | PARCIAL como pista; factor exacto NO DEMOSTRADO / NO SUSTENTADO |
| CO₂e | P × 1.0; kg CO₂e/kg | Papel/cartón; kg → kg CO₂e supuestamente evitados | “EPA (valor conservador)”; líneas 49–50, sin documento | E3, What is the Waste Reduction Model?; E4, Paper Products §3.2, Exhibit 3-7, página interna 3-6 / PDF 41 | No se encontró respaldo al 1.0 universal en las fuentes revisadas | No: WARM compara escenarios y calcula emisiones netas por material. “Conservador” carece de demostración | NO DEMOSTRADO / NO SUSTENTADO |
| Energía | P × 4.1; kWh/kg | Papel/cartón; kg → kWh estimados | “EPA”; comentario líneas 52–53, sin documento | E6, A Win-Win Option, lista One ton of recycled paper; E5, Energy Impacts §7.3, página interna 7-3 / PDF 96 | NPS publica 4,100 kWh por ton, no 4.1 kWh/kg; no es una derivación EPA del factor | Ton no se demuestra métrica ni hay aplicación uniforme; NPS divulga equivalencia, WARM exige escenarios | PARCIAL como pista; factor exacto NO DEMOSTRADO / NO SUSTENTADO |

No hay indicador VALIDADO ni ESTIMACIÓN EDUCATIVA técnicamente sustentada en esta revisión. No se afirma que sea imposible encontrar respaldo: se documenta que no fue demostrado aquí. Etiquetar los valores como no validados conserva visibilidad y compatibilidad sin certificar su exactitud; no se eliminaron indicadores.

## Comparación con fórmulas preliminares

| Indicador | da6ab9a | Desde 308f070 | Diferencia |
| --- | --- | --- | --- |
| Árboles | P / 80 = P × 0.0125 | P × 0.017 | Factor 36 % mayor; no equivalentes |
| Agua | P × 50 | P × 26.5 | Factor 47 % menor |
| CO₂ | P × 1.8 + plástico × 1.5 + vidrio × 0.3 + metal × 2.1 | P × 1.0 | Cambia factor de papel y elimina aportes de otros materiales; comentario introduce CO₂e |
| Energía | P × 4 + plástico × 6 + metal × 14 | P × 4.1 | Papel aumenta 2.5 % y desaparecen los demás aportes |

Estas diferencias no permiten elegir una fórmula como correcta. Las preliminares tampoco tienen respaldo técnico localizado. No se restauraron.

## B. Evaluación externa de EPA WARM

E3 describe comparaciones entre gestión base y alternativa, con resultados de GEI en MTCO₂e y energía en millones de BTU. No valida árboles o litros, ni una regla universal por kg. E4 separa papel de oficina, cartón corrugado y mezclas; la categoría local papel_carton no identifica por sí sola una de esas composiciones.

Ejemplo **solo de evaluación**, E4, Exhibit 3-7: Office Paper tiene emisiones netas de reciclaje -2.86 y disposición en relleno +1.13 MTCO₂e/short ton. El cambio alternativa menos base sería -3.99 MTCO₂e/short ton; la magnitud evitada es positiva 3.99. No es el factor de Ecoamigos y no se adopta. E5 §7.3 exige también dos escenarios para energía; sus factores están en millones de BTU, no directamente kWh. Convertir unidades no reemplaza elegir material, escenario, límites y supuestos.

Ecoamigos no registra composición papel/cartón, escenario base/alternativo ni parámetros necesarios para reproducir ese cálculo. Por tanto, ni E3 ni el índice de capítulos WARM [E8](https://www.epa.gov/waste-reduction-model/documentation-chapters-emissions-energy-and-economic-factors-used-waste) acreditan por sí solos las fórmulas activas. No se importó WARM ni se alteró qué registros entran a F13.

## Comprobación matemática de unidades — no implementada

E7, Appendix B.8, filas gallon (U.S.), ton metric y ton short: 1 gal US ≈ 3.785412 L; 1 t métrica = 1000 kg; 1 short ton ≈ 907.1847 kg. Usamos la precisión publicada, no valores inventados. E1/E2/E6 dicen ton, sin demostrar allí que equivalga a 1000 kg. Los siguientes son cálculos **condicionales**, no fuentes de factores nuevos:

| Valor divulgado | Hipótesis de unidad y operación | Resultado condicional |
| --- | --- | --- |
| 17 árboles/ton | Si ton métrica: 17 / 1000; si short ton: 17 / 907.1847 | 0.017 o ≈0.0187393 árboles/kg |
| 7000 gal/ton | Si gal US y ton métrica: 7000 × 3.785412 / 1000 | 26.497884 L/kg ≈26.5; coincidencia numérica, no procedencia demostrada |
| 7000 gal/ton | Si gal US y short ton: 7000 × 3.785412 / 907.1847 | ≈29.2089 L/kg |
| 4100 kWh/ton | Si ton métrica: 4100 / 1000; si short ton: 4100 / 907.1847 | 4.1 o ≈4.51948 kWh/kg |
| Ejemplo WARM: 3.99 MTCO₂e/short ton evitadas | 3.99 × 1000 kg CO₂e/MTCO₂e / 907.1847 kg/short ton | ≈4.39822 kg CO₂e/kg para ese ejemplo, no 1.0 universal |

No se convierte ninguna quantity de la aplicación ni se cambia un factor. La aritmética válida con supuestos no demuestra que esos supuestos correspondan al material y contexto local.

## Evidencia pendiente para cerrar F14

- Árboles: documento técnico que defina especie/tamaño/rendimiento, papel frente a cartón, unidad de tonelada y derivación de 0.017 árboles/kg, o un reemplazo inequívocamente justificado.
- Agua: balance y alcance del agua ahorrada, tecnología/material, unidades originales y derivación verificable de 26.5 L/kg.
- CO₂e: metodología y tabla que sustenten 1.0 kg CO₂e/kg, límites, gases/GWP, material, escenario base y alternativo. No basta llamarlo conservador.
- Energía: fuente que sustente 4.1 kWh/kg, tipo de energía, proceso y comparación; aclarar ton y aplicabilidad a papel/cartón.

La decisión institucional futura deberá definir aplicabilidad local y uso permitido a partir de esa evidencia; ninguna fórmula se considera aprobada por conservarse en software. F14 permanece PARCIAL.

## Referencias verificadas (APA 7; consulta 12 de septiembre de 2026)

E1. U.S. Environmental Protection Agency. (s. f.). *Communicating the benefits of recycling* [Página archivada]. https://archive.epa.gov/wastes/conserve/tools/localgov/web/html/index-2.html

E2. U.S. Environmental Protection Agency. (s. f.). *Teach English, teach about the environment: A resource for teachers of adult English for speakers of other languages (ESOL)*. Appendix 3, Flash Facts 6 y 17. https://www.epa.gov/sites/production/files/2015-09/documents/tesol.pdf

E3. U.S. Environmental Protection Agency. (2026, 16 de junio). *Basic information about the Waste Reduction Model*. Sección What is the Waste Reduction Model? https://www.epa.gov/waste-reduction-model/basic-information-about-waste-reduction-model

E4. U.S. Environmental Protection Agency. (2023, diciembre). *Documentation for greenhouse gas emission and energy factors used in the Waste Reduction Model (WARM): Containers, packaging, and non-durable goods materials chapters* (Versión 16). Paper Products, §3.2, Exhibit 3-7. https://www.epa.gov/system/files/documents/2023-12/warm_containers_packaging_and_non-durable_goods_materials_v16_dec.pdf

E5. U.S. Environmental Protection Agency. (2023, diciembre). *Documentation for greenhouse gas emission and energy factors used in the Waste Reduction Model (WARM): Management practices chapters* (Versión 16). Energy Impacts, §7.3. https://www.epa.gov/system/files/documents/2024-01/warm_management_practices_v16_dec.pdf

E6. National Park Service. (2022, 30 de agosto). *Recycling fast facts*. Big Bend National Park. Sección A Win-Win Option. https://www.nps.gov/bibe/planyourvisit/biberecycle_fastfacts.htm

E7. National Institute of Standards and Technology. (s. f.). *NIST guide to the SI, Appendix B.8: Factors for units listed alphabetically*. Filas gallon (U.S.), ton metric y ton short. https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b8

E8. U.S. Environmental Protection Agency. (2026, 21 de julio). *Documentation chapters for emissions, energy and economic factors used in the Waste Reduction Model*. Índice, enlaces Management Practices y Containers, Packaging and Non-Durable Goods. https://www.epa.gov/waste-reduction-model/documentation-chapters-emissions-energy-and-economic-factors-used-waste

También se examinó U.S. Environmental Protection Agency. (s. f.). *Environmental factoids* [Archivo WasteWise]. https://archive.epa.gov/epawaste/conserve/smm/wastewise/web/html/factoid.html. Es una página divulgativa; no se emplea para acreditar los cuatro factores exactos.
