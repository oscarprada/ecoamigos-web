import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gameContent, wheelSectors } from './educationGamesContent';

const SPIN_MS = 4200;

export default function EducationGamesPage() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const pending = useRef(null);
  const timer = useRef(null);

  const finishSpin = () => {
    if (!pending.current) return;
    clearTimeout(timer.current);
    setResult(pending.current);
    pending.current = null;
    setSpinning(false);
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); clearTimeout(timer.current); };
  }, []);

  useEffect(() => {
    if (reducedMotion) finishSpin();
  }, [reducedMotion]);

  const spin = () => {
    if (pending.current || spinning) return;
    const index = Math.floor(Math.random() * wheelSectors.length);
    const sector = wheelSectors[index];
    const entries = gameContent[sector.type];
    pending.current = { ...sector, ...entries[Math.floor(Math.random() * entries.length)] };
    setRevealed(false);
    setResult(null);
    // Sectors start at 12 o'clock, clockwise. Place the chosen center under the top pointer.
    const target = (360 - (index * 45 + 22.5)) % 360;
    setRotation(previous => previous + 5 * 360 + (target - previous % 360 + 360) % 360);
    if (reducedMotion) {
      finishSpin();
    } else {
      setSpinning(true);
      timer.current = setTimeout(finishSpin, SPIN_MS + 100);
    }
  };

  const reset = () => {
    if (pending.current || spinning) return;
    clearTimeout(timer.current);
    setRotation(0);
    setResult(null);
    setRevealed(false);
  };

  return (
    <div className="container page stack-lg games-page">
      <Link to="/">← Volver al inicio</Link>
      <header>
        <p className="home-sectionKicker">Educación ambiental</p>
        <h2>Educación ambiental: juegos didácticos</h2>
        <p>Descubre acciones para cuidar nuestro entorno mientras juegas.</p>
      </header>
      <section className="card" aria-labelledby="wheel-title">
        <h3 id="wheel-title">Ruleta ambiental</h3>
        <p id="wheel-instructions">Pulsa «Girar ruleta» y espera a que se detenga. El puntero señala tu resultado: responde una pregunta, realiza un reto, descubre un dato curioso o sigue intentando. En las preguntas puedes revelar la respuesta. «Reiniciar» limpia el resultado.</p>
        <div className="games-layout">
          <div className="games-wheelWrap" aria-hidden="true">
            <div className="games-pointer" />
            <svg className="games-wheel" viewBox="0 0 400 400"
              style={{ transform: `rotate(${rotation}deg)`, transition: spinning && !reducedMotion ? `transform ${SPIN_MS}ms cubic-bezier(.15,.7,.15,1)` : 'none' }}
              onTransitionEnd={event => { if (event.propertyName === 'transform') finishSpin(); }}>
              {wheelSectors.map((sector, index) => {
                const angle = index * Math.PI / 4;
                const next = angle + Math.PI / 4;
                const center = angle + Math.PI / 8;
                return <g key={index}>
                  <path d={`M200 200 L${200 + 194 * Math.sin(angle)} ${200 - 194 * Math.cos(angle)} A194 194 0 0 1 ${200 + 194 * Math.sin(next)} ${200 - 194 * Math.cos(next)} Z`} fill={sector.color} stroke="white" strokeWidth="2" />
                  <text transform={`translate(${200 + 126 * Math.sin(center)} ${200 - 126 * Math.cos(center)}) rotate(${index * 45 + 22.5})`} textAnchor="middle" dominantBaseline="middle">
                    {sector.label.split(' ').map((word, line, words) => <tspan key={line} x="0" dy={line === 0 ? `${-(words.length - 1) * 8}` : '16'}>{word}</tspan>)}
                  </text>
                </g>;
              })}
              <circle cx="200" cy="200" r="20" fill="var(--green)" />
            </svg>
          </div>
          <div className="games-play">
            <p className="helper">8 sectores: Pregunta, Sigue intentando, Reto y Dato curioso, repetidos en ese orden.</p>
            <div className="inline-actions">
              <button type="button" className="button primary" onClick={spin} disabled={spinning} aria-describedby="wheel-instructions">{spinning ? 'Girando…' : 'Girar ruleta'}</button>
              <button type="button" className="button secondary" onClick={reset} disabled={spinning}>Reiniciar</button>
            </div>
            <div className="games-result" role="status" aria-live="polite" aria-atomic="true">
              {spinning ? <p>La ruleta está girando. Espera el resultado.</p> : result ? <>
                <h4>{result.label}</h4><p>{result.text}</p>
              </> : <p>Gira la ruleta para comenzar.</p>}
            </div>
            {result?.type === 'pregunta' && <>
              <button type="button" className="button secondary" aria-expanded={revealed} aria-controls="wheel-answer" onClick={() => setRevealed(value => !value)}>{revealed ? 'Ocultar respuesta' : 'Revelar respuesta'}</button>
              <p id="wheel-answer" className="games-answer" hidden={!revealed}>{result.answer}</p>
            </>}
          </div>
        </div>
      </section>
      <article className="card">
        <h3>Sembrando conciencia: de la paca a la huerta</h3>
        <p>Registra el cultivo de tu grupo, comparte su progreso y participa en el ranking.</p>
        <Link className="button primary" to="/educacion/juegos/huerta">Participar en el reto</Link>
      </article>
      <article className="card">
        <span className="badge">Próximamente</span>
        <h3>Lotería de las áreas protegidas del Pacífico — Próximamente</h3>
        <p>Un nuevo juego para conocer y valorar las áreas protegidas del Pacífico.</p>
      </article>
    </div>
  );
}
