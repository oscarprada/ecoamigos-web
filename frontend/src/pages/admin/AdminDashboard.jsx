import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    teams: 0,
    records: 0,
    pending: 0,
  });

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data));
  }, []);

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <p style={styles.kicker}>Administración Ecoamigos</p>
        <h2 style={styles.title}>Panel de administración</h2>
        <p style={styles.description}>
          Gestiona usuarios, contenidos educativos, validaciones de reciclaje,
          equipos, periodos y premios de la campaña.
        </p>
      </section>

      <section style={styles.statsGrid}>
        <StatCard title="Usuarios" value={stats.users} />
        <StatCard title="Equipos" value={stats.teams} />
        <StatCard title="Registros" value={stats.records} />
        <StatCard title="Pendientes" value={stats.pending} />
      </section>

      <section style={styles.quickGrid}>
        <QuickCard
          title="Validar reciclajes"
          text="Revisar evidencias, aprobar registros y asignar puntos."
          to="/admin/reviews"
        />

        <QuickCard
          title="Usuarios"
          text="Crear líderes y administradores, asignados a equipos."
          to="/admin/users"
        />

        <QuickCard
          title="Contenidos educativos"
          text="Subir textos, imágenes, videos y archivos por categoría ambiental."
          to="/admin/content"
        />

        <QuickCard
          title="Configuración"
          text="Gestionar equipos, periodos activos y premios."
          to="/admin/settings"
        />
      </section>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <article style={styles.statCard}>
      <span style={styles.statLabel}>{title}</span>
      <strong style={styles.statValue}>{value ?? 0}</strong>
    </article>
  );
}

function QuickCard({ title, text, to }) {
  return (
    <Link to={to} style={styles.quickCard}>
      <h3 style={styles.quickTitle}>{title}</h3>
      <p style={styles.quickText}>{text}</p>
      <span style={styles.quickAction}>Abrir módulo →</span>
    </Link>
  );
}

const styles = {
  page: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '42px 32px 72px',
    fontFamily: 'Montserrat, sans-serif',
  },
  header: {
    marginBottom: '28px',
  },
  kicker: {
    margin: 0,
    color: '#2cab87',
    fontSize: '13px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
  },
  title: {
    margin: '8px 0 10px',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '40px',
    color: '#000000',
  },
  description: {
    margin: 0,
    maxWidth: '760px',
    color: '#444',
    lineHeight: 1.6,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
    gap: '18px',
    marginBottom: '26px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #dfe7e2',
    borderRadius: '20px',
    padding: '22px',
    boxShadow: '0 10px 24px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statLabel: {
    color: '#5d6a63',
    fontSize: '13px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  statValue: {
    color: '#71b956',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '40px',
    lineHeight: 1,
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '18px',
  },
  quickCard: {
    textDecoration: 'none',
    backgroundColor: '#ffffff',
    border: '1px solid #dfe7e2',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 10px 24px rgba(0,0,0,0.05)',
    color: '#000000',
  },
  quickTitle: {
    margin: '0 0 10px',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '24px',
    color: '#000000',
  },
  quickText: {
    margin: '0 0 18px',
    color: '#444',
    lineHeight: 1.6,
  },
  quickAction: {
    color: '#2cab87',
    fontWeight: 800,
  },
};


