import { postgresHarness } from './helpers/postgresCluster.js';
// D01-D10 only. Starts a NEW disposable PostgreSQL cluster, never reads .env.
// No application database URL is accepted. Files remain in OS temp for inspection.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import pg from 'pg';
import bcrypt from 'bcrypt';

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
test('D01-D10: instalación en un cluster PostgreSQL nuevo y aislado', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-install-test-'));
  const dataDir = path.join(temporary, 'data');
  const { run, ok, start } = postgresHarness({ bin, root, temporary, suite: 'installation.test.js' });
  let port;
  let started = false;
  let client;
  try {
    port = await start();
    started = true;
    client = new pg.Client({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres' });
    await client.connect();
    const psql = (args, options) => run('psql', ['-X', '-h', '127.0.0.1', '-p', String(port), '-U', 'postgres', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', ...args], options);

    await t.test('esquema oficial instala vacío; aliases apuntan al mismo SQL', async () => {
      ok(psql(['-f', 'database/schema.sql']));
      for (const [file, target] of [['backend/schema.sql', '../database/schema.sql'], ['docs/sql/schema-referencia.sql', '../../database/schema.sql']]) {
        const alias = fs.readFileSync(path.join(root, file), 'utf8');
        assert.ok(alias.includes('\\ir ' + target));
        assert.doesNotMatch(alias, /CREATE TABLE/i);
      }
      const columns = (await client.query("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='users'")).rows.map(r => r.column_name);
      assert.ok(columns.includes('password_hash'));
      assert.ok(!columns.includes('password'));
      const type = await client.query("SELECT data_type FROM information_schema.columns WHERE table_schema='public' AND table_name='points_catalog' AND column_name='evidence_required'");
      assert.equal(type.rows[0].data_type, 'text');
      const refs = await client.query("SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='recycling_records' AND column_name LIKE 'catalog_%'");
      assert.equal(refs.rowCount, 3);
      // Check the DB constraints against the current UI values without creating content.
      const constraints = (await client.query("SELECT pg_get_constraintdef(oid) AS definition FROM pg_constraint WHERE conrelid='content_items'::regclass")).rows.map(r => r.definition).join('\n');
      for (const value of ['agua','energia','papel','residuos','text','image','video','file']) {
        assert.ok(constraints.includes(`'${value}'`), `Falta restricción de ${value}`);
        assert.ok(fs.readFileSync(path.join(root, 'frontend/src/pages/admin/AdminContentPage.jsx'), 'utf8').includes(`value="${value}"`));
      }
      for (const table of ['users','teams','periods','content_items','prizes','winner_records','points_catalog','recycling_records']) {
        assert.equal((await client.query(`SELECT count(*)::int AS n FROM ${table}`)).rows[0].n, 0);
      }
    });

    await t.test('todas las consultas estáticas de controladores se preparan contra el esquema', async () => {
      let count = 0;
      for (const file of fs.readdirSync(path.join(root, 'backend/src/controllers'))) {
        const source = fs.readFileSync(path.join(root, 'backend/src/controllers', file), 'utf8');
        for (const match of source.matchAll(/query\(\s*(?:`([^`]+)`|'([^']+)'|"([^"]+)")/g)) {
          const sql = match[1] || match[2] || match[3];
          // Transaction commands are exercised by F08; PREPARE accepts DML only.
          if (/^(BEGIN|COMMIT|ROLLBACK)$/.test(sql) || /^LOCK TABLE /i.test(sql)) continue;
          assert.ok(!sql.includes('${'), 'Revisar SQL dinámico antes de preparar');
          await client.query(`PREPARE installation_query_${count++} AS ${sql}`);
        }
      }
      assert.ok(count >= 25, 'Cobertura de consultas insuficiente');
      t.diagnostic(`${count} consultas preparadas por PostgreSQL, sin ejecutarlas sobre datos reales.`);
    });

    await t.test('reinstalar aborta; seed repetido no escribe y diagnóstico es de lectura', async () => {
      assert.notEqual(psql(['-f', 'database/schema.sql']).status, 0);
      ok(psql(['-f', 'backend/src/seed.sql']));
      ok(psql(['-f', 'backend/src/seed.sql']));
      ok(psql(['-f', 'database/inspect_existing.sql']));
      assert.equal((await client.query('SELECT count(*)::int AS n FROM users')).rows[0].n, 0);
    });

    await t.test('CSV original: carga repetible, texto preservado y conflictos sin sobrescribir', async () => {
      ok(psql(['-f', 'database/import_points_catalog.sql']));
      const first = (await client.query('SELECT * FROM points_catalog ORDER BY id')).rows;
      assert.equal(first.length, 56);
      assert.equal(first.find(r => r.source_code === '2026-03-02').action_level, 'Nivel 3: Lote de 1,000 unidades');
      ok(psql(['-f', 'database/import_points_catalog.sql']));
      assert.deepEqual((await client.query('SELECT * FROM points_catalog ORDER BY id')).rows, first);
      assert.equal(first.some(r => r.group_name === 'Dependencias institucionales'), false);
      // Change only a metadata field in the disposable cluster to simulate a conflict.
      await client.query("UPDATE points_catalog SET evidence_required = evidence_required || ' ' WHERE id = $1", [first[0].id]);
      const beforeConflict = (await client.query('SELECT * FROM points_catalog ORDER BY id')).rows;
      assert.notEqual(psql(['-f', 'database/import_points_catalog.sql']).status, 0);
      assert.deepEqual((await client.query('SELECT * FROM points_catalog ORDER BY id')).rows, beforeConflict);
      await assert.rejects(client.query(`INSERT INTO points_catalog (group_name,action_name,action_level,points)
        SELECT upper(group_name),action_name,action_level,points FROM points_catalog LIMIT 1`), { code: '23505' });
    });

    await t.test('bootstrap exige datos; bcrypt y alta no duplican hash ni reemplazan cuentas', async () => {
      assert.notEqual(psql(['-f', 'database/create_admin.sql']).status, 0);
      // Explicit test-only identity, never included in a seed or real database.
      const password = randomBytes(24).toString('hex');
      const hashResult = spawnSync(process.execPath, ['backend/scripts/hash-password.js'], { cwd: root, input: password + '\n', encoding: 'utf8', windowsHide: true });
      ok(hashResult);
      const hash = hashResult.stdout.trim();
      assert.ok(await bcrypt.compare(password, hash));
      const args = ['-v', 'admin_name=__installation_test_only__', '-v', 'admin_email=installation-test@example.invalid', '-v', `admin_password_hash=${hash}`, '-f', 'database/create_admin.sql'];
      ok(psql(args));
      assert.notEqual(psql(args).status, 0);
      const rows = (await client.query('SELECT * FROM users')).rows;
      assert.equal(rows.length, 1);
      assert.equal(rows[0].password_hash, hash);
      assert.ok(!Object.hasOwn(rows[0], 'password'));
      const source = fs.readFileSync(path.join(root, 'backend/src/controllers/adminController.js'), 'utf8');
      const insert = source.match(/INSERT INTO users[\s\S]*?RETURNING id, name, email, role, team_id/)[0];
      const created = await client.query(insert, ['__controller_test_only__', 'controller-test@example.invalid', hash, 'admin', null]);
      assert.equal(created.rowCount, 1);
      assert.ok(await bcrypt.compare(password, (await client.query('SELECT password_hash FROM users WHERE id=$1', [created.rows[0].id])).rows[0].password_hash));
    });
  } finally {
    if (client) await client.end();
    if (started) ok(run('pg_ctl', ['-D', dataDir, '-m', 'fast', '-w', 'stop']));
    t.diagnostic(`Cluster aislado detenido; archivos de prueba: ${temporary}`);
  }
});
