// F01-F03: comprobaciones estáticas del retiro de premios y ganadores.
// No carga .env, no inicia el servidor y no se conecta a PostgreSQL.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

test('F01: no quedan páginas, rutas ni enlaces ejecutables de ganadores/premios', () => {
  assert.equal(fs.existsSync(path.join(root, 'frontend/src/pages/public/WinnersPage.jsx')), false);
  assert.equal(fs.existsSync(path.join(root, 'frontend/src/pages/public/PrizesPage.jsx')), false);

  for (const file of [
    'frontend/src/App.jsx',
    'frontend/src/components/Navbar.jsx',
    'frontend/src/pages/public/EducationCategoryPage.jsx',
    'frontend/src/pages/admin/AdminSettingsPage.jsx',
    'frontend/src/pages/admin/AdminDashboard.jsx',
  ]) {
    assert.doesNotMatch(read(file), /prize|premio|winner|ganador|\/prizes|\/winners/i, file);
  }
});

test('F02-F03: ranking conserva su contrato y el backend no consulta el módulo retirado', () => {
  const publicController = read('backend/src/controllers/publicController.js');
  const rankingController = publicController.slice(
    publicController.indexOf('export async function getRanking'),
    publicController.indexOf('export async function getPublicStats'),
  );
  assert.match(rankingController, /currentPeriod/);
  assert.match(rankingController, /ranking/);
  assert.match(rankingController, /SUM\(rr\.points_awarded\)/);
  assert.doesNotMatch(rankingController, /prize|winner|FROM\s+prizes/i);

  const rankingPage = read('frontend/src/pages/public/RankingPage.jsx');
  assert.match(rankingPage, /get\('\/public\/ranking'\)/);
  assert.match(rankingPage, /data\.ranking/);
  assert.match(rankingPage, /total_points/);

  const adminRoutes = read('backend/src/routes/adminRoutes.js');
  const adminController = read('backend/src/controllers/adminController.js');
  assert.doesNotMatch(adminRoutes, /prize|premio|\/prizes/i);
  assert.doesNotMatch(adminController, /prize|premio|FROM\s+prizes|INTO\s+prizes/i);
});

test('las estructuras PostgreSQL históricas siguen declaradas', () => {
  const schema = read('database/schema.sql');
  assert.match(schema, /CREATE TABLE prizes/i);
  assert.match(schema, /CREATE TABLE winner_records/i);

  const migration = read('database/20260908_d01_migrate_existing.sql');
  assert.match(migration, /public\.prizes/i);
  assert.match(migration, /public\.winner_records/i);
  assert.match(migration, /public\.rewards/i);
  assert.doesNotMatch(migration, /DROP\s+(TABLE|COLUMN)/i);
});
