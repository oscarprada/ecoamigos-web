import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { getBackendUrl } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function LeaderDashboard() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    api.get('/recycling/mine').then(({ data }) => setRecords(data || []));
    api.get('/public/ranking').then(({ data }) => setRanking(data.ranking || []));
  }, []);

  const teamStats = useMemo(
    () => ranking.find((r) => Number(r.id) === Number(user?.team_id)),
    [ranking, user]
  );

  const totalPoints = records.reduce(
    (sum, item) => sum + Number(item.points_awarded || 0),
    0
  );

  const pendingCount = records.filter((item) => item.status === 'pending').length;
  const approvedCount = records.filter((item) => item.status === 'approved').length;
  const rejectedCount = records.filter((item) => item.status === 'rejected').length;

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.kicker}>Panel del líder</p>
          <h2 style={styles.title}>Hola, {user?.name}</h2>
          <p style={styles.description}>
            Equipo asignado: <strong>{user?.team_name || 'Sin equipo'}</strong>
          </p>
        </div>

        {user?.role === 'leader' && <Link to="/leader/register" style={styles.primaryButton}>
          Registrar reciclaje
        </Link>}
      </section>

      <section style={styles.statsGrid}>
        <article style={styles.statCard}>
          <span style={styles.statLabel}>Puntaje del equipo</span>
          <strong style={styles.statValue}>
            {Number(teamStats?.total_points ?? teamStats?.score ?? totalPoints ?? 0)}
          </strong>
        </article>

        <article style={styles.statCard}>
          <span style={styles.statLabel}>Posición actual</span>
          <strong style={styles.statValue}>#{teamStats?.position || '-'}</strong>
        </article>

        <article style={styles.statCard}>
          <span style={styles.statLabel}>Registros enviados</span>
          <strong style={styles.statValue}>{records.length}</strong>
        </article>

        <article style={styles.statCard}>
          <span style={styles.statLabel}>Aprobados</span>
          <strong style={styles.statValue}>{approvedCount}</strong>
        </article>
      </section>

      <section style={styles.statusGrid}>
        <div style={styles.statusCard}>
          <span style={styles.statusDotPending} />
          Pendientes: {pendingCount}
        </div>

        <div style={styles.statusCard}>
          <span style={styles.statusDotApproved} />
          Aprobados: {approvedCount}
        </div>

        <div style={styles.statusCard}>
          <span style={styles.statusDotRejected} />
          Rechazados: {rejectedCount}
        </div>
      </section>

      <section style={styles.historyCard}>
        <div style={styles.historyHeader}>
          <div>
            <p style={styles.kicker}>Historial</p>
            <h3 style={styles.sectionTitle}>Mis registros recientes</h3>
          </div>
        </div>

        {records.length === 0 ? (
          <div style={styles.emptyState}>
            Aún no has enviado registros de reciclaje.
          </div>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Fecha</th>
                  <th style={styles.th}>Material</th>
                  <th style={styles.th}>Cantidad</th>
                  <th style={styles.th}>Estado</th>
                  <th style={styles.th}>Puntos</th>
                  <th style={styles.th}>Evidencia</th>
                  <th style={styles.th}>Observación admin</th>
                </tr>
              </thead>

              <tbody>
                {records.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : '-'}
                    </td>

                    <td style={styles.td}>{formatMaterial(item.material_type)}</td>

                    <td style={styles.td}>
                      {item.quantity} {item.unit}
                    </td>

                    <td style={styles.td}>
                      <span style={getStatusStyle(item.status)}>
                        {formatStatus(item.status)}
                      </span>
                    </td>

                    <td style={styles.td}>
                      <strong>{Number(item.points_awarded || 0)}</strong>
                    </td>

                    <td style={styles.td}>
                      {item.evidence_url ? (
                        <a
                          href={getBackendUrl(item.evidence_url)}
                          target="_blank"
                          rel="noreferrer"
                          style={styles.link}
                        >
                          Ver
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>

                    <td style={styles.td}>{item.review_notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function formatMaterial(material) {
  const labels = {
    papel_carton: 'Papel y cartón',
    plastico: 'Plástico',
    vidrio: 'Vidrio',
    metal: 'Metal',
    organico: 'Orgánico',
  };

  return labels[material] || material || '-';
}

function formatStatus(status) {
  const labels = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
  };

  return labels[status] || status || '-';
}

function getStatusStyle(status) {
  const base = {
    display: 'inline-flex',
    borderRadius: '999px',
    padding: '7px 11px',
    fontSize: '13px',
    fontWeight: 800,
  };

  if (status === 'approved') {
    return {
      ...base,
      backgroundColor: '#eef8f3',
      color: '#2cab87',
    };
  }

  if (status === 'rejected') {
    return {
      ...base,
      backgroundColor: '#fff3f0',
      color: '#c0392b',
    };
  }

  return {
    ...base,
    backgroundColor: '#fff7e6',
    color: '#9a6700',
  };
}

const styles = {
  page: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '42px 32px 72px',
    fontFamily: 'Montserrat, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '26px',
  },
  kicker: {
    margin: 0,
    color: 'var(--turquoise)',
    fontSize: '13px',
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
  },
  title: {
    margin: '8px 0 8px',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '38px',
    color: '#000000',
  },
  description: {
    margin: 0,
    color: '#444',
    lineHeight: 1.6,
  },
  primaryButton: {
    textDecoration: 'none',
    backgroundColor: 'var(--green)',
    color: '#ffffff',
    padding: '14px 20px',
    borderRadius: '12px',
    fontSize: '15px',
    fontWeight: 800,
    boxShadow: '0 8px 20px rgba(113, 185, 86, 0.25)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
    gap: '18px',
    marginBottom: '20px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '22px',
    boxShadow: 'var(--shadow-card)',
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
    color: 'var(--green)',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '38px',
    lineHeight: 1,
  },
  statusGrid: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '26px',
  },
  statusCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '999px',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 700,
    color: '#333',
  },
  statusDotPending: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#f1c40f',
  },
  statusDotApproved: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: 'var(--turquoise)',
  },
  statusDotRejected: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    backgroundColor: '#c0392b',
  },
  historyCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
  },
  historyHeader: {
    marginBottom: '18px',
  },
  sectionTitle: {
    margin: '8px 0 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '28px',
    color: '#000000',
  },
  emptyState: {
    backgroundColor: '#f8fbf9',
    border: '1px dashed #d9dfdc',
    borderRadius: '16px',
    padding: '20px',
    color: '#666',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '14px 12px',
    borderBottom: '1px solid #e7ece9',
    color: '#5d6a63',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '15px 12px',
    borderBottom: '1px solid #eef1ef',
    color: '#222',
    verticalAlign: 'middle',
  },
  link: {
    color: 'var(--turquoise)',
    fontWeight: 800,
    textDecoration: 'none',
  },
};
