import { useEffect, useState } from 'react';
import api from '../../api/client';
import Card from '../../components/Card';

export default function PrizesPage() {
  const [prizes, setPrizes] = useState([]);

  useEffect(() => {
    api.get('/public/ranking').then(({ data }) => setPrizes(data.prizes));
  }, []);

  return (
    <div className="container">
      <h2>Premios de la campaña</h2>
      <div className="grid three-cols">
        {prizes.map((prize) => (
          <Card key={prize.id} title={prize.name}>
            <p>{prize.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
