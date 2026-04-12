import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'leader', team_id: '' });

  const load = async () => {
    const [usersRes, teamsRes] = await Promise.all([api.get('/admin/users'), api.get('/admin/teams')]);
    setUsers(usersRes.data);
    setTeams(teamsRes.data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/admin/users', form);
    setForm({ name: '', email: '', password: '', role: 'leader', team_id: '' });
    load();
  };

  return (
    <div className="container stack-lg">
      <h2>Usuarios</h2>
      <form className="card form two-cols-form" onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input type="email" placeholder="Correo" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input type="password" placeholder="Contraseña" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="leader">Líder</option>
          <option value="admin">Administrador</option>
        </select>
        <select value={form.team_id} onChange={(e) => setForm({ ...form, team_id: e.target.value })}>
          <option value="">Seleccione equipo</option>
          {teams.map((team) => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>
        <button className="button primary" type="submit">Crear usuario</button>
      </form>
      <div className="table-wrapper">
        <table>
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Equipo</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td><td>{user.team_name || '-'}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
