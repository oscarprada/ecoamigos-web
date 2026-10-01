import { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import parquesLogo from '../assets/parques-logo.png';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);
  const menuButtonRef = useRef(null);
  const navRef = useRef(null);
  const focusDesktopNav = useRef(false);
  const location = useLocation();

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');
    const update = () => {
      const active = document.activeElement;
      if (media.matches && navRef.current?.contains(active)) menuButtonRef.current?.focus();
      if (!media.matches && active === menuButtonRef.current) focusDesktopNav.current = true;
      setIsMobile(media.matches); setMenuOpen(false);
    };
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!isMobile && focusDesktopNav.current) {
      navRef.current?.querySelector('a')?.focus();
      focusDesktopNav.current = false;
    }
  }, [isMobile]);

  useEffect(() => {
    setMenuOpen(false);
    if (window.matchMedia('(max-width: 768px)').matches && navRef.current?.contains(document.activeElement)) {
      menuButtonRef.current?.focus();
    }
  }, [location.key]);

  const closeMenu = () => {
    setMenuOpen(false);
    if (isMobile && navRef.current?.contains(document.activeElement)) menuButtonRef.current?.focus();
  };

  const handleMenuKey = e => {
    if (isMobile && menuOpen && e.key === 'Escape') {
      e.preventDefault(); e.stopPropagation(); closeMenu(); menuButtonRef.current?.focus();
    }
  };

  const handleLogout = async () => {
    if (await logout() === false) return;
    closeMenu();
    navigate('/');
  };

  return (
    <div className="site-page">
      <header className="site-header">
        <div className="site-headerContent" onKeyDown={handleMenuKey}>
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
            ref={menuButtonRef}
            aria-label={menuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? 'Cerrar' : 'Menú'}
          </button>

          <nav
            ref={navRef}
            id="site-navigation"
            aria-label="Navegación principal"
            hidden={isMobile && !menuOpen}
            className={`site-nav${menuOpen ? " site-navOpen" : ""}`}
          >
            {(!isMobile || menuOpen) && <>
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
            </>}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}
