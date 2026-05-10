import { Link } from 'react-router-dom';
import mascota from '../../assets/ecoamigos-mascota.png';

export default function HomePage() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroText}>
            <p style={styles.badge}>Ecoamigos</p>

            <h2 style={styles.slogan}>¡Pequeñas acciones, grandes cambios!</h2>

            <p style={styles.description}>
              Bienvenidos a la plataforma Ecoamigos. Aquí podrás
              aprender prácticas sostenibles para optimizar el consumo de agua, la energía eléctrica, el papel
              y la adecuada disposición de los residuos en la Dirección Territorial Pacífico.
            </p>
          </div>

          <div style={styles.heroImageWrapper}>
            <img
              src={mascota}
              alt="Mascota Ecoamigos"
              style={styles.mascota}
            />
          </div>
        </div>
      </section>

      <section style={styles.educationSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionKicker}>Educación ambiental</p>
          <h3 style={styles.sectionTitle}>Centro de educación ambiental</h3>
          <p style={styles.sectionText}>
            Consulta información institucional sobre buenas prácticas ambientales.
            Encontrarás contenido escrito, imágenes y videos cargados por la
            administración de la plataforma.
          </p>
        </div>

        <div style={styles.cards}>
          <Link to="/educacion/energia" style={styles.cardLink}>
            <article style={styles.card}>
              <div style={styles.iconCircle}>⚡</div>
              <h4 style={styles.cardTitle}>Uso eficiente de la energía</h4>
              <p style={styles.cardText}>
                Recomendaciones para reducir el consumo energético y fomentar
                hábitos responsables en la entidad.
              </p>
            </article>
          </Link>

          <Link to="/educacion/agua" style={styles.cardLink}>
            <article style={styles.card}>
              <div style={styles.iconCircle}>💧</div>
              <h4 style={styles.cardTitle}>Uso eficiente del agua</h4>
              <p style={styles.cardText}>
                Información para promover el ahorro, cuidado y uso responsable
                del recurso hídrico.
              </p>
            </article>
          </Link>

          <Link to="/educacion/residuos" style={styles.cardLink}>
            <article style={styles.card}>
              <div style={styles.iconCircle}>♻️</div>
              <h4 style={styles.cardTitle}>Gestión integral de residuos</h4>
              <p style={styles.cardText}>
                Contenidos sobre separación, disposición y manejo adecuado de
                residuos sólidos.
              </p>
            </article>
          </Link>

          <Link to="/educacion/papel" style={styles.cardLink}>
            <article style={styles.card}>
              <div style={styles.iconCircle}>📄</div>
              <h4 style={styles.cardTitle}>Uso eficiente del papel</h4>
              <p style={styles.cardText}>
                Buenas prácticas para reducir el consumo de papel y mejorar su
                aprovechamiento institucional.
              </p>
            </article>
          </Link>
        </div>
      </section>
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

  hero: {
    background:
      'linear-gradient(135deg, rgba(113, 185, 86, 0.12) 0%, rgba(44, 171, 135, 0.10) 100%)',
  },

  heroContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '48px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '32px',
    flexWrap: 'wrap',
  },

  heroText: {
    flex: '1 1 420px',
    maxWidth: '650px',
  },

  badge: {
    display: 'inline-block',
    margin: '0 0 18px 0',
    padding: '8px 14px',
    borderRadius: '999px',
    backgroundColor: '#e8f5ef',
    color: '#2cab87',
    fontSize: '14px',
    fontWeight: 700,
  },

  slogan: {
    margin: '0 0 18px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: 'clamp(38px, 5vw, 54px)',
    lineHeight: 1.05,
    color: '#000000',
    fontWeight: 800,
  },

  description: {
    margin: 0,
    fontSize: 'clamp(15px, 2vw, 18px)',
    lineHeight: 1.6,
    color: '#2f2f2f',
    maxWidth: '580px',
  },

  heroImageWrapper: {
    flex: '0 1 300px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto',
  },

  mascota: {
    width: 'clamp(190px, 28vw, 260px)',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
  },

  educationSection: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '54px 32px 72px',
  },

  sectionHeader: {
    marginBottom: '28px',
  },

  sectionKicker: {
    margin: '0 0 8px 0',
    color: '#2cab87',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.7px',
    textTransform: 'uppercase',
  },

  sectionTitle: {
    margin: '0 0 10px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: 'clamp(28px, 4vw, 34px)',
    color: '#000000',
    fontWeight: 800,
  },

  sectionText: {
    margin: 0,
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#444444',
    maxWidth: '760px',
  },

  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '28px',
  },

  cardLink: {
    textDecoration: 'none',
    color: '#000000',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '26px',
    border: '1px solid #e8ece9',
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.05)',
    minHeight: '210px',
  },

  iconCircle: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    backgroundColor: '#eef8f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26px',
    marginBottom: '18px',
  },

  cardTitle: {
    margin: '0 0 12px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '23px',
    color: '#000000',
    fontWeight: 800,
  },

  cardText: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.6,
    color: '#4b4b4b',
  },
};

