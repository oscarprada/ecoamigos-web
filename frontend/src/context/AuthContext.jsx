import { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../api/client';
import { getToken, saveToken, clearSession, onSessionRejected } from '../api/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const generation = useRef(0);
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
    const token = getToken();
    if (!token) setLoading(false);
    else api.get('/auth/me')
      .then(({ data }) => { if (active && revision === generation.current && token === getToken()) setUser(data); })
      .catch(() => { if (active && revision === generation.current) {
        setUser(null); setAuthError('No fue posible verificar la sesión. Inicia sesión nuevamente.');
      } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; stop(); };
  }, []);

  const login = async (email, password) => {
    const revision = ++generation.current;
    const { data } = await api.post('/auth/login', { email, password });
    if (revision !== generation.current) throw new Error('Session operation superseded');
    saveToken(data.token);
    setUser(data.user); setAuthError('');
    return data.user;
  };

  const logout = () => {
    clearSession();
    generation.current++;
    setUser(null); setAuthError('');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {authError && <p role="alert" className="container error">{authError}</p>}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
