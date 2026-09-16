import { createContentHandlers } from '../services/contentFiles.js';
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
        u.team_id,
        u.is_active,
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
  let client;
  let transactionOpen = false;
  let releaseError;
  try {
    const { name, email, password, role, team_id } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    client = await pool.connect();
    await client.query('BEGIN');
    transactionOpen = true;
    // Hash before locking; serialize only the short count/insert on users.
    await client.query('LOCK TABLE users IN SHARE ROW EXCLUSIVE MODE');
    const count = await client.query('SELECT COUNT(*)::int AS total FROM users');
    if (count.rows[0].total >= 15) {
      await client.query('ROLLBACK');
      transactionOpen = false;
      return res.status(409).json({ message: 'Se alcanzo el maximo de 15 usuarios totales', code: 'USER_LIMIT_REACHED' });
    }
    const result = await client.query(
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

    await client.query('COMMIT');
    transactionOpen = false;
    try { logInfo(
      `Usuario creado: ${email} | rol=${role} | admin_id=${req.user.id}`
    ); } catch { /* A committed user must not depend on file logging. */ }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (transactionOpen) {
      try { await client.query('ROLLBACK'); }
      catch (rollbackError) { releaseError = rollbackError; }
    }
    try { logError(`CREATE USER ERROR: ${error.message}`); }
    catch { /* Preserve the controlled response if logging fails. */ }

    res.status(500).json({
      message: 'Error al crear usuario',
    });
  } finally {
    if (client) client.release(releaseError);
  }
}

// F15: partial updates accept only explicitly authorized fields.
function editFields(body, limits, extra = []) {
  if (!body || Array.isArray(body) || typeof body !== 'object') return null;
  const keys = Object.keys(body);
  if (!keys.length || keys.some(key => !Object.hasOwn(limits, key) && !extra.includes(key))) return null;
  const values = { ...body };
  for (const [field, max] of Object.entries(limits)) {
    if (!Object.hasOwn(values, field)) continue;
    if (typeof values[field] !== 'string' || !values[field].trim() || values[field].trim().length > max) return null;
    values[field] = values[field].trim();
  }
  return values;
}

function editError(res, error, entity) {
  if (error.code === '23505') return res.status(409).json({ message: entity === 'usuario' ? 'El email ya existe' : 'El nombre del equipo ya existe' });
  if (['23503', '23502', '22001', '22P02'].includes(error.code)) return res.status(400).json({ message: 'Datos inválidos' });
  return res.status(500).json({ message: 'Error al actualizar ' + entity });
}

export async function updateUser(req, res) {
  const values = editFields(req.body, { name: 120, email: 150 }, ['team_id', 'is_active']);
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647 || !values ||
      (Object.hasOwn(values, 'email') && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) ||
      (Object.hasOwn(values, 'is_active') && typeof values.is_active !== 'boolean') ||
      (Object.hasOwn(values, 'team_id') && values.team_id !== null &&
        (!Number.isInteger(values.team_id) || values.team_id < 1 || values.team_id > 2147483647))) {
    return res.status(400).json({ message: 'Datos de usuario inválidos' });
  }
  try {
    const current = await query('SELECT role FROM users WHERE id = $1', [id]);
    if (!current.rows[0]) return res.status(404).json({ message: 'Usuario no encontrado' });
    if (Object.hasOwn(values, 'team_id') &&
        ((current.rows[0].role === 'leader' && values.team_id === null) ||
         (current.rows[0].role === 'admin' && values.team_id !== null))) {
      return res.status(400).json({ message: 'Equipo inválido para el rol del usuario' });
    }
    // The FK checks existence atomically. Historical recycling_records are never updated.
    const has = key => Object.hasOwn(values, key);
    const result = await query(
      `UPDATE users SET
        name = CASE WHEN $1 THEN $2 ELSE name END,
        email = CASE WHEN $3 THEN $4 ELSE email END,
        team_id = CASE WHEN $5 THEN $6 ELSE team_id END,
        is_active = CASE WHEN $7 THEN $8 ELSE is_active END
       WHERE id = $9 RETURNING id, name, email, role, team_id, is_active`,
      [has('name'), values.name, has('email'), values.email, has('team_id'), values.team_id, has('is_active'), values.is_active, id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Usuario no encontrado' });
    return res.json(result.rows[0]);
  } catch (error) { return editError(res, error, 'usuario'); }
}

export async function updateTeam(req, res) {
  const values = editFields(req.body, { name: 100, dependency: 150 });
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1 || id > 2147483647 || !values) {
    return res.status(400).json({ message: 'Datos de equipo inválidos' });
  }
  try {
    const result = await query(
      `UPDATE teams SET name = CASE WHEN $1 THEN $2 ELSE name END,
        dependency = CASE WHEN $3 THEN $4 ELSE dependency END
       WHERE id = $5 RETURNING id, name, dependency`,
      [Object.hasOwn(values, 'name'), values.name, Object.hasOwn(values, 'dependency'), values.dependency, id]);
    if (!result.rows[0]) return res.status(404).json({ message: 'Equipo no encontrado' });
    return res.json(result.rows[0]);
  } catch (error) { return editError(res, error, 'equipo'); }
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

export const { createContent, updateContent, deleteContent } = createContentHandlers(pool, query);
