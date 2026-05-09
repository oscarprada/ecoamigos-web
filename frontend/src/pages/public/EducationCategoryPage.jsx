import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../api/client';

const CATEGORY_LABELS = {
  energia: 'Uso eficiente de la energía',
  agua: 'Uso eficiente del agua',
  residuos: 'Gestión integral de residuos',
  papel: 'Uso eficiente del papel',
};

export default function EducationCategoryPage() {
  const { category } = useParams();
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get(`/public/content/${category}`).then(({ data }) => setItems(data));
  }, [category]);

  return (
    <div style={styles.page}>
      <Link to="/" style={styles.backButton}>← Atrás</Link>

      <p style={styles.kicker}>Educación ambiental</p>
      <h2 style={styles.title}>{CATEGORY_LABELS[category]}</h2>

      {items.length === 0 ? (
        <div style={styles.empty}>Aún no hay contenido publicado en esta categoría.</div>
      ) : (
        <div style={styles.grid}>
          {items.map((item) => (
            <article key={item.id} style={styles.card}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              {item.file_url && item.type === 'image' && (
                <img src={`http://localhost:3000${item.file_url}`} alt={item.title} style={styles.media} />
              )}

              {item.file_url && item.type === 'video' && (
                <video src={`http://localhost:3000${item.file_url}`} controls style={styles.media} />
              )}

              {item.file_url && item.type === 'file' && (
                <a href={`http://localhost:3000${item.file_url}`} target="_blank" rel="noreferrer">
                  Ver archivo
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '42px 32px' },
  backButton: { color: '#2cab87', fontWeight: 700, textDecoration: 'none' },
  kicker: { color: '#2cab87', fontWeight: 800, textTransform: 'uppercase' },
  title: { fontFamily: 'Nunito Sans, sans-serif', fontSize: '38px' },
  empty: { background: '#fff', padding: 24, borderRadius: 16, border: '1px solid #dfe7e2' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 },
  card: { background: '#fff', padding: 24, borderRadius: 18, border: '1px solid #dfe7e2' },
  media: { width: '100%', borderRadius: 14, marginTop: 12 },
};

