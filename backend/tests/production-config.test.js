import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { randomBytes } from 'node:crypto';
import { databaseOptions } from '../src/config/databaseOptions.js';
import { serverOptions } from '../src/config/serverOptions.js';
import { corsOptions, csrfProtection, controlledError } from '../src/middleware/httpConfig.js';
import healthRoutes from '../src/routes/healthRoutes.js';

const local = { DB_HOST: 'localhost', DB_PORT: '5432', DB_USER: 'fixture', DB_PASSWORD: 'test-only', DB_NAME: 'fixture' };

test('Producción: URL Neon conserva certificado verificado y opciones locales sin conectar', () => {
  const url = 'postgresql://fixture:p%40ss@db.example.invalid:5432/fixture?sslmode=require&channel_binding=require';
  const options = databaseOptions({ ...local, DATABASE_URL: url, NODE_ENV: 'production' });
  assert.equal(options.host, 'db.example.invalid'); assert.equal(options.password, 'p@ss');
  assert.deepEqual(options.ssl, { rejectUnauthorized: true }); assert.equal(options.enableChannelBinding, true);
  const client = new pg.Client(options); // Never connect to any external host.
  assert.deepEqual(client.connectionParameters.ssl, { rejectUnauthorized: true });
  assert.equal(client.enableChannelBinding, true);
  assert.deepEqual(databaseOptions(local).ssl, false);
  assert.deepEqual(databaseOptions({ ...local, NODE_ENV: 'production' }).ssl, { rejectUnauthorized: true });
  assert.deepEqual(databaseOptions({ ...local, DATABASE_URL: url.replace('require&channel_binding=require', 'verify-full') }).ssl, { rejectUnauthorized: true });
});

test('Producción: URL no permite degradar TLS ni introducir opciones arbitrarias', () => {
  for (const query of ['sslmode=disable','sslmode=no-verify','sslmode=prefer','sslmode=require&sslmode=disable','sslcert=private','channel_binding=disable','unknown=value']) {
    assert.throws(() => databaseOptions({ ...local, DATABASE_URL: 'postgresql://fixture:test-only@db.example.invalid/fixture?' + query }), /^Error: Configuración PostgreSQL inválida$/);
  }
  assert.throws(() => databaseOptions({ ...local, DATABASE_URL: 'postgresql://fixture:test-only@db.example.invalid/fixture?sslmode=require', DB_SSL: 'false' }));
  assert.throws(() => databaseOptions({ ...local, DB_SSL: 'true', NODE_TLS_REJECT_UNAUTHORIZED: '0' }));
});

test('Arranque: PORT numérico y respaldo 3000; sin secreto implícito ni ejemplos en producción', () => {
  const secret = randomBytes(32).toString('hex'); // Ephemeral test-only material.
  assert.deepEqual(serverOptions({ JWT_SECRET: secret }), { port: 3000 });
  assert.deepEqual(serverOptions({ JWT_SECRET: secret, PORT: '8080', NODE_ENV: 'production' }), { port: 8080 });
  for (const PORT of ['-1','0','65536','3000.5','abc',' 3000 ']) assert.throws(() => serverOptions({ JWT_SECRET: secret, PORT }), /puerto inválida/);
  for (const JWT_SECRET of [undefined,'','   ']) assert.throws(() => serverOptions({ JWT_SECRET }), /JWT_SECRET/);
  for (const JWT_SECRET of ['short','replace_with_a_long_random_secret']) assert.throws(() => serverOptions({ NODE_ENV: 'production', JWT_SECRET }), /JWT_SECRET/);
});

test('CORS: localhost solo por defecto en desarrollo; producción exige un origen HTTPS exacto', () => {
  assert.doesNotThrow(() => corsOptions({ NODE_ENV: 'development' }));
  for (const NODE_ENV of ['production','staging','test']) assert.throws(() => corsOptions({ NODE_ENV }), /CORS/);
  for (const CLIENT_URL of ['', '*', 'http://localhost:5173', 'https://frontend.example.invalid/path', 'https://one.example.invalid,https://two.example.invalid']) {
    assert.throws(() => corsOptions({ NODE_ENV: 'production', CLIENT_URL }), /CORS/);
  }
});

test('GET /api/health: público, JSON 200, sin BD; CORS y preflight de producción', async () => {
  const env = { NODE_ENV: 'production', CLIENT_URL: 'https://frontend.example.invalid' };
  const app = express(); app.use(cors(corsOptions(env))); app.use('/api', csrfProtection(env));
  app.use('/api/health', healthRoutes); app.use(controlledError);
  const server = await new Promise(resolve => { const instance = app.listen(0, '127.0.0.1', () => resolve(instance)); });
  try {
    const url = 'http://127.0.0.1:' + server.address().port + '/api/health';
    const publicResponse = await fetch(url);
    assert.equal(publicResponse.status, 200); assert.match(publicResponse.headers.get('content-type'), /application\/json/);
    assert.deepEqual(await publicResponse.json(), { status: 'ok' });
    const allowed = await fetch(url, { headers: { Origin: env.CLIENT_URL } });
    assert.equal(allowed.status, 200); assert.equal(allowed.headers.get('access-control-allow-origin'), env.CLIENT_URL);
    assert.equal(allowed.headers.get('access-control-allow-credentials'), 'true');
    const denied = await fetch(url, { headers: { Origin: 'https://other.example.invalid' } });
    assert.equal(denied.status, 403); assert.equal(denied.headers.get('access-control-allow-origin'), null);
    const preflight = await fetch(url, { method: 'OPTIONS', headers: { Origin: env.CLIENT_URL, 'Access-Control-Request-Method': 'GET' } });
    assert.equal(preflight.status, 204);
  } finally { await new Promise(resolve => server.close(resolve)); }
  // Verify the production entry point actually installs the tested route and startup guard.
  const source = fs.readFileSync(new URL('../src/server.js', import.meta.url), 'utf8');
  assert.match(source, /app\.use\('\/api\/health', healthRoutes\)/);
  assert.match(source, /serverOptions\(\)/);
  assert.match(source, /app\.listen\(PORT/);
});

test('Node: backend y lockfile declaran la misma versión compatible con CI', () => {
  const manifest = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const lock = JSON.parse(fs.readFileSync(new URL('../package-lock.json', import.meta.url), 'utf8'));
  assert.equal(manifest.engines.node, '>=24.13.0 <25');
  assert.deepEqual(lock.packages[''].engines, manifest.engines);
});
