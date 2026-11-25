import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import LazyVideo from "./LazyVideo";
import { revealDelay } from "../hooks/useRevealOnScroll";

type Project = {
  title: string;
  type: string;
  description: string;
  image: string;
  github: string;
  demo?: string;
  techs: string[];
};

export default function Projects() {
  const projects: Project[] = [
    {
      title: "Spike Gym",
      type: "Web / Full Stack",
      description:
        "Sistema de gestão de academias em PHP e JavaScript. Alunos agendam aulas e renovam a matrícula; a administração controla cadastros e gera relatórios.",
      image: "/site_academia.png",
      github: "https://github.com/Rafaelmv18/Site_Academia",
      techs: ["PHP", "JavaScript", "SQL", "CSS"],
    },
    {
      title: "VELKOR Energy",
      type: "Web / Landing Page",
      description:
        "Landing page interativa com animação quadro a quadro em Canvas 2D sincronizada com scroll (GSAP + ScrollTrigger e Lenis). Nota 99+ no Lighthouse, com os quadros carregados aos poucos.",
      image: "/energeticos.png",
      github: "https://github.com/Rafaelmv18/Portfolio/tree/main/Energeticos",
      demo: "https://portfolio-3no9.vercel.app",
      techs: ["TypeScript", "GSAP", "ScrollTrigger", "Canvas 2D", "Vite"],
    },
    {
      title: "Previsão do Tempo",
      type: "Web / Frontend",
      description:
        "Previsão do tempo com dados da Open-Meteo. O cenário muda com a hora e o clima, tem efeito parallax e o Bolota, um personagem que se veste de acordo com o tempo.",
      image: "/clima.png",
      github: "https://github.com/Rafaelmv18/Portfolio/tree/main/Clima",
      demo: "https://portfolio-2snk.vercel.app",
      techs: ["React", "TypeScript", "Vite", "OpenMeteo API", "CSS"],
    },
    {
      title: "Conversor de Moedas",
      type: "Web",
      description:
        "Consulta a cotação atual e converte valores entre moedas usando uma API de câmbio.",
      image: "/conversor_moeda.png",
      github:
        "https://github.com/Rafaelmv18/Portfolio/tree/main/ConversorMoeda",
      techs: ["JavaScript", "Exchange API", "CSS"],
    },
  ];

  return (
    <section className="section" id="projetos">
      <h3 className="section-title reveal">
        Projetos
      </h3>

      <div className="projects-list">
        {/* PROJETO DESTAQUE: INCLUIAQUI */}
        <article className="featured-project reveal" style={revealDelay(150)}>
          <div className="featured-project-content">
            <div className="featured-project-info">
              <div className="featured-project-header">
                <div>
                  <span className="featured-badge">
                    Notícia Oficial no IFBA
                  </span>
                  <h4 className="project-title">
                    IncluiAqui: aplicativo de acessibilidade
                  </h4>
                </div>
                <span className="project-tag-pill">
                  React Native & TypeScript
                </span>
              </div>

              <p className="project-description">
                App mobile feito em equipe que reúne informações de
                acessibilidade arquitetônica e urbana de locais públicos e
                privados, para que pessoas com deficiência saibam antes de ir se
                o lugar é acessível. O projeto virou matéria no portal de
                notícias do IFBA.
              </p>

              <div className="project-links">
                <a
                  href="https://portal.ifba.edu.br/feira-de-santana/noticias/2025/estudantes-do-ifba-feira-de-santana-desenvolvem-aplicativo-voltado-a-acessibilidade-incluiaqui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-action"
                >
                  <span>Matéria no Portal IFBA</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div className="video-container">
              <LazyVideo
                src="/IncluiAqui.mp4"
                label="Demonstração do aplicativo IncluiAqui"
              />
            </div>
          </div>
        </article>

        {/* GRID DE OUTROS PROJETOS */}
        <div className="projects-grid-minimal">
          {projects.map((proj, idx) => (
            <article
              key={proj.title}
              className="project-item-card reveal"
              style={revealDelay((idx % 2) * 140)}
            >
              <div className="project-item-img-wrap">
                <img
                  src={proj.image}
                  alt={`Captura de tela do projeto ${proj.title}`}
                  className="project-item-img"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h4>{proj.title}</h4>
              <p>{proj.description}</p>

              <div className="project-techs">
                {proj.techs.map((t) => (
                  <span key={t} className="project-tech">
                    {t}
                  </span>
                ))}
              </div>

              <div className="project-card-links">
                {proj.demo && (
                  <a
                    href={proj.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link-action project-link-demo"
                  >
                    <ExternalLink size={15} />
                    <span>Ver online</span>
                  </a>
                )}
                <a
                  href={proj.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link-action"
                >
                  <FontAwesomeIcon icon={faGithub} />
                  <span>Código</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
