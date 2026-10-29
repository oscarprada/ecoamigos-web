import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { uiError } from '../../utils/uiError';
import ProtectedFile from '../../components/ProtectedFile';
import EvidencePhotoInput from '../../components/EvidencePhotoInput';
import { registerGardenCrop } from './gardenRegistration';
import { gardenIntro, gardenStages, gardenVegetables } from './gardenContent';

const statusLabels = { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado' };
const dateLabel = value => String(value).slice(0, 10);

export default function GardenChallengePage({ embedded = false, onRankingLoaded } = {}) {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState({ crops: [], evidence: [] });
  const [period, setPeriod] = useState(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);
  const inFlight = useRef(false);
  const initialCrop = useRef(null);
  const [savedCrop, setSavedCrop] = useState(null);
  const [initialPhotoSelected, setInitialPhotoSelected] = useState(false);
  const admin = user?.role === 'admin';
  const canRegister = user?.role === 'leader' && Boolean(user.team_id);
  const load = useCallback(async () => {
    if (!user || (!admin && !canRegister)) return;
    setLoading(true); setLoadFailed(false);
    try {
      const [crops, ranking] = await Promise.all([api.get('/garden'), api.get('/public/ranking')]);
      setData(crops.data); setPeriod(ranking.data.currentPeriod);
      onRankingLoaded?.(ranking.data.ranking || []);
    } catch (failure) { setLoadFailed(true); setError(uiError(failure, 'No fue posible cargar los cultivos.')); }
    finally { setLoading(false); }
  }, [user, admin, canRegister, onRankingLoaded]);
  useEffect(() => { setData({ crops: [], evidence: [] }); setPeriod(null); setError(''); load(); }, [load]);
  useEffect(() => { initialCrop.current = null; setSavedCrop(null); }, [user?.id]);

  const submit = async (event, operation) => {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    inFlight.current = true; setBusy(true); setError(''); setNotice('');
    try { await operation(new FormData(form)); form.reset(); setNotice('Registro guardado.'); await load(); }
    catch (failure) { setError((initialCrop.current ? 'El cultivo ya está guardado. Reintenta la foto inicial sin registrar otro cultivo. ' : '') + uiError(failure, 'No fue posible guardar el registro.')); }
    finally { inFlight.current = false; setBusy(false); }
  };

  return <div className={embedded ? 'stack-lg games-page' : 'container page stack-lg games-page'}>
    {!embedded && <Link to="/educacion/juegos">← Volver a juegos didácticos</Link>}
    <header><p className="home-sectionKicker">Reto ambiental</p><h2>Sembrando conciencia: de la paca a la huerta</h2>
      <p>Registra el cultivo de tu grupo y comparte su evolución. <Link to="/ranking">Consultar ranking</Link></p></header>
    {(gardenIntro.image || gardenIntro.video) && <section className="card garden-intro" aria-label="Presentación del reto">
      {gardenIntro.image && <img src={gardenIntro.image} alt={gardenIntro.imageAlt} />}
      {gardenIntro.video && <video src={gardenIntro.video} controls preload="metadata">Tu navegador no reproduce este video.</video>}
    </section>}
    <section className="card" aria-labelledby="garden-instructions"><h3 id="garden-instructions">Cómo participar</h3>
      <ol><li>El líder registra la era de cultivo, las hortalizas y una descripción para su grupo existente.</li>
        <li>Riega según las necesidades del cultivo, evitando encharcamientos.</li>
        <li>Controla las arvenses con cuidado para proteger las hortalizas.</li>
        <li>Documenta el seguimiento del crecimiento con fotos, fecha y relato.</li>
        <li>Registra la cosecha y comparte lo aprendido.</li></ol>
      <p>Seguimiento: 0 puntos. Crecimiento aprobado: 50 puntos. Cosecha aprobada: 100 puntos. Cada cultivo puede recibir ambas premiaciones una sola vez, aunque tenga múltiples evidencias. Solo el administrador aprueba o rechaza; los puntos se suman al ranking del periodo de la evidencia.</p>
      <p>Una foto por registro, en JPG, PNG o WebP. Se aplican los límites de tamaño y la validación de archivos del reciclaje. Puedes añadir varias evidencias para documentar el progreso.</p>
    </section>
    {authLoading && <p role="status">Verificando sesión…</p>}
    {!authLoading && !user && <p className="card"><Link to="/login">Ingresar</Link> para registrar o validar cultivos.</p>}
    {user?.role === 'leader' && !canRegister && <p role="status">Necesitas un grupo asignado. Solicita al administrador revisar tu asignación.</p>}
    {error && <p role="alert" className="error">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    {loadFailed && <button type="button" className="button secondary" onClick={load} disabled={loading}>Reintentar carga</button>}
    {loading && <p role="status">Cargando cultivos…</p>}
    {embedded && canRegister && !loading && !loadFailed && <section className="grid garden-counters" aria-label="Contadores de huerta">
      <div className="metric-box"><span>Cultivos del grupo</span><strong className="metric">{data.crops.length}</strong></div>
      <div className="metric-box"><span>Evidencias de huerta</span><strong className="metric">{data.evidence.length}</strong></div>
      {Object.entries(statusLabels).map(([status, label]) => <div className="metric-box" key={status}><span>{label} · Huerta</span><strong className="metric">{data.evidence.filter(item => item.status === status).length}</strong></div>)}
      <div className="metric-box"><span>Puntos de huerta · Historial</span><strong className="metric">{data.evidence.reduce((sum, item) => sum + Number(item.points_awarded || 0), 0)}</strong></div>
    </section>}
    {canRegister && !loadFailed && !loading && <section className="card garden-registration" aria-labelledby="garden-registration-title">
      <header className="garden-registration-header">
        <p className="garden-registration-kicker">Registro de actividad</p>
        <h3 id="garden-registration-title" className="garden-registration-title">Registrar cultivo</h3>
        <p className="garden-registration-intro">Completa la información del cultivo de tu grupo. Puedes adjuntar una foto inicial para documentar su inicio.</p>
        <p className="garden-registration-group">Grupo: <strong>{user.team_name || 'Mi grupo'}</strong></p>
      </header>
      {period && <div className="garden-registration-period"><strong>Periodo activo:</strong> {period.name}</div>}
      {savedCrop && <p role="status">Cultivo #{savedCrop.id} guardado: {savedCrop.bed}. Selecciona o conserva la foto y reintenta su carga.</p>}
      <form className="form" onSubmit={event => submit(event, async fields => {
        await registerGardenCrop({ api, fields, period, crop: initialCrop.current, onCreated: crop => {
          initialCrop.current = crop; setSavedCrop(crop);
          setData(current => ({ ...current, crops: [{ ...crop, team_name: user.team_name }, ...current.crops] }));
        } });
        initialCrop.current = null; setSavedCrop(null); setInitialPhotoSelected(false);
      })}>
        <fieldset disabled={busy} className="garden-fields"><legend className="garden-registration-legend">Datos del cultivo</legend>
          <label>Era de cultivo<input name="bed" required maxLength={150} readOnly={Boolean(savedCrop)} /></label>
          <fieldset disabled={Boolean(savedCrop)} className="garden-registration-options"><legend>Hortalizas (selecciona al menos una)</legend><div className="garden-options">{gardenVegetables.map(value => <label key={value}><input type="checkbox" name="vegetables" value={value} />{value}</label>)}</div></fieldset>
          <label>Descripción<textarea name="description" required maxLength={4000} readOnly={Boolean(savedCrop)} /></label>
          <EvidencePhotoInput disabled={!period} required={Boolean(savedCrop)} onSelected={setInitialPhotoSelected} />
          <label>Fecha de la foto inicial<input type="date" name="initial_date" required={initialPhotoSelected || Boolean(savedCrop)} disabled={!period} min={period ? dateLabel(period.start_date) : undefined} max={period ? dateLabel(period.end_date) : undefined} /></label>
          <p>La foto inicial se registra como seguimiento: 0 puntos. Su relato será la descripción del cultivo.</p>
          {!period && <p>Sin periodo activo puedes registrar el cultivo; añade su foto cuando haya un periodo activo.</p>}
          <button className="button primary" type="submit">{savedCrop ? 'Reintentar foto inicial' : 'Registrar cultivo'}</button>
        </fieldset>
      </form></section>}
    {(admin || canRegister) && !loading && !loadFailed && <section className="stack-lg" aria-labelledby="garden-history"><h3 id="garden-history">{admin ? 'Cultivos y validación de evidencias' : 'Cultivos de mi grupo'}</h3>
      {!data.crops.length && <p>Aún no hay cultivos registrados.</p>}
      {data.crops.map(crop => <article className="card stack-lg" key={crop.id}>
        <header><h4>Era: {crop.bed}</h4><p>{crop.team_name} · {crop.vegetables.join(', ')} · Registrado: {dateLabel(crop.created_at)}</p><p>{crop.description}</p></header>
        {canRegister && <form className="form" onSubmit={event => submit(event, fields => { fields.set('period_id', period.id); return api.post(`/garden/${crop.id}/evidence`, fields); })}>
          <fieldset className="garden-fields" disabled={busy || !period}><legend>Registrar progreso</legend>
            <label>Tipo de evidencia<select name="stage">{Object.entries(gardenStages).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label>Fecha<input type="date" name="record_date" required min={period ? dateLabel(period.start_date) : undefined} max={period ? dateLabel(period.end_date) : undefined} /></label>
            <label>Relato<textarea name="story" required maxLength={4000} /></label>
            <EvidencePhotoInput required />
            <button className="button primary" type="submit">Enviar para validación</button>
          </fieldset>{!period && <p>No hay periodo activo para registrar evidencias.</p>}
        </form>}
        <h4>Historial de progreso</h4>
        {!data.evidence.some(item => item.crop_id === crop.id) && <p>Sin evidencias todavía.</p>}
        {data.evidence.filter(item => item.crop_id === crop.id).map(item => <article className="metric-box stack-lg" key={item.id}>
          <h4>{gardenStages[item.stage]} · {dateLabel(item.record_date)}</h4>
          <p><span className={`status ${item.status}`}>{statusLabels[item.status]}</span> · {item.points_awarded} puntos otorgados</p>
          <p>{item.story}</p><ProtectedFile kind="garden" id={item.id} label="Ver foto del progreso" />
          {item.review_notes && <p><strong>Observaciones del validador:</strong> {item.review_notes}</p>}
          {item.reviewed_at && <p>Validado: {dateLabel(item.reviewed_at)}</p>}
          {admin && item.status === 'pending' && <form className="form" onSubmit={event => {
            const decision = event.nativeEvent.submitter?.value;
            submit(event, fields => api.patch(`/garden/evidence/${item.id}/review`, { status: decision, review_notes: fields.get('review_notes') }));
          }}><fieldset className="garden-fields" disabled={busy}><legend>Validar evidencia</legend>
            <label>Observaciones<textarea name="review_notes" required maxLength={4000} /></label>
            <div className="inline-actions"><button className="button success" type="submit" value="approved">Aprobar</button><button className="button danger" type="submit" value="rejected">Rechazar</button></div>
          </fieldset></form>}
        </article>)}
      </article>)}
    </section>}
  </div>;
}
