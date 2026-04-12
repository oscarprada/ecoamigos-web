import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminContentPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', type: 'video', description: '', youtube_url: '', file_url: '', status: 'published' });

  const load = () => api.get('/admin/content').then(({ data }) => setItems(data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/admin/content', form);
    setForm({ title: '', type: 'video', description: '', youtube_url: '', file_url: '', status: 'published' });
    load();
  };

  return (
    <div className="container stack-lg">
      <h2>Gestión de contenidos</h2>
      <form className="card form two-cols-form" onSubmit={handleSubmit}>
        <input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
          <option value="video">Video</option>
          <option value="tip">Tip</option>
          <option value="guide">Guía</option>
          <option value="blog">Blog</option>
        </select>
        <textarea placeholder="Descripción" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="URL de YouTube" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} />
        <input placeholder="URL de archivo" value={form.file_url} onChange={(e) => setForm({ ...form, file_url: e.target.value })} />
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
          <option value="published">Publicado</option>
          <option value="draft">Borrador</option>
        </select>
        <button className="button primary" type="submit">Guardar</button>
      </form>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Título</th><th>Tipo</th><th>Estado</th><th>YouTube</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td><td>{item.type}</td><td>{item.status}</td>
                <td>{item.youtube_url ? <a href={item.youtube_url} target="_blank" rel="noreferrer">Abrir</a> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
