import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHtml5,
  faCss3Alt,
  faJs,
  faReact,
  faPhp,
  faGitAlt,
} from "@fortawesome/free-brands-svg-icons";
import { faC, faDatabase } from "@fortawesome/free-solid-svg-icons";

const Hero = () => {
  return (
    <header className="hero-section" id="hero">
      <div className="hero-content">
        <h1>Rafael Mascarenhas Venas</h1>
        <div className="tech-icons">
          <FontAwesomeIcon icon={faHtml5} title="HTML5" />
          <FontAwesomeIcon icon={faCss3Alt} title="CSS3" />
          <FontAwesomeIcon icon={faJs} title="JavaScript" />
          <FontAwesomeIcon icon={faC} title="Linguagem C" />
          <FontAwesomeIcon icon={faPhp} title="PHP" />
          <FontAwesomeIcon icon={faReact} title="React" />
          <FontAwesomeIcon icon={faGitAlt} title="Git" />
          <FontAwesomeIcon icon={faDatabase} title="Postgres" />
        </div>
        <p>
          Estudante do 6º semestre de Sistema de Informação no IFBA(Instituto
          Federal da Bahia), com conhecimento em desenvolvimento web e mobile.
          Proativo, dedicado e com forte desejo de aprender e ampliar meus
          conhecimentos em desenvolvimento front-end, mobile.
        </p>
        <a href="#projetos" className="cta-button">
          Ver Meus Projetos
        </a>
      </div>
    </header>
  );
};

export default Hero;
