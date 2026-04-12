import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminReviewsPage() {
  const [records, setRecords] = useState([]);

  const load = () => api.get('/recycling/pending').then(({ data }) => setRecords(data));
  useEffect(() => { load(); }, []);

  const review = async (id, status) => {
    await api.patch(`/recycling/${id}/review`, { status, review_notes: `Registro ${status}` });
    load();
  };

  return (
    <div className="container stack-lg">
      <h2>Validación de reciclajes</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Líder</th>
              <th>Equipo</th>
              <th>Material</th>
              <th>Cantidad</th>
              <th>Calidad</th>
              <th>Evidencia</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>{record.leader_name}</td>
                <td>{record.team_name}</td>
                <td>{record.material_type}</td>
                <td>{record.quantity} {record.unit}</td>
                <td>{record.quality_level}</td>
                <td>{record.evidence_url ? <a href={`http://localhost:3000${record.evidence_url}`} target="_blank" rel="noreferrer">Ver</a> : 'Sin archivo'}</td>
                <td>
                  <div className="inline-actions">
                    <button className="button small success" onClick={() => review(record.id, 'approved')}>Aprobar</button>
                    <button className="button small danger" onClick={() => review(record.id, 'rejected')}>Rechazar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
