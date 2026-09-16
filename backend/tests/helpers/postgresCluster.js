import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

export function isolatedEnvironment(source = process.env) {
  const env = { ...source };
  for (const key of Object.keys(env)) if (/^(PG|DB_|DATABASE_URL$)/i.test(key)) delete env[key];
  return { ...env, PGCLIENTENCODING: 'UTF8', LC_MESSAGES: 'C', DB_HOST: '127.0.0.1', DB_PORT: '1', DB_USER: 'not_an_application_account', DB_PASSWORD: 'test-only', DB_NAME: 'not_an_application_database', DATABASE_URL: '', DB_SSL: 'false' };
}

export function redact(value) {
  let text = String(value ?? '').replace(/postgres(?:ql)?:\/\/[^\s]+/gi, '[connection redacted]');
  for (const [key, secret] of Object.entries(process.env)) if (/password|secret|token/i.test(key) && secret.length >= 4) text = text.replaceAll(secret, '[redacted]');
  return text.replace(/((?:password|token|secret)\s*[=:]\s*)[^\s,;]+/gi, '$1[redacted]').slice(-12000);
}

export function postgresHarness({ bin, root, temporary, suite }) {
  const env = isolatedEnvironment();
  const dataDir = path.join(temporary, 'data');
  const log = path.join(temporary, 'postgres.log');
  const executable = name => path.join(bin, name + (process.platform === 'win32' ? '.exe' : ''));
  const run = (name, args, options = {}) => {
    // Server descendants can retain anonymous pipe handles on Windows. Capture
    // pg_ctl output in files instead, so spawnSync can finish after pg_ctl exits.
    const capture = name === 'pg_ctl' ? ['stdout', 'stderr'].map(stream => path.join(temporary, `pg_ctl-${stream}.log`)) : [];
    const descriptors = capture.map(file => fs.openSync(file, 'w'));
    let result;
    try {
      result = spawnSync(executable(name), args, { cwd: root, env, encoding: 'utf8', windowsHide: true, timeout: 60000, ...options, stdio: descriptors.length ? ['ignore', ...descriptors] : 'pipe' });
    } finally { for (const descriptor of descriptors) fs.closeSync(descriptor); }
    if (capture.length) [result.stdout, result.stderr] = capture.map(file => fs.readFileSync(file, 'utf8'));
    const stage = name === 'pg_ctl' ? args.at(-1) : name === 'psql' ? 'schema/test' : name;
    // Never print SQL arguments, input, passwords or connection arguments.
    result.diagnostic = redact(`[${suite}] stage=${stage} binary=${executable(name)} exit=${result.status} signal=${result.signal}\n${result.error?.message ?? ''}\nstdout:\n${result.stdout ?? ''}\nstderr:\n${result.stderr ?? ''}\n${name === 'pg_ctl' && fs.existsSync(log) ? 'server log:\n' + fs.readFileSync(log, 'utf8') : ''}`);
    return result;
  };
  const ok = result => { if (result.status !== 0) throw new Error(result.diagnostic ?? redact(result.stderr || result.error?.message || result.stdout)); };
  const start = async () => {
    console.log(`[${suite}] platform=${process.platform} user=${os.userInfo().username} uid=${process.getuid?.() ?? 'n/a'} bin=${bin}`);
    if (process.getuid?.() === 0) throw new Error(`[${suite}] initdb cannot run as root; run tests as an unprivileged user`);
    let expectedVersion;
    for (const name of ['initdb', 'pg_ctl', 'psql', 'createdb', 'postgres']) {
      const version = run(name, ['--version']); ok(version);
      const number = version.stdout.match(/\(PostgreSQL\) (18\.\d+)/)?.[1];
      if (!number || (expectedVersion && expectedVersion !== number)) throw new Error(`[${suite}] Consistent PostgreSQL 18 binaries required: ${redact(version.stdout)}`);
      expectedVersion = number;
    }
    console.log(`[${suite}] PostgreSQL=${expectedVersion}; temporary=${temporary}`);
    ok(run('initdb', ['-D', dataDir, '-U', 'postgres', '-A', 'trust', '--encoding=UTF8', '--no-locale']));
    // TCP only: avoid package-specific /var/run/postgresql socket permissions.
    // Configuration file avoids shell quoting for temporary paths with spaces.
    fs.appendFileSync(path.join(dataDir, 'postgresql.conf'), "\nunix_socket_directories = ''\nlisten_addresses = '127.0.0.1'\n");
    for (let attempt = 0; attempt < 5; attempt++) {
      const reservation = net.createServer();
      await new Promise((resolve, reject) => { reservation.once('error', reject); reservation.listen(0, '127.0.0.1', resolve); });
      const port = reservation.address().port;
      await new Promise(resolve => reservation.close(resolve));
      fs.writeFileSync(log, '');
      const result = run('pg_ctl', ['-D', dataDir, '-l', log, '-o', `-p ${port}`, '-w', 'start']);
      if (result.status === 0) return port;
      // PostgreSQL cannot inherit Node's reservation. Retry only a real bind race.
      if (!/Address already in use|Only one usage of each socket address/i.test(result.diagnostic) || attempt === 4) {
        run('pg_ctl', ['-D', dataDir, '-m', 'immediate', '-w', 'stop']);
        ok(result);
      }
      console.warn(`[${suite}] port ${port} occupied during startup; retry ${attempt + 1}/4`);
    }
  };
  return { run, ok, start };
}
