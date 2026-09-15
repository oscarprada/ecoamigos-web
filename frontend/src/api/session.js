const KEY = 'ecoamigos_token';
const listeners = new Set();
export const getToken = () => localStorage.getItem(KEY);
export function saveToken(token) { localStorage.setItem(KEY, token); }
export function clearSession(expected = getToken()) {
  if (expected !== getToken()) return;
  localStorage.removeItem(KEY);
  for (const listener of listeners) listener();
}
export function onSessionRejected(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export function attachSessionInterceptors(api) {
  api.interceptors.request.use(config => {
    const token = getToken();
    if (token) config.headers.Authorization = 'Bearer ' + token;
    return config;
  });
  api.interceptors.response.use(response => response, error => {
    const sent = error.config?.headers?.Authorization;
    if (error.response?.status === 401 && sent && sent === 'Bearer ' + getToken() &&
        !/\/auth\/(login|forgot-password|reset-password)$/.test(error.config?.url || '')) clearSession(sent.slice(7));
    return Promise.reject(error);
  });
}
