import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div>
        <h1>Ecoamigos</h1>
        <small>Parques Nacionales Naturales de Colombia - DTPA</small>
      </div>
      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/ranking">Ranking</Link>
        <Link to="/winners">Ganadores</Link>
        <Link to="/prizes">Premios</Link>
        {user?.role === 'leader' && <Link to="/leader">Panel líder</Link>}
        {user?.role === 'admin' && <Link to="/admin">Administración</Link>}
        {!user ? <Link to="/login">Ingresar</Link> : <button className="link-btn" onClick={logout}>Salir</button>}
      </nav>
    </header>
  );
}
