import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';

export default function AdminReviewsPage() {
  const [records, setRecords] = useState([]);
  const [submittingId, setSubmittingId] = useState(null);

  const load = async () => {
    const { data } = await api.get('/recycling/pending');
    setRecords(data);
  };

  useEffect(() => {
    load();
  }, []);

  const review = async (id, status) => {
    try {
      setSubmittingId(id);
      await api.patch(`/recycling/${id}/review`, {
        status,
        review_notes:
          status === 'approved'
            ? 'Registro aprobado por administrador'
            : 'Registro rechazado por administrador',
      });
      await load();
    } finally {
      setSubmittingId(null);
    }
  };

  const hasRecords = useMemo(() => records.length > 0, [records]);

  return (
    <div className="container stack-lg">
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Supervisión y validación</p>
          <h2 style={styles.title}>Validación de reciclajes</h2>
          <p style={styles.description}>
            Revisa los registros pendientes, consulta la evidencia y valida cada
            actividad con base en el catálogo de puntos cargado.
          </p>
        </div>
      </div>

      {!hasRecords ? (
        <div style={styles.emptyState}>
          <h3 style={styles.emptyTitle}>No hay registros pendientes</h3>
          <p style={styles.emptyText}>
            Cuando un líder envíe un nuevo registro de reciclaje, aparecerá aquí
            para revisión.
          </p>
        </div>
      ) : (
        <div style={styles.cardsWrapper}>
          {records.map((record) => (
            <article key={record.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <p style={styles.cardKicker}>Registro #{record.id}</p>
                  <h3 style={styles.cardTitle}>
                    {record.team_name || 'Equipo sin nombre'}
                  </h3>
                </div>

                <span style={styles.statusBadge}>Pendiente</span>
              </div>

              <div style={styles.metaGrid}>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Líder</span>
                  <span style={styles.metaValue}>{record.leader_name || 'Sin dato'}</span>
                </div>

                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Material</span>
                  <span style={styles.metaValue}>{record.material_type || 'Sin dato'}</span>
                </div>

                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Cantidad</span>
                  <span style={styles.metaValue}>
                    {record.quantity} {record.unit}
                  </span>
                </div>

                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Calidad</span>
                  <span style={styles.metaValue}>{record.quality_level || 'Sin dato'}</span>
                </div>

                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Criterios cumplidos</span>
                  <span style={styles.metaValue}>{record.criteria_count ?? 0}</span>
                </div>

                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Periodo</span>
                  <span style={styles.metaValue}>{record.period_name || 'Sin periodo'}</span>
                </div>
              </div>

              <div style={styles.catalogBox}>
                <p style={styles.catalogTitle}>Referencia del catálogo</p>
                <p style={styles.catalogText}>
                  <strong>Grupo:</strong>{' '}
                  {record.catalog_group_name || 'No definido'}
                </p>
                <p style={styles.catalogText}>
                  <strong>Acción:</strong>{' '}
                  {record.catalog_action_name || 'No definida'}
                </p>
                <p style={styles.catalogText}>
                  <strong>Nivel:</strong>{' '}
                  {record.catalog_action_level || 'Sin nivel'}
                </p>
              </div>

              {record.notes && (
                <div style={styles.notesBox}>
                  <p style={styles.notesTitle}>Observaciones del líder</p>
                  <p style={styles.notesText}>{record.notes}</p>
                </div>
              )}

              <div style={styles.bottomRow}>
                <div>
                  <span style={styles.metaLabel}>Evidencia</span>
                  <div style={{ marginTop: 6 }}>
                    {record.evidence_url ? (
                      <a
                        href={`http://localhost:3000${record.evidence_url}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.evidenceLink}
                      >
                        Ver archivo
                      </a>
                    ) : (
                      <span style={styles.noEvidence}>Sin archivo</span>
                    )}
                  </div>
                </div>

                <div style={styles.actions}>
                  <button
                    className="button small success"
                    onClick={() => review(record.id, 'approved')}
                    disabled={submittingId === record.id}
                  >
                    {submittingId === record.id ? 'Procesando...' : 'Aprobar'}
                  </button>

                  <button
                    className="button small danger"
                    onClick={() => review(record.id, 'rejected')}
                    disabled={submittingId === record.id}
                  >
                    {submittingId === record.id ? 'Procesando...' : 'Rechazar'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '12px',
  },
  kicker: {
    margin: 0,
    color: '#2cab87',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
  },
  title: {
    margin: '8px 0 10px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '34px',
    color: '#000000',
  },
  description: {
    margin: 0,
    maxWidth: '760px',
    color: '#444',
    lineHeight: 1.6,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    border: '1px solid #dfe7e2',
    borderRadius: '18px',
    padding: '32px',
  },
  emptyTitle: {
    margin: '0 0 8px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '24px',
  },
  emptyText: {
    margin: 0,
    color: '#555',
    lineHeight: 1.6,
  },
  cardsWrapper: {
    display: 'grid',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #dfe7e2',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: '0 10px 24px rgba(0,0,0,0.05)',
  },
  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '16px',
    marginBottom: '18px',
  },
  cardKicker: {
    margin: 0,
    color: '#2cab87',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  cardTitle: {
    margin: '8px 0 0 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '26px',
    color: '#000000',
  },
  statusBadge: {
    backgroundColor: '#fff7e6',
    color: '#9a6700',
    border: '1px solid #f1d08a',
    borderRadius: '999px',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },
  metaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '14px',
    marginBottom: '18px',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    backgroundColor: '#f8fbf9',
    borderRadius: '14px',
    padding: '14px',
    border: '1px solid #e7efea',
  },
  metaLabel: {
    fontSize: '12px',
    color: '#5d6a63',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  metaValue: {
    fontSize: '15px',
    color: '#000000',
    fontWeight: 600,
  },
  catalogBox: {
    backgroundColor: '#eef8f3',
    border: '1px solid #d8ebdf',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '16px',
  },
  catalogTitle: {
    margin: '0 0 8px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '18px',
    color: '#000000',
  },
  catalogText: {
    margin: '4px 0',
    color: '#334',
    lineHeight: 1.5,
  },
  notesBox: {
    backgroundColor: '#fafafa',
    border: '1px solid #ececec',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '16px',
  },
  notesTitle: {
    margin: '0 0 8px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '17px',
  },
  notesText: {
    margin: 0,
    color: '#444',
    lineHeight: 1.6,
  },
  bottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '18px',
    flexWrap: 'wrap',
  },
  evidenceLink: {
    color: '#2cab87',
    fontWeight: 700,
    textDecoration: 'none',
  },
  noEvidence: {
    color: '#777',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
};
