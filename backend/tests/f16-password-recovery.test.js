import { postgresHarness } from './helpers/postgresCluster.js';
import { authModuleUrl } from './helpers/authModule.js';
// F16 only. Starts a NEW disposable PostgreSQL cluster, never reads .env.
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
test('F16: revision transaccional PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-f16-test-'));
  const dataDir = path.join(temporary, 'data');
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 'f16-password-recovery.test.js' });
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
    const load = async (file, testDelivery=false) => {
      let source=fs.readFileSync(path.join(root,'backend/src/controllers',file),'utf8');
      source=source.replace(/import \{ (?:query|pool) \} from '..\/config\/db.js';/,()=> 'const pool=globalThis.__f16Pool; const query=(...args)=>pool.query(...args);');
      source=source.replace("import { logInfo, logError } from '../utils/logger.js';",()=> 'const logInfo=()=>{}; const logError=()=>{};');
      for(const pkg of ['bcrypt','jsonwebtoken']) source=source.replace("'"+pkg+"'",()=>JSON.stringify(pathToFileURL(require.resolve(pkg)).href));
      source=source.replace("'../services/passwordResetDelivery.js'",()=>JSON.stringify(pathToFileURL(path.join(root,'backend/src/services/passwordResetDelivery.js')).href));
      if(testDelivery) source=source.replace('createRecoveryHandlers(pool, deliverPasswordReset);','createRecoveryHandlers(pool, globalThis.__f16Delivery);');
      globalThis.__f16Pool=testPool; globalThis.__f16Delivery=async value=>delivered.push(value);
      const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');
      try{return {module:await import(url),url};}finally{delete globalThis.__f16Pool;delete globalThis.__f16Delivery;}
    };
    const auth=await load('authController.js');
    const recovery=await load('passwordRecoveryController.js',true);
    const production=await load('passwordRecoveryController.js');
    process.env.AUTH_LOGIN_MAX='1000'; process.env.AUTH_FORGOT_MAX='1000'; process.env.AUTH_RESET_MAX='1000';
    let routeSource=fs.readFileSync(path.join(root,'backend/src/routes/authRoutes.js'),'utf8');
    routeSource=routeSource.replace("'express'",()=>JSON.stringify(pathToFileURL(require.resolve('express')).href));
    routeSource=routeSource.replace("'../controllers/authController.js'",()=>JSON.stringify(auth.url));
    routeSource=routeSource.replace("'../controllers/passwordRecoveryController.js'",()=>JSON.stringify(recovery.url));
    routeSource=routeSource.replace("'../middleware/authMiddleware.js'",JSON.stringify(await authModuleUrl(testPool)));
    routeSource=routeSource.replace("'../middleware/authRateLimit.js'",()=>JSON.stringify(pathToFileURL(path.join(root,'backend/src/middleware/authRateLimit.js')).href));
    const {default:router}=await import('data:text/javascript;base64,'+Buffer.from(routeSource).toString('base64'));
    const app=express();app.use(express.json());app.use('/api/auth',router);
    app.post('/production/forgot',production.module.forgotPassword);
    const failingDelivery=recovery.module.createRecoveryHandlers(testPool,async()=>{throw Error('PRIVATE provider token');});
    app.post('/failed-delivery',failingDelivery.forgotPassword);
    server=await new Promise(resolve=>{const running=app.listen(0,'127.0.0.1',()=>resolve(running));});
    const base='http://127.0.0.1:'+server.address().port;
    process.env.JWT_SECRET='f16-isolated-test-secret';
    const post=async(resource,body)=>{
      const response=await fetch(base+resource,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
      const raw=await response.text();
      return {code:response.status,body:response.headers.get('content-type')?.includes('application/json')?JSON.parse(raw):raw};
    };
    const forgot=email=>post('/api/auth/forgot-password',{email});
    const reset=(token,password='new-fixture-password')=>post('/api/auth/reset-password',{token,new_password:password});
    const login=password=>post('/api/auth/login',{email:'active@test.invalid',password});
    const tokenRows=async()=> (await client.query('SELECT * FROM password_reset_tokens ORDER BY id')).rows;
    const users=async()=> (await client.query('SELECT * FROM users ORDER BY id')).rows;
    const generic={code:200,body:{message:recovery.module.RECOVERY_MESSAGE}};
    const originalHash=await bcrypt.hash('old-fixture-password',10);
    await client.query("INSERT INTO teams(name,dependency) VALUES ('Fixture','Fixture')");
    await client.query("INSERT INTO users(name,email,password_hash,role,is_active,team_id) VALUES ('Active','active@test.invalid',$1,'leader',true,1),('Inactive','inactive@test.invalid',$1,'leader',false,1)",[originalHash]);
    await client.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Fixture','2026-01-01','2026-12-31',true)");
    await client.query("INSERT INTO recycling_records(user_id,team_id,period_id,material_type,quantity,unit,quality_level,status,points_awarded,record_date) VALUES (1,1,1,'papel_carton',2.5,'kg','alta','approved',25,'2026-06-01')");
    const history=(await client.query('SELECT * FROM recycling_records ORDER BY id')).rows;
    let token;
    await t.test('solicitud: existente/inexistente/inactivo iguales; inválido 400, sin datos de cuenta',async()=>{
      for(const email of ['active@test.invalid','missing@test.invalid','inactive@test.invalid']) assert.deepEqual(await forgot(email),generic);
      for(const email of ['',null,123,'bad','a'.repeat(151)+'@x.co']) assert.equal((await forgot(email)).code,400);
      assert.equal(delivered.length,1);assert.equal((await tokenRows()).length,1);token=delivered[0].token;
      assert.equal((await forgot('ACTIVE@test.invalid')).code,200); assert.equal(delivered.length,1,'email case stays coherent with exact login lookup');
    });
    await t.test('token aleatorio de 256 bits, solo SHA-256 almacenado y expiración de 30 minutos',async()=>{
      assert.match(token,/^[a-f0-9]{64}$/);const row=(await tokenRows())[0];
      assert.equal(row.token_hash,createHash('sha256').update(token).digest('hex'));assert.notEqual(row.token_hash,token);
      assert.equal(JSON.stringify(row).includes(token),false);assert.equal(row.used_at,null);
      assert.ok(Math.abs(row.expires_at-row.created_at-30*60*1000)<1000);
      await forgot(' active@test.invalid ');assert.notEqual(delivered.at(-1).token,token);
      assert.equal((await reset(token)).code,400,'previous request invalidated');token=delivered.at(-1).token;
    });
    await t.test('reset válido: bcrypt 10, login nuevo, anterior rechazado y token de un uso',async()=>{
      const before=await users(); const oldLogin=await login('old-fixture-password');assert.equal(oldLogin.code,200);
      const result=await reset(token);assert.equal(result.code,200);assert.deepEqual(Object.keys(result.body),['message']);
      const after=await users();assert.notEqual(after[0].password_hash,originalHash);assert.equal(bcrypt.getRounds(after[0].password_hash),10);
      assert.equal(await bcrypt.compare('new-fixture-password',after[0].password_hash),true);
      assert.deepEqual(after.map(({password_hash,session_version,...rest})=>rest),before.map(({password_hash,session_version,...rest})=>rest));
      assert.equal((await login('old-fixture-password')).code,401); const next=await login('new-fixture-password');assert.equal(next.code,200);assert.equal('password_hash' in next.body.user,false);
      assert.equal((await reset(token)).code,400); assert.deepEqual(await users(),after);
      assert.ok((await tokenRows()).every(row=>row.used_at));
      // S01 supersedes the historical risk: password reset revokes old JWT.
      assert.equal(after[0].session_version,before[0].session_version+1);
      const response=await fetch(base+'/api/auth/me',{headers:{Authorization:'Bearer '+oldLogin.body.token}});assert.equal(response.status,401);
    });
    await t.test('inválido/expirado/vacío y contraseñas inválidas no cambian filas',async()=>{
      await forgot('active@test.invalid');const expiring=delivered.at(-1).token;
      await client.query("UPDATE password_reset_tokens SET created_at=clock_timestamp()-INTERVAL '2 hours', expires_at=clock_timestamp()-INTERVAL '1 hour' WHERE used_at IS NULL");
      const before=await users(),rows=await tokenRows();
      for(const value of ['',null,'invalid','0'.repeat(64),expiring]) assert.equal((await reset(value)).code,400);
      for(const password of ['',null,123,'x'.repeat(73),'é'.repeat(37)]) assert.equal((await reset(expiring,password)).code,400);
      assert.equal((await post('/api/auth/reset-password',{token:expiring,new_password:'valid',role:'admin'})).code,400);
      assert.deepEqual(await users(),before);assert.deepEqual(await tokenRows(),rows);
    });
    await t.test('desactivación posterior a emisión impide recuperación sin consumir token',async()=>{
      await forgot('active@test.invalid');const value=delivered.at(-1).token;
      await client.query('UPDATE users SET is_active=false WHERE id=1');const before=await users(),rows=await tokenRows();
      assert.equal((await reset(value)).code,400);assert.deepEqual(await users(),before);assert.deepEqual(await tokenRows(),rows);
      await client.query('UPDATE users SET is_active=true WHERE id=1');
    });
    await t.test('fallo diferido COMMIT revierte contraseña y consumo del token; reintento funciona',async()=>{
      await forgot('active@test.invalid');const value=delivered.at(-1).token;
      await client.query("CREATE FUNCTION f16_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'PRIVATE SQL password_hash'; END $$");
      await client.query('CREATE CONSTRAINT TRIGGER f16_fail AFTER UPDATE ON users DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION f16_fail()');
      const before=await users(),rows=await tokenRows();
      const result=await reset(value);assert.equal(result.code,500);assert.deepEqual(result.body,{message:'No fue posible restablecer la contraseña'});
      assert.deepEqual(await users(),before);assert.deepEqual(await tokenRows(),rows);
      await client.query('DROP TRIGGER f16_fail ON users');assert.equal((await reset(value)).code,200);
    });
    await t.test('concurrencia: mismo token se consume exactamente una vez',async()=>{
      await forgot('active@test.invalid');const value=delivered.at(-1).token;
      const results=await Promise.all([reset(value,'concurrent-a'),reset(value,'concurrent-b')]);
      assert.deepEqual(results.map(r=>r.code).sort(),[200,400]);
      assert.equal((await login(results[0].code===200?'concurrent-a':'concurrent-b')).code,200);
    });
    await t.test('producción y fallo de entrega: nunca token HTTP ni distinción de cuenta',async()=>{
      const envBefore=process.env.NODE_ENV;process.env.NODE_ENV='production';
      try {
        for(const email of ['active@test.invalid','missing@test.invalid','inactive@test.invalid']) assert.deepEqual(await post('/production/forgot',{email}),generic);
        assert.deepEqual(await post('/failed-delivery',{email:'active@test.invalid'}),generic);
      } finally {if(envBefore===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=envBefore;}
      for(const route of ['/api/auth/change-password','/api/auth/password']) assert.equal((await post(route,{password:'arbitrary'})).code,404);
    });
    await t.test('política existente sin complejidad nueva; límite bcrypt y fallos de solicitud',async()=>{
      for(const password of ['x','x'.repeat(72)]) {
        await forgot('active@test.invalid');assert.equal((await reset(delivered.at(-1).token,password)).code,200);
        assert.equal((await login(password)).code,200);
      }
      await client.query("CREATE FUNCTION f16_fail_issue() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'PRIVATE issuance'; END $$");
      await client.query('CREATE TRIGGER f16_fail_issue BEFORE INSERT ON password_reset_tokens FOR EACH ROW EXECUTE FUNCTION f16_fail_issue()');
      const before=await tokenRows(),sent=delivered.length;
      assert.deepEqual(await forgot('active@test.invalid'),generic);assert.deepEqual(await forgot('missing@test.invalid'),generic);
      assert.deepEqual(await tokenRows(),before);assert.equal(delivered.length,sent);
      await client.query('DROP TRIGGER f16_fail_issue ON password_reset_tokens');
    });
    await t.test('schema, FK restrictiva, índices y verificación de lectura',async()=>{
      ok(psql(['-f','database/verify_20260912_f16.sql']));
      const columns=(await client.query("SELECT column_name FROM information_schema.columns WHERE table_name='password_reset_tokens' ORDER BY ordinal_position")).rows.map(r=>r.column_name);
      assert.deepEqual(columns,['id','user_id','token_hash','expires_at','used_at','created_at']);
      await assert.rejects(client.query("INSERT INTO password_reset_tokens(user_id,token_hash,expires_at) VALUES (999999,$1,clock_timestamp()+INTERVAL '30 minutes')",['a'.repeat(64)]),e=>e.code==='23503');
      await assert.rejects(client.query('DELETE FROM users WHERE id=1'),e=>['23001','23503'].includes(e.code));
      assert.deepEqual((await client.query('SELECT * FROM recycling_records ORDER BY id')).rows,history);
    });
    await t.test('migración incremental: datos existentes intactos, mismo esquema, repetición aborta segura',async()=>{
      await client.query('CREATE DATABASE f16_existing');
      const pre=new pg.Client({host:'127.0.0.1',port,user:'postgres',database:'f16_existing'});await pre.connect();
      const priorSchema=fs.readFileSync(path.join(root,'database/schema.sql'),'utf8').replace(/CREATE TABLE public.password_reset_tokens[\s\S]+?CREATE INDEX password_reset_tokens_user_id_idx[^;]+;\s*/, '');
      const prePsql=(args,options)=>run('psql',['-X','-h','127.0.0.1','-p',String(port),'-U','postgres','-d','f16_existing','-v','ON_ERROR_STOP=1',...args],options);
      try {
        ok(prePsql([], {input:priorSchema}));ok(prePsql(['-f','database/import_points_catalog.sql']));
        await pre.query("INSERT INTO teams(name,dependency) VALUES ('Previous','Previous'); INSERT INTO periods(name,start_date,end_date) VALUES ('Previous','2026-01-01','2026-12-31')");
        await pre.query("INSERT INTO users(name,email,password_hash,role,team_id) VALUES ('Previous','prior@test.invalid',$1,'leader',1)",[originalHash]);
        await pre.query("INSERT INTO recycling_records(user_id,team_id,period_id,material_type,quantity,quality_level,points_awarded) VALUES (1,1,1,'papel_carton',1,'alta',0)");
        const snapshot=async()=>{const data={};for(const table of ['users','teams','periods','recycling_records','points_catalog'])data[table]=(await pre.query('SELECT * FROM '+table+' ORDER BY id')).rows;return data;};
        const before=await snapshot();ok(prePsql(['-f','database/20260912_f16_password_reset.sql']));ok(prePsql(['-f','database/verify_20260912_f16.sql']));assert.deepEqual(await snapshot(),before);
        const sql="SELECT column_name,data_type,is_nullable,column_default FROM information_schema.columns WHERE table_name='password_reset_tokens' ORDER BY ordinal_position";
        assert.deepEqual((await pre.query(sql)).rows,(await client.query(sql)).rows);
        assert.notEqual(prePsql(['-f','database/20260912_f16_password_reset.sql']).status,0);assert.deepEqual(await snapshot(),before);
        ok(prePsql(['-f','database/verify_20260912_f16.sql']));
      } finally {await pre.end();}
    });
    assert.equal(catalogBefore.length,56);
    assert.deepEqual((await client.query('SELECT * FROM points_catalog ORDER BY id')).rows,catalogBefore);
    assert.deepEqual((await client.query('SELECT * FROM recycling_records ORDER BY id')).rows,history);
  } finally {
    if(server) await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
    if(oldSecret===undefined) delete process.env.JWT_SECRET;else process.env.JWT_SECRET=oldSecret;
    if(testPool) await testPool.end();if(client) await client.end();
    if(started) ok(run('pg_ctl',['-D',dataDir,'-m','fast','-w','stop']));
  }
});
