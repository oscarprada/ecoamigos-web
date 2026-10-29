import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { storageOptions, cloudinaryOptions } from '../src/config/storageOptions.js';
import { createStorage, cleanupUnused, cleanupUncommitted } from '../src/services/fileStore.js';
import { createCloudinaryStorage } from '../src/services/cloudinaryStorage.js';
import { cloudinaryFake, cloudTestEnv } from './helpers/cloudinaryFake.js';

test('Almacenamiento: local por defecto, producción exige Cloudinary y secretos backend completos', () => {
  assert.equal(storageOptions({}).provider, 'local');
  assert.equal(storageOptions({ NODE_ENV: 'production' }).provider, 'cloudinary');
  assert.throws(() => storageOptions({ STORAGE_PROVIDER: 'other' }));
  assert.throws(() => storageOptions({ NODE_ENV: 'production', STORAGE_PROVIDER: 'local' }));
  for (const name of ['CLOUDINARY_CLOUD_NAME','CLOUDINARY_API_KEY','CLOUDINARY_API_SECRET']) assert.throws(() => cloudinaryOptions({ ...cloudTestEnv, [name]: '' }));
  assert.throws(() => cloudinaryOptions({ ...cloudTestEnv, CLOUDINARY_FOLDER: '../uploads' }));
});

test('Cloudinary simulado: firmas, formatos, carpetas, HTTPS autenticado, lectura y borrado', async () => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'ecoamigos-cloud-unit-'));
  const fake = cloudinaryFake(), storage = createStorage({ env: cloudTestEnv, transport: fake.transport });
  for (const [ext, resource] of [['jpg','image'],['png','image'],['webp','image'],['mp4','video'],['mov','video'],['avi','video'],['pdf','raw'],['docx','raw']]) {
    const filename = 'fixture.' + ext, file = path.join(temporary, filename), bytes = Buffer.from('synthetic-' + ext);
    await fs.writeFile(file, bytes);
    for (const functionality of ['recycling','garden','education']) {
      const url = await storage.persist({ filename, path: file }, functionality);
      assert.match(url, new RegExp('^https://res\\.cloudinary\\.com/fixture-cloud/' + resource + '/authenticated/v1/ecoamigos/' + functionality + '/'));
      const opened = await storage.open(url); assert.equal(opened.ext, ext); assert.deepEqual(Buffer.from(await opened.response.arrayBuffer()), bytes);
      assert.equal(await storage.remove(url), true); assert.equal(fake.assets.size, 0);
    }
  }
});

test('Cloudinary: cargas grandes fraccionadas conservan todos los bytes', async () => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'ecoamigos-cloud-chunk-'));
  const filename = 'fixture.mp4', target = path.join(temporary, filename), bytes = Buffer.alloc(21 * 1024 * 1024, 1);
  await fs.writeFile(target, bytes);
  const fake = cloudinaryFake(), storage = createStorage({ env: cloudTestEnv, transport: fake.transport });
  const url = await storage.persist({ filename, path: target }, 'education');
  assert.equal(fake.calls.filter(call => call.action === 'upload').length, 2);
  assert.deepEqual(Buffer.from(await (await storage.open(url)).response.arrayBuffer()), bytes);
});

test('Cloudinary: fallos y respuesta no confiable compensan por ID generado; destroy reintenta', async () => {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'ecoamigos-cloud-failure-'));
  const target = path.join(temporary, 'fixture.png'); await fs.writeFile(target, 'fixture');
  const fake = cloudinaryFake(), storage = createStorage({ env: cloudTestEnv, transport: fake.transport });
  fake.invalidUrl(true); await assert.rejects(storage.persist({ filename: 'fixture.png', path: target }, 'garden')); assert.equal(fake.assets.size, 0);
  fake.invalidUrl(false); fake.failUpload(1); await assert.rejects(storage.persist({ filename: 'fixture.png', path: target }, 'garden')); assert.equal(fake.assets.size, 0);
  const url = await storage.persist({ filename: 'fixture.png', path: target }, 'garden');
  fake.failDestroy(2); assert.equal(await storage.remove(url), true); assert.equal(fake.assets.size, 0);
});

test('Cloudinary: referencias manipuladas no hacen red y prueba sin transporte no usa fetch real', async () => {
  let calls = 0;
  const storage = createStorage({ env: cloudTestEnv, transport: () => { calls++; throw Error(); } });
  for (const url of ['https://evil.example.invalid/fixture.png','https://res.cloudinary.com/other/image/authenticated/v1/id.png','https://res.cloudinary.com/fixture-cloud/image/upload/v1/id.png','https://res.cloudinary.com/fixture-cloud/image/authenticated/v1/../private.png']) await assert.rejects(storage.open(url));
  assert.equal(calls, 0);
  const fake = cloudinaryFake(), provider = createCloudinaryStorage({ env: cloudTestEnv });
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'ecoamigos-cloud-no-network-'));
  const target = path.join(temporary, 'fixture.png'); await fs.writeFile(target, 'fixture');
  const url = await createStorage({ env: cloudTestEnv, transport: fake.transport }).persist({ filename: 'fixture.png', path: target }, 'garden');
  await assert.rejects(provider.open(url), /transporte simulado/);
});

test('Limpieza: fallo DB conocido compensa sin consultar BD; COMMIT ambiguo protege referencias', async () => {
  const removed = [], url = 'https://fixture.example.invalid/new.png';
  const storage = { remove: async value => { removed.push(value); } };
  await cleanupUncommitted(url, async () => { throw Error('DB unavailable'); }, { storage }); assert.deepEqual(removed, [url]);
  removed.length = 0;
  await cleanupUncommitted(url, async sql => ({ rows: sql.includes('to_regclass') ? [{ garden: true }] : [{ referenced: true }] }), { commitAttempted: true, storage });
  assert.deepEqual(removed, []);
  let checkedGarden = false;
  await cleanupUnused(url, async sql => { if (sql.includes('garden_evidence')) checkedGarden = true; return { rows: sql.includes('to_regclass') ? [{ garden: true }] : [{ referenced: true }] }; }, storage);
  assert.equal(checkedGarden, true); assert.deepEqual(removed, []);
});
