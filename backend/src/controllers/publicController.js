import { query } from '../config/db.js';

export async function getRanking(_req, res) {
  try {
    const currentPeriodResult = await query(`
      SELECT *
      FROM periods
      WHERE is_active = true
      ORDER BY start_date DESC, id DESC
      LIMIT 1
    `);

    const currentPeriod = currentPeriodResult.rows[0] || null;

    const rankingResult = await query(
      `
        SELECT
          t.id,
          t.name,
          t.dependency,
          COALESCE(SUM(rr.points_awarded), 0)::int AS total_points
        FROM teams t
        LEFT JOIN recycling_records rr
          ON rr.team_id = t.id
         AND rr.status = 'approved'
         AND (
              $1::int IS NULL
              OR rr.period_id = $1
         )
        GROUP BY t.id, t.name, t.dependency
        ORDER BY total_points DESC, t.name ASC
      `,
      [currentPeriod ? currentPeriod.id : null]
    );

    const ranking = rankingResult.rows.map((row, index) => ({
      ...row,
      position: index + 1,
    }));

    const winnersResult = await query(`
      SELECT
        p.id AS period_id,
        p.name AS period_name,
        t.name AS team_name,
        COALESCE(SUM(rr.points_awarded), 0)::int AS total_points
      FROM recycling_records rr
      JOIN teams t ON t.id = rr.team_id
      LEFT JOIN periods p ON p.id = rr.period_id
      WHERE rr.status = 'approved'
      GROUP BY p.id, p.name, t.name
      ORDER BY p.id DESC, total_points DESC
    `);

    const prizesResult = await query(`
      SELECT *
      FROM prizes
      ORDER BY created_at DESC
    `);

    res.json({
      currentPeriod,
      ranking,
      winners: winnersResult.rows,
      prizes: prizesResult.rows,
    });
  } catch (error) {
    console.error('RANKING ERROR:', error);
    res.status(500).json({
      message: 'Error al consultar información pública',
      error: error.message,
    });
  }
}

export async function getPointsCatalog(_req, res) {
  try {
    const result = await query(`
      SELECT
        id,
        source_code,
        group_name,
        action_name,
        action_level,
        points,
        evidence_required,
        max_frequency
      FROM points_catalog
      ORDER BY group_name ASC, action_name ASC, action_level ASC NULLS FIRST, id ASC
    `);

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error al consultar catálogo de puntos',
      error: error.message,
    });
  }
}
