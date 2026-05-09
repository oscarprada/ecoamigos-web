import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminContentPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    title: '',
    category: 'energia',
    type: 'text',
    description: '',
    status: 'published',
    file: null,
  });

  const load = () => {
    api.get('/admin/content').then(({ data }) => setItems(data));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append('title', form.title);
    payload.append('category', form.category);
    payload.append('type', form.type);
    payload.append('description', form.description);
    payload.append('status', form.status);

    if (form.file) {
      payload.append('file', form.file);
    }

    await api.post('/admin/content', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    setForm({
      title: '',
      category: 'energia',
      type: 'text',
      description: '',
      status: 'published',
      file: null,
    });

    load();
  };

  return (
    <div className="container stack-lg">
      <h2>Gestión de contenidos educativos</h2>

      <form className="card form two-cols-form" onSubmit={handleSubmit}>
        <input
          placeholder="Título"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="energia">Uso eficiente de la energía</option>
          <option value="agua">Uso eficiente del agua</option>
          <option value="residuos">Gestión integral de residuos</option>
          <option value="papel">Uso eficiente del papel</option>
        </select>

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="text">Texto</option>
          <option value="image">Imagen</option>
          <option value="video">Video</option>
          <option value="file">Archivo</option>
        </select>

        <textarea
          placeholder="Contenido / descripción"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <input
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="published">Publicado</option>
          <option value="draft">Borrador</option>
        </select>

        <button className="button primary" type="submit">
          Guardar contenido
        </button>
      </form>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Archivo</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{getCategoryLabel(item.category)}</td>
                <td>{getTypeLabel(item.type)}</td>
                <td>{item.status === 'published' ? 'Publicado' : 'Borrador'}</td>
                <td>
                  {item.file_url ? (
                    <a
                      href={`http://localhost:3000${item.file_url}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

