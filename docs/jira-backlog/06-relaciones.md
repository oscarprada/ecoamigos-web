# Relaciones, dependencias y decisiones de jerarquía

**Reconstrucción retrospectiva, corte 2026-09-28; HEAD local 53985bb.** Jira no se utilizó durante el desarrollo original. IDs, jerarquía, prioridades y criterios se proponen ahora a partir de evidencia; no representan tickets, sprints, reuniones o estimaciones históricas. No se crean issues ni se asigna trabajo individual a los dos estudiantes.

Parent Internal ID describe pertenencia lógica; Dependencies significa «depende técnicamente de» y no fecha de realización, bloqueo histórico o relación Jira ya creada. No hay sprints ni estimaciones. Los Bugs enlazan con la capacidad o Epic afectada. Las Tasks puramente técnicas dependen de una Epic o una Story funcional real.

## Relaciones directas

| Hijo | Tipo | Padre lógico | Epic | Dependencias adicionales |
| --- | --- | --- | --- | --- |
| [ST01](01-backlog-completo.md#st01) | Story | [EP03](01-backlog-completo.md#ep03) | EP03 | No identificadas |
| [ST02](01-backlog-completo.md#st02) | Story | [EP03](01-backlog-completo.md#ep03) | EP03 | [ST01](01-backlog-completo.md#st01) |
| [ST03](01-backlog-completo.md#st03) | Story | [EP04](01-backlog-completo.md#ep04) | EP04 | [ST01](01-backlog-completo.md#st01) |
| [ST04](01-backlog-completo.md#st04) | Story | [EP04](01-backlog-completo.md#ep04) | EP04 | [ST01](01-backlog-completo.md#st01) |
| [ST05](01-backlog-completo.md#st05) | Story | [EP04](01-backlog-completo.md#ep04) | EP04 | [ST01](01-backlog-completo.md#st01) |
| [ST06](01-backlog-completo.md#st06) | Story | [EP05](01-backlog-completo.md#ep05) | EP05 | No identificadas |
| [ST07](01-backlog-completo.md#st07) | Story | [EP05](01-backlog-completo.md#ep05) | EP05 | [ST01](01-backlog-completo.md#st01) |
| [ST08](01-backlog-completo.md#st08) | Story | [EP06](01-backlog-completo.md#ep06) | EP06 | [ST01](01-backlog-completo.md#st01), [ST04](01-backlog-completo.md#st04), [ST05](01-backlog-completo.md#st05) |
| [ST09](01-backlog-completo.md#st09) | Story | [EP06](01-backlog-completo.md#ep06) | EP06 | [ST01](01-backlog-completo.md#st01), [ST08](01-backlog-completo.md#st08) |
| [ST10](01-backlog-completo.md#st10) | Story | [EP07](01-backlog-completo.md#ep07) | EP07 | [ST01](01-backlog-completo.md#st01), [ST08](01-backlog-completo.md#st08) |
| [ST11](01-backlog-completo.md#st11) | Story | [EP07](01-backlog-completo.md#ep07) | EP07 | [ST05](01-backlog-completo.md#st05), [ST10](01-backlog-completo.md#st10) |
| [ST12](01-backlog-completo.md#st12) | Story | [EP08](01-backlog-completo.md#ep08) | EP08 | [ST10](01-backlog-completo.md#st10) |
| [ST13](01-backlog-completo.md#st13) | Story | [EP08](01-backlog-completo.md#ep08) | EP08 | [ST01](01-backlog-completo.md#st01), [ST08](01-backlog-completo.md#st08) |
| [ST14](01-backlog-completo.md#st14) | Story | [EP09](01-backlog-completo.md#ep09) | EP09 | No identificadas |
| [ST15](01-backlog-completo.md#st15) | Story | [EP07](01-backlog-completo.md#ep07) | EP07 | No identificadas |
| [ST16](01-backlog-completo.md#st16) | Story | [EP07](01-backlog-completo.md#ep07) | EP07 | No identificadas |
| [ST17](01-backlog-completo.md#st17) | Story | [EP08](01-backlog-completo.md#ep08) | EP08 | No identificadas |
| [TK01](01-backlog-completo.md#tk01) | Task | [EP01](01-backlog-completo.md#ep01) | EP01 | No identificadas |
| [TK02](01-backlog-completo.md#tk02) | Task | [EP01](01-backlog-completo.md#ep01) | EP01 | [TK01](01-backlog-completo.md#tk01) |
| [TK03](01-backlog-completo.md#tk03) | Task | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [TK04](01-backlog-completo.md#tk04) | Task | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [TK05](01-backlog-completo.md#tk05) | Task | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [TK06](01-backlog-completo.md#tk06) | Task | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [TK07](01-backlog-completo.md#tk07) | Task | [ST08](01-backlog-completo.md#st08) | EP06 | [ST01](01-backlog-completo.md#st01), [ST04](01-backlog-completo.md#st04), [ST05](01-backlog-completo.md#st05) |
| [TK08](01-backlog-completo.md#tk08) | Task | [ST08](01-backlog-completo.md#st08) | EP06 | [TK07](01-backlog-completo.md#tk07) |
| [TK09](01-backlog-completo.md#tk09) | Task | [ST10](01-backlog-completo.md#st10) | EP07 | [TK07](01-backlog-completo.md#tk07) |
| [TK10](01-backlog-completo.md#tk10) | Task | [ST10](01-backlog-completo.md#st10) | EP07 | [TK04](01-backlog-completo.md#tk04) |
| [TK11](01-backlog-completo.md#tk11) | Task | [ST06](01-backlog-completo.md#st06) | EP05 | No identificadas |
| [TK12](01-backlog-completo.md#tk12) | Task | [ST07](01-backlog-completo.md#st07) | EP05 | [ST01](01-backlog-completo.md#st01) |
| [TK13](01-backlog-completo.md#tk13) | Task | [ST13](01-backlog-completo.md#st13) | EP08 | [ST01](01-backlog-completo.md#st01) |
| [TK14](01-backlog-completo.md#tk14) | Task | [EP09](01-backlog-completo.md#ep09) | EP09 | No identificadas |
| [TK15](01-backlog-completo.md#tk15) | Task | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [TK16](01-backlog-completo.md#tk16) | Task | [EP10](01-backlog-completo.md#ep10) | EP10 | No identificadas |
| [TK17](01-backlog-completo.md#tk17) | Task | [EP10](01-backlog-completo.md#ep10) | EP10 | [TK04](01-backlog-completo.md#tk04) |
| [TK18](01-backlog-completo.md#tk18) | Task | [EP10](01-backlog-completo.md#ep10) | EP10 | No identificadas |
| [TK19](01-backlog-completo.md#tk19) | Task | [EP10](01-backlog-completo.md#ep10) | EP10 | No identificadas |
| [TK20](01-backlog-completo.md#tk20) | Task | [EP10](01-backlog-completo.md#ep10) | EP10 | [TK17](01-backlog-completo.md#tk17), [TK18](01-backlog-completo.md#tk18), [TK19](01-backlog-completo.md#tk19) |
| [TK21](01-backlog-completo.md#tk21) | Task | [EP10](01-backlog-completo.md#ep10) | EP10 | No identificadas |
| [TK22](01-backlog-completo.md#tk22) | Task | [EP10](01-backlog-completo.md#ep10) | EP10 | [TK21](01-backlog-completo.md#tk21) |
| [TK23](01-backlog-completo.md#tk23) | Task | [EP11](01-backlog-completo.md#ep11) | EP11 | No identificadas |
| [TK24](01-backlog-completo.md#tk24) | Task | [EP11](01-backlog-completo.md#ep11) | EP11 | No identificadas |
| [TK25](01-backlog-completo.md#tk25) | Task | [ST02](01-backlog-completo.md#st02) | EP03 | [ST01](01-backlog-completo.md#st01) |
| [TK26](01-backlog-completo.md#tk26) | Task | [EP11](01-backlog-completo.md#ep11) | EP11 | [TK23](01-backlog-completo.md#tk23), [TK24](01-backlog-completo.md#tk24) |
| [TK27](01-backlog-completo.md#tk27) | Task | [EP10](01-backlog-completo.md#ep10) | EP10 | No identificadas |
| [BG-D01](01-backlog-completo.md#bg-d01) | Bug | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [BG-D02](01-backlog-completo.md#bg-d02) | Bug | [ST03](01-backlog-completo.md#st03) | EP04 | No identificadas |
| [BG-D03](01-backlog-completo.md#bg-d03) | Bug | [ST07](01-backlog-completo.md#st07) | EP05 | No identificadas |
| [BG-D04](01-backlog-completo.md#bg-d04) | Bug | [ST10](01-backlog-completo.md#st10) | EP07 | No identificadas |
| [BG-D05](01-backlog-completo.md#bg-d05) | Bug | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [TK-D06](01-backlog-completo.md#tk-d06) | Task | [EP01](01-backlog-completo.md#ep01) | EP01 | No identificadas |
| [BG-D07](01-backlog-completo.md#bg-d07) | Bug | [ST03](01-backlog-completo.md#st03) | EP04 | No identificadas |
| [BG-D08](01-backlog-completo.md#bg-d08) | Bug | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [BG-D09](01-backlog-completo.md#bg-d09) | Bug | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [BG-D10](01-backlog-completo.md#bg-d10) | Bug | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [BG-F01](01-backlog-completo.md#bg-f01) | Bug | [ST16](01-backlog-completo.md#st16) | EP07 | No identificadas |
| [BG-F02](01-backlog-completo.md#bg-f02) | Bug | [ST16](01-backlog-completo.md#st16) | EP07 | No identificadas |
| [BG-F03](01-backlog-completo.md#bg-f03) | Bug | [ST15](01-backlog-completo.md#st15) | EP07 | No identificadas |
| [BG-F04](01-backlog-completo.md#bg-f04) | Bug | [ST10](01-backlog-completo.md#st10) | EP07 | No identificadas |
| [BG-F05](01-backlog-completo.md#bg-f05) | Bug | [ST08](01-backlog-completo.md#st08) | EP06 | [TK-D06](01-backlog-completo.md#tk-d06) |
| [TK-F06](01-backlog-completo.md#tk-f06) | Task | [EP01](01-backlog-completo.md#ep01) | EP01 | No identificadas |
| [BG-F07](01-backlog-completo.md#bg-f07) | Bug | [EP07](01-backlog-completo.md#ep07) | EP07 | [TK-D06](01-backlog-completo.md#tk-d06) |
| [BG-F08](01-backlog-completo.md#bg-f08) | Bug | [ST10](01-backlog-completo.md#st10) | EP07 | No identificadas |
| [BG-F09](01-backlog-completo.md#bg-f09) | Bug | [ST05](01-backlog-completo.md#st05) | EP04 | No identificadas |
| [BG-F10](01-backlog-completo.md#bg-f10) | Bug | [ST08](01-backlog-completo.md#st08) | EP06 | No identificadas |
| [BG-F11](01-backlog-completo.md#bg-f11) | Bug | [ST08](01-backlog-completo.md#st08) | EP06 | No identificadas |
| [BG-F12](01-backlog-completo.md#bg-f12) | Bug | [ST03](01-backlog-completo.md#st03) | EP04 | No identificadas |
| [BG-F13](01-backlog-completo.md#bg-f13) | Bug | [ST12](01-backlog-completo.md#st12) | EP08 | No identificadas |
| [BG-F14](01-backlog-completo.md#bg-f14) | Bug | [ST17](01-backlog-completo.md#st17) | EP08 | No identificadas |
| [TK-F15](01-backlog-completo.md#tk-f15) | Task | [EP04](01-backlog-completo.md#ep04) | EP04 | No identificadas |
| [TK-F16](01-backlog-completo.md#tk-f16) | Task | [ST02](01-backlog-completo.md#st02) | EP03 | [ST01](01-backlog-completo.md#st01) |
| [BG-F17](01-backlog-completo.md#bg-f17) | Bug | [ST14](01-backlog-completo.md#st14) | EP09 | No identificadas |
| [BG-F18](01-backlog-completo.md#bg-f18) | Bug | [ST14](01-backlog-completo.md#st14) | EP09 | No identificadas |
| [BG-F19](01-backlog-completo.md#bg-f19) | Bug | [ST08](01-backlog-completo.md#st08) | EP06 | No identificadas |
| [BG-F20](01-backlog-completo.md#bg-f20) | Bug | [ST14](01-backlog-completo.md#st14) | EP09 | No identificadas |
| [BG-S01](01-backlog-completo.md#bg-s01) | Bug | [ST01](01-backlog-completo.md#st01) | EP03 | No identificadas |
| [BG-S02](01-backlog-completo.md#bg-s02) | Bug | [ST01](01-backlog-completo.md#st01) | EP03 | No identificadas |
| [BG-S03](01-backlog-completo.md#bg-s03) | Bug | [EP03](01-backlog-completo.md#ep03) | EP03 | No identificadas |
| [BG-S04](01-backlog-completo.md#bg-s04) | Bug | [EP06](01-backlog-completo.md#ep06) | EP06 | No identificadas |
| [BG-S05](01-backlog-completo.md#bg-s05) | Bug | [ST09](01-backlog-completo.md#st09) | EP06 | No identificadas |
| [BG-S06](01-backlog-completo.md#bg-s06) | Bug | [ST07](01-backlog-completo.md#st07) | EP05 | No identificadas |
| [BG-S07](01-backlog-completo.md#bg-s07) | Bug | [EP06](01-backlog-completo.md#ep06) | EP06 | No identificadas |
| [BG-S08](01-backlog-completo.md#bg-s08) | Bug | [EP10](01-backlog-completo.md#ep10) | EP10 | No identificadas |
| [BG-S09](01-backlog-completo.md#bg-s09) | Bug | [EP10](01-backlog-completo.md#ep10) | EP10 | No identificadas |
| [BG-S10](01-backlog-completo.md#bg-s10) | Bug | [EP10](01-backlog-completo.md#ep10) | EP10 | No identificadas |
| [BG-S11](01-backlog-completo.md#bg-s11) | Bug | [ST13](01-backlog-completo.md#st13) | EP08 | No identificadas |
| [BG-S12](01-backlog-completo.md#bg-s12) | Bug | [EP10](01-backlog-completo.md#ep10) | EP10 | No identificadas |
| [BG-CI](01-backlog-completo.md#bg-ci) | Bug | [EP10](01-backlog-completo.md#ep10) | EP10 | [TK20](01-backlog-completo.md#tk20) |
| [BG-ENV](01-backlog-completo.md#bg-env) | Bug | [EP02](01-backlog-completo.md#ep02) | EP02 | No identificadas |
| [BG-UI](01-backlog-completo.md#bg-ui) | Bug | [ST06](01-backlog-completo.md#st06) | EP05 | No identificadas |

## Dependencias relevantes y su justificación

- ST03/ST04/ST05 necesitan ST01 para operaciones administrativas. ST08 necesita identidad, equipo y período; TK07 implementa el endpoint y TK08 su formulario.
- ST09/ST10/ST13 consumen registros creados por ST08, pero pueden tener su mecanismo terminado y probado con fixtures aunque ST08 siga parcial por falta de catálogo institucional. Dependencia técnica no es una regla automática de propagación de estado.
- ST11 consulta aprobaciones ST10 del período ST05. No depende de las capacidades retiradas ST15/ST16.
- BG-F05 y BG-F07 dependen de TK-D06 para cierre institucional; no se copian puntos de otro grupo. Los tests validan el rechazo, no crean una decisión de Parques.
- TK-F16 implementa recuperación temporal; ST02 conserva pendiente TK25 de correo. S01 revoca sesiones después del reset; S02 sigue parcial pese a existir logout.
- TK20 usa las suites TK17/TK18/TK19. BG-CI se relaciona con TK20 por el fallo real del primer run. TK27 registra auditoría; BG-S12 no se cierra porque CI esté verde.
- TK22 desarrolla evidencia manual prevista por TK21; TK26 requiere la documentación TK23/TK24 para una recepción futura. No se afirma que dichas decisiones ya ocurrieron.

## Relaciones de sustitución histórica

| Capacidad histórica cancelada | Corrección/retiro realizado | Capacidad que permanece |
| --- | --- | --- |
| ST15 Premios | BG-F03; 1821e21 | Sin premios; tablas legacy conservadas |
| ST16 Ganadores | BG-F01/BG-F02; 1821e21 | ST11 ranking, sin declarar ganadores |
| ST17 Equivalencias ambientales | BG-F14; fc3389a | ST12 estadísticas approved + kg |

No se suman Story y sus Tasks/Bugs como esfuerzo histórico independiente. Son vistas de trazabilidad de necesidad, implementación y corrección. La jerarquía lógica se adapta únicamente después de conocer la configuración de Jira: [plan de importación](08-plan-importacion-jira.md).

## Decisiones históricas documentadas

Pregunta 12 → RF-020 (crear/responder quizzes, Could/opcional) → RF-021 (puntos o insignias posibles, Could): se vinculan a TK02 bajo EP01 para decidir inclusión, aplazamiento o descarte. No hay implementación ni cancelación acreditada. Pregunta 10/RF-010 sustenta premios (ST15); RF-009 sustenta ganadores (ST16). Se conservan Cancelled por decisiones posteriores F01–F03, no por inexistencia de la necesidad original.

## Adaptación de relaciones para el script preparado

La jerarquía lógica anterior permanece intacta y el grafo combinado de padres y dependencias no tiene ciclos. La versión 09 conserva los tipos originales y utiliza Epic como padre Jira de todo elemento estándar. Cuando Parent Internal ID apunta a Story, preserva ese ID en Description y crea un vínculo de relación después de obtener las claves. Dependencies genera un vínculo donde la referencia bloquea al elemento que depende de ella; no se interpreta pertenencia como bloqueo. La compatibilidad con el proyecto real queda pendiente, según [08](08-plan-importacion-jira.md).
