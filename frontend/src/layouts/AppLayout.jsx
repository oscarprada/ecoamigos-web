import { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import parquesLogo from '../assets/parques-logo.png';
import { useAuth } from '../context/AuthContext';

export default function AppLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() =>
    window.matchMedia('(max-width: 768px)').matches
  );
  const menuButtonRef = useRef(null);
  const navRef = useRef(null);
  const focusDesktopNav = useRef(false);
  const location = useLocation();

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px)');

    const update = () => {
      const active = document.activeElement;

      if (media.matches && navRef.current?.contains(active)) {
        menuButtonRef.current?.focus();
      }

      if (!media.matches && active === menuButtonRef.current) {
        focusDesktopNav.current = true;
      }

      setIsMobile(media.matches);
      setMenuOpen(false);
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

    if (
      window.matchMedia('(max-width: 768px)').matches &&
      navRef.current?.contains(document.activeElement)
    ) {
      menuButtonRef.current?.focus();
    }
  }, [location.key]);

  const closeMenu = () => {
    setMenuOpen(false);

    if (isMobile && navRef.current?.contains(document.activeElement)) {
      menuButtonRef.current?.focus();
    }
  };

  const handleMenuKey = (e) => {
    if (isMobile && menuOpen && e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeMenu();
      menuButtonRef.current?.focus();
    }
  };

  const handleLogout = async () => {
    if (await logout() === false) return;

    closeMenu();
    navigate('/');
  };

  const pathname = location.pathname || '';
  const isActive = (path) => pathname === path;
  const isContentActive =
    pathname.startsWith('/educacion/') &&
    !pathname.startsWith('/educacion/juegos');

  return (
    <div className="site-page">
      <header className="site-header">
        <div className="site-headerContent" onKeyDown={handleMenuKey}>
          <Link
            to="/"
            className="site-brandBlock"
            onClick={closeMenu}
            aria-label="Ir al inicio"
          >
            <img
              src={parquesLogo}
              alt="Parques Nacionales Naturales de Colombia"
              className="site-logo"
            />

            <div className="site-brandText">
              <span className="site-brandName">Ecoamigos</span>
              <p className="site-subtitle">Dirección Territorial Pacífico</p>
            </div>
          </Link>

          <button
            type="button"
            className="site-menuButton"
            ref={menuButtonRef}
            aria-label={
              menuOpen
                ? 'Cerrar menú de navegación'
                : 'Abrir menú de navegación'
            }
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
            className={`site-nav${menuOpen ? ' site-navOpen' : ''}`}
          >
            {(!isMobile || menuOpen) && (
              <>
                <Link
                  to="/"
                  className={`site-link${
                    isActive('/') ? ' site-linkActive' : ''
                  }`}
                  onClick={closeMenu}
                >
                  Inicio
                </Link>

                <details
                  className={`site-navGroup${
                    isContentActive ? ' site-navGroupActive' : ''
                  }`}
                >
                  <summary>Contenido multimedia</summary>

                  <div className="site-submenu">
                    <Link to="/educacion/agua" onClick={closeMenu}>
                      Agua
                    </Link>

                    <Link to="/educacion/energia" onClick={closeMenu}>
                      Energía
                    </Link>

                    <Link to="/educacion/papel" onClick={closeMenu}>
                      Papel
                    </Link>

                    <Link to="/educacion/residuos" onClick={closeMenu}>
                      Residuos
                    </Link>
                  </div>
                </details>

                <Link
                  to="/educacion/juegos"
                  className={`site-link${
                    pathname.startsWith('/educacion/juegos')
                      ? ' site-linkActive'
                      : ''
                  }`}
                  onClick={closeMenu}
                >
                  Actividades
                </Link>

                <Link
                  to="/ranking"
                  className={`site-link${
                    isActive('/ranking') ? ' site-linkActive' : ''
                  }`}
                  onClick={closeMenu}
                >
                  Ranking
                </Link>

                {user ? (
                  <>
                    <Link
                      to={user.role === 'admin' ? '/admin' : '/leader'}
                      className="site-panelButton"
                      onClick={closeMenu}
                    >
                      Mi panel
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="site-logoutButton"
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="site-panelButton"
                    onClick={closeMenu}
                  >
                    Ingresar
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}
