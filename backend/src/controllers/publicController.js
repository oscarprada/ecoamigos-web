import { query } from '../config/db.js';

export async function getRanking(_req, res) {
  try {
    const currentPeriodResult = await query(
      `
        SELECT *
        FROM periods
        WHERE is_active = true
        ORDER BY start_date DESC, id DESC
        LIMIT 1
      `
    );

    const currentPeriod = currentPeriodResult.rows[0] || null;

    let ranking = [];

    if (currentPeriod) {
      const rankingResult = await query(
        `
          SELECT
            t.id,
            t.name,
            t.dependency,
            COALESCE(SUM(rr.points_awarded), 0) AS total_points
          FROM teams t
          LEFT JOIN recycling_records rr
            ON rr.team_id = t.id
           AND rr.period_id = $1
           AND rr.status = 'approved'
          GROUP BY t.id, t.name, t.dependency
          ORDER BY total_points DESC, t.name ASC
        `,
        [currentPeriod.id]
      );

      ranking = rankingResult.rows.map((row, index) => ({
        ...row,
        position: index + 1,
      }));
    }

    res.json({
      currentPeriod,
      ranking,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al consultar información pública',
    });
  }
}

export async function getPublicStats(_req, res) {
  try {
    const statusResult = await query(
      `
        SELECT
          status,
          COUNT(*)::int AS total
        FROM recycling_records
        GROUP BY status
      `
    );

    const materialsResult = await query(
      `
        SELECT
          material_type,
          COUNT(*)::int AS total,
          COALESCE(SUM(quantity) FILTER (
            WHERE status = 'approved' AND lower(btrim(unit)) = 'kg'
          ), 0)::numeric AS total_quantity,
          COALESCE(SUM(points_awarded), 0)::int AS total_points
        FROM recycling_records
        GROUP BY material_type
        ORDER BY total DESC
      `
    );

    const teamsResult = await query(
      `
        SELECT
          t.id,
          t.name,
          t.dependency,
          COUNT(rr.id)::int AS total_records,
          COALESCE(SUM(rr.points_awarded), 0)::int AS total_points
        FROM teams t
        LEFT JOIN recycling_records rr ON rr.team_id = t.id
        GROUP BY t.id, t.name, t.dependency
        ORDER BY total_points DESC, total_records DESC, t.name ASC
      `
    );

    const periodResult = await query(
      `
        SELECT
          p.id,
          p.name,
          COUNT(rr.id)::int AS total_records,
          COALESCE(SUM(rr.points_awarded), 0)::int AS total_points
        FROM periods p
        LEFT JOIN recycling_records rr ON rr.period_id = p.id
        GROUP BY p.id, p.name
        ORDER BY p.id DESC
      `
    );

    const generalResult = await query(
      `
        SELECT
          COUNT(*)::int AS total_records,
          COALESCE(SUM(points_awarded), 0)::int AS total_points,
          COALESCE(SUM(quantity) FILTER (
            WHERE status = 'approved' AND lower(btrim(unit)) = 'kg'
          ), 0)::numeric AS total_quantity
        FROM recycling_records
      `
    );

    res.json({
      general: generalResult.rows[0],
      status: statusResult.rows,
      materials: materialsResult.rows,
      teams: teamsResult.rows,
      periods: periodResult.rows,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al consultar estadísticas',
    });
  }
}

export async function getPointsCatalog(_req, res) {
  try {
    const result = await query(
      `
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
        ORDER BY group_name ASC, action_name ASC
      `
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error al consultar catálogo',
    });
  }
}

export async function getPublicContentByCategory(req, res) {
  try {
    const { category } = req.params;

    const result = await query(
      `
        SELECT
          id,
          title,
          category,
          type,
          description,
          file_url,
          created_at
        FROM content_items
        WHERE status = 'published'
          AND category = $1
        ORDER BY created_at DESC
      `,
      [category]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: 'Error al consultar contenido educativo',
    });
  }
}
