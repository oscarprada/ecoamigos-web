import { Link } from 'react-router-dom';
import mascota from '../../assets/cleoecoamigos.png';

export default function HomePage() {
  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <div style={styles.heroText}>
              <p style={styles.badge}>CAMPAÑA ECOAMIGOS</p>

              <h2 style={styles.slogan}>
                ¡Pequeñas acciones, grandes cambios!
              </h2>

              <p style={styles.description}>
                Bienvenidos/as a la plataforma de sostenibilidad de la DTPA.
                Aquí aprenderás prácticas diarias para optimizar el uso del
                agua, la energía y el papel, y a gestionar correctamente
                nuestros residuos para transformar nuestro entorno.
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
        </div>
      </section>

      <section style={styles.educationSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionKicker}>
            EDUCACIÓN AMBIENTAL
          </p>

          <p style={styles.sectionIntroTitle}>
            ¡Tú eres parte del cambio!
          </p>

          <p style={styles.sectionText}>
            Explora los programas de gestión ambiental y descubre cómo tus
            decisiones diarias transforman nuestro entorno. Selecciona una
            sección para aprender tips, consejos y prácticas sostenibles que
            nos permiten optimizar el uso de nuestros recursos y asegurar que
            cada acción cuenta.
          </p>
        </div>

        <div style={styles.cards}>
          <Link to="/educacion/energia" style={styles.cardLink}>
            <article style={styles.card}>
              <div style={styles.iconCircle}>⚡</div>

              <h4 style={styles.cardTitle}>
                Uso Eficiente de Energía
              </h4>

              <p style={styles.cardText}>
                Cada kilovatio cuenta, usa solo lo necesario.
              </p>
            </article>
          </Link>

          <Link to="/educacion/agua" style={styles.cardLink}>
            <article style={styles.card}>
              <div style={styles.iconCircle}>💧</div>

              <h4 style={styles.cardTitle}>
                Ahorro y Uso Eficiente del Agua
              </h4>

              <p style={styles.cardText}>
                El agua es vida, no la desperdicies.
              </p>
            </article>
          </Link>

          <Link to="/educacion/residuos" style={styles.cardLink}>
            <article style={styles.card}>
              <div style={styles.iconCircle}>♻️</div>

              <h4 style={styles.cardTitle}>
                Gestión Integral de Residuos
              </h4>

              <p style={styles.cardText}>
                Separa y dispone los residuos de forma adecuada.
              </p>
            </article>
          </Link>

          <Link to="/educacion/papel" style={styles.cardLink}>
            <article style={styles.card}>
              <div style={styles.iconCircle}>📄</div>

              <h4 style={styles.cardTitle}>
                Uso Responsable del Papel
              </h4>

              <p style={styles.cardText}>
                Menos papel, más bosques: piensa antes de imprimir.
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
      'linear-gradient(180deg, #eef7f2 0%, #f6f8f7 100%)',
    overflow: 'hidden',
  },

  heroOverlay: {
    background:
      'radial-gradient(circle at top right, rgba(44,171,135,0.10), transparent 40%)',
  },

  heroContent: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '52px 32px 36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '40px',
    flexWrap: 'wrap',
  },

  heroText: {
    flex: '1 1 460px',
    maxWidth: '620px',
  },

  badge: {
    display: 'inline-block',
    margin: '0 0 16px 0',
    color: '#2cab87',
    fontSize: '15px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },

  slogan: {
    margin: '0 0 18px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: 'clamp(28px, 3.4vw, 38px)',
    lineHeight: 1.1,
    color: '#000000',
    fontWeight: 800,
    maxWidth: '540px',
  },

  description: {
    margin: 0,
    fontSize: 'clamp(15px, 2vw, 18px)',
    lineHeight: 1.7,
    color: '#2f2f2f',
    maxWidth: '580px',
  },

  heroImageWrapper: {
    flex: '1 1 420px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mascota: {
    width: '100%',
    maxWidth: '620px',
    height: 'auto',
    objectFit: 'contain',
    display: 'block',
    filter: 'drop-shadow(0 10px 28px rgba(0,0,0,0.08))',
    mixBlendMode: 'multiply',
  },

  educationSection: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '54px 32px 72px',
  },

  sectionHeader: {
    marginBottom: '30px',
  },

  sectionKicker: {
    margin: '0 0 12px 0',
    color: '#2cab87',
    fontSize: '14px',
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },

  sectionIntroTitle: {
    margin: '0 0 14px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '30px',
    color: '#000000',
    fontWeight: 800,
  },

  sectionText: {
    margin: 0,
    fontSize: '17px',
    lineHeight: 1.7,
    color: '#444444',
    maxWidth: '860px',
  },

  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '22px',
    marginTop: '34px',
  },

  cardLink: {
    textDecoration: 'none',
    color: '#000000',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid #e8ece9',
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.05)',
    minHeight: '230px',
    transition: 'all 0.25s ease',
  },

  iconCircle: {
    width: '62px',
    height: '62px',
    borderRadius: '50%',
    backgroundColor: '#eef8f3',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '30px',
    marginBottom: '20px',
  },

  cardTitle: {
    margin: '0 0 14px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '24px',
    color: '#000000',
    fontWeight: 800,
    lineHeight: 1.2,
  },

  cardText: {
    margin: 0,
    fontSize: '16px',
    lineHeight: 1.7,
    color: '#4b4b4b',
  },
};