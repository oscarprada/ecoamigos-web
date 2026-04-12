import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import api from '../../api/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, pendingRecords: 0, teams: 0, publishedContent: 0 });
  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data));
  }, []);

  return (
    <div className="container stack-lg">
      <h2>Panel de administración</h2>
      <div className="grid four-cols compact-grid">
        <Card title="Usuarios activos"><p className="metric">{stats.users}</p></Card>
        <Card title="Pendientes"><p className="metric">{stats.pendingRecords}</p></Card>
        <Card title="Equipos"><p className="metric">{stats.teams}</p></Card>
        <Card title="Contenido publicado"><p className="metric">{stats.publishedContent}</p></Card>
      </div>
      <div className="grid two-cols">
        <Card title="Accesos rápidos">
          <ul>
            <li><a href="/admin/reviews">Validar reciclajes</a></li>
            <li><a href="/admin/users">Usuarios</a></li>
            <li><a href="/admin/content">Contenidos</a></li>
            <li><a href="/admin/settings">Equipos, periodos y premios</a></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
