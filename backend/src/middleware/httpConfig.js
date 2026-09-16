export function corsOptions(env = process.env) {
  if (env.CORS_ORIGINS === undefined && env.CLIENT_URL?.includes(',')) throw new Error('Configuración CORS inválida');
  const configured = env.CORS_ORIGINS ?? env.CLIENT_URL;
  const value = configured ?? (env.NODE_ENV === 'production' ? '' : 'http://localhost:5173');
  const origins = value.split(',').map(origin => origin.trim());
  if (!origins.length || origins.some(origin => {
    try { return !origin || new URL(origin).origin !== origin || !/^https?:/.test(origin); }
    catch { return true; }
  })) throw new Error('Configuración CORS inválida');
  return {
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) return callback(null, true);
      const error = new Error('Origen no permitido'); error.code = 'CORS_ORIGIN_DENIED';
      callback(error);
    },
    credentials: false,
    methods: ['GET','HEAD','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type','Authorization'],
    exposedHeaders: ['Retry-After'],
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
