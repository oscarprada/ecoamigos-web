import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import cors from 'cors';
import { setSessionCookie, clearSessionCookie, readSessionCookie } from '../src/utils/sessionCookie.js';
import { corsOptions, csrfProtection, controlledError } from '../src/middleware/httpConfig.js';

test('S02 cookie host-only, HttpOnly y Secure en producción; logout conserva atributos', async () => {
  const old = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  const app = express();
  app.get('/set', (_req, res) => { setSessionCookie(res, 'fixture'); res.end(); });
  app.post('/clear', (_req, res) => { clearSessionCookie(res); res.end(); });
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    const issued = (await fetch(base + '/set')).headers.get('set-cookie');
    const cleared = (await fetch(base + '/clear', { method: 'POST' })).headers.get('set-cookie');
    for (const value of [issued, cleared]) {
      for (const flag of ['HttpOnly', 'Secure', 'SameSite=Lax', 'Path=/api']) assert.ok(value.includes(flag));
      assert.doesNotMatch(value, /Domain=/);
    }
    assert.match(issued, /Max-Age=28800/);
    assert.match(cleared, /Expires=Thu, 01 Jan 1970/);
  } finally {
    if (old === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = old;
    await new Promise(resolve => server.close(resolve));
  }
});

test('S02 cookie ausente, duplicada o mal codificada se rechaza', () => {
  for (const cookie of [undefined, 'other=x', 'ecoamigos_session=%ZZ', 'ecoamigos_session=a; ecoamigos_session=b']) {
    assert.equal(readSessionCookie({headers:{cookie}}), null);
  }
  assert.equal(readSessionCookie({headers:{cookie:'other=x; ecoamigos_session=fixture'}}), 'fixture');
});

test('S02 CSRF protege JSON y multipart, login/logout/reset y otros métodos mutantes', async () => {
  const env = { CLIENT_URL: 'https://app.example.test', NODE_ENV: 'production' };
  const app = express(); let writes = 0;
  app.use(cors(corsOptions(env))); app.use('/api', csrfProtection(env));
  app.all('/api/*', (_req, res) => { writes++; res.json({ok:true}); }); app.use(controlledError);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const base = 'http://127.0.0.1:' + server.address().port;
    for (const method of ['POST','PUT','PATCH','DELETE']) {
      for (const resource of ['/auth/login','/auth/logout','/auth/reset-password','/recycling']) {
        for (const headers of [{}, {Origin:'null'}, {Origin:env.CLIENT_URL},
          {Origin:'https://evil.example.test','X-Ecoamigos-Request':'1'},
          {Origin:env.CLIENT_URL,'Content-Type':'multipart/form-data; boundary=test'}]) {
          const before = writes;
          const response = await fetch(base+'/api'+resource,{method,headers});
          assert.equal(response.status,403); assert.equal(writes,before);
        }
        const allowed = await fetch(base+'/api'+resource,{method,headers:{Origin:env.CLIENT_URL,'X-Ecoamigos-Request':'1'}});
        assert.equal(allowed.status,200); assert.equal(allowed.headers.get('access-control-allow-credentials'),'true');
        assert.equal(allowed.headers.get('access-control-allow-origin'),env.CLIENT_URL);
      }
    }
    assert.throws(() => corsOptions({...env,CLIENT_URL:'http://app.example.test'}));
    assert.throws(() => corsOptions({...env,CORS_ORIGINS:'https://evil.example.test'}));
  } finally { await new Promise(resolve => server.close(resolve)); }
});
