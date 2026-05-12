import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function AdminReviewsPage() {
  const { showToast } = useToast();

  const [pendingRecords, setPendingRecords] = useState([]);
  const [historyRecords, setHistoryRecords] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [submittingId, setSubmittingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState({});

  const load = async () => {
    try {
      const [pendingRes, historyRes] = await Promise.all([
        api.get('/recycling/pending'),
        api.get('/recycling/reviewed'),
      ]);

      setPendingRecords(pendingRes.data || []);
      setHistoryRecords(historyRes.data || []);
    } catch (error) {
      showToast(
        'No fue posible cargar los registros.',
        'error'
      );
    }
  };

  useEffect(() => {
    load();
  }, []);

  const records =
    activeTab === 'pending'
      ? pendingRecords
      : historyRecords;

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesSearch =
        record.team_name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        record.leader_name
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === 'all'
          ? true
          : record.material_type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [records, search, filter]);

  const review = async (id, status) => {
    try {
      setSubmittingId(id);

      await api.patch(`/recycling/${id}/review`, {
        status,
        review_notes:
          notes[id] ||
          (status === 'approved'
            ? 'Registro aprobado por administrador'
            : 'Registro rechazado por administrador'),
      });

      showToast(
        status === 'approved'
          ? 'Registro aprobado correctamente.'
          : 'Registro rechazado correctamente.',
        'success'
      );

      await load();
    } catch (error) {
      showToast(
        error.response?.data?.message ||
          'No fue posible procesar la validación.',
        'error'
      );
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>
            Supervisión y validación
          </p>

          <h2 style={styles.title}>
            Validación avanzada de reciclajes
          </h2>

          <p style={styles.description}>
            Gestión institucional de registros,
            evidencias y auditoría.
          </p>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={
            activeTab === 'pending'
              ? styles.activeTab
              : styles.tab
          }
          onClick={() => setActiveTab('pending')}
        >
          Pendientes ({pendingRecords.length})
        </button>

        <button
          style={
            activeTab === 'history'
              ? styles.activeTab
              : styles.tab
          }
          onClick={() => setActiveTab('history')}
        >
          Historial ({historyRecords.length})
        </button>
      </div>

      <div style={styles.filters}>
        <input
          style={styles.input}
          placeholder="Buscar por equipo o líder"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.input}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">
            Todos los materiales
          </option>

          <option value="papel_carton">
            Papel y cartón
          </option>

          <option value="plastico">
            Plástico
          </option>

          <option value="vidrio">
            Vidrio
          </option>

          <option value="metal">
            Metal
          </option>

          <option value="organico">
            Orgánico
          </option>
        </select>
      </div>

      {filteredRecords.length === 0 ? (
        <div style={styles.empty}>
          No hay registros para mostrar.
        </div>
      ) : (
        <div style={styles.cards}>
          {filteredRecords.map((record) => (
            <article
              key={record.id}
              style={styles.card}
            >
              <div style={styles.top}>
                <div>
                  <p style={styles.cardKicker}>
                    Registro #{record.id}
                  </p>

                  <h3 style={styles.cardTitle}>
                    {record.team_name}
                  </h3>
                </div>

                <span
                  style={
                    record.status === 'approved'
                      ? styles.approvedBadge
                      : record.status === 'rejected'
                      ? styles.rejectedBadge
                      : styles.pendingBadge
                  }
                >
                  {record.status === 'approved'
                    ? 'Aprobado'
                    : record.status === 'rejected'
                    ? 'Rechazado'
                    : 'Pendiente'}
                </span>
              </div>

              <div style={styles.grid}>
                <Info
                  label="Líder"
                  value={record.leader_name}
                />

                <Info
                  label="Material"
                  value={record.material_type}
                />

                <Info
                  label="Cantidad"
                  value={`${record.quantity} ${record.unit}`}
                />

                <Info
                  label="Periodo"
                  value={record.period_name}
                />

                <Info
                  label="Puntos"
                  value={record.points_awarded || 0}
                />

                <Info
                  label="Revisado por"
                  value={record.reviewer_name || '-'}
                />
              </div>

              {record.notes && (
                <div style={styles.notes}>
                  <strong>
                    Observaciones del líder:
                  </strong>

                  <p>{record.notes}</p>
                </div>
              )}

              {record.review_notes && (
                <div style={styles.reviewNotes}>
                  <strong>
                    Observaciones administrativas:
                  </strong>

                  <p>{record.review_notes}</p>
                </div>
              )}

              <div style={styles.evidenceBox}>
                <strong>Evidencia</strong>

                {record.evidence_url ? (
                  <>
                    {record.evidence_url.match(
                      /\.(jpg|jpeg|png|gif|webp)$/i
                    ) ? (
                      <img
                        src={`http://localhost:3000${record.evidence_url}`}
                        alt="Evidencia"
                        style={styles.previewImage}
                      />
                    ) : (
                      <a
                        href={`http://localhost:3000${record.evidence_url}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.link}
                      >
                        Abrir archivo
                      </a>
                    )}
                  </>
                ) : (
                  <p>Sin evidencia</p>
                )}
              </div>

              {activeTab === 'pending' && (
                <>
                  <textarea
                    style={styles.textarea}
                    placeholder="Observaciones administrativas"
                    value={notes[record.id] || ''}
                    onChange={(e) =>
                      setNotes({
                        ...notes,
                        [record.id]:
                          e.target.value,
                      })
                    }
                  />

                  <div style={styles.actions}>
                    <button
                      style={styles.approveButton}
                      disabled={
                        submittingId === record.id
                      }
                      onClick={() =>
                        review(
                          record.id,
                          'approved'
                        )
                      }
                    >
                      {submittingId === record.id
                        ? 'Procesando...'
                        : 'Aprobar'}
                    </button>

                    <button
                      style={styles.rejectButton}
                      disabled={
                        submittingId === record.id
                      }
                      onClick={() =>
                        review(
                          record.id,
                          'rejected'
                        )
                      }
                    >
                      {submittingId === record.id
                        ? 'Procesando...'
                        : 'Rechazar'}
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div style={styles.infoCard}>
      <span style={styles.infoLabel}>
        {label}
      </span>

      <strong style={styles.infoValue}>
        {value || '-'}
      </strong>
    </div>
  );
}

const badgeBase = {
  borderRadius: '999px',
  padding: '8px 12px',
  fontWeight: 700,
  height: 'fit-content',
};

const styles = {
  page: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '42px 32px 72px',
    fontFamily: 'Montserrat, sans-serif',
  },

  header: {
    marginBottom: '24px',
  },

  kicker: {
    margin: 0,
    color: '#2cab87',
    fontSize: '13px',
    fontWeight: 800,
    textTransform: 'uppercase',
  },

  title: {
    margin: '8px 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '40px',
  },

  description: {
    color: '#444',
  },

  tabs: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },

  tab: {
    backgroundColor: '#ffffff',
    border: '1px solid #dfe7e2',
    borderRadius: '12px',
    padding: '12px 18px',
    cursor: 'pointer',
    fontWeight: 700,
  },

  activeTab: {
    backgroundColor: '#2cab87',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 18px',
    cursor: 'pointer',
    fontWeight: 700,
  },

  filters: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },

  input: {
    border: '1px solid #d6e1db',
    borderRadius: '12px',
    padding: '12px 14px',
    minWidth: '240px',
  },

  empty: {
    backgroundColor: '#ffffff',
    border: '1px solid #dfe7e2',
    borderRadius: '18px',
    padding: '24px',
  },

  cards: {
    display: 'grid',
    gap: '22px',
  },

  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #dfe7e2',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 24px rgba(0,0,0,0.05)',
  },

  top: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '18px',
    flexWrap: 'wrap',
  },

  cardKicker: {
    margin: 0,
    color: '#2cab87',
    fontSize: '12px',
    fontWeight: 700,
  },

  cardTitle: {
    margin: '8px 0 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '28px',
  },

  pendingBadge: {
    ...badgeBase,
    backgroundColor: '#fff7e6',
    color: '#9a6700',
  },

  approvedBadge: {
    ...badgeBase,
    backgroundColor: '#eef8f3',
    color: '#2cab87',
  },

  rejectedBadge: {
    ...badgeBase,
    backgroundColor: '#fff0f0',
    color: '#c0392b',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(180px,1fr))',
    gap: '14px',
    marginBottom: '18px',
  },

  infoCard: {
    backgroundColor: '#f8fbf9',
    border: '1px solid #e7efea',
    borderRadius: '14px',
    padding: '14px',
  },

  infoLabel: {
    display: 'block',
    color: '#5d6a63',
    fontSize: '12px',
    marginBottom: '8px',
    textTransform: 'uppercase',
  },

  infoValue: {
    color: '#000',
  },

  notes: {
    backgroundColor: '#fafafa',
    border: '1px solid #ececec',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '18px',
  },

  reviewNotes: {
    backgroundColor: '#eef8f3',
    border: '1px solid #d6ebdf',
    borderRadius: '14px',
    padding: '16px',
    marginBottom: '18px',
  },

  evidenceBox: {
    marginBottom: '18px',
  },

  previewImage: {
    width: '220px',
    borderRadius: '14px',
    marginTop: '12px',
    maxWidth: '100%',
  },

  textarea: {
    width: '100%',
    minHeight: '100px',
    borderRadius: '14px',
    border: '1px solid #d6e1db',
    padding: '14px',
    marginBottom: '18px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },

  actions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },

  approveButton: {
    backgroundColor: '#71b956',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 18px',
    fontWeight: 800,
    cursor: 'pointer',
  },

  rejectButton: {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 18px',
    fontWeight: 800,
    cursor: 'pointer',
  },

  link: {
    display: 'inline-block',
    marginTop: '12px',
    color: '#2cab87',
    fontWeight: 700,
    textDecoration: 'none',
  },
};

