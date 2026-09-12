// F14 retirement; real HTTP and approved+kg SQL are exercised by F13.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root = new URL('../../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root), 'utf8');
test('F14: utilidad retirada y ningún consumidor ejecutable de equivalencias', () => {
  assert.equal(fs.existsSync(new URL('backend/src/utils/environmentalIndicators.js', root)), false);
  for (const folder of ['backend/src/', 'frontend/src/']) {
    for (const file of fs.readdirSync(new URL(folder, root), { recursive: true })) {
      if (!/\.(js|jsx)$/.test(file)) continue;
      const source = read(folder + file.replaceAll('\\', '/'));
      assert.doesNotMatch(source, /environmentalIndicators|estimatedTreesSaved|estimatedWaterSaved|estimatedCo2Reduction|estimatedEnergySaved/);
      assert.doesNotMatch(source, /\b(?:paperKg|plasticKg|glassKg|metalKg)\b/);
      assert.doesNotMatch(source, /\b0\.017\b|\b26\.5\b/);
      assert.doesNotMatch(source, /(?:\*\s*(?:4\.1|1\.0|50|1\.8|1\.5|0\.3|2\.1|14|6)\b|\/\s*80\b)/);
    }
  }
});
test('F14: dashboard sin tarjetas ni ceros sustitutos', () => {
  const ui = read('frontend/src/pages/admin/AdminDashboard.jsx');
  assert.doesNotMatch(ui, /indicators|formatIndicator|estimatedTrees|estimatedWater|estimatedCo2|estimatedEnergy/);
  assert.match(ui, /Cantidad total reciclada aprobada \(kg\)/);
  assert.match(ui, /general\?\.total_quantity/);
});
test('F14: documentación histórica conserva retiro y condición de reintroducción', () => {
  const doc = read('docs/12-METODOLOGIA-INDICADORES.md');
  for (const factor of ['0.017', '26.5', '1.0', '4.1']) assert.ok(doc.includes(factor));
  assert.match(doc, /RETIRADOS/);
  assert.match(doc, /sin commit/);
  assert.match(doc, /escenario de comparación/);
});
