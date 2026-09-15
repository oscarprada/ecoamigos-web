export function corsOptions(env = process.env) {
  const origins = (env.CORS_ORIGINS || 'http://localhost:5173').split(',').map(value => value.trim()).filter(Boolean);
  if (origins.some(origin => { try { return new URL(origin).origin !== origin || !/^https?:/.test(origin); } catch { return true; } })) {
    throw new Error('Invalid CORS_ORIGINS');
  }
  return { origin: origins, credentials: false, exposedHeaders: ['Retry-After'] };
}
export function configureProxy(app, env = process.env) {
  // Exact trusted proxy IPs/subnets, never unconditional trust in X-Forwarded-For.
  if (env.TRUSTED_PROXIES) app.set('trust proxy', env.TRUSTED_PROXIES.split(',').map(value => value.trim()));
}
export function controlledError(error, req, res, next) {
  if (res.headersSent) return next(error);
  if (error.type === 'entity.parse.failed') return res.status(400).json({ message: 'Solicitud inválida' });
  if (error.type === 'entity.too.large') return res.status(413).json({ message: 'Solicitud demasiado grande' });
  return res.status(500).json({ message: 'Error interno del servidor' });
}
