import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { isolatedEnvironment, redact, postgresHarness } from './helpers/postgresCluster.js';
import { classifyAudit } from '../../scripts/dependency-risk-report.mjs';

test('CI removes inherited PostgreSQL and application connection settings', () => {
  const env = isolatedEnvironment({ PATH: 'keep', PGHOST: 'real', PGPASSWORD: 'secret', PGSSLMODE: 'require', DB_NAME: 'ecoamigos', DATABASE_URL: 'private' });
  assert.equal(env.PATH, 'keep'); assert.equal(env.PGHOST, undefined); assert.equal(env.PGPASSWORD, undefined); assert.equal(env.PGSSLMODE, undefined);
  assert.equal(env.DB_PORT, '1'); assert.notEqual(env.DB_NAME, 'ecoamigos'); assert.equal(env.DATABASE_URL, '');
  assert.doesNotMatch(redact('postgresql://user:private@host/db password=private token=private'), /private/);
});

test('audit findings are reportable, transport and malformed output fail', () => {
  const report = total => JSON.stringify({ auditReportVersion: 2, vulnerabilities: {}, metadata: { vulnerabilities: { info: 0, low: 0, moderate: 0, high: total, critical: 0, total } } });
  assert.equal(classifyAudit({ status: 1, stdout: report(2) }).counts.total, 2);
  assert.equal(classifyAudit({ status: 0, stdout: report(0) }).counts.total, 0);
  for (const result of [{ status: 1, stdout: '{}' }, { status: 1, stdout: 'network error' }, { status: 2, stdout: report(2) }, { status: 0, stdout: report(2) }, { status: 1, stdout: report(0) }, { status: 1, stdout: report(2), error: Error('timeout') }]) assert.throws(() => classifyAudit(result));
});

test('missing PostgreSQL binary reports suite, stage, exit and spawn error', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'ecoamigos diagnostic '));
  const { run, ok } = postgresHarness({ bin: temporary, root: temporary, temporary, suite: 'diagnostic-probe' });
  const result = run('initdb', []);
  assert.throws(() => ok(result), /diagnostic-probe.*stage=initdb.*binary=.*exit=null/);
  assert.match(result.diagnostic, /ENOENT/);
  assert.match(result.diagnostic, /stdout:[\s\S]*stderr:/);
});
