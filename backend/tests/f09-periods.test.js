// D01-D10 only. Starts a NEW disposable PostgreSQL cluster, never reads .env.
// No application database URL is accepted. Files remain in OS temp for inspection.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import pg from 'pg';
import { pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('F09: revision transaccional PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-f09-test-'));
  const dataDir = path.join(temporary, 'data');
  const env = { ...process.env, PGCLIENTENCODING: 'UTF8' };
  for (const key of Object.keys(env)) if (key.startsWith('PG') && key !== 'PGCLIENTENCODING') delete env[key];
  const run = (name, args, options = {}) => spawnSync(
    path.join(bin, name + (process.platform === 'win32' ? '.exe' : '')),
    args, { cwd: root, env, encoding: 'utf8', windowsHide: true, timeout: 60000, ...options },
  );
  const ok = (result) => assert.equal(result.status, 0, result.stderr || result.error?.message || result.stdout);
  ok(run('initdb', ['-D', dataDir, '-U', 'postgres', '-A', 'trust', '--encoding=UTF8', '--no-locale']));
  const socket = net.createServer();
  await new Promise((resolve, reject) => { socket.once('error', reject); socket.listen(0, '127.0.0.1', resolve); });
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  let started = false;
  let client;
  let testPool;
  try {
    ok(run('pg_ctl', ['-D', dataDir, '-l', path.join(temporary, 'postgres.log'), '-o', `-h 127.0.0.1 -p ${port}`, '-w', 'start'], { stdio: 'ignore' }));
    started = true;
    client = new pg.Client({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres' });
    await client.connect();
    const psql = (args, options) => run('psql', ['-X', '-h', '127.0.0.1', '-p', String(port), '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', ...args], options);

    ok(psql(['-f', 'database/schema.sql']));
    ok(psql(['-f', 'database/import_points_catalog.sql']));
    const catalogBefore = (await client.query('SELECT * FROM points_catalog ORDER BY id')).rows;
    testPool = new pg.Pool({host:'127.0.0.1',port,user:'postgres',database:'postgres',max:5});
    const loadController = async file => {
      let source = fs.readFileSync(path.join(root,'backend/src/controllers',file),'utf8');
      source=source.replaceAll("'../services/contentFiles.js'",()=>JSON.stringify(new URL('../src/services/contentFiles.js',import.meta.url).href)).replaceAll("'../services/fileStore.js'",()=>JSON.stringify(new URL('../src/services/fileStore.js',import.meta.url).href));
      source = source.replace(/import \{ query(?:, pool)? \} from '..\/config\/db.js';/, 'const pool = globalThis.__f09Pool; const query = async (...args) => { const c = await pool.connect(); try { return await c.query(...args); } finally { c.release(); } };');
      source = source.replace("import { logInfo, logError } from '../utils/logger.js';", 'const logInfo = () => {}; const logError = () => {};');
      source = source.replace("import bcrypt from 'bcrypt';", 'const bcrypt = null;');
      globalThis.__f09Pool = testPool;
      try { return await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64')); }
      finally { delete globalThis.__f09Pool; }
    };
    const {createPeriod} = await loadController('adminController.js');
    const {getRanking} = await loadController('publicController.js');
    const response = () => ({code:200,status(code){this.code=code;return this;},json(body){this.body=body;return this;}});
    const create = async (name,is_active=true,extra={}) => {
      const res=response();
      await createPeriod({body:{name,start_date:'2026-01-01',end_date:'2026-12-31',is_active,...extra},user:{id:1}},res);
      return res;
    };
    const rows = async () => (await client.query('SELECT * FROM periods ORDER BY id')).rows;
    const active = async () => (await rows()).filter(r=>r.is_active);
    const ranking = async () => {const res=response();await getRanking({},res);assert.equal(res.code,200);return res.body;};
    await t.test('cero activos es valido y consumidores conservan null/lista vacia',async () => {
      assert.deepEqual(await ranking(),{currentPeriod:null,ranking:[]});
      assert.equal((await create('Inactive',false)).code,201);
      assert.equal((await active()).length,0);
      assert.deepEqual(await ranking(),{currentPeriod:null,ranking:[]});
    });
    await t.test('crear activo reemplaza anterior; crear inactivo lo conserva',async () => {
      const first=await create('First');assert.equal(first.code,201);
      const second=await create('Second');assert.equal(second.code,201);
      assert.equal((await rows()).find(r=>r.id===first.body.id).is_active,false);
      assert.deepEqual((await active()).map(r=>r.id),[second.body.id]);
      assert.equal((await create('Inactive 2',false)).code,201);
      assert.equal((await ranking()).currentPeriod.id,second.body.id);
    });
    await t.test('indice oficial rechaza INSERT y UPDATE SQL alternativos',async () => {
      await assert.rejects(client.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Bypass','2026-01-01','2026-12-31',true)"),{code:'23505'});
      await assert.rejects(client.query("UPDATE periods SET is_active=true WHERE name='Inactive'"),{code:'23505'});
      assert.equal((await active()).length,1);
    });
    await t.test('INSERT fallido restaura anterior: 409 duplicado y 400 datos invalidos',async () => {
      const before=await rows();
      assert.equal((await create('Second')).code,409);
      assert.deepEqual(await rows(),before);
      for (const extra of [{name:null},{start_date:'invalid'},{end_date:null},{is_active:'false'}]) {
        const result=await create('Invalid',true,extra);
        assert.equal(result.code,400);
        assert.deepEqual(Object.keys(result.body),['message']);
        assert.deepEqual(await rows(),before);
      }
    });
    await t.test('error interno tras desactivar: ROLLBACK y 500 sin SQL',async () => {
      const before=await rows();
      await client.query(`CREATE FUNCTION f09_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'private SQL'; END $$;
        CREATE TRIGGER f09_failure BEFORE INSERT ON periods FOR EACH ROW EXECUTE FUNCTION f09_fail()`);
      try {
        const result=await create('Failure');
        assert.equal(result.code,500);assert.deepEqual(result.body,{message:'Error al crear periodo'});
        assert.deepEqual(await rows(),before);
      } finally {await client.query('DROP TRIGGER f09_failure ON periods; DROP FUNCTION f09_fail()');}
    });
    for (const empty of [false,true]) {
      await t.test(`concurrencia real con tabla ${empty?'vacia':'con activo'}; lectores no ven desactivacion parcial`,async () => {
        if (empty) await client.query('DELETE FROM periods');
        const before=await ranking();
        const originalConnect=testPool.connect.bind(testPool);
        let reached, resume;
        const deactivated=new Promise(resolve=>{reached=resolve;});
        const gate=new Promise(resolve=>{resume=resolve;});
        let first=true;
        testPool.connect=async () => {
          const connection=await originalConnect();
          if (first) {
            first=false;
            const originalQuery=connection.query.bind(connection);
            const originalRelease=connection.release.bind(connection);
            connection.query=async (...args) => {
              const result=await originalQuery(...args);
              if (String(args[0]).startsWith('UPDATE periods')) {reached();await gate;}
              return result;
            };
            connection.release=(...args)=>{connection.query=originalQuery;originalRelease(...args);};
          }
          return connection;
        };
        const firstRequest=create('Concurrent A '+empty);
        await deactivated;
        const secondRequest=create('Concurrent B '+empty);
        try {
          let waiting=false;
          const deadline=Date.now()+5000;
          while (Date.now()<deadline) {
            waiting=(await client.query("SELECT 1 FROM pg_stat_activity WHERE wait_event_type='Lock' AND query LIKE 'LOCK TABLE periods%' AND pid<>pg_backend_pid()")).rowCount>0;
            if(waiting) break;
            await new Promise(resolve=>setTimeout(resolve,20));
          }
          assert.ok(waiting,'Segunda solicitud esperando bloqueo PostgreSQL');
          assert.deepEqual(await ranking(),before);
        } finally {resume();testPool.connect=originalConnect;}
        const results=await Promise.all([firstRequest,secondRequest]);
        assert.deepEqual(results.map(r=>r.code),[201,201]);
        assert.deepEqual((await active()).map(r=>r.id),[results[1].body.id]);
        assert.equal((await ranking()).currentPeriod.id,results[1].body.id);
      });
    }
    const indexSql="SELECT indexdef FROM pg_indexes WHERE schemaname='public' AND indexname='periods_one_active_uidx'";
    const officialIndex=(await client.query(indexSql)).rows;
    await t.test('migracion de instalacion D01 anterior conserva datos y replica indice oficial',async () => {
      await client.query('DROP INDEX periods_one_active_uidx');
      const before=await rows();
      ok(psql(['-f','database/20260909_f09_periods_one_active.sql']));
      assert.deepEqual(await rows(),before);
      assert.deepEqual((await client.query(indexSql)).rows,officialIndex);
      await assert.rejects(client.query("UPDATE periods SET is_active=true"),{code:'23505'});
    });
    await t.test('migracion aborta con multiples activos sin corregir datos',async () => {
      await client.query('DROP INDEX periods_one_active_uidx');
      await client.query('UPDATE periods SET is_active=true');
      const before=await rows();
      assert.ok(before.length>1);
      const result=psql(['-f','database/20260909_f09_periods_one_active.sql']);
      assert.notEqual(result.status,0);assert.match(result.stderr,/varios periodos activos/);
      assert.deepEqual(await rows(),before);
      assert.deepEqual((await client.query(indexSql)).rows,[]);
    });
    await t.test('migracion permite cero activos',async () => {
      await client.query('UPDATE periods SET is_active=false');
      ok(psql(['-f','database/20260909_f09_periods_one_active.sql']));
      assert.equal((await active()).length,0);
      assert.deepEqual(await ranking(),{currentPeriod:null,ranking:[]});
    });
    assert.deepEqual((await client.query('SELECT * FROM points_catalog ORDER BY id')).rows,catalogBefore);
    assert.equal(catalogBefore.length,56);
  } finally {
    if (testPool) await testPool.end();
    if (client) await client.end();
    if (started) ok(run('pg_ctl',['-D',dataDir,'-m','fast','-w','stop']));
  }
});
