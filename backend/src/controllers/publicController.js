import { query } from '../config/db.js';
import { getPointsRules } from '../utils/calculatePoints.js';

export async function getPublicHome(req, res) {
  try {
    const videos = await query(`SELECT * FROM content_items WHERE status = 'published' AND type = 'video' ORDER BY created_at DESC LIMIT 6`);
    const tips = await query(`SELECT * FROM content_items WHERE status = 'published' AND type = 'tip' ORDER BY created_at DESC LIMIT 6`);
    const guides = await query(`SELECT * FROM content_items WHERE status = 'published' AND type IN ('guide','blog') ORDER BY created_at DESC LIMIT 6`);
    res.json({
      slogan: '¡Pequeñas acciones, grandes cambios!',
      institution: 'Parques Nacionales Naturales de Colombia - Dirección Territorial Pacífico',
      campaign: 'Ecoamigos',
      videos: videos.rows,
      tips: tips.rows,
      resources: guides.rows,
      pointsRules: getPointsRules(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo inicio público', error: error.message });
  }
}

export async function getPublicRanking(req, res) {
  try {
    const currentPeriod = await query(`SELECT * FROM periods WHERE is_active = true ORDER BY start_date DESC LIMIT 1`);
    const ranking = await query(
      `SELECT t.id, t.name, t.dependency, COALESCE(SUM(rr.points_awarded),0) AS score,
              RANK() OVER (ORDER BY COALESCE(SUM(rr.points_awarded),0) DESC) AS position
       FROM teams t
       LEFT JOIN recycling_records rr
         ON rr.team_id = t.id
         AND rr.status = 'approved'
         AND ($1::int IS NULL OR rr.period_id = $1)
       GROUP BY t.id, t.name, t.dependency
       ORDER BY score DESC, t.name ASC`,
      [currentPeriod.rows[0]?.id ?? null]
    );

    const winners = await query(
      `SELECT wr.id, p.name AS period_name, p.start_date, p.end_date, t.name AS team_name, wr.final_score, pr.name AS prize_name
       FROM winner_records wr
       JOIN periods p ON p.id = wr.period_id
       JOIN teams t ON t.id = wr.team_id
       LEFT JOIN prizes pr ON pr.id = wr.prize_id
       ORDER BY p.end_date DESC`
    );

    const prizes = await query(`SELECT * FROM prizes WHERE is_active = true ORDER BY created_at DESC`);

    res.json({
      currentPeriod: currentPeriod.rows[0] ?? null,
      ranking: ranking.rows,
      winners: winners.rows,
      prizes: prizes.rows,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo ranking', error: error.message });
  }
}
