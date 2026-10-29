import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { postgresHarness } from './helpers/postgresCluster.js';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('Ranking sin migración de huerta: todos los grupos mantienen puntos y datos', { skip: !bin && 'Requiere PostgreSQL aislado' }, async t => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-ranking-legacy-'));
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 'ranking-legacy-schema.test.js' });
  const port = await start();
  const pool = new pg.Pool({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres' });
  t.after(async () => { await pool.end(); ok(run('pg_ctl', ['-D', path.join(temporary, 'data'), '-m', 'fast', '-w', 'stop'])); });
  const schema = fs.readFileSync(path.join(root, 'database/schema.sql'), 'utf8').replace(/^\\.*$/gm, '').replace(/CREATE TABLE garden_crops[\s\S]*?(?=COMMIT;)/, '');
  await pool.query(schema);
  await pool.query(`INSERT INTO teams(name,dependency) VALUES('Administrativa','Fixture'),('Otro grupo','Fixture');
    INSERT INTO users(name,email,password_hash,role,team_id) VALUES('Fixture uno','one@test.invalid','fixture','leader',1),('Fixture dos','two@test.invalid','fixture','leader',2);
    INSERT INTO periods(name,start_date,end_date,is_active) VALUES('Fixture',CURRENT_DATE-10,CURRENT_DATE+10,true);
    INSERT INTO recycling_records(user_id,team_id,period_id,material_type,quantity,quality_level,status,points_awarded) VALUES
    (1,1,1,'organico',1,'alta','approved',20),(2,2,1,'organico',1,'alta','approved',30),(1,1,1,'organico',1,'alta','pending',0)`);
  const snapshot = async () => {
    const data = {};
    for (const table of ['users','teams','recycling_records']) data[table] = (await pool.query(`SELECT * FROM ${table} ORDER BY id`)).rows;
    return data;
  };
  const before = await snapshot();
  let source = fs.readFileSync(path.join(root, 'backend/src/controllers/publicController.js'), 'utf8');
  source = source.replace("import { query } from '../config/db.js';", 'const pool=globalThis.__legacyRankingPool; const query=(...args)=>pool.query(...args);');
  globalThis.__legacyRankingPool = pool;
  const { getRanking } = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
  delete globalThis.__legacyRankingPool;
  const call = async () => {
    const res = { code: 200, status(code) { this.code=code; return this; }, json(body) { this.body=body; } };
    await getRanking({}, res); return res;
  };
  const legacy = await call();
  assert.equal(legacy.code, 200, 'El ranking no debe bloquear todos los paneles de líder si falta la migración de huerta');
  assert.deepEqual(legacy.body.ranking.map(row => [row.name, Number(row.total_points)]), [['Otro grupo',30],['Administrativa',20]]);
  assert.deepEqual(await snapshot(), before);
  // Installing the additive migration enables garden points on the next request, without restarting.
  ok(run('psql', ['-X','-h','127.0.0.1','-p',String(port),'-U','postgres','-d','postgres','-f','database/20261013_garden_challenge.sql']));
  await pool.query(`INSERT INTO garden_crops(team_id,user_id,bed,vegetables,description) VALUES(1,1,'Fixture',ARRAY['tomate'],'Fixture');
    INSERT INTO garden_evidence(crop_id,user_id,period_id,stage,record_date,story,evidence_url,status,points_awarded) VALUES
    (1,1,1,'crecimiento',CURRENT_DATE,'Fixture','/uploads/managed/evidence/fixture.png','approved',50)`);
  const migrated = await call();
  assert.equal(migrated.code, 200);
  assert.deepEqual(migrated.body.ranking.map(row => [row.name, Number(row.total_points)]), [['Administrativa',70],['Otro grupo',30]]);
  assert.deepEqual(await snapshot(), before);
});
