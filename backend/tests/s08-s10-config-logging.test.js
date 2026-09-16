import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { corsOptions, controlledError } from '../src/middleware/httpConfig.js';
import { databaseOptions } from '../src/config/databaseOptions.js';
import { createLogger, loggerOptions, sanitizeContext, flushLogs } from '../src/utils/logger.js';
const require = createRequire(import.meta.url);
const local = {DB_HOST:'localhost',DB_USER:'fixture_user',DB_PASSWORD:'fixture_secret',DB_NAME:'fixture_db'};
const temporary = () => fs.mkdtemp(path.join(os.tmpdir(),'ecoamigos-config-test-'));
async function serve(app, run) {
  const server = await new Promise(resolve=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));});
  try { await run('http://127.0.0.1:'+server.address().port); }
  finally { await new Promise(resolve=>server.close(resolve)); }
}

test('S08 CLIENT_URL local, lista normalizada, preflight y rechazos HTTP controlados',async()=>{
  for (const env of [{CLIENT_URL:'http://localhost:5173'},{CORS_ORIGINS:' http://localhost:5173 , https://frontend.example.test ',CLIENT_URL:'https://ignored.example.test'}]) {
    const app=express();let calls=0;app.use(cors(corsOptions(env)));app.all('/',(_req,res)=>{calls++;res.json({ok:true});});app.use(controlledError);
    await serve(app,async base=>{
      const allowed=await fetch(base,{headers:{Origin:'http://localhost:5173'}});assert.equal(allowed.status,200);assert.equal(allowed.headers.get('access-control-allow-origin'),'http://localhost:5173');assert.equal(allowed.headers.get('access-control-allow-credentials'),null);
      if(env.CORS_ORIGINS)assert.equal((await fetch(base,{headers:{Origin:'https://frontend.example.test'}})).status,200);
      const before=calls;const denied=await fetch(base,{method:'POST',headers:{Origin:'https://unknown.example.test'}});assert.equal(denied.status,403);assert.deepEqual(await denied.json(),{message:'Origen no permitido'});assert.equal(calls,before);assert.equal(denied.headers.get('access-control-allow-origin'),null);
      const preflight=await fetch(base,{method:'OPTIONS',headers:{Origin:'http://localhost:5173','Access-Control-Request-Method':'PATCH','Access-Control-Request-Headers':'authorization,content-type'}});
      assert.equal(preflight.status,204);assert.match(preflight.headers.get('access-control-allow-headers'),/Authorization/);assert.match(preflight.headers.get('access-control-allow-methods'),/PATCH/);assert.equal(preflight.headers.get('access-control-allow-credentials'),null);
      assert.equal((await fetch(base,{method:'OPTIONS',headers:{Origin:'https://unknown.example.test'}})).status,403);
      assert.equal((await fetch(base)).status,200);
    });
  }
});
test('S08 fallback solo desarrollo; configuración vacía, wildcard y URLs inválidas fallan cerradas',()=>{
  assert.equal(corsOptions({}).credentials,false);
  for(const value of ['', ' ', '*', 'https://example.test/path','https://example.test/','null','https://example.test,'])assert.throws(()=>corsOptions({CORS_ORIGINS:value}),/Configuración CORS/);
  assert.throws(()=>corsOptions({NODE_ENV:'production'}));assert.throws(()=>corsOptions({CORS_ORIGINS:'',CLIENT_URL:'http://localhost:5173'}));
  assert.throws(()=>corsOptions({CLIENT_URL:'http://localhost:5173,http://127.0.0.1:5173'}));
  assert.equal(corsOptions({NODE_ENV:'production',CLIENT_URL:'https://frontend.example.test'}).credentials,false);
});
test('S09 variables locales, puerto configurable y fallback sin conectar',()=>{
  assert.deepEqual(databaseOptions(local),{host:'localhost',port:5432,user:'fixture_user',password:'fixture_secret',database:'fixture_db',ssl:false});
  assert.equal(databaseOptions({...local,DB_PORT:'6543'}).port,6543);
  for(const DB_PORT of ['0','65536','-1','3.2','abc'])assert.throws(()=>databaseOptions({...local,DB_PORT}),/^Error: Configuración PostgreSQL inválida$/);
});
test('S09 DATABASE_URL prevalece, credenciales escapadas y TLS verificado en pg sin red',()=>{
  const config=databaseOptions({...local,DB_PORT:'invalid',DATABASE_URL:'postgresql://url_user:p%40ss@db.example.test:6432/url_db',DB_SSL:'true'});
  assert.equal(config.host,'db.example.test');assert.equal(config.port,6432);assert.equal(config.user,'url_user');assert.equal(config.password,'p@ss');assert.equal(config.database,'url_db');assert.deepEqual(config.ssl,{rejectUnauthorized:true});
  const client=new pg.Client(config);assert.deepEqual(client.connectionParameters.ssl,{rejectUnauthorized:true}); // never connect()
  assert.equal(databaseOptions({...local,DATABASE_URL:'postgres://u:p@localhost/db'}).port,5432);
  assert.equal(databaseOptions({...local,DB_SSL:'false'}).ssl,false);
});
test('S09 falta/invalidez controlada sin URL ni secretos; URL no puede sobreescribir TLS',()=>{
  for(const key of Object.keys(local)){const env={...local};delete env[key];assert.throws(()=>databaseOptions(env),/^Error: Configuración PostgreSQL inválida$/);}
  for(const value of ['not a URL secret','https://u:secret@host/db','postgres://u:secret@host/db?sslmode=no-verify','postgres://u:secret@host/db?sslcert=secret','postgres://u:secret@host/db#secret','postgres://host/db'])assert.throws(()=>databaseOptions({...local,DATABASE_URL:value}),/^Error: Configuración PostgreSQL inválida$/);
  assert.throws(()=>databaseOptions({...local,DB_SSL:'no-verify'}));assert.throws(()=>databaseOptions({...local,NODE_TLS_REJECT_UNAUTHORIZED:'0'}));
});
test('S10 info/warn/error JSONL y minimización anidada por allowlist',async()=>{
  const directory=await temporary();const log=createLogger({directory,maxBytes:4096,files:2,queueLimit:20});
  const secret='NEVER_DISCLOSE';const context={actor_id:7,record_id:8,status:'approved',password:secret,password_hash:secret,Authorization:secret,JWT:secret,token:secret,reset_token:secret,DATABASE_URL:secret,DB_PASSWORD:secret,email:secret,name:secret,notes:secret,IP:secret,userAgent:secret,filename:secret,evidence_url:secret,nested:{actor_id:secret,password:secret},error:new Error(secret)};
  await log.info('USER_CREATED',context);await log.warn('REVIEW_INVALID',context);await log.error('CREATE_USER_ERROR',context);await log.error(new Error(secret),context);await log.error(secret,context);await log.flush();
  const text=await fs.readFile(path.join(directory,'ecoamigos-tech.jsonl'),'utf8');assert.ok(!text.includes(secret));const rows=text.trim().split('\n').map(JSON.parse);assert.deepEqual(rows.slice(0,3).map(x=>x.level),['info','warn','error']);assert.equal(rows[0].actor_id,7);assert.equal(rows[0].record_id,8);assert.equal(rows[3].event,'APPLICATION_EVENT');assert.equal(rows[4].event,'APPLICATION_EVENT');
  assert.deepEqual(sanitizeContext({actor_id:secret,status:secret,nested:context}),{});
  assert.deepEqual(sanitizeContext(Object.defineProperty({},'actor_id',{get(){throw Error(secret);}})),{});
});
test('S10 rotación/retención por tamaño, cola serial y archivos ajenos intactos',async()=>{
  const directory=await temporary();const log=createLogger({directory,maxBytes:250,files:2,queueLimit:100});
  for(const name of ['info.log','error.log','unrelated.txt','ecoamigos-tech.99.jsonl'])await fs.writeFile(path.join(directory,name),'keep');
  const results=await Promise.all(Array.from({length:30},(_,i)=>log.info('USER_CREATED',{entity_id:i+1})));assert.ok(results.every(Boolean));await log.flush();
  for(const name of ['ecoamigos-tech.jsonl','ecoamigos-tech.1.jsonl','ecoamigos-tech.2.jsonl']){const text=await fs.readFile(path.join(directory,name),'utf8');assert.ok(Buffer.byteLength(text)<=250);text.trim().split('\n').forEach(line=>assert.equal(JSON.parse(line).event,'USER_CREATED'));}
  for(const name of ['info.log','error.log','unrelated.txt','ecoamigos-tech.99.jsonl'])assert.equal(await fs.readFile(path.join(directory,name),'utf8'),'keep');
  assert.equal((await fs.readdir(directory)).length,7);
});
test('S10 logger fallido no tumba HTTP; diagnóstico sin ruta ni error sensible',async()=>{
  const directory=await temporary();const blocked=path.join(directory,'not-a-directory');await fs.writeFile(blocked,'keep');const log=createLogger({directory:blocked,maxBytes:4096,files:2,queueLimit:5});
  const original=console.error;const output=[];console.error=value=>output.push(value);
  try {const app=express();app.get('/',(_req,res)=>{log.error('EXPORT_ERROR',new Error('secret path'));res.status(201).json({saved:true});});await serve(app,async base=>{assert.equal((await fetch(base)).status,201);});await log.flush();await log.error('EXPORT_ERROR');assert.deepEqual(output,['TECH_LOG_UNAVAILABLE']);}
  finally {console.error=original;}
});
test('S10 cola acotada rechaza exceso sin bloquear operación',async()=>{
  const directory=await temporary();let resume;const wait=new Promise(resolve=>resume=resolve);const io={...fs,appendFile:async(...args)=>{await wait;return fs.appendFile(...args);}};
  const log=createLogger({directory,maxBytes:4096,files:1,queueLimit:1},io);const original=console.error;console.error=()=>{};
  try{const first=log.info('SERVER_STARTED');assert.equal(await log.warn('APPLICATION_EVENT'),false);resume();assert.equal(await first,true);await log.flush();}finally{resume();console.error=original;}
});
test('S10 configuración de logs, sin escritura síncrona ni efectos al importar',async()=>{
  const options=loggerOptions({});assert.equal(options.maxBytes,5242880);assert.equal(options.files,5);assert.equal(options.queueLimit,1000);
  for(const env of [{LOG_DIR:''},{LOG_MAX_BYTES:'0'},{LOG_MAX_FILES:'100'},{LOG_QUEUE_LIMIT:'-1'}])assert.throws(()=>loggerOptions(env));
  const source=await fs.readFile(new URL('../src/utils/logger.js',import.meta.url),'utf8');assert.doesNotMatch(source,/appendFileSync|writeFileSync|mkdirSync/);
});
test('S10 controladores con SQL fallido no filtran secretos por HTTP ni por logs',async()=>{
  const directory=await temporary();const previous=process.env.LOG_DIR;process.env.LOG_DIR=directory;globalThis.__configFailQuery=async()=>{throw Error('NEVER_DISCLOSE SQL password JWT internal/path');};
  async function load(name){let source=await fs.readFile(new URL('../src/controllers/'+name+'.js',import.meta.url),'utf8');source=source.replace(/import \{ query(?:, pool)? \} from '..\/config\/db.js';/,'const query=globalThis.__configFailQuery;const pool={connect:query};');source=source.replace(/'..\/(utils|services)\/([^']+)'/g,(_,folder,file)=>JSON.stringify(new URL('../src/'+folder+'/'+file,import.meta.url).href));source=source.replace(/from '(bcrypt|exceljs)'/g,(_,pkg)=>'from '+JSON.stringify(pathToFileURL(require.resolve(pkg)).href));return import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));}
  try{
    const admin=await load('adminController'),publicApi=await load('publicController'),recycling=await load('recyclingController'),report=await load('exportController');
    const handlers=[admin.getDashboard,admin.listUsers,admin.listTeams,admin.listPeriods,admin.listContent,admin.createTeam,recycling.listMyRecords,recycling.listPendingRecords,recycling.listReviewedRecords,publicApi.getRanking,report.exportRecyclingReport];
    const app=express();handlers.forEach((handler,index)=>app.get('/'+index,(req,res)=>{req.user={id:1};req.body={name:'NEVER_DISCLOSE'};handler(req,res);}));app.use(controlledError);
    await serve(app,async base=>{for(let i=0;i<handlers.length;i++){const result=await fetch(base+'/'+i);assert.equal(result.status,500);const body=await result.json();assert.deepEqual(Object.keys(body),['message']);assert.ok(!JSON.stringify(body).includes('NEVER_DISCLOSE'));}});
    await flushLogs();const text=await fs.readFile(path.join(directory,'ecoamigos-tech.jsonl'),'utf8');assert.ok(!text.includes('NEVER_DISCLOSE'));
  }finally{if(previous===undefined)delete process.env.LOG_DIR;else process.env.LOG_DIR=previous;delete globalThis.__configFailQuery;}
});


test('S10 appendFile y rotación fallidos no rechazan promesas ni tocan archivos ajenos',async()=>{
  const directory=await temporary();const original=console.error;const output=[];console.error=value=>output.push(value);
  try {
    const broken=createLogger({directory,maxBytes:200,files:1,queueLimit:10},{...fs,appendFile:async()=>{throw Object.assign(Error('secret internal/path'),{code:'EACCES'});}});
    assert.equal(await broken.error('EXPORT_ERROR'),false);await broken.flush();assert.deepEqual(output,['TECH_LOG_UNAVAILABLE']);
    const good=createLogger({directory,maxBytes:200,files:1,queueLimit:10});await good.info('SERVER_STARTED');await good.info('SERVER_STARTED');
    await fs.writeFile(path.join(directory,'unrelated.txt'),'keep');
    const failRotation=createLogger({directory,maxBytes:200,files:1,queueLimit:10},{...fs,rename:async()=>{throw Error('secret rename');}});
    assert.equal(await failRotation.info('SERVER_STARTED'),false);assert.equal(await fs.readFile(path.join(directory,'unrelated.txt'),'utf8'),'keep');
    assert.ok(!output.join('').includes('secret'));
  }finally{console.error=original;}
});
