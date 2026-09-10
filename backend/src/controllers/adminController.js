import bcrypt from 'bcrypt';

import { query, pool } from '../config/db.js';
import { logInfo, logError } from '../utils/logger.js';

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
    logError(`DASHBOARD ERROR: ${error.message}`);

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
    logError(`LIST USERS ERROR: ${error.message}`);

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
          password_hash,
          role,
          is_active,
          team_id
        )
        VALUES ($1,$2,$3,$4,true,$5)
        RETURNING id, name, email, role, team_id
      `,
      [
        name,
        email,
        hashedPassword,
        role,
        role === 'leader' ? team_id : null,
      ]
    );

    logInfo(
      `Usuario creado: ${email} | rol=${role} | admin_id=${req.user.id}`
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logError(`CREATE USER ERROR: ${error.message}`);

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
    logError(`LIST TEAMS ERROR: ${error.message}`);

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

    logInfo(
      `Equipo creado: ${name} | dependencia=${dependency} | admin_id=${req.user.id}`
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logError(`CREATE TEAM ERROR: ${error.message}`);

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
    logError(`LIST PERIODS ERROR: ${error.message}`);

    res.status(500).json({
      message: 'Error al listar periodos',
      error: error.message,
    });
  }
}

export async function createPeriod(req, res) {
  let client;
  let transactionOpen = false;
  let releaseError;
  try {
    const { name, start_date, end_date, is_active } = req.body;
    if (is_active != null && typeof is_active !== 'boolean') {
      return res.status(400).json({ message: 'is_active debe ser booleano' });
    }
    client = await pool.connect();
    await client.query('BEGIN');
    transactionOpen = true;
    // Serializes writers even when there is no active row; ordinary readers continue.
    await client.query('LOCK TABLE periods IN SHARE ROW EXCLUSIVE MODE');
    if (is_active === true) {
      await client.query('UPDATE periods SET is_active = false');
    }
    const result = await client.query(
      `INSERT INTO periods (name, start_date, end_date, is_active)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, start_date, end_date, is_active]
    );
    await client.query('COMMIT');
    transactionOpen = false;
    try {
      logInfo(`Periodo creado: ${name} | activo=${is_active} | admin_id=${req.user.id}`);
    } catch { /* A committed decision must not depend on file logging. */ }
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if (transactionOpen) {
      try { await client.query('ROLLBACK'); }
      catch (rollbackError) { releaseError = rollbackError; }
    }
    try { logError(`CREATE PERIOD ERROR: ${error.message}`); }
    catch { /* Preserve the controlled response if logging fails. */ }
    if (error.code === '23505' || error.code === '40001' || error.code === '40P01') {
      return res.status(409).json({ message: 'Conflicto al crear periodo' });
    }
    if (['23502', '22007', '22008', '22001'].includes(error.code)) {
      return res.status(400).json({ message: 'Datos de periodo invalidos' });
    }
    return res.status(500).json({ message: 'Error al crear periodo' });
  } finally {
    if (client) client.release(releaseError);
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
    logError(`LIST CONTENT ERROR: ${error.message}`);

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

    logInfo(
      `Contenido creado: ${title} | categoria=${category} | tipo=${type} | admin_id=${req.user.id}`
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logError(`CREATE CONTENT ERROR: ${error.message}`);

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

    logInfo(
      `Contenido actualizado: id=${id} | titulo=${title} | admin_id=${req.user.id}`
    );

    res.json(result.rows[0]);
  } catch (error) {
    logError(`UPDATE CONTENT ERROR: ${error.message}`);

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

    logInfo(
      `Contenido eliminado: id=${id} | admin_id=${req.user.id}`
    );

    res.json({
      message: 'Contenido eliminado correctamente',
    });
  } catch (error) {
    logError(`DELETE CONTENT ERROR: ${error.message}`);

    res.status(500).json({
      message: 'Error al eliminar contenido',
      error: error.message,
    });
  }
}

