import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getBackendUrl } from '../../api/client';

const CATEGORY_LABELS = {
  energia: 'Uso eficiente de la energía',
  agua: 'Uso eficiente del agua',
  residuos: 'Gestión integral de residuos',
  papel: 'Uso eficiente del papel',
};

// =============================================================
// INTRODUCCIONES DE LAS CATEGORÍAS
// Modifique únicamente los textos.
// No cambie las llaves: agua, energia, papel y residuos.
// =============================================================
const CATEGORY_INTROS = {
  agua: `¿Sabías que una llave abierta gasta hasta 12 litros de agua por minuto? ¡Ciérrala! 
Optimizar el consumo de agua es un pilar fundamental para la sostenibilidad ambiental y 
nuestra continuidad operativa. Implementar prácticas eficientes reduce el impacto ecológico y genera ahorros económicos 
significativos para la DTPA. Te invitamos a seguir estas recomendaciones en nuestra sede territorial:

💧Cerrar la llave  mientras se enjabonan las manos, cepilla los dientes  o se lavan los   
utensilios de aseo y cocina, 

💧Regar el jardín  al inicio o al final del día para evitar la evaporación 
inmediata.

💧Reportar  inmediatamente cualquier goteo, daño o fuga en grifos, cisternas 
o tuberías al equipo de mantenimiento.
“El Pacífico es agua: cuidémosla desde nuestra sede". 
`,
  energia: `¿Sabías que los equipos en modo de espera o "vampiros" pueden representar hasta el 10% del consumo eléctrico
  de una oficina? ¡Desconéctalos!
Optimizar el consumo eléctrico es vital para reducir nuestra huella de carbono, asegurar la eficiencia energética y operativa de la DTPA.
Adoptar hábitos conscientes disminuye el impacto ambiental y optimiza los recursos de nuestra institución.
Te invitamos a aplicar estas recomendaciones de uso eficiente en la sede de la Territorial Pacífico:

⚡Apaga las luces al salir de oficinas, salas de juntas, baños o espacios comunes  
 	que no se estén utilizando.
 
⚡Aprovecha la luz natural abriendo puertas, ventanas y persianas antes de  
       encender la luz artificial.

 ⚡Apaga y desconecta los aparatos electrónicos que no estén en uso.

⚡Configura el modo ahorro de energía en tu computadora y apaga el monitor
     por completo si te vas a ausentar por más de 30 minutos.
 
⚡Usa el aire acondicionado a 24°C, manteniendo cerradas las puertas y
ventanas del espacio para evitar fugas térmicas y sobrecostos.
 
⚡Reporta fallas eléctricas o parpadeos en las luminarias de manera inmediata
    al equipo de mantenimiento.
 
“El Pacífico es energía: úsala con responsabilidad desde nuestra sede”.
`,
  papel: `¿Sabías que fabricar una sola resma de papel consume 5000 litros de agua y el 
6% de un árbol? El año pasado, la DTPA consumió 24 resmas (12.000 hojas). lo que representa un impacto de 1.5 árboles talados y 120. 000 litros de agua limpia procesada.
Con el fin de mitigar esta huella ambiental, es necesario cambiar tus hábitos hoy con estas recomendaciones: 

`,
  residuos: `¿Sabías que más del 60% de lo que tiramos a la basura se puede reciclar o compostar si se separa correctamente? Además, si no cambiamos nuestros hábitos de consumo, para el año 2050 habrá más plástico que peces en el mar.
 
Por estas razones, en la Dirección Territorial Pacífico avanzamos en la gestión 
adecuada de nuestros residuos para que no sean basura, sino semillas de
esperanza.

`,
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

      <div style={styles.titleRow}>
  <div>
    <p style={styles.kicker}>Educación ambiental</p>
    <h2 style={styles.title}>{CATEGORY_LABELS[category]}</h2>
  </div>

  {category === 'residuos' && (
    <div style={styles.actionButtons}>
      <Link to="/ranking" style={styles.secondaryButton}>
        🏆 Ranking
      </Link>

      <Link to="/winners" style={styles.secondaryButton}>
        🥇 Ganadores
      </Link>

      <Link to="/login" style={styles.primaryButton}>
        🔑 Ingresar
      </Link>
    </div>
  )}
</div>

      <div style={styles.introductionBox}>
        <p style={styles.introduction}>
          {CATEGORY_INTROS[category]}
        </p>
      </div>

      {items.length === 0 ? (
        <div style={styles.empty}>Aún no hay contenido publicado en esta categoría.</div>
      ) : (
        <div style={styles.list}>
          {items.map((item) => (
            <article key={item.id} style={styles.card}>
              <div style={styles.preview}>
                {item.file_url && item.type === 'image' ? (
                  <img
                    src={getBackendUrl(item.file_url)}
                    alt={item.title}
                    style={styles.previewMedia}
                  />
                ) : item.file_url && item.type === 'video' ? (
                  <video
                    src={getBackendUrl(item.file_url)}
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
                src={getBackendUrl(selectedItem.file_url)}
                alt={selectedItem.title}
                style={styles.modalMedia}
              />
            )}

            {selectedItem.file_url && selectedItem.type === 'video' && (
              <video
                src={getBackendUrl(selectedItem.file_url)}
                controls
                controlsList="nodownload"
                disablePictureInPicture
                style={styles.modalMedia}
              />
            )}

            {selectedItem.file_url && selectedItem.type === 'file' && (
              <a
                href={getBackendUrl(selectedItem.file_url)}
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
    color: 'var(--turquoise)',
    fontWeight: 800,
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '22px',
  },
  kicker: {
    margin: 0,
    color: 'var(--turquoise)',
    fontWeight: 800,
    textTransform: 'uppercase',
    fontSize: '13px',
    letterSpacing: '0.6px',
  },
  title: {
    fontFamily: 'Nunito Sans, sans-serif',
    fontSize: '38px',
    margin: '8px 0 0',
  },

  titleRow: {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: 20,
  marginBottom: 28,
  flexWrap: 'wrap',
},

actionButtons: {
  display: 'flex',
  gap: 12,
  flexWrap: 'wrap',
},

secondaryButton: {
  textDecoration: 'none',
  backgroundColor: 'var(--turquoise)',
  color: '#ffffff',
  padding: '10px 18px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 700,
  whiteSpace: 'nowrap',
},

primaryButton: {
  textDecoration: 'none',
  backgroundColor: 'var(--green)',
  color: '#ffffff',
  padding: '10px 18px',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: 800,
  whiteSpace: 'nowrap',
},
  introductionBox: {
    background: '#f8fbf9',
    border: '1px solid var(--border)',
    borderRadius: 18,
    padding: '22px 24px',
    marginBottom: 30,
  },
  introduction: {
    margin: 0,
    color: '#444',
    fontSize: '16px',
    lineHeight: 1.8,
    whiteSpace: 'pre-line',
  },
  empty: {
    background: '#fff',
    padding: 24,
    borderRadius: 16,
    border: '1px solid var(--border)',
  },
  list: {
    display: 'grid',
    gap: 22,
  },
  card: {
  background: '#fff',
  borderRadius: 22,
  border: '1px solid var(--border)',
  boxShadow: 'var(--shadow-card)',
  overflow: 'hidden',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
},
  preview: {
    backgroundColor: '#eef8f3',
  height: '180px',
  padding: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  },
  previewMedia: {
    width: '100%',
  height: '100%',
  objectFit: 'contain',
  borderRadius: '12px',
  },
  textPreview: {
    color: 'var(--turquoise)',
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
    color: 'var(--turquoise)',
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
    backgroundColor: 'var(--green)',
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
    backgroundColor: 'var(--turquoise)',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 12,
    textDecoration: 'none',
    fontWeight: 800,
  },
};