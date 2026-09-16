import { postgresHarness } from './helpers/postgresCluster.js';
// F10 only. Starts a NEW disposable PostgreSQL cluster, never reads .env.
// No application database URL is accepted. Files remain in OS temp for inspection.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('F10: revision transaccional PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-f10-test-'));
  const dataDir = path.join(temporary, 'data');
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 'f10-record-period.test.js' });
  let port;
  let started = false;
  let client;
  let testPool;
  try {
    port = await start();
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
      source = source.replace(/import \{ query(?:, pool)? \} from '..\/config\/db.js';/, 'const pool = globalThis.__f10Pool; const query = async (...args) => { const c = await pool.connect(); try { return await c.query(...args); } finally { c.release(); } };');
      source = source.replace("import { logInfo, logError } from '../utils/logger.js';", 'const logInfo = () => {}; const logError = () => {};');
      source = source.replace("import bcrypt from 'bcrypt';", 'const bcrypt = null;');
      for (const util of ['catalogReference', 'recordDate']) source = source.replace("'../utils/"+util+".js'", JSON.stringify(pathToFileURL(path.join(root,'backend/src/utils',util+'.js')).href));
      globalThis.__f10Pool = testPool;
      try { return await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64')); }
      finally { delete globalThis.__f10Pool; }
    };
    const {createRecord} = await loadController('recyclingController.js');
    const {createPeriod} = await loadController('adminController.js');
    const response=()=>({code:200,status(code){this.code=code;return this;},json(body){this.body=body;return this;}});
    await client.query("INSERT INTO teams(name,dependency) VALUES ('Fixture','Fixture')");
    await client.query("INSERT INTO users(name,email,password_hash,role,team_id) VALUES ('Fixture','fixture@test.invalid','fixture','leader',1)");
    // Synthetic identity solely for exercising F05 in the disposable cluster.
    // The distributed 56 rows are never rewritten or treated as institutional policy.
    const reference={catalog_group_name:'Dependencias institucionales',catalog_action_name:'Entrega acopio',catalog_action_level:'Nivel 1: Volumen bajo (1 a 5 kg)'};
    await client.query('INSERT INTO points_catalog(group_name,action_name,action_level,points) VALUES ($1,$2,$3,123)',Object.values(reference));
    const dateAt=async offset=>(await client.query('SELECT (CURRENT_DATE + $1::int)::text AS day',[offset])).rows[0].day;
    const create=async extra=>{
      const res=response();
      await createRecord({body:{material_type:'papel_carton',quantity:1,unit:'kg',quality_level:'media',criteria_count:1,record_date:await dateAt(-1),...reference,...extra},user:{id:1,team_id:1}},res);
      return res;
    };
    const period=async (name,start=null,end=null)=>{const res=response();await createPeriod({body:{name,start_date:start ?? await dateAt(-10),end_date:end ?? await dateAt(10),is_active:true},user:{id:1}},res);assert.equal(res.code,201);return res.body;};
    const records=async ()=>(await client.query('SELECT *,record_date::text AS day FROM recycling_records ORDER BY id')).rows;
    await t.test('sin activo se rechaza, aun con period_id enviado',async()=>{
      const result=await create({period_id:123});assert.equal(result.code,409);assert.match(result.body.message,/No existe/);assert.equal((await records()).length,0);
    });
    let current=await period('Current');
    const inactive=(await client.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Inactive','2025-01-01','2025-12-31',false) RETURNING id")).rows[0];
    const other=(await client.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Other','2027-01-01','2027-12-31',false) RETURNING id")).rows[0];
    await t.test('activo aceptado; pending y cero ignoran puntos del cliente',async()=>{
      const result=await create({period_id:String(current.id),points:999,points_awarded:999,status:'approved'});
      assert.equal(result.code,201);assert.equal(result.body.period_id,current.id);assert.equal(result.body.status,'pending');assert.equal(result.body.points_awarded,0);
    });
    await t.test('IDs inexistente/inactivos/omitidos/manipulados no fuerzan asociacion',async()=>{
      const before=await records();
      for(const id of [2147483647,inactive.id,other.id,null,undefined,'',`${current.id} OR 1=1`,[current.id],{id:current.id}]) {
        const result=await create({period_id:id});assert.equal(result.code,409);assert.match(result.body.message,/no coincide/);
      }
      assert.deepEqual(await records(),before);
    });
    await t.test('fecha invalida se rechaza sin INSERT, incluidos bisiestos y timestamps',async()=>{
      const before=await records();
      for(const date of ['2026-02-29','1900-02-29','2026-04-31','0000-01-01','2026-00-01','2026-13-01','2026-01-00','06/15/2026','2026-6-1','2026-06-15T00:00:00Z','infinity',123,{},['2026-06-15']]) {
        const result=await create({period_id:current.id,record_date:date});assert.equal(result.code,400);assert.match(result.body.message,/record_date/);
      }
      assert.deepEqual(await records(),before);
    });
    const scenarios=[
      ['antes del inicio',-11,-10,10,400],
      ['igual al inicio pasado',-10,-10,10,201],
      ['dentro del periodo',-1,-10,10,201],
      ['igual al fin pasado',-1,-10,-1,201],
      ['igual al fin hoy',0,-10,0,201],
      ['posterior al fin',-1,-10,-2,400],
      ['futura dentro',1,-10,10,400],
      ['futura igual al fin',10,-10,10,400],
      ['futura fuera',11,-10,10,400],
      ['inicio futuro',1,1,10,400],
      ['hoy dentro',0,-10,10,201],
    ];
    for(const [label,offset,start,end,code] of scenarios) {
      await t.test(label,async()=>{
        current=await period(label,await dateAt(start),await dateAt(end));
        const date=await dateAt(offset);const before=await records();
        const result=await create({period_id:current.id,record_date:date});assert.equal(result.code,code);
        if(code===201) {
          assert.equal((await records()).find(r=>r.id===result.body.id).day,date);
          assert.equal(result.body.status,'pending');assert.equal(result.body.points_awarded,0);
        } else {
          assert.match(result.body.message,/record_date/);assert.deepEqual(await records(),before);
        }
      });
    }
    await t.test('bisiesto pasado valido dentro de su periodo',async()=>{
      const leap=(await client.query(`SELECT make_date(y,2,29)::text AS day
        FROM generate_series(EXTRACT(YEAR FROM CURRENT_DATE)::int-1, EXTRACT(YEAR FROM CURRENT_DATE)::int-8,-1) y
        WHERE y % 4=0 AND (y % 100<>0 OR y % 400=0) ORDER BY y DESC LIMIT 1`)).rows[0].day;
      current=await period('Leap',leap,leap);
      assert.equal((await create({period_id:current.id,record_date:leap})).code,201);
    });
    current=await period('Default dates');
    await t.test('fecha omitida usa CURRENT_DATE de PostgreSQL, independiente de TZ Node',async()=>{
      const oldTZ=process.env.TZ;process.env.TZ='Pacific/Honolulu';
      try {
        for(const date of [undefined,null,'']) {
          const result=await create({period_id:current.id,record_date:date});assert.equal(result.code,201);
          const saved=await client.query('SELECT record_date=CURRENT_DATE AS correct FROM recycling_records WHERE id=$1',[result.body.id]);assert.equal(saved.rows[0].correct,true);
        }
      } finally {if(oldTZ===undefined) delete process.env.TZ;else process.env.TZ=oldTZ;}
    });
    await t.test('fallo diferido en COMMIT revierte INSERT completo y libera bloqueo',async()=>{
      const before=await records();
      await client.query(`CREATE FUNCTION f10_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'private SQL'; END $$;
        CREATE CONSTRAINT TRIGGER f10_failure AFTER INSERT ON recycling_records DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION f10_fail()`);
      try {
        const result=await create({period_id:current.id});assert.equal(result.code,500);assert.deepEqual(result.body,{message:'Error al registrar reciclaje'});assert.deepEqual(await records(),before);
      } finally {await client.query('DROP TRIGGER f10_failure ON recycling_records; DROP FUNCTION f10_fail()');}
      current=await period('After rollback');
    });
    // Pause a real connection at a known SQL point, preserving actual PostgreSQL locks.
    const pauseAt=match=>{
      const originalConnect=testPool.connect.bind(testPool);
      let reach,resume,used=false;
      const reached=new Promise(resolve=>{reach=resolve;});const gate=new Promise(resolve=>{resume=resolve;});
      testPool.connect=async()=>{
        const c=await originalConnect();const q=c.query.bind(c);const release=c.release.bind(c);
        c.query=async(...args)=>{const result=await q(...args);if(!used && match(String(args[0]))) {used=true;reach();await gate;}return result;};
        c.release=(...args)=>{c.query=q;release(...args);};return c;
      };
      return {reached,finish(){resume();testPool.connect=originalConnect;}};
    };
    const waitLock=async pattern=>{
      const deadline=Date.now()+5000;let waiting=false;
      while(Date.now()<deadline) {
        waiting=(await client.query("SELECT 1 FROM pg_stat_activity WHERE wait_event_type='Lock' AND query LIKE $1 AND pid<>pg_backend_pid()",[pattern])).rowCount>0;
        if(waiting) break;await new Promise(resolve=>setTimeout(resolve,20));
      }
      assert.ok(waiting,'Espera real de bloqueo PostgreSQL requerida');
    };
    await t.test('F10 primero: F09 espera hasta COMMIT del registro',async()=>{
      const old=current;
      const pause=pauseAt(sql=>sql.startsWith('SELECT id, CURRENT_DATE'));
      const registration=create({period_id:old.id});await pause.reached;
      const change=period('Concurrent F09 after');
      try {await waitLock('LOCK TABLE periods IN SHARE ROW EXCLUSIVE%');}
      finally {pause.finish();}
      const [result,next]=await Promise.all([registration,change]);
      assert.equal(result.code,201);assert.equal(result.body.period_id,old.id);current=next;
      assert.equal((await client.query('SELECT is_active FROM periods WHERE id=$1',[old.id])).rows[0].is_active,false);
    });
    await t.test('F09 primero: F10 espera y rechaza ID obsoleto sin INSERT',async()=>{
      const old=current;const before=await records();
      const pause=pauseAt(sql=>sql.startsWith('UPDATE periods'));
      const change=period('Concurrent F09 before');await pause.reached;
      const registration=create({period_id:old.id});
      try {await waitLock('LOCK TABLE periods IN SHARE MODE%');}
      finally {pause.finish();}
      const [next,result]=await Promise.all([change,registration]);
      current=next;assert.equal(result.code,409);assert.deepEqual(await records(),before);
      assert.equal((await create({period_id:current.id})).code,201);
    });
    assert.deepEqual((await client.query('SELECT * FROM points_catalog WHERE id=ANY($1) ORDER BY id',[catalogBefore.map(r=>r.id)])).rows,catalogBefore);
    assert.equal(catalogBefore.length,56);
  } finally {
    if(testPool) await testPool.end();
    if(client) await client.end();
    if(started) ok(run('pg_ctl',['-D',dataDir,'-m','fast','-w','stop']));
  }
});
