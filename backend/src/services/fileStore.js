import path from 'node:path';
import fs from 'node:fs/promises';
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
export async function removeStored(url) {
  try { await fs.unlink(await safeStoredPath(url)); return true; }
  catch (error) { if (error.code === 'ENOENT') return true; cleanupWarning(); return false; }
}
// Check both relations, including legacy shared references; DB outage retains the file.
export async function cleanupUnused(url, runQuery) {
  if (!url) return;
  try {
    storedPath(url);
    const { rows } = await runQuery(
      'SELECT EXISTS(SELECT 1 FROM content_items WHERE file_url=$1 UNION ALL SELECT 1 FROM recycling_records WHERE evidence_url=$1) AS referenced', [url]);
    if (!rows[0].referenced) await removeStored(url);
  } catch { cleanupWarning(); }
}
