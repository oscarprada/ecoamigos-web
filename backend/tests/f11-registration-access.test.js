import { authModuleUrl } from './helpers/authModule.js';
// F11 only. Starts a NEW disposable PostgreSQL cluster, never reads .env.
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
import express from 'express';
import jwt from 'jsonwebtoken';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('F11: revision transaccional PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-f11-test-'));
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
  let server;
  const oldSecret=process.env.JWT_SECRET;
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
      source = source.replace(/import \{ query(?:, pool)? \} from '..\/config\/db.js';/, 'const pool = globalThis.__f11Pool; const query = async (...args) => { const c = await pool.connect(); try { return await c.query(...args); } finally { c.release(); } };');
      source = source.replace("import { logInfo, logError } from '../utils/logger.js';", 'const logInfo = () => {}; const logError = () => {};');
      source = source.replace("import bcrypt from 'bcrypt';", 'const bcrypt = null;');
      for (const util of ['catalogReference', 'recordDate']) source = source.replace("'../utils/"+util+".js'", JSON.stringify(pathToFileURL(path.join(root,'backend/src/utils',util+'.js')).href));
      globalThis.__f11Pool = testPool;
      try { const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64'); globalThis.__f11ControllerUrl=url; return await import(url); }
      finally { delete globalThis.__f11Pool; }
    };
    await loadController('recyclingController.js');
    let routeSource=fs.readFileSync(path.join(root,'backend/src/routes/recyclingRoutes.js'),'utf8');
    routeSource=routeSource.replace("'express'",JSON.stringify(pathToFileURL(require.resolve('express')).href));
    routeSource=routeSource.replace("'../controllers/recyclingController.js'",JSON.stringify(globalThis.__f11ControllerUrl));
    delete globalThis.__f11ControllerUrl;
    routeSource=routeSource.replace("'../middleware/authMiddleware.js'",JSON.stringify(await authModuleUrl(testPool)));
    // No files in this suite: preserve actual route/auth/controller, stub only upload storage.
    routeSource=routeSource.replace("import { upload } from '../middleware/uploadMiddleware.js';",'const upload={single:()=> (_req,_res,next)=>next()};');
    const {default:router}=await import('data:text/javascript;base64,'+Buffer.from(routeSource).toString('base64'));
    process.env.JWT_SECRET='f11-isolated-test-secret';
    const app=express();app.use(express.json());app.use('/api/recycling',router);
    server=await new Promise(resolve=>{const running=app.listen(0,'127.0.0.1',()=>resolve(running));});
    const url=`http://127.0.0.1:${server.address().port}/api/recycling`;
    await client.query("INSERT INTO teams(name,dependency) VALUES ('Own','Fixture'),('Other','Fixture')");
    await client.query("INSERT INTO users(name,email,password_hash,role,team_id) VALUES ('Leader','leader@test.invalid','fixture','leader',1),('Admin','admin@test.invalid','fixture','admin',NULL)");
    await client.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Current',CURRENT_DATE-10,CURRENT_DATE+10,true)");
    const reference={catalog_group_name:'Dependencias institucionales',catalog_action_name:'Entrega acopio',catalog_action_level:'Nivel 1: Volumen bajo (1 a 5 kg)'};
    // Additional synthetic fixture only; never alters the 56 distributed rows.
    await client.query('INSERT INTO points_catalog(group_name,action_name,action_level,points) VALUES ($1,$2,$3,123)',Object.values(reference));
    const dates=(await client.query('SELECT CURRENT_DATE::text AS today,(CURRENT_DATE+1)::text AS future,(CURRENT_DATE-11)::text AS outside')).rows[0];
    const post=async (identity={id:1,role:'leader',team_id:1},extra={})=>{
      const token=jwt.sign({...identity,sv:0},process.env.JWT_SECRET,{expiresIn:'5m'});
      const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({material_type:'papel_carton',quantity:1,unit:'kg',quality_level:'media',criteria_count:1,period_id:1,record_date:dates.today,...reference,...extra})});
      return {code:response.status,body:await response.json()};
    };
    const rows=async ()=>(await client.query('SELECT * FROM recycling_records ORDER BY id')).rows;
    await t.test('POST real: lider usa equipo actual, ignora equipo/body y mantiene pending/0',async()=>{
      const result=await post(undefined,{team_id:2,user_id:2,role:'admin',points:999,points_awarded:999,status:'approved'});
      assert.equal(result.code,201);assert.equal(result.body.team_id,1);assert.equal(result.body.user_id,1);
      assert.equal(result.body.status,'pending');assert.equal(result.body.points_awarded,0);
    });
    for(const role of ['admin','supervisor']) {
      await t.test(`admin actual con claim ${role}: 403 incluso con equipo y body leader`,async()=>{
        const before=await rows();
        for(const team_id of [null,1]) assert.equal((await post({id:2,role,team_id},{role:'leader',team_id:1})).code,403);
        assert.deepEqual(await rows(),before);
      });
    }
    await t.test('líder sin equipo actual: 403 aunque JWT/body tengan equipo', async()=>{
      const before=await rows(); await client.query('UPDATE users SET team_id=NULL WHERE id=1');
      try { const result=await post(); assert.equal(result.code,403); assert.match(result.body.message,/equipo/); }
      finally { await client.query('UPDATE users SET team_id=1 WHERE id=1'); }
      assert.deepEqual(await rows(),before);
    });
    await t.test('equipo obsoleto o manipulado en JWT no es autoridad',async()=>{
      for(const team_id of [null,0,-1,1.2,'1',{},2147483647]) {
        const result=await post({id:1,role:'admin',team_id});
        assert.equal(result.code,201);assert.equal(result.body.team_id,1);
      }
    });
    await t.test('S01/F15 nuevo registro usa equipo actual; históricos intactos',async()=>{
      const before=await rows();await client.query('UPDATE users SET team_id=2 WHERE id=1');
      try {const result=await post({id:1,role:'leader',team_id:1});assert.equal(result.code,201);assert.equal(result.body.team_id,2);assert.deepEqual((await rows()).slice(0,before.length),before);}
      finally {await client.query('UPDATE users SET team_id=1 WHERE id=1');}
    });
    await t.test('sin autenticacion: 401 en POST real',async()=>{
      const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'});assert.equal(response.status,401);
    });
    await t.test('F05 y F10 siguen rechazando manipulaciones desde POST real',async()=>{
      const before=await rows();
      for(const [extra,code] of [[{catalog_action_name:'manipulated'},400],[{period_id:999},409],[{record_date:'2026-02-30'},400],[{record_date:dates.future},400],[{record_date:dates.outside},400]]) assert.equal((await post(undefined,extra)).code,code);
      await client.query('UPDATE periods SET is_active=false');
      assert.equal((await post()).code,409);
      assert.deepEqual(await rows(),before);
    });
    await t.test('frontend restringe solo formulario y oculta enlace a no lideres',()=>{
      const appSource=fs.readFileSync(path.join(root,'frontend/src/App.jsx'),'utf8');
      assert.match(appSource,/roles=\{\['leader'\]\}[\s\S]*?path="\/leader\/register"/);
      const dashboard=fs.readFileSync(path.join(root,'frontend/src/pages/leader/LeaderDashboard.jsx'),'utf8');
      assert.match(dashboard,/user\?\.role === 'leader' && <Link to="\/leader\/register"/);
      const guard=fs.readFileSync(path.join(root,'frontend/src/components/ProtectedRoute.jsx'),'utf8');
      assert.match(guard,/!roles.includes\(user.role\)/);assert.match(guard,/<Navigate to="\/" replace/);
    });
    assert.deepEqual((await client.query('SELECT * FROM points_catalog WHERE id=ANY($1) ORDER BY id',[catalogBefore.map(r=>r.id)])).rows,catalogBefore);
  } finally {
    if(server) await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
    if(oldSecret===undefined) delete process.env.JWT_SECRET;else process.env.JWT_SECRET=oldSecret;
    if(testPool) await testPool.end();
    if(client) await client.end();
    if(started) ok(run('pg_ctl',['-D',dataDir,'-m','fast','-w','stop']));
  }
});
