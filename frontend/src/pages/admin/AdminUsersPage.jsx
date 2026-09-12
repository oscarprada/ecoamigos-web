import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';

const MAX_USERS = 15;

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'leader',
    team_id: '',
  });

  const load = async () => {
    try {
      setLoading(true);
      const [usersRes, teamsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/teams'),
      ]);
      setUsers(usersRes.data || []);
      setTeams(teamsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalUsers = users.length;
  const remainingSlots = Math.max(MAX_USERS - totalUsers, 0);
  const canCreateMore = totalUsers < MAX_USERS;

  const leadersCount = useMemo(
    () => users.filter((user) => user.role === 'leader').length,
    [users]
  );

  const adminsCount = useMemo(
    () => users.filter((user) => user.role === 'admin').length,
    [users]
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'role' && value === 'admin' ? { team_id: '' } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!canCreateMore) {
      setError('Ya se alcanzó el máximo de 15 usuarios permitidos.');
      return;
    }

    if (form.role === 'leader' && !form.team_id) {
      setError('Debes seleccionar un equipo para el líder.');
      return;
    }

    try {
      setSubmitting(true);

      await api.post('/admin/users', {
        ...form,
        team_id: form.role === 'leader' ? form.team_id : null,
      });

      setSuccess('Usuario creado correctamente.');
      setForm({
        name: '',
        email: '',
        password: '',
        role: 'leader',
        team_id: '',
      });

      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible crear el usuario.');
      if (err.response?.status === 409 && err.response?.data?.code === 'USER_LIMIT_REACHED') {
        await load();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container stack-lg">
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Administración</p>
          <h2 style={styles.title}>Gestión de usuarios</h2>
          <p style={styles.description}>
            Desde aquí puedes crear líderes y administradores, asignar equipos y
            consultar el límite de 15 cuentas totales, incluidos administradores e inactivos.
          </p>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Usuarios registrados</span>
          <span style={styles.statValue}>{totalUsers}</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>Líderes</span>
          <span style={styles.statValue}>{leadersCount}</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>Administradores</span>
          <span style={styles.statValue}>{adminsCount}</span>
        </div>

        <div style={styles.statCard}>
          <span style={styles.statLabel}>Cupos disponibles</span>
          <span style={styles.statValue}>{remainingSlots}</span>
        </div>
      </div>

      <div style={styles.layoutGrid}>
        <section style={styles.formCard}>
          <div style={styles.formHeader}>
            <h3 style={styles.sectionTitle}>Crear usuario</h3>
            <span
              style={{
                ...styles.limitBadge,
                backgroundColor: canCreateMore ? '#eef8f3' : '#fff3f0',
                color: canCreateMore ? '#2cab87' : '#c0392b',
                borderColor: canCreateMore ? '#d7ebdf' : '#f2c7c0',
              }}
            >
              {canCreateMore
                ? `Disponibles: ${remainingSlots}`
                : 'Límite alcanzado'}
            </span>
          </div>

          {error ? <div style={styles.errorBox}>{error}</div> : null}
          {success ? <div style={styles.successBox}>{success}</div> : null}

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>
              Nombre completo
              <input
                style={styles.input}
                placeholder="Ej. Diana Isabel Zúñiga"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </label>

            <label style={styles.label}>
              Correo electrónico
              <input
                style={styles.input}
                type="email"
                placeholder="usuario@ecoamigos.com"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />
            </label>

            <label style={styles.label}>
              Contraseña temporal
              <input
                style={styles.input}
                type="password"
                placeholder="Mínimo para ingreso inicial"
                value={form.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
            </label>

            <label style={styles.label}>
              Rol
              <select
                style={styles.input}
                value={form.role}
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <option value="leader">Líder</option>
                <option value="admin">Administrador</option>
              </select>
            </label>

            <label style={styles.label}>
              Equipo asignado
              <select
                style={styles.input}
                value={form.team_id}
                onChange={(e) => handleChange('team_id', e.target.value)}
                disabled={form.role !== 'leader'}
              >
                <option value="">Seleccione equipo</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="button primary"
              type="submit"
              disabled={submitting || !canCreateMore}
              style={styles.submitButton}
            >
              {submitting ? 'Creando...' : 'Crear usuario'}
            </button>
          </form>
        </section>

        <section style={styles.tableCard}>
          <div style={styles.formHeader}>
            <h3 style={styles.sectionTitle}>Usuarios creados</h3>
            <span style={styles.tableCount}>{totalUsers} registrados</span>
          </div>

          {loading ? (
            <p style={styles.loadingText}>Cargando usuarios...</p>
          ) : users.length === 0 ? (
            <div style={styles.emptyState}>
              Aún no hay usuarios registrados.
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Correo</th>
                    <th style={styles.th}>Rol</th>
                    <th style={styles.th}>Equipo</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td style={styles.td}>{user.name}</td>
                      <td style={styles.td}>{user.email}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.roleBadge,
                            backgroundColor:
                              user.role === 'admin' ? '#eef4ff' : '#eef8f3',
                            color:
                              user.role === 'admin' ? '#3056d3' : '#2cab87',
                          }}
                        >
                          {user.role === 'admin' ? 'Administrador' : 'Líder'}
                        </span>
                      </td>
                      <td style={styles.td}>{user.team_name || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const styles = {
  header: {
    marginBottom: '12px',
  },
  kicker: {
    margin: 0,
    color: 'var(--turquoise)',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
    gap: '18px',
  },
  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '18px',
    padding: '20px',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  statLabel: {
    fontSize: '13px',
    color: '#5d6a63',
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  statValue: {
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '36px',
    fontWeight: 800,
    color: 'var(--green)',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 420px) minmax(0, 1fr)',
    gap: '22px',
    alignItems: 'start',
  },
  formCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
  },
  tableCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '20px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '14px',
    marginBottom: '18px',
    flexWrap: 'wrap',
  },
  sectionTitle: {
    margin: 0,
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '24px',
    color: '#000000',
  },
  limitBadge: {
    border: '1px solid',
    borderRadius: '999px',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 700,
  },
  tableCount: {
    color: '#666',
    fontSize: '14px',
    fontWeight: 600,
  },
  errorBox: {
    backgroundColor: '#fff3f0',
    border: '1px solid #f2c7c0',
    color: '#c0392b',
    borderRadius: '12px',
    padding: '12px 14px',
    marginBottom: '16px',
  },
  successBox: {
    backgroundColor: '#eef8f3',
    border: '1px solid #d7ebdf',
    color: 'var(--turquoise)',
    borderRadius: '12px',
    padding: '12px 14px',
    marginBottom: '16px',
  },
  form: {
    display: 'grid',
    gap: '14px',
  },
  label: {
    display: 'grid',
    gap: '8px',
    fontWeight: 600,
    color: '#222',
  },
  input: {
    width: '100%',
    border: '1px solid #d6e1db',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '14px',
    fontFamily: 'Montserrat, sans-serif',
    outline: 'none',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
  },
  submitButton: {
    marginTop: '6px',
  },
  loadingText: {
    margin: 0,
    color: '#666',
  },
  emptyState: {
    backgroundColor: '#fafafa',
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
    padding: '12px 10px',
    borderBottom: '1px solid #e7ece9',
    color: '#5d6a63',
    fontSize: '13px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  td: {
    padding: '14px 10px',
    borderBottom: '1px solid #eef1ef',
    color: '#222',
    verticalAlign: 'middle',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: '999px',
    padding: '8px 12px',
    fontSize: '13px',
    fontWeight: 700,
  },
};
