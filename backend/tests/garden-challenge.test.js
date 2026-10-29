import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { postgresHarness } from './helpers/postgresCluster.js';
import { createGardenHandlers } from '../src/controllers/gardenHandlers.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('Huerta: permisos, fechas, aprobación, ranking y premios únicos en PostgreSQL aislado', { skip: !bin && 'Requiere PostgreSQL aislado' }, async t => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-garden-'));
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 'garden-challenge.test.js' });
  const port = await start();
  const pool = new pg.Pool({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres', max: 5 });
  t.after(async () => { await pool.end(); ok(run('pg_ctl', ['-D', path.join(temporary, 'data'), '-m', 'fast', '-w', 'stop'])); });
  const psql = file => run('psql', ['-X', '-h', '127.0.0.1', '-p', String(port), '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-f', file]);
  ok(psql('database/schema.sql'));
  // Exercise additive migration against the original schema in a separate database.
  ok(run('createdb', ['-h', '127.0.0.1', '-p', String(port), '-U', 'postgres', 'migration_fixture']));
  const migrationPool = new pg.Pool({ host: '127.0.0.1', port, user: 'postgres', database: 'migration_fixture' });
  try {
    const oldSchema = fs.readFileSync(path.join(root, 'database/schema.sql'), 'utf8').replace(/^\\.*$/gm, '').replace(/CREATE TABLE garden_crops[\s\S]*?(?=COMMIT;)/, '');
    await migrationPool.query(oldSchema);
    await migrationPool.query("INSERT INTO teams(name,dependency) VALUES('Preserved fixture','Fixture')");
    const migration = () => run('psql', ['-X', '-h', '127.0.0.1', '-p', String(port), '-U', 'postgres', '-d', 'migration_fixture', '-f', 'database/20261013_garden_challenge.sql']);
    ok(migration()); assert.notEqual(migration().status, 0);
    assert.equal((await migrationPool.query('SELECT count(*)::int AS n FROM teams')).rows[0].n, 1);
    const columns = `SELECT table_name,column_name,data_type,is_nullable,column_default FROM information_schema.columns WHERE table_name IN ('garden_crops','garden_evidence') ORDER BY table_name,ordinal_position`;
    assert.deepEqual((await migrationPool.query(columns)).rows, (await pool.query(columns)).rows);
  } finally { await migrationPool.end(); }
  await pool.query(`INSERT INTO teams(name,dependency) VALUES('Fixture A','Fixture'),('Fixture B','Fixture');
    INSERT INTO users(name,email,password_hash,role,team_id) VALUES('Fixture leader','l@test.invalid','fixture','leader',1),('Fixture admin','a@test.invalid','fixture','admin',NULL),('Fixture other','o@test.invalid','fixture','leader',2);
    INSERT INTO periods(name,start_date,end_date,is_active) VALUES('Fixture period',CURRENT_DATE-10,CURRENT_DATE+10,true)`);
  const today = (await pool.query('SELECT CURRENT_DATE::text AS today')).rows[0].today;
  const leader = { id: 1, role: 'leader', team_id: 1 }, admin = { id: 2, role: 'admin', team_id: null }, other = { id: 3, role: 'leader', team_id: 2 };
  const removed = [];
  const handlers = createGardenHandlers({ pool, removeStored: async url => removed.push(url) });
  const call = async (name, user, body = {}, params = {}, file) => {
    const res = { code: 200, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } };
    await handlers[name]({ user, body, params, file }, res); return res;
  };
  const cropBody = { bed: 'Era fixture', vegetables: ['tomate', 'ají'], description: 'Cultivo de prueba' };
  assert.equal((await call('createCrop', admin, cropBody)).code, 403);
  assert.equal((await call('createCrop', { ...leader, team_id: null }, cropBody)).code, 403);
  assert.equal((await call('createCrop', leader, { ...cropBody, vegetables: ['invalid'] })).code, 400);
  const crop = await call('createCrop', leader, { ...cropBody, team_id: 2 });
  assert.equal(crop.code, 201); assert.equal(crop.body.team_id, 1);
  let fileNumber = 0;
  const evidence = (stage, user = leader, extra = {}, id = crop.body.id) => call('addEvidence', user,
    { stage, record_date: today, story: 'Progreso fixture', period_id: 1, ...extra }, { id }, { filename: 'fixture.png', url: `/uploads/managed/evidence/fixture-${++fileNumber}.png` });
  assert.equal((await evidence('crecimiento', other)).code, 403);
  assert.equal(removed.length, 1);
  assert.equal((await evidence('crecimiento', leader, { record_date: '2026-02-30' })).code, 400);
  assert.equal((await evidence('crecimiento', leader, { record_date: '2099-01-01' })).code, 400);
  assert.equal((await evidence('crecimiento', leader, { period_id: 999 })).code, 409);
  assert.equal((await evidence('other')).code, 400);
  assert.equal((await call('addEvidence', leader, { stage: 'crecimiento', record_date: today, story: 'Foto requerida', period_id: 1 }, { id: crop.body.id })).code, 400);
  assert.equal((await call('addEvidence', leader, { stage: 'crecimiento', record_date: today, story: 'Solo fotos', period_id: 1 }, { id: crop.body.id }, { filename: 'fixture.mp4', url: '/uploads/managed/evidence/video.mp4' })).code, 400);
  const review = (id, status = 'approved', user = admin) => call('review', user, { status, review_notes: 'Validación fixture', points_awarded: 99999 }, { id });
  const follow = await evidence('seguimiento'); assert.equal(follow.code, 201);
  assert.equal((await review(follow.body.id, 'approved', leader)).code, 403);
  assert.equal((await review(follow.body.id)).body.points_awarded, 0);
  const rejected = await evidence('crecimiento'); assert.equal((await review(rejected.body.id, 'rejected')).body.points_awarded, 0);
  assert.equal((await review(rejected.body.id)).code, 409);
  const growth = await evidence('crecimiento'), duplicate = await evidence('crecimiento');
  assert.equal(growth.body.points_awarded, 0);
  const approvals = await Promise.all([review(growth.body.id), review(duplicate.body.id)]);
  assert.deepEqual(approvals.map(res => res.code), [200, 200]);
  assert.equal(approvals.reduce((sum, res) => sum + res.body.points_awarded, 0), 50);
  assert.equal((await review(growth.body.id)).code, 409);
  const harvest = await evidence('cosecha');
  await pool.query(`CREATE FUNCTION garden_test_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Fixture failure'; END $$;
    CREATE CONSTRAINT TRIGGER garden_test_failure AFTER UPDATE ON garden_evidence DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION garden_test_fail()`);
  try {
    assert.equal((await review(harvest.body.id)).code, 500);
    const unchanged = (await pool.query('SELECT status,points_awarded FROM garden_evidence WHERE id=$1', [harvest.body.id])).rows[0];
    assert.deepEqual(unchanged, { status: 'pending', points_awarded: 0 });
  } finally { await pool.query('DROP TRIGGER garden_test_failure ON garden_evidence; DROP FUNCTION garden_test_fail()'); }
  const sameRequest = await Promise.all([review(harvest.body.id), review(harvest.body.id)]);
  assert.deepEqual(sameRequest.map(res => res.code).sort(), [200, 409]);
  const extraHarvest = await evidence('cosecha'); assert.equal((await review(extraHarvest.body.id)).body.points_awarded, 0);
  await pool.query("UPDATE periods SET is_active=false; INSERT INTO periods(name,start_date,end_date,is_active) VALUES('Fixture next period',CURRENT_DATE-1,CURRENT_DATE+1,true)");
  const nextGrowth = await evidence('crecimiento', leader, { period_id: 2 });
  assert.equal((await review(nextGrowth.body.id)).body.points_awarded, 0);
  assert.equal((await pool.query('SELECT sum(points_awarded)::int AS n FROM garden_evidence')).rows[0].n, 150);
  assert.equal((await call('list', other)).body.evidence.length, 0);
  assert.ok((await call('list', admin)).body.evidence.length > 0);
  assert.equal((await call('list', { role: 'unknown' })).code, 403);
  // Database constraint independently prevents accidental duplicate awards.
  await assert.rejects(pool.query('UPDATE garden_evidence SET points_awarded=50 WHERE id=$1', [nextGrowth.body.id]), error => error.code === '23505');
  // Real ranking controller, with database injection only (no db.js or .env).
  let source = fs.readFileSync(path.join(root, 'backend/src/controllers/publicController.js'), 'utf8');
  globalThis.__gardenTestPool = pool;
  source = source.replace("import { query } from '../config/db.js';", 'const pool=globalThis.__gardenTestPool; const query=(...args)=>pool.query(...args);');
  const { getRanking } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
  delete globalThis.__gardenTestPool;
  await pool.query('UPDATE periods SET is_active=false WHERE id=2; UPDATE periods SET is_active=true WHERE id=1');
  await pool.query("INSERT INTO recycling_records(user_id,team_id,period_id,material_type,quantity,quality_level,status,points_awarded) VALUES(1,1,1,'organico',1,'alta','approved',20)");
  const ranking = { status() { return this; }, json(body) { this.body = body; } };
  await getRanking({}, ranking);
  assert.equal(Number(ranking.body.ranking.find(row => row.id === 1).total_points), 170);
  // Real file access handler rejects a different group before resolving disk paths.
  let fileSource = fs.readFileSync(path.join(root, 'backend/src/controllers/fileController.js'), 'utf8');
  fileSource = fileSource.replace("import { query } from '../config/db.js';", 'const query=()=>{};');
  for (const name of ['fileStore', 'fileFormats']) fileSource = fileSource.replace(`'../services/${name}.js'`, JSON.stringify(new URL(`../src/services/${name}.js`, import.meta.url).href));
  const { createFileHandlers } = await import('data:text/javascript;base64,' + Buffer.from(fileSource).toString('base64'));
  const fileHandler = createFileHandlers((...args) => pool.query(...args)).garden;
  const fileRes = { status(code) { this.code = code; return this; }, json(body) { this.body = body; } };
  await fileHandler({ params: { id: growth.body.id }, user: other }, fileRes); assert.equal(fileRes.code, 403);
});
