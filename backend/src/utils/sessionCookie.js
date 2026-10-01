export const SESSION_COOKIE = 'ecoamigos_session';
export const SESSION_SECONDS = 8 * 60 * 60;
export const sessionCookieOptions = () => ({
  httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/api',
});
export function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, { ...sessionCookieOptions(), maxAge: SESSION_SECONDS * 1000 });
}
export function clearSessionCookie(res) { res.clearCookie(SESSION_COOKIE, sessionCookieOptions()); }
export function readSessionCookie(req) {
  const header = req.headers.cookie;
  if (typeof header !== 'string') return null;
  const matches = header.split(';').map(value => value.trim()).filter(value => value.startsWith(SESSION_COOKIE + '='));
  if (matches.length !== 1) return null;
  try { return decodeURIComponent(matches[0].slice(SESSION_COOKIE.length + 1)); } catch { return null; }
}
