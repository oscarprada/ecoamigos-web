import { activateDialog } from '../../utils/dialogFocus';
import LoadState from '../../components/LoadState';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { getBackendUrl } from '../../api/client';

const CATEGORY_LABELS = {
  energia: 'Uso eficiente de la energía',
  agua: 'Uso eficiente del agua',
  residuos: 'Gestión integral de residuos',
  papel: 'Uso eficiente del papel',
};

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
  const [loadError, setLoadError] = useState('');
  const [pageLoading, setPageLoading] = useState(true);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!selectedItem || !dialogRef.current) return;

    return activateDialog(dialogRef.current, triggerRef.current, () => setSelectedItem(null));
}, [selectedItem]);

  useEffect(() => {
    let current = true;

    setPageLoading(true);
    setLoadError('');
    setSelectedItem(null);

    api.get(`/public/content/${category}`)
      .then(({ data }) => {
        if (current) setItems(data || []);
      })
      .catch(() => {
        if (current) setLoadError('No fue posible cargar el contenido.');
      })
      .finally(() => {
        if (current) setPageLoading(false);
      });

    return () => {
      current = false;
    };
  }, [category]);

  if (pageLoading || loadError) {
    return (
      <LoadState
        loading={pageLoading}
        error={loadError}
        retry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="education-page">
      <nav className="page-breadcrumb" aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link>
        <span aria-hidden="true">›</span>
        <span>Contenido multimedia</span>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{CATEGORY_LABELS[category]}</span>
      </nav>

      <section className="education-hero">
        <div className="education-heroContent">
          <p className="education-kicker">Contenido multimedia</p>
          <h2>{CATEGORY_LABELS[category]}</h2>
          <p className="education-introduction">
            {CATEGORY_INTROS[category]}
          </p>
        </div>

        <div
          className={`education-orb education-orb-${category}`}
          aria-hidden="true"
        />
      </section>

      <div className="education-publicationsHeader">
        <div>
          <p className="education-kicker">Contenido disponible</p>
          <h3>Publicaciones</h3>
        </div>

        {category === 'residuos' && (
          <div className="education-actions">
            <Link to="/ranking" className="button secondary">
              🏆 Ranking
            </Link>

            <Link to="/login" className="button primary">
              🔑 Ingresar
            </Link>
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <div className="education-empty">
          Aún no hay contenido publicado en esta categoría.
        </div>
      ) : (
        <div className="education-list">
          {items.map((item) => (
            <article key={item.id} className="education-card">
              <div className="education-preview">
                {item.file_url && item.type === 'image' ? (
                  <img
                    src={getBackendUrl(
                      '/api/files/public/content/' + item.id
                    )}
                    alt={item.title}
                    className="education-previewMedia"
                  />
                ) : item.file_url && item.type === 'video' ? (
                  <video
                    src={getBackendUrl(
                      '/api/files/public/content/' + item.id
                    )}
                    className="education-previewMedia"
                    muted
                    preload="metadata"
                    controlsList="nodownload"
                    disablePictureInPicture
                  />
                ) : (
                  <div className="education-textPreview">
                    {getTypeLabel(item.type)}
                  </div>
                )}
              </div>

              <div className="education-cardContent">
                <p className="education-typeLabel">
                  {getTypeLabel(item.type)}
                </p>

                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <button
                  type="button"
                  className="education-viewButton"
                  onClick={(e) => {
                    triggerRef.current = e.currentTarget;
                    setSelectedItem(item);
                  }}
                >
                  Ver contenido completo
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {selectedItem && (
        <dialog ref={dialogRef}
          className="education-dialog"
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
          aria-modal="true"
          aria-labelledby="education-dialog-title"
          tabIndex={-1}
          onCancel={(e) => {
            e.preventDefault();
            setSelectedItem(null);
          }}
          onClick={(e) => {
            if (e.target !== e.currentTarget) return;

            const rect = e.currentTarget.getBoundingClientRect();

            if (
              e.clientX < rect.left ||
              e.clientX > rect.right ||
              e.clientY < rect.top ||
              e.clientY > rect.bottom
            ) {
              setSelectedItem(null);
            }
          }}
        >
          <div className="education-modalHeader">
            <div>
              <p className="education-kicker">Contenido educativo</p>
              <h3 id="education-dialog-title">{selectedItem.title}</h3>
            </div>

            <button
              type="button"
              className="education-closeButton"
              onClick={() => setSelectedItem(null)}
            >
              Cerrar
            </button>
          </div>

          <p className="education-modalText">
            {selectedItem.description}
          </p>

          {selectedItem.file_url && selectedItem.type === 'image' && (
            <img
              src={getBackendUrl(
                '/api/files/public/content/' + selectedItem.id
              )}
              alt={selectedItem.title}
              className="education-modalMedia"
            />
          )}

          {selectedItem.file_url && selectedItem.type === 'video' && (
            <video
              src={getBackendUrl(
                '/api/files/public/content/' + selectedItem.id
              )}
              controls
              controlsList="nodownload"
              disablePictureInPicture
              className="education-modalMedia"
            />
          )}

          {selectedItem.file_url && selectedItem.type === 'file' && (
            <a
              href={getBackendUrl(
                '/api/files/public/content/' + selectedItem.id
              )}
              target="_blank"
              rel="noreferrer"
              className="education-fileButton"
            >
              Ver archivo
            </a>
          )}
        </dialog>
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