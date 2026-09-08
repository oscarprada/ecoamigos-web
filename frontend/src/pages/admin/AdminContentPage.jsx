import { useEffect, useState } from 'react';
import api, { getBackendUrl } from '../../api/client';

const initialForm = {
  title: '',
  category: 'energia',
  type: 'text',
  description: '',
  status: 'published',
  file: null,
};

export default function AdminContentPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    api.get('/admin/content').then(({ data }) => setItems(data || []));
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('category', form.category);
      payload.append('type', form.type);
      payload.append('description', form.description);
      payload.append('status', form.status);

      if (form.file) {
        payload.append('file', form.file);
      }

      if (editingId) {
        await api.put(`/admin/content/${editingId}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Contenido actualizado correctamente.');
      } else {
        await api.post('/admin/content', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Contenido creado correctamente.');
      }

      resetForm();
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible guardar el contenido.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setMessage('');
    setError('');

    setForm({
      title: item.title || '',
      category: item.category || 'energia',
      type: item.type || 'text',
      description: item.description || '',
      status: item.status || 'published',
      file: null,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      '¿Seguro que deseas eliminar este contenido? Esta acción no se puede deshacer.'
    );

    if (!confirmDelete) return;

    setMessage('');
    setError('');

    try {
      await api.delete(`/admin/content/${id}`);
      setMessage('Contenido eliminado correctamente.');
      load();

      if (editingId === id) {
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No fue posible eliminar el contenido.');
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.header}>
        <p style={styles.kicker}>Administración</p>
        <h2 style={styles.title}>Gestión de contenidos educativos</h2>
        <p style={styles.description}>
          Crea, edita, publica o retira contenidos educativos por categoría ambiental.
        </p>
      </section>

      {message && <div style={styles.successBox}>{message}</div>}
      {error && <div style={styles.errorBox}>{error}</div>}

      <form style={styles.formCard} onSubmit={handleSubmit}>
        <div style={styles.formHeader}>
          <h3 style={styles.formTitle}>
            {editingId ? 'Editar contenido' : 'Crear contenido'}
          </h3>

          {editingId && (
            <button type="button" style={styles.secondaryButton} onClick={resetForm}>
              Cancelar edición
            </button>
          )}
        </div>

        <div style={styles.formGrid}>
          <input
            style={styles.input}
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <select
            style={styles.input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="energia">Uso eficiente de la energía</option>
            <option value="agua">Uso eficiente del agua</option>
            <option value="residuos">Gestión integral de residuos</option>
            <option value="papel">Uso eficiente del papel</option>
          </select>

          <select
            style={styles.input}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="text">Texto</option>
            <option value="image">Imagen</option>
            <option value="video">Video</option>
            <option value="file">Archivo</option>
          </select>

          <select
            style={styles.input}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="published">Publicado</option>
            <option value="draft">Borrador</option>
          </select>
        </div>

        <textarea
          style={{ ...styles.input, minHeight: '110px', resize: 'vertical' }}
          placeholder="Contenido / descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          style={styles.input}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
        />

        <button style={styles.primaryButton} type="submit">
          {editingId ? 'Actualizar contenido' : 'Guardar contenido'}
        </button>
      </form>

      <section style={styles.tableCard}>
        <div style={styles.tableHeader}>
          <h3 style={styles.sectionTitle}>Contenidos registrados</h3>
          <span style={styles.countBadge}>{items.length} contenidos</span>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Título</th>
                <th style={styles.th}>Categoría</th>
                <th style={styles.th}>Tipo</th>
                <th style={styles.th}>Estado</th>
                <th style={styles.th}>Archivo</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.title}</td>
                  <td style={styles.td}>{getCategoryLabel(item.category)}</td>
                  <td style={styles.td}>{getTypeLabel(item.type)}</td>
                  <td style={styles.td}>
                    <span style={item.status === 'published' ? styles.publishedBadge : styles.draftBadge}>
                      {item.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    {item.file_url ? (
                      <a
                        href={getBackendUrl(item.file_url)}
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
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button
                        type="button"
                        style={styles.editButton}
                        onClick={() => handleEdit(item)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        style={styles.deleteButton}
                        onClick={() => handleDelete(item.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td style={styles.td} colSpan="6">
                    No hay contenidos registrados todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function getCategoryLabel(category) {
  const labels = {
    energia: 'Uso eficiente de la energía',
    agua: 'Uso eficiente del agua',
    residuos: 'Gestión integral de residuos',
    papel: 'Uso eficiente del papel',
  };

  return labels[category] || category;
}

function getTypeLabel(type) {
  const labels = {
    text: 'Texto',
    image: 'Imagen',
    video: 'Video',
    file: 'Archivo',
  };

  return labels[type] || type;
}

const badgeBase = {
  display: 'inline-flex',
  borderRadius: '999px',
  padding: '7px 11px',
  fontSize: '12px',
  fontWeight: 800,
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
    color: '#444',
    lineHeight: 1.6,
  },
  successBox: {
    backgroundColor: '#eef8f3',
    color: 'var(--turquoise)',
    border: '1px solid #d7ebdf',
    borderRadius: '14px',
    padding: '14px 16px',
    marginBottom: '18px',
    fontWeight: 700,
  },
  errorBox: {
    backgroundColor: '#fff3f0',
    color: '#c0392b',
    border: '1px solid #f2c7c0',
    borderRadius: '14px',
    padding: '14px 16px',
    marginBottom: '18px',
    fontWeight: 700,
  },
  formCard: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--border)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: 'var(--shadow-card)',
    display: 'grid',
    gap: '14px',
    marginBottom: '24px',
  },
  formHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  formTitle: {
    margin: 0,
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '26px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))',
    gap: '14px',
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
  primaryButton: {
    backgroundColor: 'var(--green)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '13px 18px',
    fontSize: '14px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
  },
  secondaryButton: {
    backgroundColor: 'var(--turquoise)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '13px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
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
  },
  sectionTitle: {
    margin: 0,
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '26px',
  },
  countBadge: {
    color: 'var(--turquoise)',
    fontWeight: 800,
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
  },
  td: {
    padding: '15px 12px',
    borderBottom: '1px solid #eef1ef',
    color: '#222',
    verticalAlign: 'middle',
  },
  publishedBadge: {
    ...badgeBase,
    backgroundColor: '#eef8f3',
    color: 'var(--turquoise)',
  },
  draftBadge: {
    ...badgeBase,
    backgroundColor: '#fff7e6',
    color: '#9a6700',
  },
  link: {
    color: 'var(--turquoise)',
    fontWeight: 800,
    textDecoration: 'none',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  editButton: {
    backgroundColor: 'var(--turquoise)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 12px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  deleteButton: {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '8px 12px',
    fontWeight: 800,
    cursor: 'pointer',
  },
};

