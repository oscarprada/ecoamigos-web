import { Outlet, Link, useNavigate } from 'react-router-dom';
import parquesLogo from '../assets/parques-logo.png';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.brandBlock}>
            <img src={parquesLogo} alt="Parques Nacionales Naturales de Colombia" style={styles.logo} />

            <div style={styles.brandText}>
              <p style={styles.kicker}>CAMPAÑA INTERNA ECOAMIGOS</p>
              <h1 style={styles.title}>
                Parques Nacionales Naturales de Colombia – Dirección Territorial Pacífico
              </h1>
            </div>
          </div>

          <nav style={styles.nav}>
            <Link to="/" style={styles.link}>Inicio</Link>
            <Link to="/ranking" style={styles.link}>Ranking</Link>
            <Link to="/winners" style={styles.link}>Ganadores</Link>
            <Link to="/prizes" style={styles.link}>Premios</Link>

            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/leader'} style={styles.panelButton}>
                  {user.role === 'admin' ? 'Panel admin' : 'Panel líder'}
                </Link>
                <button type="button" onClick={handleLogout} style={styles.logoutButton}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link to="/login" style={styles.loginButton}>Ingresar</Link>
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
    padding: '16px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
  },
  brandBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    minWidth: 0,
    flex: 1,
  },
  logo: {
    width: '120px',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    flexShrink: 0,
  },
  brandText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    minWidth: 0,
  },
  kicker: {
    margin: 0,
    color: '#2cab87',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '0.8px',
    textTransform: 'uppercase',
  },
  title: {
    margin: 0,
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '18px',
    lineHeight: 1.2,
    color: '#000000',
    fontWeight: 800,
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    flexShrink: 0,
  },
  link: {
    textDecoration: 'none',
    color: '#000000',
    fontSize: '15px',
    fontWeight: 600,
  },
  loginButton: {
    textDecoration: 'none',
    backgroundColor: '#71b956',
    color: '#ffffff',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 700,
  },
  panelButton: {
    textDecoration: 'none',
    backgroundColor: '#2cab87',
    color: '#ffffff',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 700,
  },
  logoutButton: {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
  },
  main: {
    paddingTop: 0,
  },
};




