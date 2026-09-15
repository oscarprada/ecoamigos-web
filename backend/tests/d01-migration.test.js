// D01 only. Builds disposable PostgreSQL databases from the inspected historical
// structure. It never reads .env and cannot connect to the application database.
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

const root = fileURLToPath(new URL('../../', import.meta.url));
const bin = process.env.ECOAMIGOS_TEST_PG_BIN;
const migration = 'database/20260908_d01_migrate_existing.sql';
const verification = 'database/verify_20260908_d01.sql';

const historicalSchema = (evidenceType = 'text') => `
  CREATE TABLE users (
    id serial PRIMARY KEY, email varchar(100) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    role varchar(20) NOT NULL CHECK (role IN ('admin','leader')),
    created_at timestamp DEFAULT current_timestamp,
    name varchar(100), password_hash varchar(255), is_active boolean DEFAULT true,
    team_id integer
  );
  CREATE TABLE teams (
    id serial PRIMARY KEY, name varchar(100) NOT NULL,
    leader_id integer REFERENCES users(id), dependency varchar(150)
  );
  ALTER TABLE users ADD CONSTRAINT users_team_id_fkey FOREIGN KEY (team_id) REFERENCES teams(id);
  CREATE TABLE periods (
    id serial PRIMARY KEY, name varchar(100), start_date date, end_date date,
    is_active boolean DEFAULT true
  );
  CREATE TABLE content_items (
    id serial PRIMARY KEY, title varchar(200) NOT NULL, category varchar(50) NOT NULL,
    type varchar(30) NOT NULL, description text, file_url text,
    status varchar(30) DEFAULT 'published', created_by integer, created_at timestamp DEFAULT current_timestamp
  );
  CREATE TABLE contents (
    id serial PRIMARY KEY, title varchar(200), type varchar(50), url text,
    description text, created_at timestamp DEFAULT current_timestamp
  );
  CREATE TABLE rewards (
    id serial PRIMARY KEY, name varchar(100), description text,
    period_id integer REFERENCES periods(id)
  );
  CREATE TABLE prizes (
    id serial PRIMARY KEY, name varchar(150) NOT NULL, description text,
    is_active boolean DEFAULT true, created_at timestamp DEFAULT current_timestamp
  );
  CREATE TABLE points_catalog (
    id serial PRIMARY KEY, source_code varchar(50), group_name varchar(100) NOT NULL,
    action_name varchar(150) NOT NULL, action_level varchar(100), points integer NOT NULL DEFAULT 0,
    evidence_required ${evidenceType}, max_frequency varchar(50)
  );
  CREATE TABLE recycling_records (
    id serial PRIMARY KEY,
    team_id integer REFERENCES teams(id), user_id integer REFERENCES users(id),
    material_type varchar(50), quantity numeric, unit varchar(20),
    quality_checked boolean DEFAULT false, evidence_url text,
    status varchar(20) DEFAULT 'pending', points integer DEFAULT 0,
    created_at timestamp DEFAULT current_timestamp,
    catalog_group_name varchar(100), catalog_action_name varchar(150), catalog_action_level varchar(100),
    points_awarded integer DEFAULT 0, period_id integer REFERENCES periods(id),
    quality_level varchar(50), criteria_count integer DEFAULT 0, notes text,
    record_date date, review_notes text, reviewed_by integer, reviewed_at timestamp
  );
`;

async function seedHistorical(client, hash, { evidenceType = 'text', unsafePassword = false, needsPasswordMigration = false } = {}) {
  await client.query(historicalSchema(evidenceType));
  const legacyPassword = unsafePassword ? 'legacy-plain-text' : hash;
  const officialHash = needsPasswordMigration || unsafePassword ? null : hash;
  await client.query("INSERT INTO teams(name, dependency) VALUES ('Equipo histórico','Dependencia histórica')");
  await client.query(
    "INSERT INTO users(email,password,role,name,password_hash,is_active,team_id) VALUES ('fixture@example.invalid',$1,'leader','Fixture histórica',$2,true,1)",
    [legacyPassword, officialHash],
  );
  await client.query('UPDATE teams SET leader_id=1 WHERE id=1');
  await client.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Periodo histórico','2026-01-01','2026-12-31',true)");
  await client.query("INSERT INTO content_items(title,category,type,description,status,created_by) VALUES ('Contenido histórico','agua','text','Conservar','published',1)");
  await client.query("INSERT INTO contents(title,type,url,description) VALUES ('Contenido legado','guide','/legacy','No migrar automáticamente')");
  await client.query("INSERT INTO rewards(name,description,period_id) VALUES ('Recompensa legada','No convertir a premio',1)");
  await client.query("INSERT INTO prizes(name,description) VALUES ('Premio conservado','Compatibilidad')");
  if (evidenceType === 'boolean') {
    await client.query("INSERT INTO points_catalog(source_code,group_name,action_name,action_level,points,evidence_required,max_frequency) VALUES ('F-1','Grupo','Acción','Nivel',25,true,'mensual')");
  } else {
    await client.query("INSERT INTO points_catalog(source_code,group_name,action_name,action_level,points,evidence_required,max_frequency) VALUES ('F-1','Grupo','Acción','Nivel',25,'Fotografía requerida','mensual')");
  }
  await client.query(`
    INSERT INTO recycling_records(
      team_id,user_id,material_type,quantity,unit,quality_checked,status,points,
      catalog_group_name,catalog_action_name,catalog_action_level,points_awarded,
      period_id,quality_level,criteria_count,notes,record_date,review_notes,reviewed_by
    ) VALUES (1,1,'papel_carton',12.50,'kg',false,'approved',0,
      'Grupo','Acción','Nivel',25,1,'alta',2,'Conservar','2026-06-15','Revisado',1)
  `);
}

test('D01: migración histórica transaccional y sin pérdida', {
  skip: !bin && 'Definir ECOAMIGOS_TEST_PG_BIN con el directorio de binarios PostgreSQL.',
}, async (t) => {
  assert.ok(fs.existsSync(path.join(root, migration)));
  assert.ok(fs.existsSync(path.join(root, verification)));
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos-d01-test-'));
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
  let admin;
  try {
    ok(run('pg_ctl', ['-D', dataDir, '-l', path.join(temporary, 'postgres.log'), '-o', `-h 127.0.0.1 -p ${port}`, '-w', 'start'], { stdio: 'ignore' }));
    started = true;
    admin = new pg.Client({ host: '127.0.0.1', port, user: 'postgres', database: 'postgres' });
    await admin.connect();
    for (const database of ['d01_official', 'd01_detected', 'd01_boolean', 'd01_unsafe', 'd01_multiple_active']) {
      await admin.query(`CREATE DATABASE ${database}`);
    }
    const psql = (database, file) => run('psql', [
      '-X', '-h', '127.0.0.1', '-p', String(port), '-U', 'postgres', '-d', database,
      '-v', 'ON_ERROR_STOP=1', '-f', file,
    ]);
    const connect = async (database) => {
      const client = new pg.Client({ host: '127.0.0.1', port, user: 'postgres', database });
      await client.connect();
      return client;
    };
    const hash = await bcrypt.hash('fixture-only-password', 10);
    ok(psql('d01_official', 'database/schema.sql'));

    await t.test('migra la estructura detectada y preserva datos y legado', async () => {
      const client = await connect('d01_detected');
      try {
        await seedHistorical(client, hash);
        const before = (await client.query(`SELECT
          (SELECT count(*)::int FROM users) users,
          (SELECT count(*)::int FROM teams) teams,
          (SELECT count(*)::int FROM periods) periods,
          (SELECT count(*)::int FROM content_items) content_items,
          (SELECT count(*)::int FROM contents) contents,
          (SELECT count(*)::int FROM rewards) rewards,
          (SELECT count(*)::int FROM recycling_records) recycling_records,
          (SELECT count(*)::int FROM points_catalog) points_catalog,
          (SELECT count(*)::int FROM prizes) prizes`)).rows[0];
        ok(psql('d01_detected', migration));
        ok(psql('d01_detected', verification));
        const after = (await client.query(`SELECT
          (SELECT count(*)::int FROM users) users,
          (SELECT count(*)::int FROM teams) teams,
          (SELECT count(*)::int FROM periods) periods,
          (SELECT count(*)::int FROM content_items) content_items,
          (SELECT count(*)::int FROM contents) contents,
          (SELECT count(*)::int FROM rewards) rewards,
          (SELECT count(*)::int FROM recycling_records) recycling_records,
          (SELECT count(*)::int FROM points_catalog) points_catalog,
          (SELECT count(*)::int FROM prizes) prizes`)).rows[0];
        assert.deepEqual(after, before);
        const legacy = (await client.query(`SELECT points,points_awarded,quality_checked,quality_level,
          (SELECT password IS NOT NULL AND password=password_hash FROM users WHERE id=1) AS password_preserved
          FROM recycling_records WHERE id=1`)).rows[0];
        assert.deepEqual(legacy, { points: 0, points_awarded: 25, quality_checked: false, quality_level: 'alta', password_preserved: true });
        await client.query(
          "INSERT INTO users(name,email,password_hash,role,is_active) VALUES ('Usuario nuevo','new@example.invalid',$1,'admin',true)",
          [hash],
        );
        assert.equal((await client.query("SELECT password IS NULL AS detached FROM users WHERE email='new@example.invalid'")).rows[0].detached, true);
      } finally {
        await client.end();
      }
    });

    await t.test('convierte evidence_required BOOLEAN y migra solo el hash faltante', async () => {
      const client = await connect('d01_boolean');
      try {
        await seedHistorical(client, hash, { evidenceType: 'boolean', needsPasswordMigration: true });
        ok(psql('d01_boolean', migration));
        ok(psql('d01_boolean', verification));
        const result = (await client.query(`SELECT
          (SELECT evidence_required FROM points_catalog LIMIT 1) AS evidence,
          (SELECT password_hash IS NOT NULL AND password_hash=password FROM users LIMIT 1) AS hash_copied`)).rows[0];
        assert.deepEqual(result, { evidence: 'true', hash_copied: true });
      } finally {
        await client.end();
      }
    });

    ok(psql('d01_detected', 'database/20260914_s01_session_version.sql'));
    await t.test('las columnas y restricciones oficiales coinciden con una instalación nueva', async () => {
      const official = await connect('d01_official');
      const migrated = await connect('d01_detected');
      try {
        const tables = ['users', 'teams', 'periods', 'content_items', 'points_catalog', 'recycling_records'];
        const columnSql = `SELECT table_name,column_name,data_type,udt_name,is_nullable,
          character_maximum_length,numeric_precision,numeric_scale,column_default
          FROM information_schema.columns WHERE table_schema='public' AND table_name=ANY($1)
          ORDER BY table_name,column_name`;
        const officialColumns = (await official.query(columnSql, [tables])).rows;
        const officialNames = new Set(officialColumns.map(row => `${row.table_name}.${row.column_name}`));
        const migratedColumns = (await migrated.query(columnSql, [tables])).rows
          .filter(row => officialNames.has(`${row.table_name}.${row.column_name}`));
        assert.deepEqual(migratedColumns, officialColumns);
        const indexSql = "SELECT indexdef FROM pg_indexes WHERE schemaname='public' AND indexname='periods_one_active_uidx'";
        assert.deepEqual((await migrated.query(indexSql)).rows, (await official.query(indexSql)).rows);
        await assert.rejects(migrated.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Segundo activo','2026-01-01','2026-12-31',true)"), { code: '23505' });

        const constraintSql = `SELECT conrelid::regclass::text AS table_name,conname,pg_get_constraintdef(oid) AS definition
          FROM pg_constraint WHERE connamespace='public'::regnamespace
            AND conrelid::regclass::text=ANY($1) ORDER BY table_name,conname`;
        const officialConstraints = (await official.query(constraintSql, [tables])).rows;
        const migratedConstraints = (await migrated.query(constraintSql, [tables])).rows;
        const migratedByName = new Map(migratedConstraints.map(row => [`${row.table_name}.${row.conname}`, row.definition]));
        for (const constraint of officialConstraints) {
          assert.equal(
            migratedByName.get(`${constraint.table_name}.${constraint.conname}`),
            constraint.definition,
            `Restricción oficial distinta: ${constraint.table_name}.${constraint.conname}`,
          );
        }
      } finally {
        await official.end();
        await migrated.end();
      }
    });

    await t.test('F09: D01 aborta sin cambios con varios periodos activos', async () => {
      const client = await connect('d01_multiple_active');
      try {
        await seedHistorical(client, hash);
        await client.query("INSERT INTO periods(name,start_date,end_date,is_active) VALUES ('Otro activo','2026-01-01','2026-12-31',true)");
        const before = (await client.query('SELECT * FROM periods ORDER BY id')).rows;
        const result = psql('d01_multiple_active', migration);
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /varios periodos activos/);
        assert.deepEqual((await client.query('SELECT * FROM periods ORDER BY id')).rows, before);
        assert.equal((await client.query("SELECT 1 FROM pg_type WHERE typname='user_role' AND typnamespace='public'::regnamespace")).rowCount, 0);
      } finally { await client.end(); }
    });

    await t.test('aborta y revierte ante un password histórico no seguro', async () => {
      const client = await connect('d01_unsafe');
      try {
        await seedHistorical(client, hash, { unsafePassword: true });
        const result = psql('d01_unsafe', migration);
        assert.notEqual(result.status, 0);
        assert.match(result.stderr, /no es un bcrypt reconocible/i);
        const state = (await client.query(`SELECT
          password_hash IS NULL AS hash_unchanged,
          (SELECT is_nullable='NO' FROM information_schema.columns WHERE table_schema='public' AND table_name='users' AND column_name='password') AS password_still_required,
          NOT EXISTS (SELECT 1 FROM pg_type WHERE typname='user_role' AND typnamespace='public'::regnamespace) AS transaction_reverted
          FROM users LIMIT 1`)).rows[0];
        assert.deepEqual(state, { hash_unchanged: true, password_still_required: true, transaction_reverted: true });
      } finally {
        await client.end();
      }
    });
  } finally {
    if (admin) await admin.end();
    if (started) ok(run('pg_ctl', ['-D', dataDir, '-m', 'fast', '-w', 'stop']));
    t.diagnostic(`Cluster D01 aislado detenido; archivos de prueba: ${temporary}`);
  }
});
