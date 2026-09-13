import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authError, setAuthError] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ecoamigos_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then(({ data }) => setUser(data))
      .catch(() => { localStorage.removeItem('ecoamigos_token'); setAuthError('No fue posible verificar la sesión. Inicia sesión nuevamente.'); })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('ecoamigos_token', data.token);
    setUser(data.user); setAuthError('');
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('ecoamigos_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {authError && <p role="alert" className="container error">{authError}</p>}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
