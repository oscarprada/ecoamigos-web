import LoadState from '../../components/LoadState';
import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';

export default function RankingPage() {
  const [loadError, setLoadError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [data, setData] = useState({
    ranking: [],
    currentPeriod: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/public/ranking')
      .then(({ data }) => setData(data))
      .catch(() => setLoadError('No fue posible cargar el ranking.'))
      .finally(() => { setLoading(false); setPageLoading(false); });
  }, []);

  const topThree = useMemo(() => data.ranking.slice(0, 3), [data.ranking]);

  const getPoints = (row) => {
    return Number(row.total_points ?? row.score ?? 0);
  };

  if (pageLoading || loadError) return <LoadState loading={pageLoading} error={loadError} retry={() => window.location.reload()} />;

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.kicker}>Ranking público</p>
        <h2 style={styles.title}>Ranking Ecoamigos</h2>
        <p style={styles.description}>
          Consulta las posiciones de los equipos según los puntos obtenidos por
          registros de reciclaje aprobados durante el periodo activo.
        </p>

        {data.currentPeriod && (
          <div style={styles.periodBadge}>
            Periodo vigente: {data.currentPeriod.name}
          </div>
        )}
      </section>

      {loading ? (
        <div style={styles.card}>Cargando ranking...</div>
      ) : data.ranking.length === 0 ? (
        <div style={styles.card}>
          Aún no hay registros aprobados para mostrar en el ranking.
        </div>
      ) : (
        <>
          <section style={styles.podium}>
            {topThree.map((team) => (
              <div key={team.id} style={styles.podiumCard}>
                <div style={styles.positionCircle}>#{team.position}</div>
                <h3 style={styles.teamName}>{team.name}</h3>
                <p style={styles.teamDependency}>
                  {team.dependency || 'Dependencia no registrada'}
                </p>
                <strong style={styles.points}>{getPoints(team)} pts</strong>
              </div>
            ))}
          </section>

          <section style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h3 style={styles.sectionTitle}>Tabla general</h3>
              <span style={styles.totalTeams}>
                {data.ranking.length} equipos
              </span>
            </div>

            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Posición</th>
                    <th style={styles.th}>Equipo</th>
                    <th style={styles.th}>Dependencia</th>
                    <th style={styles.th}>Puntaje</th>
                  </tr>
                </thead>

                <tbody>
                  {data.ranking.map((row) => (
                    <tr key={row.id}>
                      <td style={styles.td}>
                        <span style={styles.rankBadge}>#{row.position}</span>
                      </td>
                      <td style={styles.td}>{row.name}</td>
                      <td style={styles.td}>
                        {row.dependency || 'No registrada'}
                      </td>
                      <td style={styles.td}>
                        <strong>{getPoints(row)} pts</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '42px 32px 72px',
    fontFamily: 'Montserrat, sans-serif',
  },

  hero: {
    marginBottom: '30px',
  },

  kicker: {
    margin: 0,
    color: 'var(--turquoise)',
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
  },

  title: {
    margin: '8px 0 12px',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '42px',
    color: '#000000',
    fontWeight: 800,
  },

  description: {
    maxWidth: '760px',
    margin: 0,
    color: '#444',
    lineHeight: 1.6,
    fontSize: '16px',
  },

  periodBadge: {
    display: 'inline-block',
    marginTop: '18px',
    backgroundColor: '#eef8f3',
    color: 'var(--turquoise)',
    border: '1px solid #d7ebdf',
    borderRadius: '999px',
    padding: '10px 16px',
    fontWeight: 700,
  },

  podium: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
    gap: '20px',
    marginBottom: '26px',
  },

  podiumCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '26px',
    boxShadow: 'var(--shadow-card)',
  },

  positionCircle: {
    width: '52px',
    height: '52px',
    borderRadius: '50%',
    backgroundColor: 'var(--green)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '18px',
    marginBottom: '16px',
  },

  teamName: {
    margin: '0 0 8px',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '24px',
    color: '#000000',
  },

  teamDependency: {
    margin: '0 0 14px',
    color: '#555',
  },

  points: {
    color: 'var(--turquoise)',
    fontSize: '24px',
  },

  card: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '18px',
    padding: '28px',
    color: '#444',
  },

  tableCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
  },

  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '18px',
    gap: '16px',
  },

  sectionTitle: {
    margin: 0,
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '26px',
    color: '#000000',
  },

  totalTeams: {
    color: 'var(--turquoise)',
    fontWeight: 700,
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
    padding: '16px 12px',
    borderBottom: '1px solid #eef1ef',
    color: '#222',
  },

  rankBadge: {
    backgroundColor: '#eef8f3',
    color: 'var(--turquoise)',
    borderRadius: '999px',
    padding: '8px 12px',
    fontWeight: 800,
  },
};
