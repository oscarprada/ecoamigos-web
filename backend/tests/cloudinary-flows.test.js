import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import express from 'express';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import { postgresHarness } from './helpers/postgresCluster.js';
import { authModuleUrl } from './helpers/authModule.js';
import { cloudinaryFake, cloudTestEnv } from './helpers/cloudinaryFake.js';
import { createStorage } from '../src/services/fileStore.js';
import { receiveUpload } from '../src/middleware/uploadMiddleware.js';
import { createContentHandlers } from '../src/services/contentFiles.js';
import { createGardenHandlers } from '../src/controllers/gardenHandlers.js';
import { png, jpg, webp, mp4, mov, avi, pdf, docx } from './fixtures/files.js';

const root = fileURLToPath(new URL('../../', import.meta.url)), bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('Cloudinary simulado: flujos HTTP, BD temporal, validaciones, permisos y compensaciones', { skip: !bin && 'Requiere PostgreSQL aislado' }, async t => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-cloud-flows-'));
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 'cloudinary-flows.test.js' });
  const port = await start();
  const pool = new pg.Pool({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres', max: 5 });
  const previousRoot = process.env.UPLOAD_ROOT, previousSecret = process.env.JWT_SECRET;
  let server;
  t.after(async () => {
    if (server) await new Promise(resolve => server.close(resolve));
    await pool.end(); ok(run('pg_ctl', ['-D', path.join(temporary, 'data'), '-m', 'fast', '-w', 'stop']));
    if (previousRoot === undefined) delete process.env.UPLOAD_ROOT; else process.env.UPLOAD_ROOT = previousRoot;
    if (previousSecret === undefined) delete process.env.JWT_SECRET; else process.env.JWT_SECRET = previousSecret;
    delete globalThis.__cloudFlowPool; delete globalThis.__cloudFlowStore;
  });
  ok(run('psql', ['-X','-h','127.0.0.1','-p',String(port),'-U','postgres','-d','postgres','-v','ON_ERROR_STOP=1','-f','database/schema.sql']));
  process.env.UPLOAD_ROOT = path.join(temporary, 'legacy-uploads');
  process.env.JWT_SECRET = randomBytes(32).toString('hex');
  await pool.query(`INSERT INTO teams(name,dependency) VALUES('Fixture one','Fixture'),('Fixture two','Fixture');
    INSERT INTO users(name,email,password_hash,role,team_id) VALUES('Fixture admin','admin@test.invalid','fixture','admin',NULL),('Fixture owner','owner@test.invalid','fixture','leader',1),('Fixture other','other@test.invalid','fixture','leader',2);
    INSERT INTO periods(name,start_date,end_date,is_active) VALUES('Fixture period',CURRENT_DATE-1,CURRENT_DATE+1,true);
    INSERT INTO points_catalog(group_name,action_name,action_level,points) VALUES('Dependencias institucionales','Entrega acopio','Nivel 1: Volumen bajo (1 a 5 kg)',123)`);
  const today = (await pool.query('SELECT CURRENT_DATE::text AS today')).rows[0].today;
  const fake = cloudinaryFake(), storage = createStorage({ env: cloudTestEnv, transport: fake.transport });
  globalThis.__cloudFlowPool = pool; globalThis.__cloudFlowStore = storage;
  const load = async file => {
    let source = fs.readFileSync(path.join(root, 'backend/src/controllers', file), 'utf8');
    source = source.replace(/import \{ query(?:, pool)? \} from '..\/config\/db.js';/, 'const pool=globalThis.__cloudFlowPool; const query=(...args)=>pool.query(...args);');
    source = source.replace("import { logInfo, logError } from '../utils/logger.js';", 'const logInfo=()=>{};const logError=()=>{};');
    source = source.replace("import { cleanupUncommitted } from '../services/fileStore.js';", "import { cleanupUncommitted as cleanup } from '../services/fileStore.js'; const store=globalThis.__cloudFlowStore;const cleanupUncommitted=(url,query,options)=>cleanup(url,query,{...options,storage:store});");
    source = source.replace(/'..\/(services|utils)\/([^']+)'/g, (_, folder, name) => JSON.stringify(new URL('../src/' + folder + '/' + name, import.meta.url).href));
    return import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
  };
  const files = (await load('fileController.js')).createFileHandlers((...args) => pool.query(...args), storage);
  const recycling = await load('recyclingController.js');
  const garden = createGardenHandlers({ pool, removeStored: url => storage.remove(url) });
  const content = createContentHandlers(pool, (...args) => pool.query(...args), storage);
  const { authenticateToken, authorizeRoles } = await import(await authModuleUrl(pool));
  const app = express(); app.use(express.json());
  app.post('/api/recycling', authenticateToken, authorizeRoles('leader'), receiveUpload('evidence', { storage }), recycling.createRecord);
  app.post('/api/garden', authenticateToken, authorizeRoles('leader'), garden.createCrop);
  app.get('/api/garden', authenticateToken, authorizeRoles('leader','admin'), garden.list);
  app.post('/api/garden/:id/evidence', authenticateToken, authorizeRoles('leader'), receiveUpload('evidence', { storage, functionality: 'garden' }), garden.addEvidence);
  app.post('/api/admin/content', authenticateToken, authorizeRoles('admin'), receiveUpload('content', { storage }), content.createContent);
  app.put('/api/admin/content/:id', authenticateToken, authorizeRoles('admin'), receiveUpload('content', { storage }), content.updateContent);
  app.delete('/api/admin/content/:id', authenticateToken, authorizeRoles('admin'), content.deleteContent);
  const unavailable = createContentHandlers({ connect: async () => { throw Error('Fixture DB unavailable'); } }, async () => { throw Error('Fixture DB unavailable'); }, storage);
  app.post('/api/fixture-unavailable', authenticateToken, authorizeRoles('admin'), receiveUpload('content', { storage }), unavailable.createContent);
  app.get('/api/files/evidence/:id', authenticateToken, files.evidence);
  app.get('/api/files/garden/:id', authenticateToken, authorizeRoles('leader','admin'), files.garden);
  app.get('/api/files/content/:id', authenticateToken, authorizeRoles('admin'), files.content);
  app.get('/api/files/public/content/:id', files.published);
  server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  const base = 'http://127.0.0.1:' + server.address().port;
  const headers = user => user ? { Cookie: 'ecoamigos_session=' + jwt.sign({ id: user, sv: 0 }, process.env.JWT_SECRET, { expiresIn: '5m' }) } : {};
  const json = async (url, user, body, method = 'POST') => {
    const response = await fetch(base + url, { method, headers: { ...headers(user), 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    return { code: response.status, body: await response.json() };
  };
  const upload = async (url, user, extra = {}, bytes = png, name = 'fixture.png', mime = 'image/png', method = 'POST') => {
    const body = new FormData(); for (const [key, value] of Object.entries(extra)) body.set(key, value);
    if (bytes !== null) body.set(url.includes('recycling') || /\/garden\//.test(url) ? 'evidence' : 'file', new Blob([bytes], { type: mime }), name);
    const response = await fetch(base + url, { method, headers: headers(user), body });
    return { code: response.status, body: await response.json() };
  };
  const get = (url, user, extra = {}) => fetch(base + url, { headers: { ...headers(user), ...extra } });
  const contentBody = { title: 'Fixture', category: 'agua', type: 'image', status: 'published' };
  const recyclingBody = { material_type: 'papel_carton', quantity: '1', unit: 'kg', quality_level: 'media', criteria_count: '1', record_date: today, period_id: '1', catalog_group_name: 'Dependencias institucionales', catalog_action_name: 'Entrega acopio', catalog_action_level: 'Nivel 1: Volumen bajo (1 a 5 kg)' };
  const crop = await json('/api/garden', 2, { bed: 'Fixture bed', vegetables: ['tomate'], description: 'Fixture' }); assert.equal(crop.code, 201);
  const gardenPath = '/api/garden/' + crop.body.id + '/evidence';
  const gardenBody = { stage: 'seguimiento', record_date: today, story: 'Fixture progress', period_id: '1' };

  await t.test('Reciclaje y Huerta guardan HTTPS y conservan propietario, grupo y administrador', async () => {
    for (const [url, body, kind, folder] of [['/api/recycling',recyclingBody,'evidence','recycling'],[gardenPath,gardenBody,'garden','garden']]) {
      const result = await upload(url, 2, body); assert.equal(result.code, 201); assert.equal(result.body.points_awarded, 0);
      assert.match(result.body.evidence_url, new RegExp('/ecoamigos/' + folder + '/'));
      const endpoint = '/api/files/' + kind + '/' + result.body.id;
      for (const user of [1,2]) { const response = await get(endpoint, user); assert.equal(response.status, 200); assert.deepEqual(Buffer.from(await response.arrayBuffer()), png); }
      const reads = fake.calls.filter(call => call.action === 'read').length;
      assert.equal((await get(endpoint, 3)).status, 403); assert.equal((await get(endpoint)).status, 401);
      assert.equal(fake.calls.filter(call => call.action === 'read').length, reads);
      const saved = (await pool.query('SELECT evidence_url FROM ' + (kind === 'garden' ? 'garden_evidence' : 'recycling_records') + ' WHERE id=$1', [result.body.id])).rows[0];
      assert.equal(saved.evidence_url, result.body.evidence_url);
    }
  });
  await t.test('Contenidos: todos los formatos existentes, borradores privados y rangos de video', async () => {
    for (const [name,mime,bytes,type] of [['fixture.png','image/png',png,'image'],['fixture.jpg','image/jpeg',jpg,'image'],['fixture.webp','image/webp',webp,'image'],['fixture.mp4','video/mp4',mp4,'video'],['fixture.mov','video/quicktime',mov,'video'],['fixture.avi','video/x-msvideo',avi,'video'],['fixture.pdf','application/pdf',pdf,'file'],['fixture.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',await docx(),'file']]) {
      const result = await upload('/api/admin/content', 1, { ...contentBody, type, status: 'draft' }, bytes, name, mime);
      assert.equal(result.code, 201); assert.match(result.body.file_url, /\/education\//);
      assert.equal((await get('/api/files/public/content/' + result.body.id)).status, 404);
      assert.equal((await get('/api/files/content/' + result.body.id, 2)).status, 403);
      const response = await get('/api/files/content/' + result.body.id, 1); assert.equal(response.status, 200); assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes);
      if (type === 'video') { const range = await get('/api/files/content/' + result.body.id, 1, { Range: 'bytes=0-3' }); assert.equal(range.status, 206); assert.deepEqual(Buffer.from(await range.arrayBuffer()), bytes.subarray(0,4)); }
      if (type === 'file') assert.match(response.headers.get('content-disposition'), /^attachment/);
    }
  });
  await t.test('Validación y permisos rechazan antes de enviar bytes a Cloudinary', async () => {
    const uploads = fake.calls.filter(call => call.action === 'upload').length;
    assert.equal((await upload('/api/admin/content', 2, contentBody)).code, 403);
    assert.equal((await upload('/api/recycling', null, recyclingBody)).code, 401);
    assert.equal((await upload('/api/admin/content', 1, contentBody, Buffer.from('invalid PNG'))).code, 415);
    assert.equal((await upload('/api/admin/content', 1, { ...contentBody, type: 'video' })).code, 400);
    assert.equal((await upload('/api/admin/content', 1, contentBody, Buffer.alloc(10 * 1024 * 1024 + 1))).code, 413);
    assert.equal(fake.calls.filter(call => call.action === 'upload').length, uploads);
  });
  await t.test('Fallo INSERT en cada flujo compensa el UUID remoto y conserva datos anteriores', async () => {
    for (const [table,url,user,body] of [['recycling_records','/api/recycling',2,recyclingBody],['garden_evidence',gardenPath,2,gardenBody],['content_items','/api/admin/content',1,contentBody]]) {
      await pool.query(`CREATE FUNCTION cloud_fail() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Fixture rollback'; END $$; CREATE TRIGGER cloud_failure BEFORE INSERT ON ${table} FOR EACH ROW EXECUTE FUNCTION cloud_fail()`);
      const before = [...fake.assets.keys()].sort();
      try { const result = await upload(url, user, body); assert.equal(result.code, 500); assert.deepEqual([...fake.assets.keys()].sort(), before); }
      finally { await pool.query('DROP TRIGGER cloud_failure ON ' + table + '; DROP FUNCTION cloud_fail()'); }
    }
    const before = [...fake.assets.keys()].sort();
    assert.equal((await upload('/api/fixture-unavailable', 1, contentBody)).code, 500);
    assert.deepEqual([...fake.assets.keys()].sort(), before);
  });
  await t.test('Reemplazos, rechazo UPDATE y referencias de Huerta conservan archivos válidos', async () => {
    const first = await upload('/api/admin/content', 1, contentBody);
    const original = first.body.file_url;
    const failed = await upload('/api/admin/content/' + first.body.id, 1, { ...contentBody, category: 'invalid' }, png, 'fixture.png', 'image/png', 'PUT');
    assert.equal(failed.code, 500); assert.equal((await get('/api/files/public/content/' + first.body.id)).status, 200);
    const updated = await upload('/api/admin/content/' + first.body.id, 1, contentBody, jpg, 'fixture.jpg', 'image/jpeg', 'PUT');
    assert.equal(updated.code, 200); assert.notEqual(updated.body.file_url, original);
    await pool.query('UPDATE garden_evidence SET evidence_url=$1 WHERE crop_id=$2', [updated.body.file_url, crop.body.id]);
    const before = [...fake.assets.keys()].sort();
    const deleted = await fetch(base + '/api/admin/content/' + first.body.id, { method: 'DELETE', headers: headers(1) }); assert.equal(deleted.status, 200);
    assert.deepEqual([...fake.assets.keys()].sort(), before);
  });
  await t.test('Proveedor remoto sigue sirviendo una evidencia local histórica sin migrarla ni borrarla', async () => {
    const directory = path.join(process.env.UPLOAD_ROOT, 'content'); fs.mkdirSync(directory, { recursive: true });
    const file = path.join(directory, 'legacy.png'); fs.writeFileSync(file, png);
    const row = (await pool.query("INSERT INTO content_items(title,category,type,status,file_url,created_by) VALUES('Fixture legacy','agua','image','published','/uploads/content/legacy.png',1) RETURNING id")).rows[0];
    const before = fake.calls.length;
    const response = await get('/api/files/public/content/' + row.id); assert.equal(response.status, 200); assert.deepEqual(Buffer.from(await response.arrayBuffer()), png);
    assert.deepEqual(fs.readFileSync(file), png); assert.equal(fake.calls.length, before);
  });
});
