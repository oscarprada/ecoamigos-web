function positive(value, fallback, name) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error('Invalid configuration: ' + name);
  return parsed;
}
// Fixed windows per IP, separately for each sensitive endpoint. No permanent lockout.
export function createAuthRateLimit({ max, windowMs, now = Date.now, capacity = 10000 }) {
  const entries = new Map();
  return (req, res, next) => {
    const time = now();
    for (const [key, entry] of entries) if (entry.until <= time) entries.delete(key);
    const key = req.ip || req.socket?.remoteAddress || 'unknown';
    let entry = entries.get(key);
    if (!entry && entries.size < capacity) {
      entry = { count: 0, until: time + windowMs }; entries.set(key, entry);
    }
    if (!entry || entry.count >= max) {
      res.set('Retry-After', String(Math.max(1, Math.ceil(((entry?.until || time + windowMs) - time) / 1000))));
      return res.status(429).json({ message: 'Demasiados intentos. Intenta de nuevo más tarde.' });
    }
    entry.count++;
    next();
  };
}
export function authRateLimit(endpoint) {
  const defaults = { LOGIN: 10, FORGOT: 5, RESET: 10 };
  const max = positive(process.env['AUTH_' + endpoint + '_MAX'], defaults[endpoint], 'AUTH_' + endpoint + '_MAX');
  const windowMs = positive(process.env.AUTH_WINDOW_MS, 15 * 60 * 1000, 'AUTH_WINDOW_MS');
  return createAuthRateLimit({ max, windowMs });
}
