import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

export const cloudTestEnv = { NODE_ENV: 'test', STORAGE_PROVIDER: 'cloudinary', CLOUDINARY_CLOUD_NAME: 'fixture-cloud',
  CLOUDINARY_API_KEY: '123456789000000', CLOUDINARY_API_SECRET: 'synthetic-test-only-not-a-real-secret', CLOUDINARY_FOLDER: 'ecoamigos' };

// No network: an in-memory implementation of the signed Upload API and delivery URLs.
export function cloudinaryFake() {
  const assets = new Map(), calls = [], chunks = new Map();
  let destroyFailures = 0, uploadFailures = 0, badUploadUrl = false;
  const transport = async (value, options) => {
    const url = new URL(value);
    assert.equal(options.redirect, 'error');
    if (url.hostname === 'api.cloudinary.com') {
      assert.equal(options.method, 'POST');
      const [, , cloud, resource, action] = url.pathname.split('/');
      assert.equal(cloud, cloudTestEnv.CLOUDINARY_CLOUD_NAME);
      const params = Object.fromEntries([...options.body.entries()].filter(([name]) => !['file','api_key','signature'].includes(name)));
      const expected = createHash('sha256').update(Object.keys(params).sort().map(key => key + '=' + params[key]).join('&') + cloudTestEnv.CLOUDINARY_API_SECRET).digest('hex');
      assert.equal(options.body.get('signature'), expected); assert.equal(options.body.get('api_key'), cloudTestEnv.CLOUDINARY_API_KEY);
      assert.equal(params.type, 'authenticated');
      calls.push({ action, resource, publicId: params.public_id, params, headers: options.headers });
      const id = resource + '/' + params.public_id;
      if (action === 'destroy') {
        if (destroyFailures-- > 0) return new Response('{}', { status: 503 });
        return Response.json({ result: assets.delete(id) ? 'ok' : 'not found' });
      }
      assert.equal(action, 'upload'); assert.equal(params.overwrite, 'false');
      if (uploadFailures-- > 0) return new Response('{}', { status: 503 });
      const file = options.body.get('file'), ext = file.name.split('.').at(-1);
      const bytes = Buffer.from(await file.arrayBuffer());
      const range = options.headers?.['Content-Range'];
      if (range) {
        const match = /^bytes (\d+)-(\d+)\/(\d+)$/.exec(range); assert.ok(match);
        const saved = chunks.get(id) || []; saved.push(bytes); chunks.set(id, saved);
        if (Number(match[2]) + 1 < Number(match[3])) return Response.json({ done: false });
        assets.set(id, Buffer.concat(saved)); chunks.delete(id);
      } else assets.set(id, bytes);
      const suffix = params.public_id + (resource === 'raw' ? '' : '.' + ext);
      return Response.json({ public_id: params.public_id, resource_type: resource, type: 'authenticated',
        secure_url: badUploadUrl ? 'https://untrusted.example.invalid/fixture.png' : `https://res.cloudinary.com/${cloud}/` + resource + '/authenticated/v1/' + suffix });
    }
    assert.equal(url.hostname, 'res.cloudinary.com'); assert.equal(options.method, 'GET');
    const parts = url.pathname.split('/');
    const resource = parts[2], signature = parts[4], suffix = parts.slice(5).join('/');
    assert.equal(signature, 's--' + createHash('sha256').update(suffix + cloudTestEnv.CLOUDINARY_API_SECRET).digest('base64url').slice(0, 8) + '--');
    const path = parts.slice(6).join('/'), publicId = resource === 'raw' ? path : path.slice(0, path.lastIndexOf('.'));
    calls.push({ action: 'read', resource, publicId, range: options.headers.Range });
    const bytes = assets.get(resource + '/' + publicId);
    if (!bytes) return new Response('', { status: 404 });
    if (options.headers.Range) return new Response(bytes.subarray(0, 4), { status: 206, headers: { 'Content-Length': '4', 'Content-Range': `bytes 0-3/${bytes.length}`, 'Accept-Ranges': 'bytes' } });
    return new Response(bytes, { headers: { 'Content-Length': String(bytes.length), 'Accept-Ranges': 'bytes' } });
  };
  return { transport, assets, calls, failDestroy: count => { destroyFailures = count; }, failUpload: count => { uploadFailures = count; }, invalidUrl: value => { badUploadUrl = value; } };
}
