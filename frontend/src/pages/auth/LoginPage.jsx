import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'admin' ? '/admin' : '/leader');
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible iniciar sesión');
    }
  };

  return (
    <div className="container narrow">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>
        <label>Correo
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label>Contraseña
          <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="button primary" type="submit">Ingresar</button>
        <Link className="helper" to="/forgot-password">¿Olvidaste tu contraseña?</Link>
      </form>
    </div>
  );
}
