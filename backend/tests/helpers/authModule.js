// Loads actual auth middleware with only its database connection replaced.
// Never imports config/db.js or reads application .env.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
export async function authModuleUrl(pool) {
  let source = fs.readFileSync(new URL('../../src/middleware/authMiddleware.js', import.meta.url), 'utf8');
  source = source.replace("import { query } from '../config/db.js';", 'const database = globalThis.__isolatedAuthPool; const query = (...args) => database.query(...args);');
  source = source.replace("'jsonwebtoken'", () => JSON.stringify(pathToFileURL(require.resolve('jsonwebtoken')).href));
  globalThis.__isolatedAuthPool = pool;
  const url = 'data:text/javascript;base64,' + Buffer.from(source).toString('base64');
  try { await import(url); return url; } finally { delete globalThis.__isolatedAuthPool; }
}
