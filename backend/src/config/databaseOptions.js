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
  let urlRequiresSSL = false;
  let channelBinding = false;
  if (env.DATABASE_URL !== undefined && env.DATABASE_URL !== '') {
    try {
      const url = new URL(env.DATABASE_URL);
      // Parse known Neon options ourselves; pg must never replace verified TLS.
      if (!['postgres:', 'postgresql:'].includes(url.protocol) || url.hash) invalid();
      for (const key of url.searchParams.keys()) {
        if (!['sslmode', 'channel_binding'].includes(key) || url.searchParams.getAll(key).length !== 1) invalid();
      }
      const sslmode = url.searchParams.get('sslmode');
      if (sslmode !== null && !['require', 'verify-full'].includes(sslmode)) invalid();
      const binding = url.searchParams.get('channel_binding');
      if (binding !== null && binding !== 'require') invalid();
      urlRequiresSSL = sslmode !== null || binding !== null;
      channelBinding = binding === 'require';
      config = { host: required(url.hostname).replace(/^\[|\]$/g,''), port: port(url.port),
        user: required(decodeURIComponent(url.username)), password: required(decodeURIComponent(url.password)),
        database: required(decodeURIComponent(url.pathname.slice(1))) };
      if (config.database.includes('/')) invalid();
    } catch { invalid(); }
  } else {
    config = { host: required(env.DB_HOST), port: port(env.DB_PORT), user: required(env.DB_USER),
      password: required(env.DB_PASSWORD), database: required(env.DB_NAME) };
  }
  const ssl = env.DB_SSL ?? (urlRequiresSSL || env.NODE_ENV === 'production' ? 'true' : 'false');
  if (!['true','false'].includes(ssl)) invalid();
  if (urlRequiresSSL && ssl !== 'true') invalid();
  if (env.NODE_TLS_REJECT_UNAUTHORIZED === '0') invalid();
  config.ssl = ssl === 'true' ? { rejectUnauthorized: true } : false;
  if (channelBinding) config.enableChannelBinding = true;
  return config;
}
