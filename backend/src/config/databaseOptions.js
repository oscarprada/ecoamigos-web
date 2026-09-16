// Pure configuration: no dotenv, pool construction or network access.
export function databaseOptions(env = process.env) {
  const invalid = () => { throw new Error('Configuración PostgreSQL inválida'); };
  const required = value => typeof value === 'string' && value.trim() ? value : invalid();
  const port = value => {
    if (value === undefined || value === '') return 5432;
    if (!/^\d+$/.test(String(value)) || Number(value)<1 || Number(value)>65535) invalid();
    return Number(value);
  };
  let config;
  if (env.DATABASE_URL !== undefined && env.DATABASE_URL !== '') {
    try {
      const url = new URL(env.DATABASE_URL);
      // One TLS authority: DB_SSL. URL query options must not override it in pg.
      if (!['postgres:', 'postgresql:'].includes(url.protocol) || url.search || url.hash) invalid();
      config = { host: required(url.hostname).replace(/^\[|\]$/g,''), port: port(url.port),
        user: required(decodeURIComponent(url.username)), password: required(decodeURIComponent(url.password)),
        database: required(decodeURIComponent(url.pathname.slice(1))) };
      if (config.database.includes('/')) invalid();
    } catch { invalid(); }
  } else {
    config = { host: required(env.DB_HOST), port: port(env.DB_PORT), user: required(env.DB_USER),
      password: required(env.DB_PASSWORD), database: required(env.DB_NAME) };
  }
  const ssl = env.DB_SSL ?? 'false';
  if (!['true','false'].includes(ssl)) invalid();
  if (env.NODE_TLS_REJECT_UNAUTHORIZED === '0') invalid();
  config.ssl = ssl === 'true' ? { rejectUnauthorized: true } : false;
  return config;
}
