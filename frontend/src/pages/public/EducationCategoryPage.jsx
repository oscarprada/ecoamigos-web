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
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    api.get(`/public/content/${category}`).then(({ data }) => setItems(data || []));
  }, [category]);

  return (
    <div style={styles.page}>
      <Link to="/" style={styles.backButton}>← Atrás</Link>

      <p style={styles.kicker}>Educación ambiental</p>
      <h2 style={styles.title}>{CATEGORY_LABELS[category]}</h2>

      {items.length === 0 ? (
        <div style={styles.empty}>Aún no hay contenido publicado en esta categoría.</div>
      ) : (
        <div style={styles.list}>
          {items.map((item) => (
            <article key={item.id} style={styles.card}>
              <div style={styles.preview}>
                {item.file_url && item.type === 'image' ? (
                  <img
                    src={`http://localhost:3000${item.file_url}`}
                    alt={item.title}
                    style={styles.previewMedia}
                  />
                ) : item.file_url && item.type === 'video' ? (
                  <video
                    src={`http://localhost:3000${item.file_url}`}
                    style={styles.previewMedia}
                    muted
                    preload="metadata"
                    controlsList="nodownload"
                    disablePictureInPicture
                  />
                ) : (
                  <div style={styles.textPreview}>{getTypeLabel(item.type)}</div>
                )}
              </div>

              <div style={styles.content}>
                <p style={styles.typeLabel}>{getTypeLabel(item.type)}</p>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.cardText}>{item.description}</p>

                <button
                  type="button"
                  style={styles.viewButton}
                  onClick={() => setSelectedItem(item)}
                >
                  Ver contenido completo
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedItem && (
        <div style={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div>
                <p style={styles.kicker}>Contenido educativo</p>
                <h3 style={styles.modalTitle}>{selectedItem.title}</h3>
              </div>

              <button
                type="button"
                style={styles.closeButton}
                onClick={() => setSelectedItem(null)}
              >
                Cerrar
              </button>
            </div>

            <p style={styles.modalText}>{selectedItem.description}</p>

            {selectedItem.file_url && selectedItem.type === 'image' && (
              <img
                src={`http://localhost:3000${selectedItem.file_url}`}
                alt={selectedItem.title}
                style={styles.modalMedia}
              />
            )}

            {selectedItem.file_url && selectedItem.type === 'video' && (
              <video
                src={`http://localhost:3000${selectedItem.file_url}`}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                style={styles.modalMedia}
              />
            )}

            {selectedItem.file_url && selectedItem.type === 'file' && (
              <a
                href={`http://localhost:3000${selectedItem.file_url}`}
                target="_blank"
                rel="noreferrer"
                style={styles.fileButton}
              >
                Ver archivo
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getTypeLabel(type) {
  const labels = {
    text: 'Texto',
    image: 'Imagen',
    video: 'Video',
    file: 'Archivo',
  };

  return labels[type] || 'Contenido';
}

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '42px 32px',
    fontFamily: 'Montserrat, sans-serif',
  },
  backButton: {
    color: '#2cab87',
    fontWeight: 800,
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '22px',
  },
  kicker: {
    margin: 0,
    color: '#2cab87',
    fontWeight: 800,
    textTransform: 'uppercase',
    fontSize: '13px',
    letterSpacing: '0.6px',
  },
  title: {
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '38px',
    margin: '8px 0 28px',
  },
  empty: {
    background: '#fff',
    padding: 24,
    borderRadius: 16,
    border: '1px solid #dfe7e2',
  },
  list: {
    display: 'grid',
    gap: 22,
  },
  card: {
  background: '#fff',
  borderRadius: 22,
  border: '1px solid #dfe7e2',
  boxShadow: '0 10px 24px rgba(0,0,0,0.05)',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
},
  preview: {
    backgroundColor: '#eef8f3',
    minHeight: 260,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewMedia: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  textPreview: {
    color: '#2cab87',
    fontWeight: 800,
    fontSize: 20,
  },
  content: {
    padding: 28,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
  },
  typeLabel: {
    margin: 0,
    color: '#2cab87',
    fontSize: 12,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
  },
  cardTitle: {
    margin: 0,
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: 26,
    color: '#000000',
  },
  cardText: {
    margin: '0 0 8px',
    color: '#444',
    lineHeight: 1.65,
    fontSize: 16,
  },
  viewButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#71b956',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '12px 16px',
    fontWeight: 800,
    cursor: 'pointer',
    fontFamily: 'Montserrat, sans-serif',
  },
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.58)',
    zIndex: 3000,
    padding: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    width: 'min(920px, 100%)',
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: 22,
    padding: 24,
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    margin: '8px 0 0',
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: 30,
  },
  modalText: {
    color: '#444',
    lineHeight: 1.6,
  },
  modalMedia: {
    width: '100%',
    maxHeight: '65vh',
    objectFit: 'contain',
    borderRadius: 16,
    backgroundColor: '#000',
  },
  closeButton: {
    backgroundColor: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '10px 14px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  fileButton: {
    display: 'inline-flex',
    backgroundColor: '#2cab87',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 800,
  },
};



