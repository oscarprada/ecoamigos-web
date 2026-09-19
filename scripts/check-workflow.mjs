import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require=createRequire(new URL('../backend/package.json',import.meta.url));const YAML=require('yaml');
const text=fs.readFileSync(new URL('../.github/workflows/ci.yml',import.meta.url),'utf8');
const doc=YAML.parseDocument(text,{uniqueKeys:true});assert.equal(doc.errors.length,0,doc.errors.map(error=>error.message).join('\n'));const ci=doc.toJS();
assert.deepEqual(ci.on.push.branches,['main']);assert.deepEqual(ci.on.pull_request.branches,['main']);assert.deepEqual(ci.permissions,{contents:'read'});
const job=ci.jobs.quality;assert.equal(job.services.postgres.image,'postgres:18');assert.match(job.services.postgres.options,/pg_isready/);assert.deepEqual(job.services.postgres.ports,['55432:5432']);assert.equal(job.env.NODE_ENV,'test');assert.equal(job.env.JWT_SECRET,'fake_ci_only_jwt_secret');
for(const command of ['npm ci --prefix backend','npm ci --prefix frontend','node scripts/check-ci-postgres.mjs','npm test --prefix backend','npm test --prefix frontend','npm run build --prefix frontend','npm run check'])assert.ok(job.steps.some(step=>step.run===command),command);
for(const name of ['backend','frontend']){const p=JSON.parse(fs.readFileSync(new URL('../'+name+'/package.json',import.meta.url)));assert.ok(p.scripts.test);assert.ok(fs.existsSync(new URL('../'+name+'/package-lock.json',import.meta.url)));}
assert.doesNotMatch(text,/pull_request_target|secrets\.|continue-on-error|audit fix|deploy/i);
assert.ok(ci.jobs['dependency-audit'].steps.some(step=>step.run==='node scripts/dependency-risk-report.mjs'));
assert.ok(ci.jobs['dependency-audit'].steps.some(step=>step.uses==='actions/upload-artifact@v4' && step.if==='always()'));
for(const job of Object.values(ci.jobs))for(const step of job.steps){if(step.uses)assert.match(step.uses,/^actions\/(?:(checkout|setup-node)@v7\.|upload-artifact@v4$)/);if(step['working-directory'])assert.ok(fs.existsSync(new URL('../'+step['working-directory'],import.meta.url)));}
console.log('YAML y contrato de CI válidos; esta comprobación local no consulta ejecuciones remotas.');
