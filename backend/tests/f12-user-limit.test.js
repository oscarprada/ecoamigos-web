// F12 only. Starts a NEW disposable PostgreSQL cluster, never reads .env.
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
import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('F12: revision transaccional PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-f12-test-'));
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
      source = source.replace(/import \{ query(?:, pool)? \} from '..\/config\/db.js';/, 'const pool = globalThis.__f12Pool; const query = async (...args) => { const c = await pool.connect(); try { return await c.query(...args); } finally { c.release(); } };');
      source = source.replace("import { logInfo, logError } from '../utils/logger.js';", 'const logInfo = () => {}; const logError = () => {};');
      source = source.replace("'bcrypt'", JSON.stringify(pathToFileURL(require.resolve('bcrypt')).href));
      source = source.replace("'../utils/environmentalIndicators.js'", JSON.stringify(pathToFileURL(path.join(root,'backend/src/utils/environmentalIndicators.js')).href));
      for (const util of ['catalogReference', 'recordDate']) source = source.replace("'../utils/"+util+".js'", JSON.stringify(pathToFileURL(path.join(root,'backend/src/utils',util+'.js')).href));
      globalThis.__f12Pool = testPool;
      try { const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64'); globalThis.__f12ControllerUrl=url; return await import(url); }
      finally { delete globalThis.__f12Pool; }
    };
    await loadController('adminController.js');
    let routeSource=fs.readFileSync(path.join(root,'backend/src/routes/adminRoutes.js'),'utf8');
    for(const pkg of ['express','multer']) routeSource=routeSource.replace(`'${pkg}'`,JSON.stringify(pathToFileURL(require.resolve(pkg)).href));
    routeSource=routeSource.replace("'../controllers/adminController.js'",JSON.stringify(globalThis.__f12ControllerUrl));delete globalThis.__f12ControllerUrl;
    routeSource=routeSource.replace("import { exportRecyclingReport } from '../controllers/exportController.js';",'const exportRecyclingReport=()=>{};');
    routeSource=routeSource.replace("'../middleware/authMiddleware.js'",JSON.stringify(pathToFileURL(path.join(root,'backend/src/middleware/authMiddleware.js')).href));
    const {default:router}=await import('data:text/javascript;base64,'+Buffer.from(routeSource).toString('base64'));
    process.env.JWT_SECRET='f12-isolated-test-secret';
    const app=express();app.use(express.json());app.use('/api/admin',router);
    server=await new Promise(resolve=>{const running=app.listen(0,'127.0.0.1',()=>resolve(running));});
    const url=`http://127.0.0.1:${server.address().port}/api/admin/users`;
    const token=jwt.sign({id:1,role:'admin'},process.env.JWT_SECRET,{expiresIn:'5m'});
    const post=async(email,extra={})=>{
      const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body:JSON.stringify({name:'Fixture',email,password:'fixture-password',role:'leader',team_id:1,...extra})});
      return {code:response.status,body:await response.json()};
    };
    const rows=async()=>(await client.query('SELECT * FROM users ORDER BY id')).rows;
    const count=async()=>(await rows()).length;
    await client.query("INSERT INTO teams(name,dependency) VALUES ('Fixture','Fixture')");
    const seed=async total=>{
      // Only disposable cluster fixtures; no application connection is loaded.
      await client.query('DELETE FROM users');
      await client.query(`INSERT INTO users(name,email,password_hash,role,is_active,team_id)
        SELECT 'Fixture', 'seed-'||n||'@test.invalid','fixture',CASE WHEN n=1 THEN 'admin'::user_role ELSE 'leader'::user_role END,
        n % 2=1,CASE WHEN n=1 THEN NULL ELSE 1 END FROM generate_series(1,$1::int) n`,[total]);
    };
    await t.test('alta HTTP conserva bcrypt 10, password_hash, role, equipo y activo',async()=>{
      await seed(1);
      const leader=await post('leader@test.invalid');assert.equal(leader.code,201);
      const saved=(await rows()).find(r=>r.id===leader.body.id);
      assert.equal(saved.role,'leader');assert.equal(saved.team_id,1);assert.equal(saved.is_active,true);
      assert.ok(await bcrypt.compare('fixture-password',saved.password_hash));assert.equal(bcrypt.getRounds(saved.password_hash),10);
      assert.equal('password' in saved,false);assert.equal('password_hash' in leader.body,false);
      const admin=await post('admin@test.invalid',{role:'admin',team_id:1});assert.equal(admin.code,201);assert.equal(admin.body.team_id,null);assert.equal(admin.body.role,'admin');
    });
    await t.test('15 totales valido: admins e inactivos consumen cupo; API 16 devuelve 409',async()=>{
      await seed(14);assert.equal((await post('fifteenth@test.invalid')).code,201);assert.equal(await count(),15);
      const before=await rows();const result=await post('sixteenth@test.invalid');
      assert.equal(result.code,409);assert.equal(result.body.code,'USER_LIMIT_REACHED');assert.deepEqual(await rows(),before);
    });
    await t.test('desactivar/reactivar no altera cupo total; no existen rutas para ello',async()=>{
      await client.query('UPDATE users SET is_active=false');
      assert.equal((await post('inactive-full@test.invalid')).code,409);
      await client.query('UPDATE users SET is_active=true');
      assert.equal((await post('active-full@test.invalid')).code,409);assert.equal(await count(),15);
      assert.doesNotMatch(routeSource,/router\.(?:put|patch|delete)\(['"]\/users/);
    });
    await t.test('fallo INSERT y fallo diferido COMMIT revierten sin consumir cupo ni exponer SQL',async()=>{
      await seed(14);const before=await rows();
      const duplicate=await post('seed-1@test.invalid');assert.equal(duplicate.code,500);assert.deepEqual(duplicate.body,{message:'Error al crear usuario'});assert.deepEqual(await rows(),before);
      await client.query(`CREATE FUNCTION f12_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'private SQL'; END $$;
        CREATE CONSTRAINT TRIGGER f12_failure AFTER INSERT ON users DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION f12_fail()`);
      try {const result=await post('rollback@test.invalid');assert.equal(result.code,500);assert.deepEqual(result.body,{message:'Error al crear usuario'});assert.deepEqual(await rows(),before);}
      finally {await client.query('DROP TRIGGER f12_failure ON users; DROP FUNCTION f12_fail()');}
      assert.equal((await post('after-rollback@test.invalid')).code,201);assert.equal(await count(),15);
    });
    await t.test('dos POST reales con 14: bloqueo observado, 201/409 y total 15',async()=>{
      await seed(14);
      const originalConnect=testPool.connect.bind(testPool);let reached,resume,used=false;
      const locked=new Promise(resolve=>{reached=resolve;});const gate=new Promise(resolve=>{resume=resolve;});
      testPool.connect=async()=>{
        const c=await originalConnect();const q=c.query.bind(c);const release=c.release.bind(c);
        c.query=async(...args)=>{const result=await q(...args);if(!used && String(args[0]).startsWith('SELECT COUNT(*)::int AS total')) {used=true;reached();await gate;}return result;};
        c.release=(...args)=>{c.query=q;release(...args);};return c;
      };
      const first=post('race-first@test.invalid');await locked;
      const second=post('race-second@test.invalid');
      try {
        let waiting=false;const deadline=Date.now()+10000;
        while(Date.now()<deadline) {
          waiting=(await client.query("SELECT 1 FROM pg_stat_activity WHERE wait_event_type='Lock' AND query LIKE 'LOCK TABLE users%' AND pid<>pg_backend_pid()")).rowCount>0;
          if(waiting) break;await new Promise(resolve=>setTimeout(resolve,20));
        }
        assert.ok(waiting,'Segundo POST debe esperar bloqueo PostgreSQL');assert.equal(await count(),14);
      } finally {resume();testPool.connect=originalConnect;}
      const result=await Promise.all([first,second]);assert.deepEqual(result.map(r=>r.code),[201,409]);assert.equal(await count(),15);
    });
    await t.test('bootstrap respeta el mismo cupo: 14->15 y siguiente aborta intacto',async()=>{
      await seed(14);const hash=await bcrypt.hash('fixture-password',10);
      const args=['-v','admin_name=Bootstrap fixture','-v',`admin_password_hash=${hash}`,'-v','admin_email=bootstrap@test.invalid','-f','database/create_admin.sql'];
      ok(psql(args));assert.equal(await count(),15);const before=await rows();
      const result=psql(args);assert.notEqual(result.status,0);assert.match(result.stderr,/maximo de 15/);assert.deepEqual(await rows(),before);
    });
    await t.test('instalacion previamente excedida rechaza altas sin modificar usuarios',async()=>{
      await seed(16);const before=await rows();assert.equal((await post('over@test.invalid')).code,409);assert.deepEqual(await rows(),before);
    });
    await t.test('frontend conserva conteo total y refresca tras conflicto de cupo',()=>{
      const ui=fs.readFileSync(path.join(root,'frontend/src/pages/admin/AdminUsersPage.jsx'),'utf8');
      assert.match(ui,/const MAX_USERS = 15/);assert.match(ui,/const totalUsers = users.length/);assert.match(ui,/USER_LIMIT_REACHED[\s\S]*?await load\(\)/);
    });
    assert.deepEqual((await client.query('SELECT * FROM points_catalog ORDER BY id')).rows,catalogBefore);assert.equal(catalogBefore.length,56);
  } finally {
    if(server) await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
    if(oldSecret===undefined) delete process.env.JWT_SECRET;else process.env.JWT_SECRET=oldSecret;
    if(testPool) await testPool.end();if(client) await client.end();
    if(started) ok(run('pg_ctl',['-D',dataDir,'-m','fast','-w','stop']));
  }
});
