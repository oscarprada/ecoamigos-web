import { useEffect, useState } from 'react';
import api from '../../api/client';
import Card from '../../components/Card';

export default function WinnersPage() {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    api.get('/public/ranking').then(({ data }) => setWinners(data.winners));
  }, []);

  return (
    <div className="container">
      <h2>Ganadores anteriores</h2>
      <div className="grid two-cols">
        {winners.map((winner) => (
          <Card key={winner.id} title={winner.team_name}>
            <p><strong>Periodo:</strong> {winner.period_name}</p>
            <p><strong>Puntaje final:</strong> {winner.final_score}</p>
            <p><strong>Premio:</strong> {winner.prize_name || 'Pendiente'}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
