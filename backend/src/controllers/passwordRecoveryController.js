import { randomBytes, createHash } from 'node:crypto';
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import { deliverPasswordReset } from '../services/passwordResetDelivery.js';

export const RECOVERY_MESSAGE = 'Si existe una cuenta asociada, se enviarán instrucciones de recuperación.';
const invalidToken = res => res.status(400).json({ message: 'Enlace de recuperación inválido o vencido' });
const digest = token => createHash('sha256').update(token).digest('hex');
const fields = (body, allowed) => body && typeof body === 'object' && !Array.isArray(body) &&
  Object.keys(body).length === allowed.length && Object.keys(body).every(key => allowed.includes(key));

// Dependency injection lets isolated tests capture delivery in memory only.
// Production routes always use the institutional adapter, never a test sink.
export function createRecoveryHandlers(databasePool, deliver) {
  async function forgotPassword(req, res) {
    const email = req.body?.email;
    if (!fields(req.body, ['email']) || typeof email !== 'string' || email.trim().length > 150 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({ message: 'Email inválido' });
    }
    let client;
    let open = false;
    let releaseError;
    let delivery;
    try {
      client = await databasePool.connect();
      await client.query('BEGIN'); open = true;
      // Same user-first locking order in request/reset. Also serializes F15 edits.
      const user = (await client.query('SELECT id, email, is_active FROM users WHERE email = $1 FOR UPDATE', [email.trim()])).rows[0];
      if (user?.is_active) {
        const token = randomBytes(32).toString('hex');
        await client.query('UPDATE password_reset_tokens SET used_at = clock_timestamp() WHERE user_id = $1 AND used_at IS NULL', [user.id]);
        const row = (await client.query(
          `INSERT INTO password_reset_tokens(user_id, token_hash, expires_at)
           VALUES ($1, $2, clock_timestamp() + INTERVAL '30 minutes') RETURNING expires_at`,
          [user.id, digest(token)])).rows[0];
        delivery = { email: user.email, token, expiresAt: row.expires_at };
      }
      await client.query('COMMIT'); open = false;
    } catch {
      if (open) { try { await client.query('ROLLBACK'); } catch (error) { releaseError = error; } }
      // Same public result even if issuance/delivery fails; never disclose account state.
    } finally { if (client) client.release(releaseError); }
    if (delivery && !open) {
      try { await deliver(delivery); } catch { /* No provider details or token in response/logs. */ }
    }
    return res.json({ message: RECOVERY_MESSAGE });
  }

  async function resetPassword(req, res) {
    const { token, new_password: password } = req.body || {};
    if (!fields(req.body, ['token', 'new_password']) || typeof token !== 'string' || !/^[a-f0-9]{64}$/.test(token) ||
        typeof password !== 'string' || password.length === 0 || Buffer.byteLength(password, 'utf8') > 72) {
      return res.status(400).json({ message: 'Token o contraseña inválidos (contraseña de 1 a 72 bytes UTF-8)' });
    }
    let client;
    let open = false;
    let releaseError;
    try {
      client = await databasePool.connect();
      await client.query('BEGIN'); open = true;
      const hash = digest(token);
      const candidate = (await client.query('SELECT user_id FROM password_reset_tokens WHERE token_hash = $1', [hash])).rows[0];
      const user = candidate && (await client.query('SELECT id, is_active FROM users WHERE id = $1 FOR UPDATE', [candidate.user_id])).rows[0];
      const reset = user?.is_active && (await client.query(
        'SELECT id FROM password_reset_tokens WHERE token_hash = $1 AND used_at IS NULL AND expires_at > clock_timestamp() FOR UPDATE', [hash])).rows[0];
      if (!reset) {
        await client.query('ROLLBACK'); open = false;
        return invalidToken(res);
      }
      const passwordHash = await bcrypt.hash(password, 10);
      // Recheck expiration after hashing while still holding both locks.
      const consumed = await client.query(
        'UPDATE password_reset_tokens SET used_at = clock_timestamp() WHERE id = $1 AND expires_at > clock_timestamp() RETURNING id', [reset.id]);
      if (!consumed.rowCount) {
        await client.query('ROLLBACK'); open = false;
        return invalidToken(res);
      }
      await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [passwordHash, user.id]);
      await client.query('UPDATE password_reset_tokens SET used_at = clock_timestamp() WHERE user_id = $1 AND used_at IS NULL', [user.id]);
      await client.query('COMMIT'); open = false;
      return res.json({ message: 'Contraseña restablecida. Puedes iniciar sesión.' });
    } catch {
      if (open) { try { await client.query('ROLLBACK'); } catch (error) { releaseError = error; } }
      return res.status(500).json({ message: 'No fue posible restablecer la contraseña' });
    } finally { if (client) client.release(releaseError); }
  }
  return { forgotPassword, resetPassword };
}

export const { forgotPassword, resetPassword } = createRecoveryHandlers(pool, deliverPasswordReset);
