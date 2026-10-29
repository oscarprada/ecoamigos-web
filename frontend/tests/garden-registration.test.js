import test from 'node:test';
import assert from 'node:assert/strict';
import { registerGardenCrop } from '../src/pages/public/gardenRegistration.js';

test('foto inicial fallida se reintenta con el mismo cultivo y siempre como seguimiento', async () => {
  const fields = new FormData();
  fields.set('bed', 'Era fixture'); fields.set('description', 'Descripción fixture'); fields.append('vegetables', 'tomate');
  fields.set('initial_date', '2026-10-13'); fields.set('evidence', new Blob(['fixture'], { type: 'image/png' }), 'fixture.png');
  let crop, creations = 0, uploads = 0;
  const api = { post: async (url, payload) => {
    if (url === '/garden') { creations++; return { data: { id: 17, ...payload } }; }
    uploads++; assert.equal(url, '/garden/17/evidence'); assert.ok(payload instanceof FormData);
    assert.equal(payload.get('stage'), 'seguimiento'); assert.equal(payload.get('period_id'), '1');
    assert.equal(payload.get('story'), 'Descripción fixture'); assert.equal(payload.get('evidence').name, 'fixture.png');
    if (uploads === 1) throw new Error('Fixture upload failure');
    return { data: { id: 33, status: 'pending', points_awarded: 0 } };
  } };
  const onCreated = value => { crop = value; };
  await assert.rejects(registerGardenCrop({ api, fields, onCreated, period: { id: 1 } }));
  assert.equal(crop.id, 17);
  await registerGardenCrop({ api, fields, crop, onCreated, period: { id: 1 } });
  assert.equal(creations, 1); assert.equal(uploads, 2);
});
test('registro sin foto conserva la opción de añadir evidencias después', async () => {
  const fields = new FormData(); fields.set('bed', 'Fixture'); fields.set('description', 'Fixture'); fields.append('vegetables', 'tomate');
  const urls = [];
  await registerGardenCrop({ api: { post: async (url, payload) => { urls.push(url); return { data: { id: 1, ...payload } }; } }, fields, onCreated() {}, period: null });
  assert.deepEqual(urls, ['/garden']);
});
