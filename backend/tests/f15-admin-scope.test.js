import { postgresHarness } from './helpers/postgresCluster.js';
import { authModuleUrl } from './helpers/authModule.js';
// F15 only. Starts a NEW disposable PostgreSQL cluster, never reads .env.
// No application database URL is accepted. Files remain in OS temp for inspection.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import express from 'express';
import jwt from 'jsonwebtoken';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('F15: revision transaccional PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-f15-test-'));
  const dataDir = path.join(temporary, 'data');
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 'f15-admin-scope.test.js' });
  let port;
  let started = false;
  let client;
  let testPool;
  let server;
  const oldSecret=process.env.JWT_SECRET;
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
      source = source.replace(/import \{ query(?:, pool)? \} from '..\/config\/db.js';/, 'const pool = globalThis.__f15Pool; const query = async (...args) => { const c = await pool.connect(); try { return await c.query(...args); } finally { c.release(); } };');
      source = source.replace("import { logInfo, logError } from '../utils/logger.js';", 'const logInfo = () => {}; const logError = () => {};');
      source = source.replace("'jsonwebtoken'", JSON.stringify(pathToFileURL(require.resolve('jsonwebtoken')).href));
      source = source.replace("'bcrypt'", JSON.stringify(pathToFileURL(require.resolve('bcrypt')).href));
      for (const util of ['catalogReference', 'recordDate', 'sessionCookie']) source = source.replace("'../utils/"+util+".js'", JSON.stringify(pathToFileURL(path.join(root,'backend/src/utils',util+'.js')).href));
      globalThis.__f15Pool = testPool;
      try { const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64'); globalThis.__f15ControllerUrl=url; return await import(url); }
      finally { delete globalThis.__f15Pool; }
    };
    await loadController('adminController.js');
    let routeSource=fs.readFileSync(path.join(root,'backend/src/routes/adminRoutes.js'),'utf8');
    routeSource=routeSource.replace("'../middleware/uploadMiddleware.js'",()=>JSON.stringify(new URL('../src/middleware/uploadMiddleware.js',import.meta.url).href));
    for(const pkg of ['express','multer']) routeSource=routeSource.replace(`'${pkg}'`,JSON.stringify(pathToFileURL(require.resolve(pkg)).href));
    routeSource=routeSource.replace("'../controllers/adminController.js'",JSON.stringify(globalThis.__f15ControllerUrl));delete globalThis.__f15ControllerUrl;
    routeSource=routeSource.replace("import { exportRecyclingReport } from '../controllers/exportController.js';",'const exportRecyclingReport=()=>{};');
    routeSource=routeSource.replace("'../middleware/authMiddleware.js'",JSON.stringify(await authModuleUrl(testPool)));
    const {default:router}=await import('data:text/javascript;base64,'+Buffer.from(routeSource).toString('base64'));
    process.env.JWT_SECRET='f15-isolated-test-secret';
    const app=express();app.use(express.json());app.use('/api/admin',router);
    const auth = await loadController('authController.js');
    const pub = await loadController('publicController.js');
    delete globalThis.__f15ControllerUrl;
    app.post('/api/auth/login', auth.login); app.get('/api/public/ranking', pub.getRanking);
    server=await new Promise(resolve=>{const running=app.listen(0,'127.0.0.1',()=>resolve(running));});
    const base = 'http://127.0.0.1:' + server.address().port + '/api/admin';
    await client.query("INSERT INTO users(id,name,email,password_hash,role) VALUES (100,'Auth admin','auth@test.invalid','fixture','admin')");
    const token = role => jwt.sign({ id: role === 'admin' ? 100 : 1, sv: 0 }, process.env.JWT_SECRET, { expiresIn: '5m' });
    const request = async (method, resource, body, role = 'admin') => {
      const response = await fetch(base + resource, {
        method, headers: { Cookie: 'ecoamigos_session=' + token(role), 'Content-Type': 'application/json' },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
      const raw = await response.text();
      return { code: response.status, body: response.headers.get('content-type')?.includes('application/json') ? JSON.parse(raw) : raw };
    };
    const snapshot = async () => {
      const result = {};
      for (const table of ['users','teams','periods','recycling_records','content_items','winner_records']) {
        result[table] = (await client.query('SELECT * FROM ' + table + ' ORDER BY id')).rows;
      }
      return result;
    };
    const period = { name: 'Fixture periodo', start_date: '2026-01-01', end_date: '2026-12-31', is_active: true };
    await t.test('admin crea y lista equipos, usuarios y periodos mediante rutas reales', async () => {
      assert.equal((await request('POST','/teams',{name:'Fixture equipo',dependency:'Fixture'})).code,201);
      const created = await request('POST','/users',{name:'Fixture lider',email:'f15@test.invalid',password:'fixture-password',role:'leader',team_id:1});
      assert.equal(created.code,201); assert.equal('password_hash' in created.body,false);
      assert.equal((await request('POST','/periods',period)).code,201);
      for (const entity of ['users','teams','periods']) {
        const result=await request('GET','/'+entity); assert.equal(result.code,200); assert.equal(result.body.length,entity === 'users' ? 2 : 1);
      }
      const users=await request('GET','/users'); assert.equal('password_hash' in users.body[0],false);
    });
    await client.query("INSERT INTO recycling_records(user_id,team_id,period_id,material_type,quantity,unit,quality_level,status,points_awarded,reviewed_by,record_date) VALUES (1,1,1,'papel_carton',2.5,'kg','alta','approved',25,1,'2026-06-01')");
    await client.query("INSERT INTO content_items(title,category,type,status,created_by) VALUES ('Fixture','papel','text','published',1)");
    const before=await snapshot();
    await t.test('lider recibe 403 en todas las colecciones administrativas sin alterar datos',async()=>{
      for(const entity of ['users','teams','periods']) for(const method of ['GET','POST']) {
        assert.equal((await request(method,'/'+entity,method==='POST'?{}:undefined,'leader')).code,403);
      }
      assert.deepEqual(await snapshot(),before);
    });
    await t.test('operaciones por ID no habilitadas: 404 incluso para IDs existentes; no DELETE accidental',async()=>{
      for(const entity of ['users','teams','periods']) for(const method of ['PUT','PATCH','DELETE']) {
        assert.equal((await request(method,'/'+entity,{is_active:false})).code,404);
      }
      for(const entity of ['users','teams','periods']) for(const id of [1,999999]) for(const method of ['GET','PUT','PATCH','DELETE']) {
        if (method === 'PATCH' && entity !== 'periods') continue;
        assert.equal((await request(method,'/'+entity+'/'+id,method==='GET'?undefined:{name:'Cambio',is_active:false,role:'admin',team_id:999999,start_date:'2030-01-01'})).code,404);
      }
      assert.deepEqual(await snapshot(),before);
    });
    await t.test('periodos: entradas invalidas 400 y duplicado 409 conservan estado e historia',async()=>{
      const invalid=await request('POST','/periods',{...period,name:'Invalido',is_active:'true'});
      assert.equal(invalid.code,400); assert.equal('error' in invalid.body,false);
      const duplicate=await request('POST','/periods',period);assert.equal(duplicate.code,409);assert.equal('error' in duplicate.body,false);
      assert.deepEqual(await snapshot(),before);
    });
    await t.test('FK historicas e invariantes conservadas; equipos sin is_active',async()=>{
      const refs=(await client.query("SELECT conname,confdeltype FROM pg_constraint WHERE contype='f' AND conrelid='recycling_records'::regclass")).rows;
      for(const field of ['user_id','team_id']) assert.equal(refs.find(r=>r.conname==='recycling_records_'+field+'_fkey').confdeltype,'c');
      for(const field of ['period_id','reviewed_by']) assert.equal(refs.find(r=>r.conname==='recycling_records_'+field+'_fkey').confdeltype,'n');
      assert.equal((await client.query("SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='teams' AND column_name='is_active'")).rowCount,0);
      assert.equal((await client.query("SELECT count(*)::int AS n FROM periods WHERE is_active=true")).rows[0].n,1);
      assert.deepEqual(await snapshot(),before);
    });
    await t.test('usuarios: edición permitida, validaciones, permisos y hash protegido', async () => {
      assert.equal((await request('POST','/teams',{name:'Segundo equipo',dependency:'Otra'})).code,201);
      assert.equal((await request('POST','/users',{name:'Segundo',email:'second@test.invalid',password:'fixture-password',role:'admin'})).code,201);
      let r=await request('PATCH','/users/1',{name:'Nombre editado',email:'edited@test.invalid',team_id:2});
      assert.equal(r.code,200); assert.equal(r.body.name,'Nombre editado'); assert.equal(r.body.email,'edited@test.invalid'); assert.equal(r.body.team_id,2); assert.equal(r.body.role,'leader'); assert.equal('password_hash' in r.body,false);
      const valid=await snapshot();
      for(const body of [{name:''},{name:'  '},{name:12},{name:'a'.repeat(121)},{email:'invalid'},{email:null},{email:'a'.repeat(151)+'@x.co'},{team_id:999999},{team_id:null},{team_id:'2'},{team_id:-1},{is_active:'false'},{password:'other'},{password_hash:'other'},{role:'admin'},{id:2},{unknown:true},{}]) {
        assert.equal((await request('PATCH','/users/1',body)).code,400,JSON.stringify(body));
      }
      assert.equal((await request('PATCH','/users/1',{email:'second@test.invalid'})).code,409);
      assert.equal((await request('PATCH','/users/999999',{name:'Missing'})).code,404);
      assert.equal((await request('PATCH','/users/invalid',{name:'Missing'})).code,400);
      assert.equal((await request('PATCH','/users/1',{name:'Forbidden'},'leader')).code,403);
      assert.deepEqual(await snapshot(),valid);
      assert.equal(valid.users[0].password_hash,before.users[0].password_hash);
      assert.deepEqual(valid.recycling_records,before.recycling_records);
      assert.deepEqual(valid.content_items,before.content_items);
      const listed=(await request('GET','/users')).body.find(u=>u.id===1);
      assert.equal(listed.team_id,2); assert.equal(listed.name,'Nombre editado'); assert.equal('password_hash' in listed,false);
    });
    await t.test('equipos: edición básica, errores controlados, referencias y ranking', async () => {
      const ranking=async()=>{const r=await fetch(base.replace('/admin','/public/ranking'));assert.equal(r.status,200);return r.json();};
      const prior=await ranking(); const saved=await snapshot();
      const updated=await request('PATCH','/teams/1',{name:'Equipo editado',dependency:'Dependencia editada'});
      assert.equal(updated.code,200); assert.deepEqual(updated.body,{id:1,name:'Equipo editado',dependency:'Dependencia editada'});
      const after=await snapshot();
      for(const body of [{name:''},{name:'  '},{name:123},{name:'x'.repeat(101)},{dependency:null},{dependency:'x'.repeat(151)},{is_active:false},{id:2},{}]) assert.equal((await request('PATCH','/teams/1',body)).code,400);
      assert.equal((await request('PATCH','/teams/1',{name:'Segundo equipo'})).code,409);
      assert.equal((await request('PATCH','/teams/999999',{name:'Missing'})).code,404);
      assert.equal((await request('PATCH','/teams/1',{name:'Forbidden'},'leader')).code,403);
      assert.deepEqual(await snapshot(),after); assert.deepEqual(after.users,saved.users); assert.deepEqual(after.recycling_records,before.recycling_records);
      const current=await ranking();
      assert.deepEqual(current.currentPeriod,prior.currentPeriod);
      const scores=r=>r.ranking.map(({id,total_points,position})=>({id,total_points,position}));
      assert.deepEqual(scores(current),scores(prior)); assert.equal(current.ranking[0].name,'Equipo editado');
    });
    await t.test('desactivación lógica, login y límite F12 incluyen inactivos', async () => {
      const login=async()=>fetch(base.replace('/admin','/auth/login'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'edited@test.invalid',password:'fixture-password'})});
      assert.equal((await login()).status,200);
      assert.equal((await request('PATCH','/users/1',{is_active:false})).body.is_active,false);
      assert.equal((await login()).status,401);
      assert.equal((await client.query('SELECT count(*)::int n FROM users')).rows[0].n,3);
      await client.query("INSERT INTO users(name,email,password_hash,role,is_active) SELECT 'Cupo', 'slot'||n||'@test.invalid', 'fixture', 'admin', true FROM generate_series(4,15) n");
      const full=await request('POST','/users',{name:'Exceso',email:'excess@test.invalid',password:'fixture-password',role:'admin'});
      assert.equal(full.code,409); assert.equal(full.body.code,'USER_LIMIT_REACHED');
      assert.equal((await request('PATCH','/users/1',{is_active:true})).body.is_active,true);
      assert.equal((await login()).status,200);
      assert.equal((await client.query('SELECT count(*)::int n FROM users')).rows[0].n,15);
      assert.deepEqual((await snapshot()).recycling_records,before.recycling_records);
    });
    await t.test('errores internos de edición: 500 genérico y rollback de la sentencia',async()=>{
      await client.query("CREATE FUNCTION f15_fail_update() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'PRIVATE SQL secret'; END $$");
      for(const entity of ['users','teams']) {
        await client.query('CREATE TRIGGER f15_fail BEFORE UPDATE ON '+entity+' FOR EACH ROW EXECUTE FUNCTION f15_fail_update()');
        const saved=await snapshot(); const result=await request('PATCH','/'+entity+'/1',{name:'Failure'});
        assert.equal(result.code,500); assert.deepEqual(Object.keys(result.body),['message']); assert.doesNotMatch(JSON.stringify(result.body),/PRIVATE|SQL|secret|UPDATE/);
        assert.deepEqual(await snapshot(),saved); await client.query('DROP TRIGGER f15_fail ON '+entity);
      }
    });
    await t.test('DELETE ausente; fechas históricas y períodos vacíos no editables',async()=>{
      assert.equal((await request('POST','/periods',{...period,name:'Vacío',is_active:false})).code,201);
      const saved=await snapshot();
      for(const entity of ['users','teams','periods']) for(const id of [1,2,999999]) assert.equal((await request('DELETE','/'+entity+'/'+id)).code,404);
      for(const id of [1,2,999999]) for(const method of ['PATCH','PUT']) assert.equal((await request(method,'/periods/'+id,{start_date:'2030-01-01',end_date:'2030-12-31'})).code,404);
      assert.deepEqual(await snapshot(),saved); assert.deepEqual(saved.recycling_records,before.recycling_records); assert.deepEqual(saved.periods[0],before.periods[0]);
      const routes=fs.readFileSync(path.join(root,'backend/src/routes/adminRoutes.js'),'utf8');
      assert.doesNotMatch(routes,/router\.delete\(['"]\/(users|teams|periods)/);
      const controller=fs.readFileSync(path.join(root,'backend/src/controllers/adminController.js'),'utf8');
      assert.doesNotMatch(controller,/DELETE\s+FROM\s+(users|teams|periods)\b/i);
    });
    assert.equal(catalogBefore.length,56);
    assert.deepEqual((await client.query('SELECT * FROM points_catalog ORDER BY id')).rows,catalogBefore);
  } finally {
    if(server) await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
    if(oldSecret===undefined) delete process.env.JWT_SECRET;else process.env.JWT_SECRET=oldSecret;
    if(testPool) await testPool.end();if(client) await client.end();
    if(started) ok(run('pg_ctl',['-D',dataDir,'-m','fast','-w','stop']));
  }
});
