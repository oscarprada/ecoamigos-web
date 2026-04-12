import bcrypt from 'bcrypt';
import { query } from '../config/db.js';

export async function getDashboard(req, res) {
  try {
    const [users, pending, teams, content] = await Promise.all([
      query(`SELECT COUNT(*)::int AS total FROM users WHERE is_active = true`),
      query(`SELECT COUNT(*)::int AS total FROM recycling_records WHERE status = 'pending'`),
      query(`SELECT COUNT(*)::int AS total FROM teams`),
      query(`SELECT COUNT(*)::int AS total FROM content_items WHERE status = 'published'`),
    ]);

    res.json({
      users: users.rows[0].total,
      pendingRecords: pending.rows[0].total,
      teams: teams.rows[0].total,
      publishedContent: content.rows[0].total,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cargar dashboard', error: error.message });
  }
}

export async function listUsers(req, res) {
  try {
    const users = await query(
      `SELECT u.id, u.name, u.email, u.role, u.is_active, u.created_at, t.name AS team_name
       FROM users u
       LEFT JOIN teams t ON t.id = u.team_id
       ORDER BY u.created_at DESC`
    );
    res.json(users.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar usuarios', error: error.message });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, password, role, team_id } = req.body;

    // 🔒 Validaciones básicas
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // 🔒 Máximo 15 usuarios
    const countResult = await query(`SELECT COUNT(*)::int AS total FROM users`);
    if (countResult.rows[0].total >= 15) {
      return res.status(400).json({ message: 'Solo se permiten máximo 15 usuarios' });
    }

    // 🔒 Evitar correos duplicados
    const existingUser = await query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // 🔒 Validación de rol
    if (!['leader', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    // 🔒 Líder debe tener equipo
    if (role === 'leader' && !team_id) {
      return res.status(400).json({ message: 'El líder debe tener un equipo asignado' });
    }

    // 🔒 Encriptar contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (name, email, password, password_hash, role, team_id, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, name, email, role, team_id`,
      [
        name,
        email,
        password_hash,      // ⚠️ necesario por tu estructura actual
        password_hash,
        role,
        role === 'leader' ? team_id : null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('CREATE USER ERROR:', error);
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
}

export async function createContent(req, res) {
  try {
    const { title, type, description, youtube_url, file_url, status } = req.body;

    const result = await query(
      `INSERT INTO content_items (title, type, description, youtube_url, file_url, status, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [
        title,
        type,
        description,
        youtube_url || null,
        file_url || null,
        status || 'published',
        req.user.id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear contenido', error: error.message });
  }
}

export async function listContent(req, res) {
  try {
    const result = await query(`SELECT * FROM content_items ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar contenido', error: error.message });
  }
}

export async function createTeam(req, res) {
  try {
    const { name, dependency } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre del equipo es obligatorio' });
    }

    const result = await query(
      `INSERT INTO teams (name, dependency)
       VALUES ($1, $2)
       RETURNING *`,
      [name, dependency]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear equipo', error: error.message });
  }
}

export async function listTeams(_req, res) {
  try {
    const result = await query(`SELECT * FROM teams ORDER BY name ASC`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar equipos', error: error.message });
  }
}

export async function createPeriod(req, res) {
  try {
    const { name, start_date, end_date, is_active } = req.body;

    if (!name || !start_date || !end_date) {
      return res.status(400).json({ message: 'Datos del periodo incompletos' });
    }

    if (is_active) {
      await query(`UPDATE periods SET is_active = false WHERE is_active = true`);
    }

    const result = await query(
      `INSERT INTO periods (name, start_date, end_date, is_active)
       VALUES ($1,$2,$3,$4)
       RETURNING *`,
      [name, start_date, end_date, Boolean(is_active)]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear periodo', error: error.message });
  }
}

export async function listPeriods(_req, res) {
  try {
    const result = await query(`SELECT * FROM periods ORDER BY start_date DESC`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar periodos', error: error.message });
  }
}

export async function createPrize(req, res) {
  try {
    const { name, description, is_active } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'El nombre del premio es obligatorio' });
    }

    const result = await query(
      `INSERT INTO prizes (name, description, is_active)
       VALUES ($1,$2,$3)
       RETURNING *`,
      [name, description, is_active ?? true]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear premio', error: error.message });
  }
}

export async function listPrizes(_req, res) {
  try {
    const result = await query(`SELECT * FROM prizes ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar premios', error: error.message });
  }
}


