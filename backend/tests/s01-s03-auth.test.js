import { postgresHarness } from './helpers/postgresCluster.js';
import { authModuleUrl } from './helpers/authModule.js';
// S01-S03 only. Starts a NEW disposable PostgreSQL cluster, never reads .env.
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
import bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('S01-S03: revision transaccional PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-s01-test-'));
  const dataDir = path.join(temporary, 'data');
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 's01-s03-auth.test.js' });
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


    const delivered=[];
    globalThis.__securityPool=testPool;
    async function loadController(file) {
      let source=fs.readFileSync(path.join(root,'backend/src/controllers',file),'utf8');
      source=source.replace(/import \{ (?:query|pool) \} from '..\/config\/db.js';/,
        'const pool=globalThis.__securityPool; const query=(...args)=>pool.query(...args);');
      for(const pkg of ['bcrypt','jsonwebtoken']) source=source.replace("'"+pkg+"'",()=>JSON.stringify(pathToFileURL(require.resolve(pkg)).href));
      source=source.replace("import { deliverPasswordReset } from '../services/passwordResetDelivery.js';",'const deliverPasswordReset=globalThis.__securityDelivery;');
      return 'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
    }
    globalThis.__securityDelivery=async value=>delivered.push(value);
    const authUrl=await loadController('authController.js'), recoveryUrl=await loadController('passwordRecoveryController.js');
    const middlewareUrl=await authModuleUrl(testPool);
    const middleware=await import(middlewareUrl);
    let routeSource=fs.readFileSync(path.join(root,'backend/src/routes/authRoutes.js'),'utf8');
    for(const [from,to] of [ ['express',pathToFileURL(require.resolve('express')).href],
      ['../controllers/authController.js',authUrl],['../controllers/passwordRecoveryController.js',recoveryUrl],
      ['../middleware/authMiddleware.js',middlewareUrl],
      ['../middleware/authRateLimit.js',pathToFileURL(path.join(root,'backend/src/middleware/authRateLimit.js')).href]]) {
      routeSource=routeSource.replace("'"+from+"'",()=>JSON.stringify(to));
    }
    process.env.JWT_SECRET='security-isolated-test-secret';
    delete process.env.AUTH_LOGIN_MAX;delete process.env.AUTH_FORGOT_MAX;delete process.env.AUTH_RESET_MAX;delete process.env.AUTH_WINDOW_MS;
    const {default:router}=await import('data:text/javascript;base64,'+Buffer.from(routeSource).toString('base64'));
    const {controlledError,corsOptions}=await import('../src/middleware/httpConfig.js');
    const cors=(await import('cors')).default;
    const app=express();app.use(cors(corsOptions()));app.use(express.json());app.use('/api/auth',router);
    app.get('/protected',middleware.authenticateToken,(req,res)=>res.json(req.user));
    app.get('/admin',middleware.authenticateToken,middleware.authorizeRoles('admin'),(req,res)=>res.json({ok:true}));
    app.get('/db-failure',middleware.createAuthenticateToken(async()=>{throw Error('SELECT private SQL password JWT reset-token');}),(_req,res)=>res.json({ok:true}));
    app.use(controlledError);
    server=await new Promise(resolve=>{const running=app.listen(0,'127.0.0.1',()=>resolve(running));});
    const base='http://127.0.0.1:'+server.address().port;
    const request=async(resource,{token,body,headers={},method=body?'POST':'GET'}={})=>{
      const response=await fetch(base+resource,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{}),...headers},...(body?{body:JSON.stringify(body)}:{})});
      return {code:response.status,body:await response.json(),headers:response.headers};
    };
    const hash=await bcrypt.hash('fixture-password',10);
    await client.query("INSERT INTO teams(name,dependency) VALUES ('One','Fixture'),('Two','Fixture')");
    await client.query("INSERT INTO users(name,email,password_hash,role,team_id) VALUES ('Leader','leader@test.invalid',$1,'leader',1),('Admin','admin@test.invalid',$1,'admin',NULL)",[hash]);
    const login=()=>request('/api/auth/login',{body:{email:'leader@test.invalid',password:'fixture-password'}});
    const sign=(claims={},options={})=>jwt.sign({id:1,sv:0,...claims},process.env.JWT_SECRET,{expiresIn:'5m',...options});
    let token;
    await t.test('S01/S02 login Bearer mínimo, ocho horas; me no expone hash/version',async()=>{
      const response=await login();assert.equal(response.code,200);token=response.body.token;
      assert.equal(response.headers.get('set-cookie'),null);
      const claims=jwt.verify(token,process.env.JWT_SECRET);assert.deepEqual(Object.keys(claims).sort(),['exp','iat','id','sv']);assert.equal(claims.exp-claims.iat,28800);
      const me=await request('/api/auth/me',{token});assert.equal(me.code,200);assert.equal(me.body.team_id,1);
      assert.equal('password_hash' in me.body,false);assert.equal('session_version' in me.body,false);
      assert.equal((await request('/protected',{token})).code,200);
    });
    await t.test('S01 desactivación y usuario inexistente rechazan me y rutas protegidas',async()=>{
      await client.query('UPDATE users SET is_active=false WHERE id=1');
      for(const route of ['/api/auth/me','/protected']) assert.equal((await request(route,{token})).code,401);
      await client.query('UPDATE users SET is_active=true WHERE id=1');
      assert.equal((await request('/protected',{token:sign({id:999})})).code,401);
    });
    await t.test('S01 datos actuales ganan a role/team obsoletos; una sola consulta',async()=>{
      await client.query("UPDATE users SET team_id=2,name='Changed' WHERE id=1");
      const old=sign({role:'admin',team_id:1});
      assert.equal((await request('/admin',{token:old})).code,403);
      let calls=0;const original=testPool.query.bind(testPool);testPool.query=(...args)=>{calls++;return original(...args);};
      try {const me=await request('/api/auth/me',{token:old});assert.equal(me.body.team_id,2);assert.equal(me.body.name,'Changed');assert.equal(calls,1);}
      finally {testPool.query=original;}
      await client.query("UPDATE users SET role='admin',team_id=NULL WHERE id=1");
      assert.equal((await request('/admin',{token})).code,200);
      await client.query("UPDATE users SET role='leader',team_id=1 WHERE id=1");
    });
    await t.test('S01 JWT expirado, alterado, legacy, identidad inválida y algoritmo ajeno rechazados',async()=>{
      for(const bad of [sign({}, {expiresIn:-1}),token.slice(0,-8)+'tampered',jwt.sign({id:1},process.env.JWT_SECRET),sign({id:'1'}),sign({}, {algorithm:'HS384'})]) {
        assert.equal((await request('/protected',{token:bad})).code,401);
      }
      assert.equal((await request('/protected')).code,401);
    });
    await t.test('S03 SQL simulado falla cerrado y JSON inválido no revela detalles',async()=>{
      const response=await request('/db-failure',{token});assert.equal(response.code,500);assert.deepEqual(response.body,{message:'No fue posible verificar la sesión'});
      const original=testPool.query.bind(testPool);testPool.query=async()=>{throw Error('SELECT private SQL JWT password');};
      const logs=[];const originalLog=console.log,originalError=console.error;console.log=(...args)=>logs.push(args);console.error=(...args)=>logs.push(args);
      try {const failed=await login();assert.equal(failed.code,500);assert.deepEqual(failed.body,{message:'Error al iniciar sesión'});}
      finally {testPool.query=original;console.log=originalLog;console.error=originalError;}
      assert.deepEqual(logs,[]);
      const raw=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:'{private'});
      assert.equal(raw.status,400);assert.deepEqual(await raw.json(),{message:'Solicitud inválida'});
    });
    await t.test('S01/F16 reset revoca sesiones; rollback conserva versión y JWT',async()=>{
      const forgot=()=>request('/api/auth/forgot-password',{body:{email:'leader@test.invalid'}});
      await forgot();const resetToken=delivered.at(-1).token;
      await client.query("CREATE FUNCTION fail_session() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'private'; END $$");
      await client.query('CREATE CONSTRAINT TRIGGER fail_session AFTER UPDATE ON users DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION fail_session()');
      const reset=()=>request('/api/auth/reset-password',{body:{token:resetToken,new_password:'new-password'}});
      assert.equal((await reset()).code,500);assert.equal((await request('/protected',{token})).code,200);
      assert.equal((await client.query('SELECT session_version FROM users WHERE id=1')).rows[0].session_version,0);
      await client.query('DROP TRIGGER fail_session ON users');
      assert.equal((await reset()).code,200);assert.equal((await request('/api/auth/me',{token})).code,401);
      const next=await request('/api/auth/login',{body:{email:'leader@test.invalid',password:'new-password'}});
      assert.equal(next.code,200);assert.equal((await request('/protected',{token:next.body.token})).code,200);
    });
    await t.test('S03 credenciales genéricas y límites reales login/forgot/reset',async()=>{
      const missing=await request('/api/auth/login',{body:{email:'missing@test.invalid',password:'wrong'}});
      const wrong=await login();assert.equal(wrong.code,401);assert.deepEqual(missing.body,wrong.body);
      for(let i=0;i<10;i++) await login();
      const limited=await login();assert.equal(limited.code,429);assert.ok(Number(limited.headers.get('retry-after'))>0);assert.deepEqual(Object.keys(limited.body),['message']);
      const forgot= email=>request('/api/auth/forgot-password',{body:{email}});
      assert.deepEqual((await forgot('missing@test.invalid')).body,(await forgot('leader@test.invalid')).body);
      for(let i=0;i<5;i++) await forgot('missing@test.invalid');assert.equal((await forgot('missing@test.invalid')).code,429);
      for(let i=0;i<10;i++) await request('/api/auth/reset-password',{body:{token:'a'.repeat(64),new_password:'x'}});
      assert.equal((await request('/api/auth/reset-password',{body:{token:'a'.repeat(64),new_password:'x'}})).code,429);
    });
    await t.test('S02 CORS exacto sin credenciales y preflight Authorization',async()=>{
      const response=await fetch(base+'/protected',{method:'OPTIONS',headers:{Origin:'http://localhost:5173','Access-Control-Request-Method':'GET','Access-Control-Request-Headers':'authorization'}});
      assert.equal(response.headers.get('access-control-allow-origin'),'http://localhost:5173');assert.equal(response.headers.get('access-control-allow-credentials'),null);
      const other=await fetch(base+'/protected',{headers:{Origin:'https://other.invalid'}});assert.equal(other.headers.get('access-control-allow-origin'),null);
    });
    await t.test('S01 migración idempotente sobre datos previos y verificación',async()=>{
      await client.query('ALTER TABLE users DROP COLUMN session_version');
      const before=(await client.query('SELECT * FROM users ORDER BY id')).rows;
      for(let i=0;i<2;i++) ok(psql(['-f','database/20260914_s01_session_version.sql']));
      ok(psql(['-f','database/verify_s01_session_version.sql']));
      const after=(await client.query('SELECT * FROM users ORDER BY id')).rows;
      assert.deepEqual(after.map(({session_version,...row})=>row),before);assert.ok(after.every(row=>row.session_version===0));
      await assert.rejects(client.query('UPDATE users SET session_version=-1 WHERE id=1'),{code:'23514'});
      await client.query('UPDATE users SET session_version=3 WHERE id=1');ok(psql(['-f','database/20260914_s01_session_version.sql']));
      assert.equal((await client.query('SELECT session_version FROM users WHERE id=1')).rows[0].session_version,3);
    });
    assert.equal(catalogBefore.length,56);assert.deepEqual((await client.query('SELECT * FROM points_catalog ORDER BY id')).rows,catalogBefore);
    delete globalThis.__securityPool;delete globalThis.__securityDelivery;
  } finally {
    if(server) await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
    if(oldSecret===undefined) delete process.env.JWT_SECRET;else process.env.JWT_SECRET=oldSecret;
    if(testPool) await testPool.end();if(client) await client.end();
    if(started) ok(run('pg_ctl',['-D',dataDir,'-m','fast','-w','stop']));
  }
});
