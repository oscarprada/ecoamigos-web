import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function RankingPage() {
  const [data, setData] = useState({ ranking: [], currentPeriod: null });

  useEffect(() => {
    api.get('/public/ranking').then(({ data }) => setData(data));
  }, []);

  return (
    <div className="container stack-lg">
      <div className="section-header">
        <div>
          <h2>Ranking Ecoamigos</h2>
          <p>Consulta pública de posiciones, puntajes y periodo vigente.</p>
        </div>
        {data.currentPeriod && <span className="badge">{data.currentPeriod.name}</span>}
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Posición</th>
              <th>Equipo</th>
              <th>Dependencia</th>
              <th>Puntaje</th>
            </tr>
          </thead>
          <tbody>
            {data.ranking.map((row) => (
              <tr key={row.id}>
                <td>{row.position}</td>
                <td>{row.name}</td>
                <td>{row.dependency}</td>
                <td>{row.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
