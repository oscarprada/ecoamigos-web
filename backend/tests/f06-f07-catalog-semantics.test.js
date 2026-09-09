// F06-F07: caracteriza el catálogo sin interpretar sus textos como reglas ejecutables.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const catalog = parseCsv(read('database/points_catalog_clean.csv'));

test('F06: max_frequency conserva diez valores textuales con sus conteos reales', () => {
  assert.equal(catalog.length, 56);

  const frequencies = countBy(catalog, 'max_frequency');
  assert.deepEqual(Object.fromEntries([...frequencies].sort()), {
    '1 por visita': 2,
    '2 al mes': 1,
    '2 por semana': 1,
    '3 por semana': 1,
    Ilimitado: 38,
    Mensual: 5,
    Semanal: 3,
    Semestral: 1,
    Trimestral: 3,
    'Única vez': 1,
  });
});

test('F06: evidence_required son instrucciones, no un indicador booleano', () => {
  const evidence = catalog.map((row) => row.evidence_required);

  assert.equal(evidence.every((value) => value.trim().length > 0), true);
  assert.equal(new Set(evidence).size, 53);
  assert.ok(evidence.some((value) => /foto/i.test(value)));
  assert.ok(evidence.some((value) => /video/i.test(value)));
  assert.ok(evidence.some((value) => /enlace/i.test(value)));
  assert.ok(evidence.some((value) => /GPS/i.test(value)));
  assert.ok(evidence.some((value) => /sistema|historial/i.test(value)));
});

test('F06: frecuencia y evidencia de catálogo solo se exponen, no intervienen en registrar o aprobar', () => {
  const publicController = read('backend/src/controllers/publicController.js');
  const recyclingController = read('backend/src/controllers/recyclingController.js');
  const catalogReference = read('backend/src/utils/catalogReference.js');

  assert.match(publicController, /evidence_required/);
  assert.match(publicController, /max_frequency/);
  assert.doesNotMatch(recyclingController, /evidence_required|max_frequency/);
  assert.doesNotMatch(catalogReference, /evidence_required|max_frequency/);
});

test('F06: no existe lógica ejecutable de rachas en backend o frontend', () => {
  for (const directory of ['backend/src', 'frontend/src']) {
    for (const file of walk(path.join(root, directory))) {
      assert.doesNotMatch(
        fs.readFileSync(file, 'utf8'),
        /\b(?:racha|rachas|streak|streaks)\b/i,
        `Se encontró una posible lógica de rachas en ${path.relative(root, file)}`
      );
    }
  }
});

test('F07: el CSV conserva rangos descriptivos y no autoriza una referencia institucional orgánica', () => {
  const householdCollection = catalog.filter(
    (row) => row.group_name === 'Hogares' && row.action_name === 'Entrega acopio'
  );

  assert.deepEqual(
    householdCollection.map((row) => row.action_level),
    [
      'Nivel 1: Volumen bajo (1 a 5 kg)',
      'Nivel 2: Volumen medio (6 a 15 kg)',
      'Nivel 3: Volumen alto (16 a 30 kg)',
      'Nivel 4: Volumen masivo (+30 kg)',
    ]
  );

  const institutionalOrganic = catalog.filter(
    (row) => row.group_name === 'Dependencias institucionales'
      && row.action_name === 'Ciclo orgánico'
      && row.action_level === '5 kg de abono generado en compostera'
  );
  const householdOrganic = catalog.filter(
    (row) => row.group_name === 'Hogares'
      && row.action_name === 'Ciclo orgánico'
      && row.action_level === '5 kg de abono generado en compostera'
  );

  assert.equal(institutionalOrganic.length, 0);
  assert.equal(householdOrganic.length, 1);
  assert.equal(Number(householdOrganic[0].points), 40);
});

function countBy(rows, field) {
  const counts = new Map();
  for (const row of rows) counts.set(row[field], (counts.get(row[field]) || 0) + 1);
  return counts;
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  }).filter((file) => /\.(js|jsx)$/.test(file));
}

function parseCsv(source) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (character === '"') {
      if (quoted && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && source[index + 1] === '\n') index += 1;
      row.push(field);
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = '';
    } else {
      field += character;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records.map((values) => Object.fromEntries(
    headers.map((header, index) => [header, values[index]])
  ));
}
