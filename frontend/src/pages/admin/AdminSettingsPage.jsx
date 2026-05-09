import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminSettingsPage() {
  const [teams, setTeams] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [prizes, setPrizes] = useState([]);

  const [teamForm, setTeamForm] = useState({ name: '', dependency: '' });
  const [periodForm, setPeriodForm] = useState({
    name: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });
  const [prizeForm, setPrizeForm] = useState({
    name: '',
    description: '',
    is_active: true,
  });

  const load = async () => {
    const [teamsRes, periodsRes, prizesRes] = await Promise.all([
      api.get('/admin/teams'),
      api.get('/admin/periods'),
      api.get('/admin/prizes'),
    ]);

    setTeams(teamsRes.data || []);
    setPeriods(periodsRes.data || []);
    setPrizes(prizesRes.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submitTeam = async (e) => {
    e.preventDefault();
    await api.post('/admin/teams', teamForm);
    setTeamForm({ name: '', dependency: '' });
    load();
  };

  const submitPeriod = async (e) => {
    e.preventDefault();
    await api.post('/admin/periods', periodForm);
    setPeriodForm({
      name: '',
      start_date: '',
      end_date: '',
      is_active: true,
    });
    load();
  };

  const submitPrize = async (e) => {
    e.preventDefault();
    await api.post('/admin/prizes', prizeForm);
    setPrizeForm({ name: '', description: '', is_active: true });
    load();
  };

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <p style={styles.kicker}>Configuración</p>
        <h2 style={styles.title}>Configuración general</h2>
        <p style={styles.description}>
          Administra los equipos participantes, periodos de competencia y premios
          disponibles para la campaña Ecoamigos.
        </p>
      </section>

      <section style={styles.grid}>
        <ConfigCard title="Equipos" subtitle="Crea y consulta equipos participantes.">
          <form style={styles.form} onSubmit={submitTeam}>
            <input
              style={styles.input}
              placeholder="Nombre del equipo"
              value={teamForm.name}
              onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
              required
            />

            <input
              style={styles.input}
              placeholder="Dependencia"
              value={teamForm.dependency}
              onChange={(e) =>
                setTeamForm({ ...teamForm, dependency: e.target.value })
              }
              required
            />

            <button style={styles.button} type="submit">
              Crear equipo
            </button>
          </form>

          <ItemList
            items={teams.map((item) => ({
              id: item.id,
              title: item.name,
              subtitle: item.dependency || 'Sin dependencia',
            }))}
          />
        </ConfigCard>

        <ConfigCard title="Periodos" subtitle="Define el periodo activo del ranking.">
          <form style={styles.form} onSubmit={submitPeriod}>
            <input
              style={styles.input}
              placeholder="Nombre del periodo"
              value={periodForm.name}
              onChange={(e) =>
                setPeriodForm({ ...periodForm, name: e.target.value })
              }
              required
            />

            <input
              style={styles.input}
              type="date"
              value={periodForm.start_date}
              onChange={(e) =>
                setPeriodForm({ ...periodForm, start_date: e.target.value })
              }
              required
            />

            <input
              style={styles.input}
              type="date"
              value={periodForm.end_date}
              onChange={(e) =>
                setPeriodForm({ ...periodForm, end_date: e.target.value })
              }
              required
            />

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={periodForm.is_active}
                onChange={(e) =>
                  setPeriodForm({ ...periodForm, is_active: e.target.checked })
                }
              />
              Marcar como periodo activo
            </label>

            <button style={styles.button} type="submit">
              Crear periodo
            </button>
          </form>

          <ItemList
            items={periods.map((item) => ({
              id: item.id,
              title: item.name,
              subtitle: `${formatDate(item.start_date)} - ${formatDate(
                item.end_date
              )}`,
              badge: item.is_active ? 'Activo' : 'Inactivo',
            }))}
          />
        </ConfigCard>

        <ConfigCard title="Premios" subtitle="Registra premios visibles para la campaña.">
          <form style={styles.form} onSubmit={submitPrize}>
            <input
              style={styles.input}
              placeholder="Nombre del premio"
              value={prizeForm.name}
              onChange={(e) =>
                setPrizeForm({ ...prizeForm, name: e.target.value })
              }
              required
            />

            <textarea
              style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
              placeholder="Descripción"
              value={prizeForm.description}
              onChange={(e) =>
                setPrizeForm({ ...prizeForm, description: e.target.value })
              }
            />

            <label style={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={prizeForm.is_active}
                onChange={(e) =>
                  setPrizeForm({ ...prizeForm, is_active: e.target.checked })
                }
              />
              Premio activo
            </label>

            <button style={styles.button} type="submit">
              Crear premio
            </button>
          </form>

          <ItemList
            items={prizes.map((item) => ({
              id: item.id,
              title: item.name || item.title,
              subtitle: item.description || 'Sin descripción',
              badge: item.is_active ? 'Activo' : 'Inactivo',
            }))}
          />
        </ConfigCard>
      </section>
    </div>
  );
}

function ConfigCard({ title, subtitle, children }) {
  return (
    <article style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.cardTitle}>{title}</h3>
        <p style={styles.cardSubtitle}>{subtitle}</p>
      </div>
      {children}
    </article>
  );
}

function ItemList({ items }) {
  if (!items.length) {
    return <div style={styles.empty}>No hay registros todavía.</div>;
  }

  return (
    <div style={styles.list}>
      {items.map((item) => (
        <div key={item.id} style={styles.listItem}>
          <div>
            <strong style={styles.listTitle}>{item.title}</strong>
            <p style={styles.listSubtitle}>{item.subtitle}</p>
          </div>

          {item.badge && <span style={styles.badge}>{item.badge}</span>}
        </div>
      ))}
    </div>
  );
}

function formatDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
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
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
    gap: '22px',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #dfe7e2',
    borderRadius: '22px',
    padding: '24px',
    boxShadow: '0 10px 24px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    marginBottom: '18px',
  },
  cardTitle: {
    margin: '0 0 8px',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '26px',
    color: '#000000',
  },
  cardSubtitle: {
    margin: 0,
    color: '#555',
    lineHeight: 1.5,
  },
  form: {
    display: 'grid',
    gap: '12px',
    marginBottom: '22px',
  },
  input: {
    width: '100%',
    border: '1px solid #d6e1db',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '14px',
    fontFamily: 'Montserrat, sans-serif',
    outline: 'none',
    boxSizing: 'border-box',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#333',
    fontWeight: 600,
  },
  button: {
    backgroundColor: '#71b956',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '13px 18px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
  },
  list: {
    display: 'grid',
    gap: '10px',
  },
  listItem: {
    backgroundColor: '#f8fbf9',
    border: '1px solid #e7efea',
    borderRadius: '14px',
    padding: '14px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
  },
  listTitle: {
    color: '#000000',
  },
  listSubtitle: {
    margin: '6px 0 0',
    color: '#555',
    fontSize: '14px',
  },
  badge: {
    backgroundColor: '#eef8f3',
    color: '#2cab87',
    borderRadius: '999px',
    padding: '7px 11px',
    fontSize: '12px',
    fontWeight: 800,
  },
  empty: {
    backgroundColor: '#f8fbf9',
    border: '1px dashed #d9dfdc',
    borderRadius: '14px',
    padding: '16px',
    color: '#666',
  },
};

