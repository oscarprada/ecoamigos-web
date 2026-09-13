import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return <section className="container narrow"><div className="card">
    <h1>404 — Página no encontrada</h1>
    <p>La página que buscas no existe.</p>
    <Link className="button primary" to="/">Volver al inicio</Link>
  </div></section>;
}
