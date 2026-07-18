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
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link to="/" style={styles.brandBlock} onClick={closeMenu}>
            <img
              src={parquesLogo}
              alt="Parques Nacionales Naturales de Colombia"
              style={styles.logo}
            />

           <div style={styles.brandText}>
            <h1 style={styles.title}>
              Parques Nacionales Naturales de Colombia
            </h1>

            <p style={styles.subtitle}>
              Dirección Territorial Pacífico
            </p>
          </div>
          </Link>

          <button
            type="button"
            style={styles.menuButton}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? 'Cerrar' : 'Menú'}
          </button>

          <nav
            style={{
              ...styles.nav,
              ...(menuOpen ? styles.navOpen : {}),
            }}
          >
            <Link to="/" style={styles.link} onClick={closeMenu}>
              Inicio
            </Link>

            <Link to="/ranking" style={styles.link} onClick={closeMenu}>
              Ranking
            </Link>

            <Link to="/winners" style={styles.link} onClick={closeMenu}>
              Ganadores
            </Link>

            <Link to="/prizes" style={styles.link} onClick={closeMenu}>
              Premios
            </Link>

            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/leader'}
                  style={styles.panelButton}
                  onClick={closeMenu}
                >
                  {user.role === 'admin' ? 'Panel admin' : 'Panel líder'}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  style={styles.logoutButton}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" style={styles.loginButton} onClick={closeMenu}>
                Ingresar
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f6f8f7',
    fontFamily: 'Montserrat, sans-serif',
    color: '#000000',
  },
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #dfe7e2',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
  },
  headerContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '12px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '36px',
    flexWrap: 'wrap',
  },
  brandBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    minWidth: 0,
    flex: '0 1 620px',
    textDecoration: 'none',
    color: '#000000',
  },
  logo: {
    width: '96px',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    flexShrink: 0,
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  title: {
    margin: 0,
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '15px',
    lineHeight: 1.2,
    color: '#000000',
    fontWeight: 800,
    maxWidth: '520px',

    subtitle: {
  margin: '2px 0 0',
  fontFamily: 'Nunito Sans, sans-serif',
  fontSize: '15px',
  lineHeight: 1.2,
  color: '#000000',
  fontWeight: 800,
},
  },
  menuButton: {
    display: 'none',
    backgroundColor: '#2cab87',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    flex: '1 1 auto',
  },
  navOpen: {
    display: 'flex',
  },
  link: {
    textDecoration: 'none',
    color: '#000000',
    fontSize: '15px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  loginButton: {
    textDecoration: 'none',
    backgroundColor: '#71b956',
    color: '#ffffff',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  panelButton: {
    textDecoration: 'none',
    backgroundColor: '#2cab87',
    color: '#ffffff',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  logoutButton: {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
    whiteSpace: 'nowrap',
  },
  main: {
    paddingTop: 0,
  },
};




