import { query } from '../config/db.js';

function normalizeValue(value) {
  if (value === undefined || value === null) return null;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
}

async function getCatalogPoints({
  catalog_group_name,
  catalog_action_name,
  catalog_action_level,
}) {
  if (!catalog_group_name || !catalog_action_name) {
    return 0;
  }

  const result = await query(
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
        normalizeValue(catalog_group_name),
        normalizeValue(catalog_action_name),
        normalizeValue(catalog_action_level),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('CREATE RECYCLING ERROR:', error);
    res.status(500).json({
      message: 'Error al registrar reciclaje',
      error: error.message,
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
    console.error('LIST MY RECORDS ERROR:', error);
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
    console.error('LIST PENDING RECORDS ERROR:', error);
    res.status(500).json({
      message: 'Error al listar pendientes',
      error: error.message,
    });
  }
}

export async function reviewRecord(req, res) {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const current = await query(
      `SELECT * FROM recycling_records WHERE id = $1`,
      [id]
    );

    if (!current.rows[0]) {
      return res.status(404).json({ message: 'Registro no encontrado' });
    }

    const record = current.rows[0];

    let points = 0;

    if (status === 'approved') {
      points = await getCatalogPoints({
        catalog_group_name: record.catalog_group_name,
        catalog_action_name: record.catalog_action_name,
        catalog_action_level: record.catalog_action_level,
      });
    }

    const result = await query(
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

    res.json(result.rows[0]);
  } catch (error) {
    console.error('REVIEW RECORD ERROR:', error);
    res.status(500).json({
      message: 'Error al validar registro',
      error: error.message,
    });
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
    console.error('LIST REVIEWED RECORDS ERROR:', error);

    res.status(500).json({
      message: 'Error al listar historial',
      error: error.message,
    });
  }
}


