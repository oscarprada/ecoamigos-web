import { query } from '../config/db.js';
import { calculatePoints } from '../utils/calculatePoints.js';

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
    } = req.body;

    const evidence_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await query(
      `INSERT INTO recycling_records (
          user_id, team_id, material_type, quantity, unit, quality_level, criteria_count,
          notes, evidence_url, period_id, record_date, status
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'pending')
       RETURNING *`,
      [
        req.user.id,
        req.user.team_id,
        material_type,
        quantity,
        unit,
        quality_level,
        criteria_count,
        notes || null,
        evidence_url,
        period_id || null,
        record_date || new Date(),
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar reciclaje', error: error.message });
  }
}

export async function listMyRecords(req, res) {
  try {
    const result = await query(
      `SELECT rr.*, p.name AS period_name
       FROM recycling_records rr
       LEFT JOIN periods p ON p.id = rr.period_id
       WHERE rr.user_id = $1
       ORDER BY rr.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar registros', error: error.message });
  }
}

export async function listPendingRecords(_req, res) {
  try {
    const result = await query(
      `SELECT rr.*, u.name AS leader_name, t.name AS team_name, p.name AS period_name
       FROM recycling_records rr
       JOIN users u ON u.id = rr.user_id
       JOIN teams t ON t.id = rr.team_id
       LEFT JOIN periods p ON p.id = rr.period_id
       WHERE rr.status = 'pending'
       ORDER BY rr.created_at ASC`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error al listar pendientes', error: error.message });
  }
}

export async function reviewRecord(req, res) {
  try {
    const { id } = req.params;
    const { status, review_notes } = req.body;

    const current = await query(`SELECT * FROM recycling_records WHERE id = $1`, [id]);
    if (!current.rows[0]) return res.status(404).json({ message: 'Registro no encontrado' });

    const record = current.rows[0];
    const points = status === 'approved'
      ? calculatePoints({
          material_type: record.material_type,
          quantity: record.quantity,
          quality_level: record.quality_level,
          criteria_count: record.criteria_count,
        })
      : 0;

    const result = await query(
      `UPDATE recycling_records
       SET status = $1,
           review_notes = $2,
           reviewed_by = $3,
           reviewed_at = NOW(),
           points_awarded = $4
       WHERE id = $5
       RETURNING *`,
      [status, review_notes || null, req.user.id, points, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al validar registro', error: error.message });
  }
}
