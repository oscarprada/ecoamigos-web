import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

// One current-user lookup per protected request; JWT role/team are never authority.
export function createAuthenticateToken(runQuery) {
  return async function authenticateToken(req, res, next) {
    const header = req.headers.authorization;
    const token = typeof header === 'string' && /^Bearer [^ ]+$/i.test(header) ? header.slice(7) : null;
    const reject = () => res.status(401).json({ message: 'Sesión inválida o expirada' });
    if (!token) return reject();
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      if (!Number.isInteger(decoded.id) || decoded.id <= 0 || decoded.id > 2147483647 ||
          !Number.isInteger(decoded.sv) || decoded.sv < 0) return reject();
    } catch { return reject(); }
    try {
      const { rows } = await runQuery(
        'SELECT u.id, u.name, u.email, u.role, u.team_id, u.is_active, u.session_version, t.name AS team_name FROM users u LEFT JOIN teams t ON t.id = u.team_id WHERE u.id = $1',
        [decoded.id]);
      const user = rows[0];
      if (!user?.is_active || user.session_version !== decoded.sv) return reject();
      const { session_version, is_active, ...currentUser } = user;
      req.user = currentUser;
    } catch { return res.status(500).json({ message: 'No fue posible verificar la sesión' }); }
    next();
  };
}
export const authenticateToken = createAuthenticateToken(query);

export function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'No tienes permisos para esta acción' });
    }
    next();
  };
}
