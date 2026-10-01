import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { setSessionCookie, clearSessionCookie, SESSION_SECONDS } from '../utils/sessionCookie.js';

// Valid bcrypt hash with cost 10; keeps missing/inactive accounts on the comparison path.
const DUMMY_HASH = '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
export async function login(req, res) {
  const { email, password } = req.body || {};
  const invalid = () => res.status(401).json({ message: 'Credenciales inválidas' });
  if (typeof email !== 'string' || email.length > 150 || typeof password !== 'string' ||
      !password.length || Buffer.byteLength(password, 'utf8') > 72) return invalid();
  try {
    const { rows } = await query(
      'SELECT u.id, u.name, u.email, u.password_hash, u.role, u.is_active, u.team_id, u.session_version, t.name AS team_name FROM users u LEFT JOIN teams t ON t.id = u.team_id WHERE u.email = $1', [email]);
    const user = rows[0];
    const valid = await bcrypt.compare(password, user?.password_hash || DUMMY_HASH);
    if (!user?.is_active || !valid) return invalid();
    const token = jwt.sign({ id: user.id, sv: user.session_version }, process.env.JWT_SECRET,
      { algorithm: 'HS256', expiresIn: SESSION_SECONDS });
    const { password_hash, is_active, session_version, ...publicUser } = user;
    setSessionCookie(res, token);
    res.set('Cache-Control', 'no-store');
    return res.json({ message: 'Inicio de sesión exitoso', user: publicUser });
  } catch {
    return res.status(500).json({ message: 'Error al iniciar sesión' });
  }
}
export function me(req, res) { return res.set('Cache-Control', 'no-store').json(req.user); }
export function logout(req, res) {
  clearSessionCookie(res);
  return res.set('Cache-Control', 'no-store').json({ message: 'Sesión cerrada' });
}
