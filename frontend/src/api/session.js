const listeners = new Set();
let revision = 0;
export const sessionRevision = () => revision;
export function advanceSession() { return ++revision; }
export function clearSession(expected = revision) {
  if (expected !== revision) return;
  revision++;
  for (const listener of listeners) listener();
}
// One-way cleanup of the old credential. Never read or store it again.
export function removeLegacyCredential() {
  try { localStorage.removeItem('ecoamigos_token'); } catch { /* Storage may be disabled. */ }
}
export function onSessionRejected(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function attachSessionInterceptors(api) {
  api.interceptors.request.use(config => {
    config.sessionRevision = revision;
    config.headers = config.headers || {};
    if (!['get', 'head', 'options'].includes((config.method || 'get').toLowerCase())) {
      config.headers['X-Ecoamigos-Request'] = '1';
    }
    return config;
  });
  api.interceptors.response.use(response => response, error => {
    if (error.response?.status === 401 && error.config?.sessionRevision === revision &&
        !/\/auth\/(login|forgot-password|reset-password|me)$/.test(error.config?.url || '')) clearSession(revision);
    return Promise.reject(error);
  });
}
