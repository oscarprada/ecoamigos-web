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
              Bienvenido a la plataforma interna de Ecoamigos. Aquí podrás
              aprender buenas prácticas de reciclaje, consultar el ranking de
              equipos y fortalecer la cultura ambiental de la Dirección
              Territorial Pacífico.
            </p>

            <div style={styles.buttons}>
              <a href="/ranking" style={styles.linkReset}>
                <button style={styles.primaryButton}>Ver Ranking</button>
              </a>

              <a href="/login" style={styles.linkReset}>
                <button style={styles.secondaryButton}>Iniciar Sesión</button>
              </a>
            </div>
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
          <h3 style={styles.sectionTitle}>Aprende a reciclar correctamente</h3>
          <p style={styles.sectionText}>
            Consulta recomendaciones básicas para separar residuos y aportar al
            cuidado del entorno en la entidad.
          </p>
        </div>

        <div style={styles.cards}>
          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Papel y cartón</h4>
            <p style={styles.cardText}>
              Deposítalos limpios, secos y sin restos de comida, grasa o líquidos.
            </p>
          </div>

          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Plástico</h4>
            <p style={styles.cardText}>
              Usa envases vacíos, limpios y secos. Aplasta las botellas para reducir volumen.
            </p>
          </div>

          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Vidrio</h4>
            <p style={styles.cardText}>
              Entrégalo vacío, limpio y seco para facilitar su aprovechamiento.
            </p>
          </div>

          <div style={styles.card}>
            <h4 style={styles.cardTitle}>Metales</h4>
            <p style={styles.cardText}>
              Lava bien las latas y recipientes, retira residuos y evita guardarlos mojados.
            </p>
          </div>
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
    padding: '56px 32px 48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '40px',
  },

  heroText: {
    flex: 1,
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
    fontSize: '54px',
    lineHeight: 1.05,
    color: '#000000',
    fontWeight: 800,
  },

  description: {
    margin: '0 0 28px 0',
    fontSize: '18px',
    lineHeight: 1.6,
    color: '#2f2f2f',
    maxWidth: '580px',
  },

  buttons: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
  },

  linkReset: {
    textDecoration: 'none',
  },

  primaryButton: {
    backgroundColor: '#71b956',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 22px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(113, 185, 86, 0.25)',
  },

  secondaryButton: {
    backgroundColor: '#2cab87',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '14px 22px',
    fontSize: '15px',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(44, 171, 135, 0.22)',
  },

  heroImageWrapper: {
    flex: '0 0 360px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mascota: {
    width: '340px',
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
    fontSize: '32px',
    color: '#000000',
    fontWeight: 800,
  },

  sectionText: {
    margin: 0,
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#444444',
    maxWidth: '700px',
  },

  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginTop: '26px',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '24px',
    border: '1px solid #e8ece9',
    boxShadow: '0 10px 24px rgba(0, 0, 0, 0.05)',
  },

  cardTitle: {
    margin: '0 0 12px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '22px',
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

