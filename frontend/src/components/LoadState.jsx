export default function LoadState({ loading, error, retry }) {
  // Successful empty collections are rendered by each page, never as errors here.
  if (!loading && !error) return null;
  return <div className="container narrow"><div className="card">
    {loading ? <p role="status">Cargando...</p> : <>
      <p role="alert">{error}</p>
      {retry && <button className="button" type="button" onClick={retry}>Reintentar</button>}
    </>}
  </div></div>;
}
