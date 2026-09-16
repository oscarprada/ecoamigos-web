import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=fileURLToPath(new URL('../',import.meta.url));
const side=process.argv[2];
if(!['backend','frontend'].includes(side))throw Error('Choose backend or frontend');
if(side==='backend'){
 const bin=process.env.ECOAMIGOS_TEST_PG_BIN;
 for(const executable of ['initdb','pg_ctl','psql'])if(!bin||!fs.existsSync(path.join(bin,executable+(process.platform==='win32'?'.exe':'')))){
  console.error('ECOAMIGOS_TEST_PG_BIN debe señalar binarios PostgreSQL. No se permite omitir regresiones de BD.');process.exit(1);
 }
}
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'ecoamigos-suite-'));
const env={...process.env,NODE_ENV:'test',JWT_SECRET:'ci-and-local-test-only-not-a-real-secret',CLIENT_URL:'http://localhost:5173',CORS_ORIGINS:'http://localhost:5173',
 DB_HOST:'127.0.0.1',DB_PORT:'1',DB_USER:'not_an_application_account',DB_PASSWORD:'test-only',DB_NAME:'not_an_application_database',DATABASE_URL:'',DB_SSL:'false',
 LOG_DIR:path.join(temporary,'logs'),UPLOAD_ROOT:path.join(temporary,'uploads')};
// Individual suites inject their disposable databases. Accidental application Pool gets port 1, never a real DB.
const tests=fs.readdirSync(path.join(root,side,'tests')).filter(name=>name.endsWith('.test.js')).sort().map(name=>path.join(root,side,'tests',name));
const result=spawnSync(process.execPath,['--test','--test-concurrency=2',...tests],{cwd:root,env,stdio:'inherit',windowsHide:true});
process.exit(result.status??1);
