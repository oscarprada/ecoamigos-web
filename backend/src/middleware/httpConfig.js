export function clientOrigin(env = process.env) {
  const development = env.NODE_ENV === undefined || env.NODE_ENV === 'development';
  const value = env.CLIENT_URL ?? (development ? 'http://localhost:5173' : '');
  try {
    const url = new URL(value);
    if (url.origin !== value || !['http:', 'https:'].includes(url.protocol) ||
        (env.NODE_ENV === 'production' && url.protocol !== 'https:')) throw new Error();
  } catch { throw new Error('Configuración CORS inválida: CLIENT_URL debe ser un origen exacto'); }
  // Old deployments may still set this variable; never silently permit extra origins.
  if (env.CORS_ORIGINS !== undefined && env.CORS_ORIGINS.trim() !== value) {
    throw new Error('Configuración CORS inválida: CORS_ORIGINS debe retirarse o coincidir con CLIENT_URL');
  }
  return value;
}
export function corsOptions(env = process.env) {
  const allowed = clientOrigin(env);
  return {
    origin(origin, callback) {
      if (!origin || origin === allowed) return callback(null, true);
      const error = new Error('Origen no permitido'); error.code = 'CORS_ORIGIN_DENIED';
      callback(error);
    },
    credentials: true,
    methods: ['GET','HEAD','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','X-Ecoamigos-Request'],
    exposedHeaders: ['Retry-After'],
  };
}
export function csrfProtection(env = process.env) {
  const allowed = clientOrigin(env);
  return (req, res, next) => {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    if (req.headers.origin !== allowed || req.headers['x-ecoamigos-request'] !== '1') {
      return res.status(403).json({ message: 'Origen o verificación de solicitud inválidos' });
    }
    next();
  };
}
export function configureProxy(app, env = process.env) {
  // Exact trusted proxy IPs/subnets, never unconditional trust in X-Forwarded-For.
  if (env.TRUSTED_PROXIES) app.set('trust proxy', env.TRUSTED_PROXIES.split(',').map(value => value.trim()));
}
export function controlledError(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.code === 'CORS_ORIGIN_DENIED') return res.status(403).json({ message: 'Origen no permitido' });
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Solicitud inválida' });
  if (error.type === 'entity.too.large') return res.status(413).json({ message: 'Solicitud demasiado grande' });
  return res.status(500).json({ message: 'Error interno del servidor' });
}
