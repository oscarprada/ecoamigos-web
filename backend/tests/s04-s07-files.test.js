import { postgresHarness } from './helpers/postgresCluster.js';
import { authModuleUrl } from './helpers/authModule.js';
// S04-S07 only. Starts a NEW disposable PostgreSQL cluster, never reads .env.
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
test('S04-S07: revision transaccional PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-files-test-'));
  const dataDir = path.join(temporary, 'data');
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 's04-s07-files.test.js' });
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



    const previousRoot=process.env.UPLOAD_ROOT;
    process.env.UPLOAD_ROOT=path.join(temporary,'uploads');
    process.env.UPLOAD_IMAGE_MB='1';process.env.UPLOAD_EVIDENCE_MB='1';
    const {png,jpg,webp,mp4,mov,avi,pdf,docx}=await import('./fixtures/files.js');
    const {cleanupUnused,removeStored,storedPath}=await import('../src/services/fileStore.js');
    const {createContentHandlers}=await import('../src/services/contentFiles.js');
    const {receiveUpload}=await import('../src/middleware/uploadMiddleware.js');
    globalThis.__filesPool=testPool;
    async function controller(file){
      let source=fs.readFileSync(path.join(root,'backend/src/controllers',file),'utf8');
      source=source.replace(/import \{ query(?:, pool)? \} from '..\/config\/db.js';/,'const pool=globalThis.__filesPool;const query=(...args)=>pool.query(...args);');
      source=source.replace("import { logInfo, logError } from '../utils/logger.js';",'const logInfo=()=>{};const logError=()=>{};');
      source=source.replace(/'..\/(services|utils)\/([^']+)'/g,(_match,folder,name)=>JSON.stringify(new URL('../src/'+folder+'/'+name,import.meta.url).href));
      const url='data:text/javascript;base64,'+Buffer.from(source).toString('base64');return import(url);
    }
    const files=await controller('fileController.js'),recycling=await controller('recyclingController.js');
    const {authenticateToken,authorizeRoles}=await import(await authModuleUrl(testPool));
    const handlers=createContentHandlers(testPool,(...args)=>testPool.query(...args));
    const app=express();app.use(express.json());
    app.get('/api/files/public/content/:id',files.published);
    app.get('/api/files/evidence/:id',authenticateToken,files.evidence);
    app.get('/api/files/content/:id',authenticateToken,authorizeRoles('admin'),files.content);
    app.post('/content',authenticateToken,authorizeRoles('admin'),receiveUpload('content'),handlers.createContent);
    app.put('/content/:id',authenticateToken,authorizeRoles('admin'),receiveUpload('content'),handlers.updateContent);
    app.delete('/content/:id',authenticateToken,authorizeRoles('admin'),handlers.deleteContent);
    app.post('/evidence',authenticateToken,authorizeRoles('leader'),receiveUpload('evidence'),recycling.createRecord);
    server=await new Promise(resolve=>{const running=app.listen(0,'127.0.0.1',()=>resolve(running));});
    const base='http://127.0.0.1:'+server.address().port;
    process.env.JWT_SECRET='files-isolated-fixture-secret';
    const token=id=>jwt.sign({id,sv:0},process.env.JWT_SECRET,{expiresIn:'5m'});
    await client.query("INSERT INTO teams(name,dependency) VALUES ('One','Fixture'),('Two','Fixture')");
    await client.query("INSERT INTO users(name,email,password_hash,role,team_id) VALUES ('Admin','admin@test.invalid','fixture','admin',NULL),('Owner','owner@test.invalid','fixture','leader',1),('Other','other@test.invalid','fixture','leader',2)");
    await client.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Active',CURRENT_DATE-1,CURRENT_DATE+1,true)");
    const reference={catalog_group_name:'Dependencias institucionales',catalog_action_name:'Entrega acopio',catalog_action_level:'Nivel 1: Volumen bajo (1 a 5 kg)'};
    await client.query('INSERT INTO points_catalog(group_name,action_name,action_level,points) VALUES ($1,$2,$3,123)',Object.values(reference));
    const form={title:'Fixture',category:'agua',type:'image',description:'Safe',status:'published'};
    const upload=async({resource='/content',method='POST',user=1,bytes=png,name='one.png',mime='image/png',extra={},multiple=false,field}={})=>{
      const data=new FormData();for(const [key,value]of Object.entries(resource==='/evidence'?{material_type:'papel_carton',quantity:'1',unit:'kg',quality_level:'media',criteria_count:'1',period_id:'1',...reference,...extra}:{...form,...extra}))data.append(key,value);
      if(bytes!==null)data.append(field || (resource==='/evidence'?'evidence':'file'),new Blob([bytes],{type:mime}),name);
      if(multiple)data.append(field || 'file',new Blob([bytes],{type:mime}),name);
      const res=await fetch(base+resource,{method,headers:{Authorization:'Bearer '+token(user)},body:data});return {code:res.status,body:await res.json()};
    };
    const get=async(resource,user)=>{const r=await fetch(base+resource,{headers:user?{Authorization:'Bearer '+token(user)}:{}});return {code:r.status,headers:r.headers,bytes:Buffer.from(await r.arrayBuffer())};};
    const exists=url=>fs.existsSync(storedPath(url));
    const disk=()=>fs.existsSync(process.env.UPLOAD_ROOT)?fs.readdirSync(process.env.UPLOAD_ROOT,{recursive:true}).filter(name=>/\.(png|jpg|webp|mp4|mov|avi|pdf|docx)$/.test(name)).sort():[];
    const settled=async()=>{await new Promise(resolve=>setTimeout(resolve,100));};
    let published,draft,evidence;
    await t.test('S04/S07 formatos, MIME reales y nombres UUID sin sobrescritura',async()=>{
      for(const [name,mime,bytes,type]of [['one.png','image/png',png,'image'],['one.jpg','image/jpeg',jpg,'image'],['one.webp','image/webp',webp,'image'],['one.mp4','video/mp4',mp4,'video'],['one.mov','video/quicktime',mov,'video'],['one.avi','video/x-msvideo',avi,'video'],['one.pdf','application/pdf',pdf,'file'],['one.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',await docx(),'file']]){
        const result=await upload({name,mime,bytes,extra:{type}});assert.equal(result.code,201,name+': '+JSON.stringify(result.body));assert.match(result.body.file_url,/\/managed\/content\/[0-9a-f-]{36}\./);assert.ok(exists(result.body.file_url));
      }
      published=(await upload({name:'../../evil.exe.png'})).body;
      const next=(await upload({name:'../../evil.exe.png'})).body;assert.notEqual(next.file_url,published.file_url);assert.ok(!next.file_url.includes('evil'));assert.ok(exists(published.file_url));
      draft=(await upload({extra:{status:'draft'}})).body;
    });
    await t.test('S04/S07 rechazos seguros y sin residuos: tamaño, cantidad, campo, spoofing, vacío/truncado',async()=>{
      const before=disk();
      for(const options of [{bytes:Buffer.alloc(1024*1024+1),extra:{type:'image'}},{multiple:true},{field:'other'},{name:'evil.exe'},{name:'evil.constructor'},{name:'evil.__proto__'},{bytes:Buffer.from('MZ executable')},{bytes:Buffer.from('plain text')},{name:'text.jpg',mime:'image/jpeg',bytes:Buffer.from('plain text')},{name:'text.pdf',mime:'application/pdf',bytes:Buffer.from('plain text'),extra:{type:'file'}},{name:'double.png.exe'},{name:'spoof.exe.png',bytes:Buffer.from('MZ arbitrary bytes')},{mime:'application/pdf'},{name:'false.jpg'},{bytes:Buffer.alloc(0)},{bytes:png.subarray(0,30)},{bytes:jpg.subarray(0,jpg.length-2)},{extra:{type:'video'}}]){
        const result=await upload(options);assert.ok([400,413,415].includes(result.code),JSON.stringify(result));assert.deepEqual(Object.keys(result.body),['message']);assert.doesNotMatch(JSON.stringify(result.body),/SELECT|stack|[A-Z]:\\/);
      }
      const over=await upload({resource:'/evidence',user:2,bytes:Buffer.alloc(1024*1024+1)});assert.equal(over.code,413);
      await settled();assert.deepEqual(disk(),before);
    });
    await t.test('S05 público publicado, borrador privado, rutas antiguas y traversal',async()=>{
      const publicFile=await get('/api/files/public/content/'+published.id);assert.equal(publicFile.code,200);assert.deepEqual(publicFile.bytes,png);assert.equal(publicFile.headers.get('x-content-type-options'),'nosniff');assert.equal(publicFile.headers.get('cache-control'),'no-store');
      assert.equal((await get('/api/files/public/content/'+draft.id)).code,404);assert.equal((await get('/api/files/content/'+draft.id)).code,401);assert.equal((await get('/api/files/content/'+draft.id,2)).code,403);assert.equal((await get('/api/files/content/'+draft.id,1)).code,200);
      assert.equal((await get(published.file_url)).code,404);
      for(const id of ['999999','..%2F..%2Fsecret','C:%5Csecret']) assert.equal((await get('/api/files/content/'+id,1)).code,404);
      await client.query("UPDATE content_items SET file_url='/uploads/../../private' WHERE id=$1",[draft.id]);assert.equal((await get('/api/files/content/'+draft.id,1)).code,404);await client.query('UPDATE content_items SET file_url=$1 WHERE id=$2',[draft.file_url,draft.id]);
      const missing=await upload();await fs.promises.unlink(storedPath(missing.body.file_url));assert.equal((await get('/api/files/public/content/'+missing.body.id)).code,404);
    });
    await t.test('S05 evidencia: admin/propietario, ajeno/inactivo y sin sesión',async()=>{
      const result=await upload({resource:'/evidence',user:2});assert.equal(result.code,201,JSON.stringify(result.body));evidence=result.body;
      const url='/api/files/evidence/'+evidence.id;
      assert.equal((await get('/api/files/evidence/999999',1)).code,404);
      assert.equal((await get(url)).code,401);assert.equal((await get(url,1)).code,200);assert.equal((await get(url,2)).code,200);assert.equal((await get(url,3)).code,403);
      await client.query('UPDATE users SET is_active=false WHERE id=2');assert.equal((await get(url,2)).code,401);await client.query('UPDATE users SET is_active=true WHERE id=2');
      await client.query('UPDATE users SET team_id=2 WHERE id=2');assert.equal((await get(url,2)).code,200,'propiedad histórica sigue por user_id');
      assert.equal((await get(evidence.evidence_url)).code,404);
    });
    await t.test('S06 INSERT y validación F10 fallidos eliminan archivo nuevo',async()=>{
      const before=disk();assert.equal((await upload({extra:{category:'invalid'}})).code,500);
      assert.equal((await upload({resource:'/evidence',user:2,extra:{period_id:'999'}})).code,409);
      await settled();assert.deepEqual(disk(),before);
    });
    await t.test('S06 UPDATE falla conserva anterior; éxito retira anterior tras COMMIT',async()=>{
      const before=disk();const result=await upload({resource:'/content/'+published.id,method:'PUT',extra:{category:'invalid'}});assert.equal(result.code,500);await settled();assert.deepEqual(disk(),before);assert.ok(exists(published.file_url));
      const changed=await upload({resource:'/content/'+published.id,method:'PUT'});assert.equal(changed.code,200);assert.ok(exists(changed.body.file_url));assert.equal(exists(published.file_url),false);published=changed.body;
    });
    await t.test('S06 rollback diferido de contenido conserva BD/archivo anterior',async()=>{
      await client.query("CREATE FUNCTION fail_file_commit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'private sql'; END $$");
      await client.query('CREATE CONSTRAINT TRIGGER fail_file_commit AFTER UPDATE ON content_items DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION fail_file_commit()');
      const before=disk();assert.equal((await upload({resource:'/content/'+published.id,method:'PUT'})).code,500);await settled();assert.deepEqual(disk(),before);assert.ok(exists(published.file_url));await client.query('DROP TRIGGER fail_file_commit ON content_items');
    });
    await t.test('S06 DELETE no borra referencias compartidas; último elimina; ENOENT seguro',async()=>{
      await client.query('UPDATE content_items SET file_url=$1 WHERE id=$2',[published.file_url,draft.id]);
      const remove=async id=>fetch(base+'/content/'+id,{method:'DELETE',headers:{Authorization:'Bearer '+token(1)}});
      assert.equal((await remove(published.id)).status,200);assert.ok(exists(published.file_url));assert.equal((await remove(draft.id)).status,200);assert.equal(exists(published.file_url),false);assert.equal(await removeStored(published.file_url),true);
      assert.ok(exists(evidence.evidence_url));
    });
    await t.test('S06 fallo de cleanup conserva éxito y log sin ruta; referencia intacta',async()=>{
      const row=(await upload()).body;const original=console.error,logs=[];console.error=(...args)=>logs.push(args);
      try {
        await cleanupUnused(row.file_url,async()=>{throw Error('PRIVATE SQL path');});assert.ok(exists(row.file_url));
        await client.query('UPDATE content_items SET file_url=$1 WHERE id=$2',['/uploads/../../secret',row.id]);
        const res=await fetch(base+'/content/'+row.id,{method:'DELETE',headers:{Authorization:'Bearer '+token(1)}});assert.equal(res.status,200);
        assert.ok(logs.length>=2);assert.ok(logs.every(entry=>entry.join(' ')==='FILE_CLEANUP_PENDING'));
      } finally {console.error=original;}
    });
    await t.test('S04 fallo de almacenamiento devuelve 500 sin detalles',async()=>{
      const activeRoot=process.env.UPLOAD_ROOT;const blocked=path.join(temporary,'not-a-directory');fs.writeFileSync(blocked,'fixture');process.env.UPLOAD_ROOT=blocked;
      try {const result=await upload();assert.equal(result.code,500);assert.deepEqual(result.body,{message:'No fue posible almacenar el archivo'});}
      finally {process.env.UPLOAD_ROOT=activeRoot;}
    });
    await t.test('S06 unlink falla después de COMMIT: éxito, retención y reintento seguro',async()=>{
      const row=(await upload()).body;const original=fs.promises.unlink,log=console.error,logs=[];
      fs.promises.unlink=async()=>{throw Object.assign(Error('PRIVATE path'),{code:'EACCES'});};console.error=value=>logs.push(value);
      try {const response=await fetch(base+'/content/'+row.id,{method:'DELETE',headers:{Authorization:'Bearer '+token(1)}});assert.equal(response.status,200);assert.ok(exists(row.file_url));assert.deepEqual(logs,['FILE_CLEANUP_PENDING']);}
      finally {fs.promises.unlink=original;console.error=log;}
      await cleanupUnused(row.file_url,(...args)=>testPool.query(...args));assert.equal(exists(row.file_url),false);
    });
    await t.test('S06 reemplazos concurrentes dejan solo archivo de la fila final',async()=>{
      const row=(await upload()).body;
      const changed=await Promise.all([upload({resource:'/content/'+row.id,method:'PUT'}),upload({resource:'/content/'+row.id,method:'PUT'})]);assert.ok(changed.every(result=>result.code===200));
      const current=(await client.query('SELECT file_url FROM content_items WHERE id=$1',[row.id])).rows[0].file_url;
      assert.ok(exists(current));assert.equal(exists(row.file_url),false);assert.equal(changed.filter(result=>exists(result.body.file_url)).length,1);
    });
    await t.test('S05 compatibilidad con archivo legado sin moverlo',async()=>{
      const url='/uploads/content/old-name.pdf';await fs.promises.mkdir(path.dirname(storedPath(url)),{recursive:true});await fs.promises.writeFile(storedPath(url),pdf);
      const row=(await client.query("INSERT INTO content_items(title,category,type,status,file_url,created_by) VALUES ('Legacy','agua','file','published',$1,1) RETURNING id",[url])).rows[0];
      const response=await get('/api/files/public/content/'+row.id);assert.equal(response.code,200);assert.match(response.headers.get('content-disposition'),/^attachment/);assert.ok(exists(url));assert.equal((await get(url)).code,404);
      assert.equal(fs.readFileSync(path.join(root,'backend/src/server.js'),'utf8').includes("express.static('uploads')"),false);
    });
    await t.test('S05 evidencia legacy conserva ruta, bytes y autorización sin moverla',async()=>{
      const url='/uploads/1690000000000-123456789.jpg';await fs.promises.writeFile(storedPath(url),jpg);
      const row=(await client.query("INSERT INTO recycling_records(user_id,team_id,material_type,quantity,unit,quality_level,status,evidence_url,period_id,record_date) VALUES (2,1,'papel_carton',1,'kg','media','pending',$1,1,CURRENT_DATE) RETURNING id",[url])).rows[0];
      const endpoint='/api/files/evidence/'+row.id;
      assert.equal((await get(endpoint)).code,401);assert.deepEqual((await get(endpoint,2)).bytes,jpg);assert.equal((await get(endpoint,1)).code,200);assert.equal((await get(endpoint,3)).code,403);assert.equal((await get(url)).code,404);
      assert.deepEqual(fs.readFileSync(storedPath(url)),jpg);
      await client.query("UPDATE recycling_records SET evidence_url='/uploads/1690000000001-123456789.jpg' WHERE id=$1",[row.id]);assert.equal((await get(endpoint,2)).code,404);assert.ok(exists(url));
    });
    await t.test('S05/S07 DOC legacy descargable en borrador/publicado; nuevas cargas DOC rechazadas',async()=>{
      const url='/uploads/content/1690000000000-Guía anterior.doc';
      // Legacy reads preserve opaque historical bytes; no Word parser certification.
      const bytes=Buffer.concat([Buffer.from([0xd0,0xcf,0x11,0xe0,0xa1,0xb1,0x1a,0xe1]),Buffer.alloc(512)]);
      await fs.promises.writeFile(storedPath(url),bytes);
      const row=(await client.query("INSERT INTO content_items(title,category,type,status,file_url,created_by) VALUES ('Legacy DOC','agua','file','draft',$1,1) RETURNING id",[url])).rows[0];
      const endpoint='/api/files/content/'+row.id;
      assert.equal((await get('/api/files/public/content/'+row.id)).code,404);assert.equal((await get(endpoint)).code,401);assert.equal((await get(endpoint,2)).code,403);
      const response=await get(endpoint,1);assert.equal(response.code,200);assert.deepEqual(response.bytes,bytes);assert.match(response.headers.get('content-type'),/^application\/msword/);assert.match(response.headers.get('content-disposition'),/^attachment/);
      await client.query("UPDATE content_items SET status='published' WHERE id=$1",[row.id]);assert.deepEqual((await get('/api/files/public/content/'+row.id)).bytes,bytes);
      assert.equal((await upload({name:'new.doc',mime:'application/msword',bytes,extra:{type:'file'}})).code,415);assert.deepEqual(fs.readFileSync(storedPath(url)),bytes);assert.equal((await get(url)).code,404);
    });
    await t.test('S06 UPDATE confirmado con unlink fallido retiene residuo, nunca borra referencia nueva',async()=>{
      const old=(await upload()).body;const unlink=fs.promises.unlink,log=console.error,logs=[];let calls=0,changed;
      fs.promises.unlink=async()=>{calls++;throw Object.assign(Error('private path'),{code:'EACCES'});};console.error=value=>logs.push(value);
      try {
        await cleanupUnused(old.file_url,(...args)=>testPool.query(...args));assert.equal(calls,0,'referenciado no alcanza unlink');
        changed=await upload({resource:'/content/'+old.id,method:'PUT'});assert.equal(changed.code,200);assert.ok(exists(changed.body.file_url));assert.ok(exists(old.file_url));
        assert.equal((await client.query('SELECT file_url FROM content_items WHERE id=$1',[old.id])).rows[0].file_url,changed.body.file_url);assert.deepEqual(logs,['FILE_CLEANUP_PENDING']);
      }finally{fs.promises.unlink=unlink;console.error=log;}
      await cleanupUnused(old.file_url,(...args)=>testPool.query(...args));assert.equal(exists(old.file_url),false);assert.ok(exists(changed.body.file_url));
    });
    await t.test('S04/S05 directorios enlazados se rechazan antes de escritura, lectura o borrado',async()=>{
      const activeRoot=process.env.UPLOAD_ROOT, aliasRoot=path.join(temporary,'alias-root'),outside=path.join(temporary,'outside');
      fs.mkdirSync(aliasRoot);fs.mkdirSync(outside);fs.writeFileSync(path.join(outside,'keep.png'),png);
      fs.symlinkSync(outside,path.join(aliasRoot,'managed'),'junction');process.env.UPLOAD_ROOT=aliasRoot;
      const log=console.error;console.error=()=>{};
      try {
        const result=await upload();assert.equal(result.code,500);assert.equal(fs.existsSync(path.join(outside,'content')),false);
        fs.symlinkSync(outside,path.join(aliasRoot,'content'),'junction');
        const row=(await client.query("INSERT INTO content_items(title,category,type,status,file_url,created_by) VALUES ('Linked','agua','image','published','/uploads/content/keep.png',1) RETURNING id")).rows[0];
        assert.equal((await get('/api/files/public/content/'+row.id)).code,404);assert.equal(await removeStored('/uploads/content/keep.png'),false);assert.deepEqual(fs.readFileSync(path.join(outside,'keep.png')),png);
      }finally{process.env.UPLOAD_ROOT=activeRoot;console.error=log;}
    });
    assert.equal(catalogBefore.length,56);assert.deepEqual((await client.query('SELECT * FROM points_catalog WHERE id=ANY($1) ORDER BY id',[catalogBefore.map(r=>r.id)])).rows,catalogBefore);
    delete globalThis.__filesPool;
    if(previousRoot===undefined)delete process.env.UPLOAD_ROOT;else process.env.UPLOAD_ROOT=previousRoot;
  } finally {
    if(server) await new Promise((resolve,reject)=>server.close(error=>error?reject(error):resolve()));
    if(oldSecret===undefined) delete process.env.JWT_SECRET;else process.env.JWT_SECRET=oldSecret;
    if(testPool) await testPool.end();if(client) await client.end();
    if(started) ok(run('pg_ctl',['-D',dataDir,'-m','fast','-w','stop']));
  }
});
