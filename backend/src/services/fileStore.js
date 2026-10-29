import path from 'node:path';
import fs from 'node:fs/promises';
import { storageOptions, cloudinaryOptions } from '../config/storageOptions.js';
import { createCloudinaryStorage } from './cloudinaryStorage.js';
import { extension, FileError } from './fileFormats.js';
export const uploadsRoot = () => path.resolve(process.env.UPLOAD_ROOT || 'uploads');
export function storedPath(url) {
  if (typeof url !== 'string' || !/^\/uploads\/(?:content\/|managed\/(?:content|evidence)\/)?[^/\\:%\x00-\x1f]+$/.test(url)) throw Error('Unsafe file reference');
  const name = url.split('/').at(-1);
  if (name.startsWith('.')) throw Error('Unsafe file reference');
  return path.join(uploadsRoot(), ...url.slice('/uploads/'.length).split('/'));
}
export async function safeStoredPath(url) {
  const filename = storedPath(url);
  const root = await fs.realpath(uploadsRoot());
  let segmentPath = uploadsRoot();
  for (const segment of path.relative(uploadsRoot(), filename).split(path.sep)) {
    segmentPath = path.join(segmentPath, segment);
    if ((await fs.lstat(segmentPath)).isSymbolicLink()) throw Error('Unsafe file reference');
  }
  const real = await fs.realpath(filename);
  const relative = path.relative(root, real);
  if (relative.startsWith('..') || path.isAbsolute(relative) || (await fs.lstat(filename)).isSymbolicLink()) throw Error('Unsafe file reference');
  if (!(await fs.stat(real)).isFile()) throw Error('Not a file');
  return real;
}
export const cleanupWarning = () => { try { console.error('FILE_CLEANUP_PENDING'); } catch {} };
async function removeLocal(url) {
  try { await fs.unlink(await safeStoredPath(url)); return true; }
  catch (error) { if (error.code === 'ENOENT') return true; cleanupWarning(); return false; }
}
// Provider selection affects new uploads only. Existing references select their own reader.
export function createStorage({ env = process.env, transport } = {}) {
  const { provider } = storageOptions(env);
  if (provider === 'cloudinary') cloudinaryOptions(env);
  const cloud = () => createCloudinaryStorage({ env, transport });
  return {
    provider,
    async persist(file, functionality) { return provider === 'local' ? file.url : cloud().persist(file, functionality); },
    async remove(url) {
      if (typeof url === 'string' && url.startsWith('https://')) {
        try { await cloud().remove(url); return true; } catch { cleanupWarning(); return false; }
      }
      return removeLocal(url);
    },
    async open(url, options) {
      if (typeof url === 'string' && url.startsWith('https://')) return cloud().open(url, options);
      try { const filename = await safeStoredPath(url); return { filename, ext: extension(filename) }; }
      catch { throw new FileError(404, 'Archivo no encontrado'); }
    },
  };
}
export async function removeStored(url) { return createStorage().remove(url); }
// Check both relations, including legacy shared references; DB outage retains the file.
export async function cleanupUnused(url, runQuery, storage = createStorage()) {
  if (!url) return;
  try {
    // Also protect photos belonging to a group; old databases may lack garden tables.
    const garden = await runQuery("SELECT to_regclass('garden_evidence') IS NOT NULL AS garden");
    const { rows } = await runQuery(
      garden.rows[0]?.garden
        ? 'SELECT EXISTS(SELECT 1 FROM content_items WHERE file_url=$1 UNION ALL SELECT 1 FROM recycling_records WHERE evidence_url=$1 UNION ALL SELECT 1 FROM garden_evidence WHERE evidence_url=$1) AS referenced'
        : 'SELECT EXISTS(SELECT 1 FROM content_items WHERE file_url=$1 UNION ALL SELECT 1 FROM recycling_records WHERE evidence_url=$1) AS referenced', [url]);
    if (!rows[0].referenced) await storage.remove(url);
  } catch { cleanupWarning(); }
}

// New UUID references are private to the current upload until COMMIT. A known failure
// can compensate directly even if the database is unavailable. Ambiguous COMMITs must
// first check references: never delete a file that may already belong to saved data.
export async function cleanupUncommitted(url, runQuery, { commitAttempted = false, storage = createStorage() } = {}) {
  if (!url) return;
  if (commitAttempted) return cleanupUnused(url, runQuery, storage);
  await storage.remove(url);
}
