// F04: protege de forma estática el flujo vigente de puntos.
// No carga .env, no inicia el servidor y no se conecta a PostgreSQL.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('F04: la fórmula histórica fue retirada y no quedan imports', () => {
  assert.equal(fs.existsSync(path.join(root, 'backend/src/utils/calculatePoints.js')), false);

  for (const directory of ['backend/src', 'frontend/src']) {
    for (const file of walk(path.join(root, directory))) {
      assert.doesNotMatch(read(path.relative(root, file)), /calculatePoints|getPointsRules/);
    }
  }
});

test('el registro nace con cero y la aprobación obtiene points_catalog.points', () => {
  const controller = read('backend/src/controllers/recyclingController.js');

  assert.match(controller, /SELECT\s+points\s+FROM points_catalog/i);
  assert.match(controller, /LOWER\(TRIM\(group_name\)\)/);
  assert.match(controller, /LOWER\(TRIM\(action_name\)\)/);
  assert.match(controller, /LOWER\(TRIM\(COALESCE\(action_level, ''\)\)\)/);
  assert.match(controller, /catalog_action_level \|\| ''/);
  assert.match(controller, /'pending',\$12,\$13,\$14,0/);
  assert.match(controller, /if \(status === 'approved'\)[\s\S]*getCatalogPoints/);
  assert.match(controller, /points_awarded = \$4/);
  assert.match(controller, /\[status, normalizeValue\(review_notes\), req\.user\.id, points, id\]/);
});

test('ranking suma points_awarded aprobados únicamente en el periodo activo', () => {
  const controller = read('backend/src/controllers/publicController.js');
  const ranking = controller.slice(
    controller.indexOf('export async function getRanking'),
    controller.indexOf('export async function getPublicStats'),
  );

  assert.match(ranking, /COALESCE\(SUM\(rr\.points_awarded\), 0\) AS total_points/);
  assert.match(ranking, /rr\.period_id = \$1/);
  assert.match(ranking, /rr\.status = 'approved'/);
});

test('el catálogo distribuido conserva sus 56 registros', () => {
  const lines = read('database/points_catalog_clean.csv').trimEnd().split(/\r?\n/);
  assert.equal(lines.length, 57, 'Se esperaba una cabecera y 56 registros de catálogo');
});

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  }).filter((file) => /\.(js|jsx)$/.test(file));
}
