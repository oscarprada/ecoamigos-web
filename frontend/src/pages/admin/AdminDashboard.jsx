import { exportError } from '../../utils/exportError';
import LoadState from '../../components/LoadState';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminDashboard() {
  const [loadError, setLoadError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const [adminStats, setAdminStats] = useState({
    users: 0,
    teams: 0,
    records: 0,
    pending: 0,
  });

  const [publicStats, setPublicStats] = useState({
    general: {
      total_records: 0,
      total_points: 0,
      total_quantity: 0,
    },
    status: [],
    materials: [],
    teams: [],
    periods: [],

  });

  useEffect(() => {
    const load = async () => {
      try {
      const [adminRes, publicRes] = await Promise.all([
        api.get('/admin/dashboard'),
        api.get('/public/stats'),
      ]);

      setAdminStats(adminRes.data);
      setPublicStats(publicRes.data);
      } catch { setLoadError('No fue posible cargar las estadísticas.'); }
      finally { setPageLoading(false); }
    };

    load();
  }, []);

  const handleExportExcel = async () => {
  try {
    const response = await api.get('/admin/export/excel', {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(
      new Blob([response.data])
    );

    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', 'Reporte_Ecoamigos.xlsx');

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    alert(await exportError(error));
  }
};

  const statusSummary = useMemo(() => {
    const base = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    publicStats.status.forEach((item) => {
      base[item.status] = item.total;
    });

    return base;
  }, [publicStats.status]);

  const topTeams = publicStats.teams.slice(0, 5);
  const topMaterials = publicStats.materials.slice(0, 5);

  const maxTeamPoints = Math.max(
    ...topTeams.map((item) => Number(item.total_points || 0)),
    1
  );

  const maxMaterialRecords = Math.max(
    ...topMaterials.map((item) => Number(item.total || 0)),
    1
  );

  if (pageLoading || loadError) return <LoadState loading={pageLoading} error={loadError} retry={() => window.location.reload()} />;

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <p style={styles.kicker}>Administración Ecoamigos</p>
        <h2 style={styles.title}>PANEL EJECUTIVO </h2>
        <p style={styles.description}>
          Histórico de todos los períodos: registros y puntos acumulados por equipos.
          El reciclaje aprobado suma solo cantidades declaradas en kg. Otras unidades
          quedan fuera. Los indicadores ambientales equivalentes se encuentran en revisión
          metodológica y no se muestran hasta contar con factores técnicamente validados.
        </p>
        <div style={styles.exportContainer}>
        <button
          type="button"
          onClick={handleExportExcel}
          style={styles.exportButton}
        >
          📊 Exportar reporte Excel
        </button>
      </div>
      </section>

      <section style={styles.statsGrid}>
        <StatCard title="Usuarios" value={adminStats.users} />
        <StatCard title="Equipos" value={adminStats.teams} />
        <StatCard title="Registros" value={publicStats.general?.total_records || 0} />
        <StatCard title="Puntos acumulados" value={publicStats.general?.total_points || 0} />
      </section>

      <section style={styles.statsGrid}>
        <StatCard title="Pendientes" value={statusSummary.pending} />
        <StatCard title="Aprobados" value={statusSummary.approved} />
        <StatCard title="Rechazados" value={statusSummary.rejected} />
        <StatCard title="Cantidad total reciclada aprobada (kg)" value={Number(publicStats.general?.total_quantity || 0)} />
      </section>

      <section style={styles.chartsGrid}>
        <ChartCard title="Equipos por puntos históricos">
          {topTeams.length === 0 ? (
            <EmptyText text="Aún no hay datos de equipos." />
          ) : (
            <div style={styles.barList}>
              {topTeams.map((team, index) => {
                const points = Number(team.total_points || 0);
                const width = `${Math.max((points / maxTeamPoints) * 100, 6)}%`;

                return (
                  <div key={team.id} style={styles.barItem}>
                    <div style={styles.barHeader}>
                      <span style={styles.barName}>
                        #{index + 1} {team.name}
                      </span>
                      <strong>{points} pts</strong>
                    </div>

                    <div style={styles.barTrack}>
                      <div style={{ ...styles.barFill, width }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>

        <ChartCard title="Materiales más registrados">
          {topMaterials.length === 0 ? (
            <EmptyText text="Aún no hay datos de materiales." />
          ) : (
            <div style={styles.barList}>
              {topMaterials.map((material) => {
                const total = Number(material.total || 0);
                const width = `${Math.max((total / maxMaterialRecords) * 100, 6)}%`;

                return (
                  <div key={material.material_type} style={styles.barItem}>
                    <div style={styles.barHeader}>
                      <span style={styles.barName}>
                        {formatMaterial(material.material_type)}
                      </span>
                      <strong>{total} registros</strong>
                    </div>

                    <div style={styles.barTrack}>
                      <div style={{ ...styles.barFillAlt, width }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>
      </section>

      <section style={styles.chartsGrid}>
        <ChartCard title="Estado de validaciones">
          <div style={styles.statusGrid}>
            <StatusBox label="Pendientes" value={statusSummary.pending} color="#9a6700" />
            <StatusBox label="Aprobados" value={statusSummary.approved} color="#2cab87" />
            <StatusBox label="Rechazados" value={statusSummary.rejected} color="#c0392b" />
          </div>
        </ChartCard>

        <ChartCard title="Accesos rápidos">
          <div style={styles.quickGrid}>
            <QuickCard
              title="Validar reciclajes"
              text="Revisar evidencias y aprobar registros."
              to="/admin/reviews"
            />

            <QuickCard
              title="Usuarios"
              text="Crear líderes y administradores."
              to="/admin/users"
            />

            <QuickCard
              title="Contenidos"
              text="Gestionar material educativo."
              to="/admin/content"
            />

            <QuickCard
              title="Configuración"
              text="Equipos y periodos del ranking."
              to="/admin/settings"
            />
          </div>
        </ChartCard>
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

function ChartCard({ title, children }) {
  return (
    <article style={styles.chartCard}>
      <h3 style={styles.chartTitle}>{title}</h3>
      {children}
    </article>
  );
}

function StatusBox({ label, value, color }) {
  return (
    <div style={styles.statusBox}>
      <span style={{ ...styles.statusDot, backgroundColor: color }} />
      <span style={styles.statusLabel}>{label}</span>
      <strong style={styles.statusValue}>{value}</strong>
    </div>
  );
}

function QuickCard({ title, text, to }) {
  return (
    <Link to={to} style={styles.quickCard}>
      <h4 style={styles.quickTitle}>{title}</h4>
      <p style={styles.quickText}>{text}</p>
      <span style={styles.quickAction}>Abrir →</span>
    </Link>
  );
}

function EmptyText({ text }) {
  return <p style={styles.emptyText}>{text}</p>;
}

function formatMaterial(material) {
  const labels = {
    papel_carton: 'Papel y cartón',
    plastico: 'Plástico',
    vidrio: 'Vidrio',
    metal: 'Metal',
    organico: 'Orgánico',
  };

  return labels[material] || material || 'Sin dato';
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
    color: 'var(--turquoise)',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(210px, 100%), 1fr))',
    gap: '18px',
    marginBottom: '22px',
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
    fontSize: '40px',
    lineHeight: 1,
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
    gap: '22px',
    marginTop: '22px',
  },
  chartCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
  },
  chartTitle: {
    margin: '0 0 18px',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '24px',
    color: '#000000',
  },
  barList: {
    display: 'grid',
    gap: '16px',
  },
  barItem: {
    display: 'grid',
    gap: '8px',
  },
  barHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
  },
  barName: {
    fontWeight: 700,
    color: '#333',
  },
  barTrack: {
    height: '12px',
    borderRadius: '999px',
    backgroundColor: '#eef3ef',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '999px',
    backgroundColor: 'var(--green)',
  },
  barFillAlt: {
    height: '100%',
    borderRadius: '999px',
    backgroundColor: 'var(--turquoise)',
  },
  statusGrid: {
    display: 'grid',
    gap: '14px',
  },
  statusBox: {
    display: 'grid',
    gridTemplateColumns: '16px 1fr auto',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f8fbf9',
    border: '1px solid #e7efea',
    borderRadius: '14px',
    padding: '14px',
  },
  statusDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
  },
  statusLabel: {
    color: '#333',
    fontWeight: 700,
  },
  statusValue: {
    fontSize: '20px',
    color: '#000',
  },
  quickGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
    gap: '14px',
  },
  quickCard: {
    textDecoration: 'none',
    backgroundColor: '#f8fbf9',
    border: '1px solid #e7efea',
    borderRadius: '16px',
    padding: '18px',
    color: '#000000',
  },
  quickTitle: {
    margin: '0 0 8px',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '19px',
  },
  quickText: {
    margin: '0 0 12px',
    color: '#555',
    lineHeight: 1.5,
    fontSize: '14px',
  },
   quickAction: {
    color: 'var(--turquoise)',
    fontWeight: 800,
  },

  exportContainer: {
    marginTop: '22px',
  },

  exportButton: {
    backgroundColor: 'var(--turquoise)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 22px',
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 800,
    fontSize: '15px',
    cursor: 'pointer',
  },

  emptyText: {
    color: '#666',
    margin: 0,
  },
};
