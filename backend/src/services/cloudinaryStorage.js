import fs from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { cloudinaryOptions } from '../config/storageOptions.js';
import { extension, formats, FileError } from './fileFormats.js';

const functionalityFolders = ['recycling', 'garden', 'education'];
const resourceFor = kind => kind === 'file' ? 'raw' : kind;
const sign = (params, secret) => createHash('sha256').update(Object.keys(params).sort().map(key => key + '=' + params[key]).join('&') + secret).digest('hex');

export function createCloudinaryStorage({ env = process.env, transport } = {}) {
  const { cloud, key, secret, folder } = cloudinaryOptions(env);
  const request = async (url, options) => {
    // Test mode can only use an explicitly injected fake; never real credentials/network.
    if (env.NODE_ENV === 'test' && !transport) throw new Error('Cloudinary requiere transporte simulado en pruebas');
    return (transport || globalThis.fetch)(url, { ...options, redirect: 'error', signal: options.signal || AbortSignal.timeout(120000) });
  };
  const reference = value => {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com' || url.port || url.username || url.password || url.search || url.hash) throw Error();
      const prefix = '/' + cloud + '/';
      if (!url.pathname.startsWith(prefix)) throw Error();
      const [resource, type, version, ...segments] = url.pathname.slice(prefix.length).split('/');
      const idWithExtension = segments.join('/');
      const ext = extension(idWithExtension);
      const format = formats[ext];
      const root = folder + '/';
      if (type !== 'authenticated' || !/^v\d+$/.test(version) || !format || resource !== resourceFor(format.kind) || !idWithExtension.startsWith(root)) throw Error();
      const remaining = idWithExtension.slice(root.length);
      const [functionality, filename, extra] = remaining.split('/');
      if (!functionalityFolders.includes(functionality) || extra || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.[a-z0-9]+$/.test(filename)) throw Error();
      return { resource, ext, suffix: version + '/' + idWithExtension,
        publicId: resource === 'raw' ? idWithExtension : idWithExtension.slice(0, -(ext.length + 1)) };
    } catch { throw new FileError(404, 'Archivo no encontrado'); }
  };
  const apiRequest = async (resource, action, params, blob, name, headers = {}) => {
    const signed = { ...params, timestamp: String(Math.floor(Date.now() / 1000)) };
    const body = new FormData();
    for (const [name, value] of Object.entries(signed)) body.set(name, String(value));
    body.set('api_key', key); body.set('signature', sign(signed, secret));
    if (blob) body.set('file', blob, name);
    const response = await request('https://api.cloudinary.com/v1_1/' + cloud + '/' + resource + '/' + action, { method: 'POST', body, headers });
    if (!response.ok) { await response.body?.cancel(); throw new Error('Operación Cloudinary fallida'); }
    return response.json();
  };
  const destroy = async (resource, publicId) => {
    // Retry transient failures without ever emitting provider errors, URLs or credentials.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await apiRequest(resource, 'destroy', { public_id: publicId, type: 'authenticated', invalidate: 'true' });
        if (!['ok', 'not found'].includes(result.result)) throw Error();
        return;
      } catch { if (attempt === 2) throw new Error('No fue posible limpiar el archivo remoto'); }
    }
  };
  return {
    reference,
    async persist(file, functionality) {
      if (!functionalityFolders.includes(functionality)) throw new Error('Funcionalidad de almacenamiento inválida');
      const ext = extension(file.filename), format = formats[ext];
      if (!format) throw new Error('Formato inválido');
      const resource = resourceFor(format.kind);
      const publicId = folder + '/' + functionality + '/' + randomUUID() + (resource === 'raw' ? '.' + ext : '');
      // Own the descriptor explicitly: no lazy file-backed Blob can outlive the
      // request and race the removal of its private temporary file (notably on Windows).
      const handle = await fs.open(file.path, 'r');
      try {
        const { size } = await handle.stat();
        const chunkSize = 20 * 1024 * 1024;
        const uploadId = randomUUID();
        let result;
        for (let offset = 0; offset < size; offset += chunkSize) {
          const end = Math.min(offset + chunkSize, size), bytes = Buffer.alloc(end - offset);
          let read = 0;
          while (read < bytes.length) {
            const part = await handle.read(bytes, read, bytes.length - read, offset + read);
            if (!part.bytesRead) throw new Error('Archivo temporal incompleto');
            read += part.bytesRead;
          }
          const headers = size > chunkSize ? { 'X-Unique-Upload-Id': uploadId, 'Content-Range': `bytes ${offset}-${end - 1}/${size}` } : {};
          result = await apiRequest(resource, 'upload', { public_id: publicId, type: 'authenticated', overwrite: 'false' }, new Blob([bytes], { type: format.mime }), file.filename, headers);
        }
        const saved = reference(result?.secure_url);
        if (saved.publicId !== publicId || saved.resource !== resource || saved.ext !== ext || result.public_id !== publicId) throw Error();
        return result.secure_url;
      } catch {
        try { await destroy(resource, publicId); } catch { console.error('FILE_CLEANUP_PENDING'); }
        throw new Error('No fue posible almacenar el archivo remoto');
      } finally { await handle.close(); }
    },
    async remove(url) {
      const { resource, publicId } = reference(url);
      await destroy(resource, publicId);
    },
    async open(url, { range, signal } = {}) {
      const ref = reference(url);
      if (range && !/^bytes=\d*-\d*$/.test(range)) throw new FileError(416, 'Rango inválido');
      // Authenticated delivery is signed only on the server and proxied, never redirected.
      const signature = createHash('sha256').update(ref.suffix + secret).digest('base64url').slice(0, 8);
      const signedUrl = 'https://res.cloudinary.com/' + cloud + '/' + ref.resource + '/authenticated/s--' + signature + '--/' + ref.suffix;
      const response = await request(signedUrl, { method: 'GET', headers: range ? { Range: range } : {}, signal });
      if (![200, 206].includes(response.status) || !response.body) {
        await response.body?.cancel();
        throw new FileError(response.status === 404 ? 404 : response.status === 416 ? 416 : 502, 'No fue posible obtener el archivo');
      }
      return { ext: ref.ext, response };
    },
  };
}
