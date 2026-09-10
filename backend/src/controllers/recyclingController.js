import { query, pool } from '../config/db.js';
import { logInfo, logError } from '../utils/logger.js';
import {
  CatalogReferenceValidationError,
  validateCatalogReference,
} from '../utils/catalogReference.js';

function normalizeValue(value) {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
}

async function getCatalogPoints(client, {
  catalog_group_name,
  catalog_action_name,
  catalog_action_level,
}) {
  if (!catalog_group_name || !catalog_action_name) {
    return 0;
  }

  const result = await client.query(
    `
      SELECT points
      FROM points_catalog
      WHERE LOWER(TRIM(group_name)) = LOWER(TRIM($1))
        AND LOWER(TRIM(action_name)) = LOWER(TRIM($2))
        AND LOWER(TRIM(COALESCE(action_level, ''))) = LOWER(TRIM(COALESCE($3, '')))
      ORDER BY id ASC
      LIMIT 1
    `,
    [catalog_group_name, catalog_action_name, catalog_action_level || '']
  );

  return Number(result.rows[0]?.points || 0);
}

async function findCatalogEntry({
  catalog_group_name,
  catalog_action_name,
  catalog_action_level,
}) {
  const result = await query(
    `
      SELECT group_name, action_name, action_level
      FROM points_catalog
      WHERE LOWER(TRIM(group_name)) = LOWER(TRIM($1))
        AND LOWER(TRIM(action_name)) = LOWER(TRIM($2))
        AND LOWER(TRIM(COALESCE(action_level, ''))) = LOWER(TRIM(COALESCE($3, '')))
      ORDER BY id ASC
      LIMIT 1
    `,
    [catalog_group_name, catalog_action_name, catalog_action_level || '']
  );

  return result.rows[0] || null;
}

export async function createRecord(req, res) {
  try {
    const {
      material_type,
      quantity,
      unit,
      quality_level,
      criteria_count,
      notes,
      period_id,
      record_date,
      catalog_group_name,
      catalog_action_name,
      catalog_action_level,
    } = req.body;

    const evidence_url = req.file ? `/uploads/${req.file.filename}` : null;
    const catalogReference = await validateCatalogReference({
      materialType: material_type,
      quantity,
      receivedReference: {
        catalog_group_name,
        catalog_action_name,
        catalog_action_level,
      },
      findCatalogEntry,
    });

    const result = await query(
      `
        INSERT INTO recycling_records (
          user_id,
          team_id,
          material_type,
          quantity,
          unit,
          quality_level,
          criteria_count,
          notes,
          evidence_url,
          period_id,
          record_date,
          status,
          catalog_group_name,
          catalog_action_name,
          catalog_action_level,
          points_awarded
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending',$12,$13,$14,0
        )
        RETURNING *
      `,
      [
        req.user.id,
        req.user.team_id,
        normalizeValue(material_type),
        quantity,
        normalizeValue(unit),
        normalizeValue(quality_level),
        criteria_count,
        normalizeValue(notes),
        evidence_url,
        period_id || null,
        record_date || new Date(),
        catalogReference.catalog_group_name,
        catalogReference.catalog_action_name,
        catalogReference.catalog_action_level,
      ]
    );

    logInfo(
      `Registro de reciclaje creado: record_id=${result.rows[0].id} | user_id=${req.user.id} | team_id=${req.user.team_id} | material=${material_type} | cantidad=${quantity}${unit}`
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    logError(`CREATE RECYCLING ERROR user_id=${req.user?.id}: ${error.message}`);

    if (error instanceof CatalogReferenceValidationError) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: 'Error al registrar reciclaje',
    });
  }
}

export async function listMyRecords(req, res) {
  try {
    const result = await query(
      `
        SELECT
          rr.*,
          p.name AS period_name
        FROM recycling_records rr
        LEFT JOIN periods p ON p.id = rr.period_id
        WHERE rr.user_id = $1
        ORDER BY rr.created_at DESC
      `,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    logError(`LIST MY RECORDS ERROR user_id=${req.user?.id}: ${error.message}`);

    res.status(500).json({
      message: 'Error al listar registros',
      error: error.message,
    });
  }
}

export async function listPendingRecords(_req, res) {
  try {
    const result = await query(
      `
        SELECT
          rr.*,
          u.name AS leader_name,
          t.name AS team_name,
          p.name AS period_name
        FROM recycling_records rr
        JOIN users u ON u.id = rr.user_id
        JOIN teams t ON t.id = rr.team_id
        LEFT JOIN periods p ON p.id = rr.period_id
        WHERE rr.status = 'pending'
        ORDER BY rr.created_at ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    logError(`LIST PENDING RECORDS ERROR: ${error.message}`);

    res.status(500).json({
      message: 'Error al listar pendientes',
      error: error.message,
    });
  }
}

export async function reviewRecord(req, res) {
  let client;
  let transactionOpen = false;
  let releaseError;
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      logInfo(
        `Intento de validación con estado inválido: record_id=${id} | status=${status} | admin_id=${req.user.id}`
      );

      return res.status(400).json({
        message: 'Estado inválido',
      });
    }

    client = await pool.connect();
    await client.query('BEGIN');
    transactionOpen = true;
    const current = await client.query(
      `SELECT * FROM recycling_records WHERE id = $1 FOR UPDATE`,
      [id]
    );

    if (!current.rows[0]) {
      await client.query('ROLLBACK');
      transactionOpen = false;
      logInfo(
        `Intento de validar registro inexistente: record_id=${id} | admin_id=${req.user.id}`
      );

      return res.status(404).json({
        message: 'Registro no encontrado',
      });
    }

    const record = current.rows[0];
    if (record.status !== 'pending') {
      await client.query('ROLLBACK');
      transactionOpen = false;
      return res.status(409).json({ message: 'El registro ya fue revisado' });
    }

    let points = 0;

    if (status === 'approved') {
      points = await getCatalogPoints(client, {
        catalog_group_name: record.catalog_group_name,
        catalog_action_name: record.catalog_action_name,
        catalog_action_level: record.catalog_action_level,
      });
    }

    const result = await client.query(
      `
        UPDATE recycling_records
        SET
          status = $1,
          review_notes = $2,
          reviewed_by = $3,
          reviewed_at = NOW(),
          points_awarded = $4
        WHERE id = $5
        RETURNING *
      `,
      [status, normalizeValue(review_notes), req.user.id, points, id]
    );

    await client.query('COMMIT');
    transactionOpen = false;
    try { logInfo(
      `Registro validado: record_id=${id} | status=${status} | points=${points} | admin_id=${req.user.id}`
    ); } catch { /* La decision confirmada no depende del archivo de log. */ }

    res.json(result.rows[0]);
  } catch (error) {
    if (transactionOpen) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        releaseError = rollbackError;
      }
    }
    try { logError(
      `REVIEW RECORD ERROR record_id=${req.params?.id} admin_id=${req.user?.id}: ${error.message}`
    ); } catch { /* Mantener la respuesta controlada aunque falle el log. */ }

    res.status(500).json({
      message: 'Error al validar registro',
    });
  } finally {
    if (client) client.release(releaseError);
  }
}

export async function listReviewedRecords(_req, res) {
  try {
    const result = await query(
      `
        SELECT
          rr.*,
          u.name AS leader_name,
          t.name AS team_name,
          p.name AS period_name,
          reviewer.name AS reviewer_name
        FROM recycling_records rr
        JOIN users u ON u.id = rr.user_id
        JOIN teams t ON t.id = rr.team_id
        LEFT JOIN periods p ON p.id = rr.period_id
        LEFT JOIN users reviewer ON reviewer.id = rr.reviewed_by
        WHERE rr.status IN ('approved', 'rejected')
        ORDER BY rr.reviewed_at DESC
      `
    );

    res.json(result.rows);
  } catch (error) {
    logError(`LIST REVIEWED RECORDS ERROR: ${error.message}`);

    res.status(500).json({
      message: 'Error al listar historial',
      error: error.message,
    });
  }
}
