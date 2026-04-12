import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await query(
      `SELECT u.id, u.name, u.email, u.password_hash, u.role, u.is_active, u.team_id, t.name AS team_name
       FROM users u
       LEFT JOIN teams t ON t.id = u.team_id
       WHERE u.email = $1`,
      [email]
    );

    const user = result.rows[0];
    if (!user || !user.is_active) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email, team_id: user.team_id },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        team_id: user.team_id,
        team_name: user.team_name,
      },
    });
  } catch (error) {
  console.error('LOGIN ERROR:', error);
  return res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
}
}

export async function me(req, res) {
  try {
    const result = await query(
      `SELECT u.id, u.name, u.email, u.role, u.team_id, t.name AS team_name
       FROM users u
       LEFT JOIN teams t ON t.id = u.team_id
       WHERE u.id = $1`,
      [req.user.id]
    );

    return res.json(result.rows[0]);
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
}


