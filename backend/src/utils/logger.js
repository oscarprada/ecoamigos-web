import fs from 'node:fs/promises';
import path from 'node:path';

const events = new Set([
  'APPLICATION_EVENT','SERVER_STARTED','DATABASE_POOL_ERROR','EXPORT_ERROR',
  'DASHBOARD_ERROR','LIST_USERS_ERROR','CREATE_USER_ERROR','USER_CREATED',
  'LIST_TEAMS_ERROR','CREATE_TEAM_ERROR','TEAM_CREATED','LIST_PERIODS_ERROR',
  'CREATE_PERIOD_ERROR','PERIOD_CREATED','LIST_CONTENT_ERROR','RECYCLING_CREATED',
  'CREATE_RECYCLING_ERROR','LIST_MY_RECORDS_ERROR','LIST_PENDING_RECORDS_ERROR',
  'REVIEW_INVALID','REVIEW_NOT_FOUND','RECORD_REVIEWED','REVIEW_RECORD_ERROR','LIST_REVIEWED_RECORDS_ERROR',
]);
// Deliberate allowlist, not a regex applied to arbitrary error messages or nested payloads.
export function sanitizeContext(context) {
  const output = {};
  if (!context || typeof context !== 'object') return output;
  for (const key of ['actor_id','record_id','entity_id','team_id']) {
    const value = Object.getOwnPropertyDescriptor(context,key)?.value;
    if (Number.isSafeInteger(value) && value > 0 && value <= 2147483647) output[key] = value;
  }
  const status = Object.getOwnPropertyDescriptor(context,'status')?.value;
  if (['approved','rejected'].includes(status)) output.status = status;
  return output;
}
export function loggerOptions(env = process.env) {
  const integer = (name, fallback, maximum) => {
    const raw = env[name] ?? String(fallback);
    if (!/^\d+$/.test(raw) || Number(raw)<1 || Number(raw)>maximum) throw Error('Configuración de logs inválida');
    return Number(raw);
  };
  if (env.LOG_DIR !== undefined && !env.LOG_DIR.trim()) throw Error('Configuración de logs inválida');
  return { directory: path.resolve(env.LOG_DIR ?? 'logs'), maxBytes: integer('LOG_MAX_BYTES',5242880,104857600),
    files: integer('LOG_MAX_FILES',5,20), queueLimit: integer('LOG_QUEUE_LIMIT',1000,10000) };
}
export function createLogger({directory, maxBytes, files, queueLimit}, io = fs) {
  let tail = Promise.resolve(), pending = 0, warned = false;
  const target = index => path.join(directory, 'ecoamigos-tech' + (index ? '.'+index : '') + '.jsonl');
  const fallback = () => {
    if (!warned) { warned = true; try { console.error('TECH_LOG_UNAVAILABLE'); } catch {} }
  };
  async function statSafe(file) {
    try {
      const stat = await io.lstat(file);
      if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1) throw Error('Unsafe log file');
      return stat;
    } catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  }
  async function write(line) {
    await io.mkdir(directory,{recursive:true,mode:0o700});
    const dir = await io.lstat(directory);
    if (!dir.isDirectory() || dir.isSymbolicLink()) throw Error('Unsafe log directory');
    const current = await statSafe(target(0));
    if (current && current.size + Buffer.byteLength(line) > maxBytes) {
      // Inspect every owned slot before modifying any. Never enumerate/delete arbitrary files.
      const slots = [];
      for (let i=1;i<=files;i++) slots[i] = await statSafe(target(i));
      if (slots[files]) await io.unlink(target(files));
      for (let i=files-1;i>=1;i--) if (slots[i]) await io.rename(target(i),target(i+1));
      await io.rename(target(0),target(1));
    }
    await io.appendFile(target(0),line,{encoding:'utf8',mode:0o600});
  }
  function log(level, event, context) {
    try {
      if (pending >= queueLimit) { fallback(); return Promise.resolve(false); }
      const entry = {time:new Date().toISOString(),level,event:events.has(event)?event:'APPLICATION_EVENT',...sanitizeContext(context)};
      const line = JSON.stringify(entry)+'\n';
      if (Buffer.byteLength(line)>maxBytes) { fallback(); return Promise.resolve(false); }
      pending++;
      const task = tail.then(()=>write(line)).then(()=>true,()=>{fallback();return false;}).finally(()=>{pending--;});
      tail = task; return task;
    } catch { fallback(); return Promise.resolve(false); }
  }
  return { info:(event,context)=>log('info',event,context), warn:(event,context)=>log('warn',event,context),
    error:(event,context)=>log('error',event,context), flush:()=>tail };
}
// Lazy creation avoids filesystem effects merely by importing controllers.
let singleton;
function emit(level,event,context) {
  try { singleton ??= createLogger(loggerOptions()); return singleton[level](event,context); }
  catch { return Promise.resolve(false); }
}
export const logInfo = (event,context) => emit('info',event,context);
export const logWarn = (event,context) => emit('warn',event,context);
export const logError = (event,context) => emit('error',event,context);
export const flushLogs = () => singleton?.flush() ?? Promise.resolve();
