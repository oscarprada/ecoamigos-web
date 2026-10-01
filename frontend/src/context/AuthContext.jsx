import { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../api/client';
import { advanceSession, removeLegacyCredential, clearSession, onSessionRejected } from '../api/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const generation = useRef(0);
  const operations = useRef(Promise.resolve());
  const serialize = operation => {
    const pending = operations.current.then(operation, operation);
    operations.current = pending.catch(() => {});
    return pending;
  };
  const [authError, setAuthError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const revision = generation.current;
    const stop = onSessionRejected(() => {
      generation.current++;
      setUser(null); setLoading(false);
      setAuthError('La sesión terminó. Inicia sesión nuevamente.');
    });
    removeLegacyCredential();
    api.get('/auth/me')
      .then(({ data }) => { if (active && revision === generation.current) setUser(data); })
      .catch(error => { if (active && revision === generation.current) {
        setUser(null);
        // A visitor without a cookie is normal, not an expired-session alert.
        if (error.response?.status !== 401) setAuthError('No fue posible verificar la sesión. Inicia sesión nuevamente.');
      } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; stop(); };
  }, []);

  const login = async (email, password) => {
    const revision = ++generation.current;
    advanceSession();
    const { data } = await serialize(() => api.post('/auth/login', { email, password }));
    if (revision !== generation.current) throw new Error('Session operation superseded');
    advanceSession();
    setUser(data.user); setAuthError('');
    return data.user;
  };

  const logout = async () => {
    const revision = ++generation.current;
    advanceSession();
    try {
      await serialize(() => api.post('/auth/logout'));
      if (revision !== generation.current) return false;
      clearSession();
      setUser(null); setAuthError('');
      return true;
    } catch {
      if (revision === generation.current) setAuthError('No fue posible cerrar la sesión. Intenta nuevamente.');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {authError && <p role="alert" className="container error">{authError}</p>}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
