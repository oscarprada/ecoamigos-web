import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminSettingsPage() {
  const [teams, setTeams] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [prizes, setPrizes] = useState([]);
  const [teamForm, setTeamForm] = useState({ name: '', dependency: '' });
  const [periodForm, setPeriodForm] = useState({ name: '', start_date: '', end_date: '', is_active: true });
  const [prizeForm, setPrizeForm] = useState({ name: '', description: '', is_active: true });

  const load = async () => {
    const [teamsRes, periodsRes, prizesRes] = await Promise.all([
      api.get('/admin/teams'), api.get('/admin/periods'), api.get('/admin/prizes')
    ]);
    setTeams(teamsRes.data);
    setPeriods(periodsRes.data);
    setPrizes(prizesRes.data);
  };
  useEffect(() => { load(); }, []);

  const submitTeam = async (e) => { e.preventDefault(); await api.post('/admin/teams', teamForm); setTeamForm({ name: '', dependency: '' }); load(); };
  const submitPeriod = async (e) => { e.preventDefault(); await api.post('/admin/periods', periodForm); setPeriodForm({ name: '', start_date: '', end_date: '', is_active: true }); load(); };
  const submitPrize = async (e) => { e.preventDefault(); await api.post('/admin/prizes', prizeForm); setPrizeForm({ name: '', description: '', is_active: true }); load(); };

  return (
    <div className="container stack-lg">
      <h2>Configuración general</h2>
      <div className="grid three-cols">
        <form className="card form" onSubmit={submitTeam}>
          <h3>Equipos</h3>
          <input placeholder="Nombre del equipo" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} required />
          <input placeholder="Dependencia" value={teamForm.dependency} onChange={(e) => setTeamForm({ ...teamForm, dependency: e.target.value })} required />
          <button className="button primary" type="submit">Crear equipo</button>
          <ul>{teams.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
        </form>
        <form className="card form" onSubmit={submitPeriod}>
          <h3>Periodos</h3>
          <input placeholder="Nombre" value={periodForm.name} onChange={(e) => setPeriodForm({ ...periodForm, name: e.target.value })} required />
          <input type="date" value={periodForm.start_date} onChange={(e) => setPeriodForm({ ...periodForm, start_date: e.target.value })} required />
          <input type="date" value={periodForm.end_date} onChange={(e) => setPeriodForm({ ...periodForm, end_date: e.target.value })} required />
          <label><input type="checkbox" checked={periodForm.is_active} onChange={(e) => setPeriodForm({ ...periodForm, is_active: e.target.checked })} /> Activo</label>
          <button className="button primary" type="submit">Crear periodo</button>
          <ul>{periods.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
        </form>
        <form className="card form" onSubmit={submitPrize}>
          <h3>Premios</h3>
          <input placeholder="Nombre" value={prizeForm.name} onChange={(e) => setPrizeForm({ ...prizeForm, name: e.target.value })} required />
          <textarea placeholder="Descripción" value={prizeForm.description} onChange={(e) => setPrizeForm({ ...prizeForm, description: e.target.value })} />
          <label><input type="checkbox" checked={prizeForm.is_active} onChange={(e) => setPrizeForm({ ...prizeForm, is_active: e.target.checked })} /> Activo</label>
          <button className="button primary" type="submit">Crear premio</button>
          <ul>{prizes.map((item) => <li key={item.id}>{item.name}</li>)}</ul>
        </form>
      </div>
    </div>
  );
}
