import { isValidRecordDate } from '../utils/recordDate.js';
import { formats, extension } from '../services/fileFormats.js';
import { cleanupUncommitted } from '../services/fileStore.js';

export const vegetables = ['cebolla larga', 'tomate', 'lechuga', 'cilantro', 'pimentón', 'ají'];
const text = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
const validId = value => /^[1-9]\d{0,9}$/.test(String(value)) && Number(value) <= 2147483647;
class RequestError extends Error { constructor(code, message) { super(message); this.code = code; } }
const fail = (code, message) => { throw new RequestError(code, message); };

// Inject infrastructure so tests never load application credentials or .env.
export function createGardenHandlers({ pool, removeStored }) {
  const action = operation => async (req, res) => {
    let client, committed = false, commitAttempted = false, releaseError;
    try {
      client = await pool.connect();
      await client.query('BEGIN');
      const result = await operation(req, client);
      commitAttempted = true; await client.query('COMMIT'); committed = true;
      res.status(result.code || 200).json(result.data);
    } catch (error) {
      if (client && !committed) try { await client.query('ROLLBACK'); } catch (rollbackError) { releaseError = rollbackError; }
      res.status(error instanceof RequestError ? error.code : 500).json({ message: error instanceof RequestError ? error.message : 'No fue posible procesar el cultivo' });
    } finally {
      client?.release(releaseError);
      // The validated upload has a new random filename and no relation on failure.
      if (req.file && !committed) await cleanupUncommitted(req.file.url, (...args) => pool.query(...args), { commitAttempted, storage: { remove: removeStored } });
    }
  };
  const leader = req => {
    if (req.user?.role !== 'leader' || !validId(req.user.team_id)) fail(403, 'Necesitas un grupo asignado y rol de líder');
  };
  return {
    list: action(async (req, client) => {
      if (!['leader', 'admin'].includes(req.user?.role)) fail(403, 'No tienes permisos');
      if (req.user.role === 'leader') leader(req);
      const crops = await client.query(`SELECT c.*, t.name AS team_name FROM garden_crops c JOIN teams t ON t.id=c.team_id
        WHERE ($1::boolean OR c.team_id=$2) ORDER BY c.created_at DESC, c.id DESC`, [req.user.role === 'admin', req.user.team_id]);
      const evidence = await client.query(`SELECT e.* FROM garden_evidence e JOIN garden_crops c ON c.id=e.crop_id
        WHERE ($1::boolean OR c.team_id=$2) ORDER BY e.record_date DESC,e.created_at DESC,e.id DESC`, [req.user.role === 'admin', req.user.team_id]);
      return { data: { crops: crops.rows, evidence: evidence.rows } };
    }),
    createCrop: action(async (req, client) => {
      leader(req);
      const { bed, description, vegetables: chosen } = req.body;
      if (!text(bed, 150) || !text(description, 4000) || !Array.isArray(chosen) || !chosen.length || chosen.length > 6 || chosen.some(value => !vegetables.includes(value)) || new Set(chosen).size !== chosen.length) fail(400, 'Revisa la era, descripción y hortalizas');
      const team = await client.query('SELECT id FROM teams WHERE id=$1 FOR KEY SHARE', [req.user.team_id]);
      if (!team.rows.length) fail(403, 'El grupo asignado no existe');
      const result = await client.query('INSERT INTO garden_crops(team_id,user_id,bed,vegetables,description) VALUES($1,$2,$3,$4,$5) RETURNING *', [req.user.team_id, req.user.id, bed.trim(), chosen, description.trim()]);
      return { code: 201, data: result.rows[0] };
    }),
    addEvidence: action(async (req, client) => {
      leader(req);
      if (!validId(req.params.id)) fail(404, 'Cultivo no encontrado');
      const { stage, record_date, story, period_id } = req.body;
      if (!['seguimiento', 'crecimiento', 'cosecha'].includes(stage) || !isValidRecordDate(record_date) || !text(story, 4000) || !req.file || formats[extension(req.file.filename)]?.kind !== 'image') fail(400, 'Incluye una foto válida, fecha, etapa y relato');
      const crop = await client.query('SELECT * FROM garden_crops WHERE id=$1 FOR KEY SHARE', [req.params.id]);
      if (!crop.rows[0]) fail(404, 'Cultivo no encontrado');
      if (crop.rows[0].team_id !== req.user.team_id) fail(403, 'El cultivo pertenece a otro grupo');
      // Same period lock and date policy as recycling registration.
      await client.query('LOCK TABLE periods IN SHARE MODE');
      const active = await client.query(`SELECT id, $1::date BETWEEN start_date AND end_date AS in_period,
        $1::date <= CURRENT_DATE AS not_future FROM periods WHERE is_active=true`, [record_date]);
      if (active.rows.length !== 1 || String(active.rows[0].id) !== String(period_id)) fail(409, 'Actualiza el formulario: necesitas el periodo activo');
      if (!active.rows[0].in_period || !active.rows[0].not_future) fail(400, 'La fecha debe estar dentro del periodo activo y no ser futura');
      const result = await client.query(`INSERT INTO garden_evidence(crop_id,user_id,period_id,stage,record_date,story,evidence_url)
        VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`, [crop.rows[0].id, req.user.id, active.rows[0].id, stage, record_date, story.trim(), req.file.url]);
      return { code: 201, data: result.rows[0] };
    }),
    review: action(async (req, client) => {
      if (req.user?.role !== 'admin') fail(403, 'Solo administradores pueden validar');
      if (!validId(req.params.id)) fail(404, 'Evidencia no encontrada');
      const { status, review_notes } = req.body;
      if (!['approved', 'rejected'].includes(status) || !text(review_notes, 4000)) fail(400, 'Indica una decisión y observaciones');
      const found = await client.query('SELECT crop_id FROM garden_evidence WHERE id=$1', [req.params.id]);
      if (!found.rows[0]) fail(404, 'Evidencia no encontrada');
      // Lock crop first: serializes awards across ALL its evidence, not just one row.
      await client.query('SELECT id FROM garden_crops WHERE id=$1 FOR UPDATE', [found.rows[0].crop_id]);
      const current = (await client.query('SELECT * FROM garden_evidence WHERE id=$1 FOR UPDATE', [req.params.id])).rows[0];
      if (current.status !== 'pending') fail(409, 'La evidencia ya fue revisada');
      let points = 0;
      if (status === 'approved' && current.stage !== 'seguimiento') {
        const previous = await client.query('SELECT id FROM garden_evidence WHERE crop_id=$1 AND stage=$2 AND points_awarded>0', [current.crop_id, current.stage]);
        if (!previous.rows.length) points = current.stage === 'crecimiento' ? 50 : 100;
      }
      const result = await client.query(`UPDATE garden_evidence SET status=$1,review_notes=$2,reviewed_by=$3,reviewed_at=NOW(),points_awarded=$4 WHERE id=$5 RETURNING *`, [status, review_notes.trim(), req.user.id, points, req.params.id]);
      return { data: result.rows[0] };
    }),
  };
}
