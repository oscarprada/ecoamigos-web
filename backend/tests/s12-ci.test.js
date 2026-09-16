import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../../',import.meta.url));
test('S12 YAML y contrato CI se validan con parser real',()=>{
 const result=spawnSync(process.execPath,['scripts/check-workflow.mjs'],{cwd:root,encoding:'utf8',windowsHide:true});assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/YAML y contrato/);
});
test('S12 runner rechaza ausencia de PostgreSQL en lugar de omitir migraciones',()=>{
 const result=spawnSync(process.execPath,['scripts/run-tests.mjs','backend'],{cwd:root,env:{...process.env,ECOAMIGOS_TEST_PG_BIN:''},encoding:'utf8',windowsHide:true});assert.equal(result.status,1);assert.match(result.stderr,/No se permite omitir/);
});
test('S12 probe de servicio CI no conecta fuera de GitHub',()=>{
 const result=spawnSync(process.execPath,['scripts/check-ci-postgres.mjs'],{cwd:root,env:{...process.env,CI:'false',GITHUB_ACTIONS:'false'},encoding:'utf8',windowsHide:true});assert.notEqual(result.status,0);assert.match(result.stderr,/Solo servicio efímero/);
});
