// F13: only a new disposable PostgreSQL cluster; never loads .env or application DB.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import pg from 'pg';
import express from 'express';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
const materialTypes = ['papel_carton', 'plastico', 'vidrio', 'metal', 'organico'];
const closeTo = (actual, expected) => assert.ok(
  Math.abs(Number(actual) - expected) < 1e-10, `${actual} != ${expected}`,
);

test('F13: estadísticas aprobadas en kg por HTTP y PostgreSQL aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-f13-test-'));
  const dataDir = path.join(temporary, 'data');
  const env = { ...process.env, PGCLIENTENCODING: 'UTF8' };
  for (const key of Object.keys(env)) if (key.startsWith('PG') && key !== 'PGCLIENTENCODING') delete env[key];
  const run = (name, args, options = {}) => spawnSync(
    path.join(bin, name + (process.platform === 'win32' ? '.exe' : '')),
    args, { cwd: root, env, encoding: 'utf8', windowsHide: true, timeout: 60000, ...options },
  );
  const ok = result => assert.equal(result.status, 0, result.stderr || result.error?.message || result.stdout);
  ok(run('initdb', ['-D', dataDir, '-U', 'postgres', '-A', 'trust', '--encoding=UTF8', '--no-locale']));
  const socket = net.createServer();
  await new Promise((resolve, reject) => { socket.once('error', reject); socket.listen(0, '127.0.0.1', resolve); });
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  let started = false;
  let client;
  let testPool;
  let server;
  try {
    ok(run('pg_ctl', ['-D', dataDir, '-l', path.join(temporary, 'postgres.log'), '-o', `-h 127.0.0.1 -p ${port}`, '-w', 'start'], { stdio: 'ignore' }));
    started = true;
    client = new pg.Client({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres' });
    await client.connect();
    const psql = args => run('psql', ['-X', '-h', '127.0.0.1', '-p', String(port), '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', ...args]);
    ok(psql(['-f', 'database/schema.sql']));
    ok(psql(['-f', 'database/import_points_catalog.sql']));
    const catalogBefore = (await client.query('SELECT * FROM points_catalog ORDER BY id')).rows;
    testPool = new pg.Pool({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres' });

    // Substitute only DB transport; public router, SQL and calculations remain real.
    let source = fs.readFileSync(path.join(root, 'backend/src/controllers/publicController.js'), 'utf8');
    source = source.replace("import { query } from '../config/db.js';", 'const pool = globalThis.__f13Pool; const query = (...args) => pool.query(...args);');
    const controllerUrl = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
    let routes = fs.readFileSync(path.join(root, 'backend/src/routes/publicRoutes.js'), 'utf8');
    routes = routes.replace("'express'", JSON.stringify(pathToFileURL(require.resolve('express')).href));
    routes = routes.replace("'../controllers/publicController.js'", JSON.stringify(controllerUrl));
    globalThis.__f13Pool = testPool;
    let router;
    try { ({ default: router } = await import('data:text/javascript;base64,' + Buffer.from(routes).toString('base64'))); }
    finally { delete globalThis.__f13Pool; }
    const app = express();
    app.use('/api/public', router);
    server = await new Promise(resolve => { const running = app.listen(0, '127.0.0.1', () => resolve(running)); });
    const get = async (endpoint = 'stats') => {
      const response = await fetch(`http://127.0.0.1:${server.address().port}/api/public/${endpoint}`);
      assert.equal(response.status, 200);
      return response.json();
    };
    await client.query("INSERT INTO teams(name,dependency) VALUES ('Equipo A','Fixture'),('Equipo B','Fixture')");
    await client.query("INSERT INTO users(name,email,password_hash,role,team_id) VALUES ('Líder','fixture@test.invalid','fixture','leader',1)");
    await client.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Histórico','2025-01-01','2025-12-31',false),('Activo','2026-01-01','2026-12-31',true)");
    const reset = () => client.query('DELETE FROM recycling_records');
    const insert = ({ material = 'papel_carton', quantity = '1.25', unit = 'kg', status = 'approved', period = 2, points = 0 } = {}) => client.query(
      `INSERT INTO recycling_records(user_id,team_id,material_type,quantity,unit,quality_level,status,period_id,points_awarded)
       VALUES (1,1,$1,$2,$3,'alta',$4,$5,$6)`, [material, quantity, unit, status, period, points],
    );
    const assertQuantity = (body, expected) => {
      closeTo(body.general.total_quantity, expected);
      closeTo(body.materials.reduce((sum, row) => sum + Number(row.total_quantity), 0), expected);
    };

    await t.test('vacío: contrato HTTP completo, ceros y listas coherentes', async () => {
      const body = await get();
      assert.deepEqual(Object.keys(body).sort(), ['general', 'materials', 'periods', 'status', 'teams']);
      assertQuantity(body, 0);
      assert.equal(body.general.total_records, 0);
      assert.equal(body.general.total_points, 0);
      assert.deepEqual(body.materials, []);
      assert.deepEqual(body.status, []);
    });
    for (const status of ['approved', 'pending', 'rejected']) {
      await t.test(`${status}: solo approved suma kg; conteo operativo permanece`, async () => {
        await reset(); await insert({ status });
        const body = await get();
        assertQuantity(body, status === 'approved' ? 1.25 : 0);
        assert.equal(body.general.total_records, 1);
        assert.deepEqual(body.status, [{ status, total: 1 }]);
        assert.equal(body.materials[0].total, 1);
      });
    }
    await t.test('mezcla de estados por cada material: cantidad aprobada y actividad separadas', async () => {
      await reset();
      for (const material of materialTypes) {
        await insert({ material, quantity: '2.75' });
        await insert({ material, quantity: '100', status: 'pending' });
        await insert({ material, quantity: '200', status: 'rejected' });
      }
      const body = await get();
      assertQuantity(body, 13.75);
      assert.equal(body.general.total_records, 15);
      assert.equal(body.materials.length, 5);
      for (const row of body.materials) { closeTo(row.total_quantity, 2.75); assert.equal(row.total, 3); }
    });
    await t.test('todos los materiales en kg, incluidas mayúsculas/espacios, sin inferir bloques orgánicos', async () => {
      await reset();
      for (const material of materialTypes) await insert({ material, quantity: '1.23', unit: ' KG ' });
      assertQuantity(await get(), 6.15);
    });
    await t.test('litros, unidades, bloques y unidades no reconocidas nunca se convierten a kg', async () => {
      await reset();
      for (const material of materialTypes) {
        for (const unit of ['L', 'unidades', 'bloques', 'g', 'ton', 'kilogramos', '?', '']) {
          await insert({ material, unit, quantity: '999.99' });
        }
      }
      const body = await get();
      assertQuantity(body, 0);
      assert.equal(body.general.total_records, 40);
    });
    await t.test('decimales: SQL conserva centésimas sin redondeo adicional', async () => {
      await reset(); await insert({ quantity: '0.10' }); await insert({ quantity: '0.20' });
      const body = await get();
      assert.equal(body.general.total_quantity, '0.30');
      assert.equal(body.materials[0].total_quantity, '0.30');
      assertQuantity(body, 0.30);
    });
    await t.test('F14 HTTP: total aprobado correcto sin equivalencias ambientales', async () => {
      await reset(); await insert({ quantity: '2.25' });
      await insert({ quantity: '500', unit: 'L' });
      await insert({ quantity: '500', status: 'pending' });
      await insert({ quantity: '500', status: 'rejected' });
      for (const material of materialTypes.slice(1)) await insert({ material, quantity: '10' });
      const body = await get();
      assertQuantity(body, 42.25);
      assert.equal('indicators' in body, false);
      assert.doesNotMatch(JSON.stringify(body), /trees|water|co2|energy|estimated/i);
    });
    await t.test('histórico: incluye activo, inactivo y sin período; ranking conserva solo activo aprobado', async () => {
      await reset();
      await insert({ period: 1, quantity: '1.25', points: 100 });
      await insert({ period: 2, quantity: '2.25', points: 20 });
      await insert({ period: null, quantity: '3.25', points: 30 });
      await insert({ period: 2, status: 'pending', points: 0 });
      await insert({ period: 2, status: 'rejected', points: 0 });
      const before = (await client.query('SELECT * FROM recycling_records ORDER BY id')).rows;
      const body = await get();
      assertQuantity(body, 6.75);
      assert.equal(body.general.total_points, 150);
      assert.equal(body.teams.find(row => row.id === 1).total_points, 150);
      assert.equal(body.periods.find(row => row.id === 1).total_points, 100);
      assert.equal(body.periods.find(row => row.id === 2).total_points, 20);
      const ranking = await get('ranking');
      assert.equal(ranking.currentPeriod.id, 2);
      assert.equal(Number(ranking.ranking[0].total_points), 20);
      assert.equal(ranking.ranking[0].position, 1);
      assert.deepEqual((await client.query('SELECT * FROM recycling_records ORDER BY id')).rows, before);
      await client.query('UPDATE periods SET is_active=false');
      try {
        assertQuantity(await get(), 6.75);
        assert.deepEqual(await get('ranking'), { currentPeriod: null, ranking: [] });
      } finally { await client.query('UPDATE periods SET is_active=true WHERE id=2'); }
    });
    await t.test('cantidad excluida no elimina puntos, conteos ni resúmenes operativos', async () => {
      await reset(); await insert({ unit: 'unidades', points: 40 });
      const body = await get();
      assertQuantity(body, 0);
      assert.equal(body.general.total_points, 40);
      assert.equal(body.materials[0].total_points, 40);
      assert.equal(body.teams[0].total_points, 40);
      assert.equal(body.periods.find(row => row.id === 2).total_records, 1);
      assert.equal(Number((await get('ranking')).ranking[0].total_points), 40);
    });
    await t.test('frontend conserva histórico y total aprobado en kg', () => {
      const ui = fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminDashboard.jsx'), 'utf8');
      assert.match(ui, /Histórico de todos los períodos/);
      assert.match(ui, /Cantidad total reciclada aprobada \(kg\)/);
    });
    assert.equal(catalogBefore.length, 56);
    assert.deepEqual((await client.query('SELECT * FROM points_catalog ORDER BY id')).rows, catalogBefore);
  } finally {
    if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    if (testPool) await testPool.end();
    if (client) await client.end();
    if (started) ok(run('pg_ctl', ['-D', dataDir, '-m', 'fast', '-w', 'stop']));
  }
});
