import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/client';

const generic = 'Si existe una cuenta asociada, se enviarán instrucciones de recuperación.';

export default function PasswordRecoveryPage({ reset = false }) {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async e => {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      if (reset) {
        const response = await api.post('/auth/reset-password', { token, new_password: password });
        setPassword(''); setDone(true); setMessage(response.data.message);
        // Remove the bearer secret from browser history after successful consumption.
        window.history.replaceState(null, '', '/reset-password');
      } else {
        await api.post('/auth/forgot-password', { email });
        setMessage(generic);
      }
    } catch (err) {
      setMessage(reset ? (err.response?.data?.message || 'No fue posible restablecer la contraseña.') : generic);
    } finally { setBusy(false); }
  };

  return <div className="container narrow">
    <form className="card form" onSubmit={submit}>
      <h2>{reset ? 'Restablecer contraseña' : 'Recuperar contraseña'}</h2>
      {reset ? (!done && token ? <label>Nueva contraseña
        <input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required />
        <span className="helper">Máximo 72 bytes UTF-8; algunos caracteres ocupan más de un byte.</span>
      </label> : !done && <p>Abre un enlace de recuperación válido para continuar.</p>) :
        <label>Correo<input type="email" autoComplete="email" maxLength={150} value={email} onChange={e => setEmail(e.target.value)} required /></label>}
      {message && <p role="status">{message}</p>}
      {!done && (!reset || token) && <button className="button primary" type="submit" disabled={busy}>
        {busy ? 'Procesando...' : reset ? 'Restablecer contraseña' : 'Solicitar recuperación'}
      </button>}
      <Link to="/login">Volver a iniciar sesión</Link>
    </form>
  </div>;
}
