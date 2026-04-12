import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';

export default function RegisterRecyclingPage() {
  const navigate = useNavigate();
  const [periods, setPeriods] = useState([]);
  const [form, setForm] = useState({
    material_type: 'papel_carton',
    quantity: 1,
    unit: 'kg',
    quality_level: 'media',
    criteria_count: 1,
    notes: '',
    period_id: '',
    record_date: new Date().toISOString().slice(0, 10),
    evidence: null,
  });

  useEffect(() => {
    api.get('/public/ranking').then(({ data }) => {
      if (data.currentPeriod) {
        setPeriods([data.currentPeriod]);
        setForm((prev) => ({ ...prev, period_id: data.currentPeriod.id }));
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'evidence' && value) payload.append('evidence', value);
        if (key !== 'evidence') payload.append(key, value);
      }
    });
    await api.post('/recycling', payload, { headers: { 'Content-Type': 'multipart/form-data' } });
    navigate('/leader');
  };

  return (
    <div className="container narrow">
      <form className="card form" onSubmit={handleSubmit}>
        <h2>Registrar reciclaje</h2>
        <label>Material
          <select value={form.material_type} onChange={(e) => setForm({ ...form, material_type: e.target.value })}>
            <option value="papel_carton">Papel y cartón</option>
            <option value="plastico">Plástico</option>
            <option value="vidrio">Vidrio</option>
            <option value="metal">Metal</option>
            <option value="organico">Orgánico</option>
          </select>
        </label>
        <label>Cantidad
          <input type="number" min="0.1" step="0.1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        </label>
        <label>Unidad
          <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
        </label>
        <label>Calidad
          <select value={form.quality_level} onChange={(e) => setForm({ ...form, quality_level: e.target.value })}>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </label>
        <label>Criterios cumplidos
          <input type="number" min="0" max="5" value={form.criteria_count} onChange={(e) => setForm({ ...form, criteria_count: e.target.value })} />
        </label>
        <label>Periodo
          <select value={form.period_id} onChange={(e) => setForm({ ...form, period_id: e.target.value })}>
            {periods.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>
        <label>Fecha del registro
          <input type="date" value={form.record_date} onChange={(e) => setForm({ ...form, record_date: e.target.value })} />
        </label>
        <label>Observaciones
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
        </label>
        <label>Evidencia (foto o video)
          <input type="file" accept="image/*,video/*" onChange={(e) => setForm({ ...form, evidence: e.target.files[0] })} />
        </label>
        <button className="button primary" type="submit">Enviar registro</button>
      </form>
    </div>
  );
}
