import { Link } from 'react-router-dom';
import mascota from '../../assets/cleoecoamigos.png';
import aguaIcon from '../../assets/icons/agua.png';
import energiaIcon from '../../assets/icons/energia.png';
import papelIcon from '../../assets/icons/papel.png';
import residuosIcon from '../../assets/icons/residuos.png';
import carvajalLogo from '../../assets/allies/carvajal.png';
import asobosurLogo from '../../assets/allies/asobosur.png';
import carlosPortelaLogo from '../../assets/allies/carlos-portela.png';
import grupoRetornaLogo from '../../assets/allies/grupo-retorna.jpg';

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-heroOverlay">
          <div className="home-heroContent">
            <div className="home-heroText">
              <p className="home-badge">CAMPAÑA ECOAMIGOS</p>

              <h2 className="home-slogan">
                Con mis acciones cuido el planeta
              </h2>

              <p className="home-description">
                Bienvenidos/as a la plataforma de sostenibilidad de la DTPA.
                En este espacio aprenderás como optimizar el uso diario del
                agua, la energía y el papel, Súmate y descubre pautas clave
                para gestionar los residuos y transformar juntos nuestro entorno.
              </p>
            </div>

            <div className="home-heroImageWrapper">
              <img
                src={mascota}
                alt="Mascota Ecoamigos"
                className="home-mascota"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="home-educationSection">
        <div className="home-sectionHeader">
          <p className="home-sectionKicker">
            EDUCACIÓN AMBIENTAL
          </p>

          <p className="home-sectionIntroTitle">
            ¡Tú eres parte del cambio!
          </p>

          <p className="home-sectionText">
            Explora los programas de gestión ambiental y descubre cómo tus
            decisiones diarias transforman nuestro entorno. Selecciona una
            sección para aprender tips, consejos y prácticas sostenibles que
            nos permiten optimizar el uso de nuestros recursos y asegurar que
            cada acción cuenta.
          </p>
        </div>

        <div className="home-cards">
  <Link to="/educacion/agua" className="home-cardLink">
    <article className="home-card">
      <div className="home-iconCircle">
        <img
          src={aguaIcon}
          alt="Agua"
          className="home-iconImg"
        />
      </div>

      <h4 className="home-cardTitle">
        Ahorro y Uso Eficiente del Agua
      </h4>

      <p className="home-cardText">
        El agua es vida, no la desperdicies.
      </p>
    </article>
  </Link>

  <Link to="/educacion/energia" className="home-cardLink">
    <article className="home-card">
      <div className="home-iconCircle">
        <img
          src={energiaIcon}
          alt="Energía"
          className="home-iconImg"
        />
      </div>

      <h4 className="home-cardTitle">
        Uso Eficiente de Energía
      </h4>

      <p className="home-cardText">
        Cada kilovatio cuenta, usa solo lo necesario.
      </p>
    </article>
  </Link>

  <Link to="/educacion/papel" className="home-cardLink">
    <article className="home-card">
      <div className="home-iconCircle">
        <img
          src={papelIcon}
          alt="Papel"
          className="home-iconImg"
        />
      </div>

      <h4 className="home-cardTitle">
        Uso Responsable del Papel
      </h4>

      <p className="home-cardText">
        Menos papel, más bosques: piensa antes de imprimir.
      </p>
    </article>
  </Link>

  <Link to="/educacion/residuos" className="home-cardLink">
    <article className="home-card">
      <div className="home-iconCircle">
        <img
          src={residuosIcon}
          alt="Residuos"
          className="home-iconImg"
        />
      </div>

      <h4 className="home-cardTitle">
        Gestión Integral de Residuos
      </h4>

      <p className="home-cardText">
        Separa y dispone los residuos de forma adecuada.
      </p>
    </article>
  </Link>
</div>
      </section>

      <section className="home-alliesSection">
        <p className="home-sectionKicker">
          NUESTROS ALIADOS
        </p>

        <h3 className="home-sectionIntroTitle">
          Organizaciones que apoyan la sostenibilidad
        </h3>

        <div className="home-alliesGrid">

          <a
            href="https://www.fundacioncarvajal.org.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="home-allyLink"
          >
            <img
              src={carvajalLogo}
              alt="Fundación Carvajal"
              className="home-allyLogo"
            />
          </a>

          <a
            href="https://asobosur.co/index.php/en/"
            target="_blank"
            rel="noopener noreferrer"
            className="home-allyLink"
          >
            <img
              src={asobosurLogo}
              alt="ASOBOSUR"
              className="home-allyLogo"
            />
          </a>

          <a
            href="https://fundacioncarlosportela.blogspot.com/p/nosotros.html"
            target="_blank"
            rel="noopener noreferrer"
            className="home-allyLink"
          >
            <img
              src={carlosPortelaLogo}
              alt="Fundación Carlos Portela"
              className="home-allyLogo"
            />
          </a>

          <a
            href="https://gruporetorna.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="home-allyLink"
          >
            <img
              src={grupoRetornaLogo}
              alt="Grupo Retorna"
              className="home-allyLogo"
            />
          </a>

        </div>
      </section>

    </div>
  );
}
