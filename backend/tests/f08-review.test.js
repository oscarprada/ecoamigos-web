import { postgresHarness } from './helpers/postgresCluster.js';
// D01-D10 only. Starts a NEW disposable PostgreSQL cluster, never reads .env.
// No application database URL is accepted. Files remain in OS temp for inspection.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import pg from 'pg';
import { pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('F08: revision transaccional PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-f08-test-'));
  const dataDir = path.join(temporary, 'data');
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 'f08-review.test.js' });
  let port;
  let started = false;
  let client;
  try {
    port = await start();
    started = true;
    client = new pg.Client({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres' });
    await client.connect();
    const psql = (args, options) => run('psql', ['-X', '-h', '127.0.0.1', '-p', String(port), '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', ...args], options);

    ok(psql(['-f', 'database/schema.sql']));
    ok(psql(['-f', 'database/import_points_catalog.sql']));
    const catalogBefore = (await client.query('SELECT * FROM points_catalog ORDER BY id')).rows;
    await client.query("INSERT INTO teams(name,dependency) VALUES ('Fixture','Fixture')");
    await client.query("INSERT INTO users(name,email,password_hash,role,team_id) VALUES ('Admin 1','a@test.invalid','fixture','admin',1),('Admin 2','b@test.invalid','fixture','admin',1)");
    const testPool = new pg.Pool({host:'127.0.0.1', port, user:'postgres', database:'postgres', max:5});
    t.after(() => testPool.end());
    // Import the actual controller with only infrastructure replaced. Never load db.js/.env.
    let source = fs.readFileSync(path.join(root,'backend/src/controllers/recyclingController.js'),'utf8');
      source=source.replaceAll("'../services/contentFiles.js'",()=>JSON.stringify(new URL('../src/services/contentFiles.js',import.meta.url).href)).replaceAll("'../services/fileStore.js'",()=>JSON.stringify(new URL('../src/services/fileStore.js',import.meta.url).href));
    source = source.replace("import { query, pool } from '../config/db.js';", 'const pool = globalThis.__f08Pool; const query = (...args) => pool.query(...args);');
    source = source.replace("import { logInfo, logError } from '../utils/logger.js';", 'const logInfo = () => {}; const logError = () => {};');
    source = source.replace("'../utils/catalogReference.js'", JSON.stringify(pathToFileURL(path.join(root,'backend/src/utils/catalogReference.js')).href));
    source = source.replace("'../utils/recordDate.js'", JSON.stringify(pathToFileURL(path.join(root,'backend/src/utils/recordDate.js')).href));
    globalThis.__f08Pool = testPool;
    const {reviewRecord} = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
    delete globalThis.__f08Pool;
    const fixture = async (status='pending') => (await client.query(`INSERT INTO recycling_records(user_id,team_id,material_type,quantity,quality_level,status,points_awarded,catalog_group_name,catalog_action_name,catalog_action_level)
      SELECT 1,1,'papel_carton',1,'alta',$1::record_status,CASE WHEN $1::record_status='approved' THEN points ELSE 0 END,group_name,action_name,action_level FROM points_catalog ORDER BY id LIMIT 1 RETURNING *`,[status])).rows[0];
    const read = async id => (await client.query('SELECT * FROM recycling_records WHERE id=$1',[id])).rows[0];
    const review = async (id,status,admin=1,extra={}) => {
      const res = {code:200,status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
      await reviewRecord({params:{id},body:{status,review_notes:'  decision  ',...extra},user:{id:admin}},res);
      return res;
    };
    for (const decision of ['approved','rejected']) {
      await t.test(`pending -> ${decision}: puntos y auditoria persistidos`,async () => {
        const row = await fixture();
        const result = await review(row.id,decision,2,{points:999999,points_awarded:999999});
        assert.equal(result.code,200);
        const saved = await read(row.id);
        assert.equal(saved.status,decision);
        assert.equal(saved.points_awarded,decision==='approved'?catalogBefore[0].points:0);
        assert.equal(saved.reviewed_by,2);
        assert.ok(saved.reviewed_at instanceof Date);
        assert.equal(saved.review_notes,'decision');
        assert.deepEqual(saved,result.body);
      });
    }
    for (const initial of ['approved','rejected']) for (const decision of ['approved','rejected']) {
      await t.test(`${initial} -> ${decision}: 409 sin modificar`,async () => {
        const row = await fixture(initial);
        assert.equal((await review(row.id,decision)).code,409);
        assert.deepEqual(await read(row.id),row);
      });
    }
    await t.test('inexistente 404 y decision invalida 400', async () => {
      assert.equal((await review(2147483647,'approved')).code,404);
      const row = await fixture();
      for (const value of ['pending','other',null,undefined]) assert.equal((await review(row.id,value)).code,400);
      assert.deepEqual(await read(row.id),row);
    });
    await t.test('fallo PostgreSQL posterior a UPDATE: rollback completo y respuesta sin SQL',async () => {
      const row = await fixture();
      await client.query(`CREATE FUNCTION f08_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'F08 SQL private failure'; END $$;
        CREATE CONSTRAINT TRIGGER f08_failure AFTER UPDATE ON recycling_records DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION f08_fail()`);
      try {
        const result = await review(row.id,'approved');
        assert.equal(result.code,500);
        assert.deepEqual(result.body,{message:'Error al validar registro'});
        assert.deepEqual(await read(row.id),row);
      } finally { await client.query('DROP TRIGGER f08_failure ON recycling_records; DROP FUNCTION f08_fail()'); }
      assert.equal((await review(row.id,'rejected')).code,200);
    });
    for (const decisions of [['approved','approved'],['approved','rejected'],['rejected','approved'],['rejected','rejected']]) {
      await t.test(`concurrencia ${decisions.join('/')}: bloqueo real, un 200 y un 409`,async () => {
        const row = await fixture();
        const originalConnect = testPool.connect.bind(testPool);
        let acquired;
        let resume;
        const locked = new Promise(resolve => {acquired=resolve;});
        const gate = new Promise(resolve => {resume=resolve;});
        let first = true;
        testPool.connect = async () => {
          const connection = await originalConnect();
          if (first) {
            first = false;
            const originalQuery = connection.query.bind(connection);
            const originalRelease = connection.release.bind(connection);
            connection.query = async (...args) => {
              const result = await originalQuery(...args);
              if (String(args[0]).includes('FOR UPDATE')) { acquired(); await gate; }
              return result;
            };
            connection.release = (...args) => { connection.query=originalQuery; originalRelease(...args); };
          }
          return connection;
        };
        const winner = review(row.id,decisions[0],1);
        await locked;
        const loser = review(row.id,decisions[1],2);
        try {
          const deadline = Date.now()+5000;
          let waiting = false;
          while (Date.now()<deadline) {
            waiting = (await client.query("SELECT 1 FROM pg_stat_activity WHERE wait_event_type='Lock' AND query LIKE '%FOR UPDATE%' AND pid<>pg_backend_pid()")).rowCount>0;
            if (waiting) break;
            await new Promise(resolve => setTimeout(resolve,20));
          }
          assert.ok(waiting,'La segunda conexion debe esperar el bloqueo PostgreSQL');
        } finally {resume();testPool.connect=originalConnect;}
        const results = await Promise.all([winner,loser]);
        assert.deepEqual(results.map(r=>r.code),[200,409]);
        assert.deepEqual(await read(row.id),results[0].body);
        assert.equal(results[0].body.reviewed_by,1);
      });
    }
    assert.deepEqual((await client.query('SELECT * FROM points_catalog ORDER BY id')).rows,catalogBefore);
    assert.equal(catalogBefore.length,56);
  } finally {
    if (client) await client.end();
    if (started) ok(run('pg_ctl',['-D',dataDir,'-m','immediate','-w','stop']));
  }
});
