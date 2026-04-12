import { useEffect, useMemo, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/Card';

export default function LeaderDashboard() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    api.get('/recycling/mine').then(({ data }) => setRecords(data));
    api.get('/public/ranking').then(({ data }) => setRanking(data.ranking));
  }, []);

  const teamStats = useMemo(() => ranking.find((r) => Number(r.id) === Number(user?.team_id)), [ranking, user]);

  return (
    <div className="container stack-lg">
      <div className="section-header">
        <div>
          <h2>Panel del líder</h2>
          <p>Bienvenido, {user?.name}. Equipo: {user?.team_name}</p>
        </div>
        <a href="/leader/register" className="button primary">Registrar reciclaje</a>
      </div>

      <div className="grid three-cols compact-grid">
        <Card title="Puntaje del equipo"><p className="metric">{teamStats?.score || 0}</p></Card>
        <Card title="Posición actual"><p className="metric">#{teamStats?.position || '-'}</p></Card>
        <Card title="Registros enviados"><p className="metric">{records.length}</p></Card>
      </div>

      <Card title="Mis registros recientes">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Material</th>
                <th>Cantidad</th>
                <th>Estado</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {records.map((item) => (
                <tr key={item.id}>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>{item.material_type}</td>
                  <td>{item.quantity} {item.unit}</td>
                  <td><span className={`status ${item.status}`}>{item.status}</span></td>
                  <td>{item.points_awarded}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
