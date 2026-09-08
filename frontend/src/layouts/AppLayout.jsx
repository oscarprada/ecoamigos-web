import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import parquesLogo from '../assets/parques-logo.png';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };

  return (
    <div className="site-page">
      <header className="site-header">
        <div className="site-headerContent">
          <Link to="/" className="site-brandBlock" onClick={closeMenu}>
            <img
              src={parquesLogo}
              alt="Parques Nacionales Naturales de Colombia"
              className="site-logo"
            />

            <div className="site-brandText">
              <h1 className="site-title">
                Parques Nacionales Naturales de Colombia
              </h1>

              <p className="site-subtitle">
                Dirección Territorial Pacífico
              </p>
            </div>
          </Link>

          <button
            type="button"
            className="site-menuButton"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? 'Cerrar' : 'Menú'}
          </button>

          <nav
            className={`site-nav${menuOpen ? " site-navOpen" : ""}`}
          >
            <Link to="/" className="site-link" onClick={closeMenu}>
              Inicio
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/leader'}
                  className="site-panelButton"
                  onClick={closeMenu}
                >
                  {user.role === 'admin'
                    ? 'Panel admin'
                    : 'Panel líder'}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="site-logoutButton"
                >
                  Cerrar sesión
                </button>
              </>
            ) : null}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}
