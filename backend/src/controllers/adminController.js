import bcrypt from 'bcrypt';
import { query } from '../config/db.js';

export async function getDashboard(_req, res) {
  try {
    const users = await query(`SELECT COUNT(*) FROM users`);
    const teams = await query(`SELECT COUNT(*) FROM teams`);
    const records = await query(`SELECT COUNT(*) FROM recycling_records`);
    const pending = await query(
      `SELECT COUNT(*) FROM recycling_records WHERE status = 'pending'`
    );

    res.json({
      users: Number(users.rows[0].count),
      teams: Number(teams.rows[0].count),
      records: Number(records.rows[0].count),
      pending: Number(pending.rows[0].count),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al cargar dashboard',
      error: error.message,
    });
  }
}

export async function listUsers(_req, res) {
  try {
    const result = await query(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        t.name AS team_name
      FROM users u
      LEFT JOIN teams t ON t.id = u.team_id
      ORDER BY u.id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error al listar usuarios',
      error: error.message,
    });
  }
}

export async function createUser(req, res) {
  try {
    const { name, email, password, role, team_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await query(
      `
        INSERT INTO users (
          name,
          email,
          password,
          password_hash,
          role,
          is_active,
          team_id
        )
        VALUES ($1,$2,$3,$4,$5,true,$6)
        RETURNING id, name, email, role, team_id
      `,
      [
        name,
        email,
        hashedPassword,
        hashedPassword,
        role,
        role === 'leader' ? team_id : null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('CREATE USER ERROR:', error);

    res.status(500).json({
      message: 'Error al crear usuario',
      error: error.message,
    });
  }
}

export async function listTeams(_req, res) {
  try {
    const result = await query(`
      SELECT *
      FROM teams
      ORDER BY name ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error al listar equipos',
      error: error.message,
    });
  }
}

export async function createTeam(req, res) {
  try {
    const { name, dependency } = req.body;

    const result = await query(
      `
        INSERT INTO teams (name, dependency)
        VALUES ($1,$2)
        RETURNING *
      `,
      [name, dependency]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear equipo',
      error: error.message,
    });
  }
}

export async function listPeriods(_req, res) {
  try {
    const result = await query(`
      SELECT *
      FROM periods
      ORDER BY start_date DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error al listar periodos',
      error: error.message,
    });
  }
}

export async function createPeriod(req, res) {
  try {
    const { name, start_date, end_date, is_active } = req.body;

    if (is_active) {
      await query(`UPDATE periods SET is_active = false`);
    }

    const result = await query(
      `
        INSERT INTO periods (
          name,
          start_date,
          end_date,
          is_active
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *
      `,
      [name, start_date, end_date, is_active]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear periodo',
      error: error.message,
    });
  }
}

export async function listPrizes(_req, res) {
  try {
    const result = await query(`
      SELECT *
      FROM prizes
      ORDER BY id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error al listar premios',
      error: error.message,
    });
  }
}

export async function createPrize(req, res) {
  try {
    const { name, description, is_active } = req.body;

    const result = await query(
      `
        INSERT INTO prizes (
          name,
          description,
          is_active
        )
        VALUES ($1,$2,$3)
        RETURNING *
      `,
      [name, description, is_active]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear premio',
      error: error.message,
    });
  }
}

export async function listContent(_req, res) {
  try {
    const result = await query(`
      SELECT *
      FROM content_items
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error al listar contenidos',
      error: error.message,
    });
  }
}

export async function createContent(req, res) {
  try {
    const {
      title,
      category,
      type,
      description,
      status,
    } = req.body;

    const file_url = req.file
      ? `/uploads/content/${req.file.filename}`
      : null;

    const result = await query(
      `
        INSERT INTO content_items (
          title,
          category,
          type,
          description,
          file_url,
          status,
          created_by
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
      `,
      [
        title,
        category,
        type,
        description || null,
        file_url,
        status || 'published',
        req.user.id,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('CREATE CONTENT ERROR:', error);

    res.status(500).json({
      message: 'Error al crear contenido',
      error: error.message,
    });
  }
}

export async function updateContent(req, res) {
  try {
    const { id } = req.params;
    const { title, category, type, description, status } = req.body;

    const current = await query(
      `SELECT * FROM content_items WHERE id = $1`,
      [id]
    );

    if (!current.rows[0]) {
      return res.status(404).json({
        message: 'Contenido no encontrado',
      });
    }

    const currentFileUrl = current.rows[0].file_url;

    const file_url = req.file
      ? `/uploads/content/${req.file.filename}`
      : currentFileUrl;

    const result = await query(
      `
        UPDATE content_items
        SET
          title = $1,
          category = $2,
          type = $3,
          description = $4,
          file_url = $5,
          status = $6
        WHERE id = $7
        RETURNING *
      `,
      [
        title,
        category,
        type,
        description || null,
        file_url,
        status,
        id,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('UPDATE CONTENT ERROR:', error);

    res.status(500).json({
      message: 'Error al actualizar contenido',
      error: error.message,
    });
  }
}

export async function deleteContent(req, res) {
  try {
    const { id } = req.params;

    await query(
      `DELETE FROM content_items WHERE id = $1`,
      [id]
    );

    res.json({
      message: 'Contenido eliminado correctamente',
    });
  } catch (error) {
    console.error('DELETE CONTENT ERROR:', error);

    res.status(500).json({
      message: 'Error al eliminar contenido',
      error: error.message,
    });
  }
}




