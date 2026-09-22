import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { ArrowUpRight } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "Spike Gym",
      type: "Web / Full Stack",
      description:
        "Sistema desenvolvido em PHP e JavaScript para gestão de academias. Contempla agendamento de aulas, renovação de matrículas para alunos e módulos administrativos de controle e relatórios.",
      image: "/site_academia.png",
      github: "https://github.com/Rafaelmv18/Site_Academia",
      techs: ["PHP", "JavaScript", "SQL", "CSS"],
    },
    {
      title: "Previsão do Tempo",
      type: "Web",
      description:
        "Aplicação web que consome API meteorológica para exibir condições climáticas, temperatura e umidade em tempo real para qualquer cidade.",
      image: "/clima.png",
      github: "https://github.com/Rafaelmv18/Portfolio/tree/main/Clima",
      techs: ["JavaScript", "REST API", "CSS"],
    },
    {
      title: "Conversor de Moedas",
      type: "Web",
      description:
        "Aplicação para consulta de cotações em tempo real e conversão dinâmica entre moedas internacionais via integração de API financeira.",
      image: "/conversor_moeda.png",
      github:
        "https://github.com/Rafaelmv18/Portfolio/tree/main/ConversorMoeda",
      techs: ["JavaScript", "Exchange API", "CSS"],
    },
    {
      title: "To-do List",
      type: "Web",
      description:
        "Aplicação de gerenciamento de tarefas focada em usabilidade e organização do fluxo de trabalho diário.",
      image: "/to-do_list.png",
      github: "https://github.com/Rafaelmv18/Portfolio/tree/main/To-do%20List",
      techs: ["JavaScript", "LocalStorage", "HTML/CSS"],
    },
  ];

  return (
    <section className="section" id="projetos">
      <span className="section-label">Portfólio</span>
      <h3 className="section-title">Projetos</h3>

      <div className="projects-list">
        {/* PROJETO DESTAQUE: INCLUIAQUI */}
        <article className="featured-project">
          <div className="featured-project-header">
            <div>
              <span className="featured-badge">Notícia Oficial no IFBA</span>
              <h4 className="project-title">
                IncluiAqui — Aplicativo de Acessibilidade
              </h4>
            </div>
            <span
              style={{
                fontSize: "0.85rem",
                color: "#64748b",
                fontFamily: "monospace",
              }}
            >
              React Native & TypeScript
            </span>
          </div>

          <p className="project-description">
            Desenvolvido em equipe para o ecossistema móvel, o IncluiAqui tem
            como objetivo facilitar o acesso a informações de acessibilidade
            arquitetônica e urbana em locais públicos e privados. O projeto
            recebeu destaque institucional com matéria no portal de notícias do
            IFBA.
          </p>

          <div className="video-container">
            <video
              src="/projetoTA.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
            />
          </div>

          <div className="project-links">
            <a
              href="https://github.com/Rafaelmv18/IncluiAqui"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-action"
            >
              <FontAwesomeIcon icon={faGithub} />
              <span>Ver no GitHub</span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href="https://portal.ifba.edu.br/feira-de-santana/noticias/2025/estudantes-do-ifba-feira-de-santana-desenvolvem-aplicativo-voltado-a-acessibilidade-incluiaqui"
              target="_blank"
              rel="noopener noreferrer"
              className="project-link-action"
            >
              <span>Matéria no Portal IFBA</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </article>

        {/* GRID DE OUTROS PROJETOS */}
        <div className="projects-grid-minimal">
          {projects.map((proj, idx) => (
            <article key={idx} className="project-item-card">
              <img
                src={proj.image}
                alt={proj.title}
                className="project-item-img"
              />
              <h4>{proj.title}</h4>
              <p>{proj.description}</p>

              <div
                style={{
                  display: "flex",
                  gap: "0.4rem",
                  flexWrap: "wrap",
                  marginBottom: "1rem",
                }}
              >
                {proj.techs.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontSize: "0.75rem",
                      fontFamily: "monospace",
                      background: "#181d29",
                      padding: "0.15rem 0.5rem",
                      borderRadius: "4px",
                      color: "#94a3b8",
                      border: "1px solid #1e2430",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <a
                href={proj.github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-link-action"
                style={{ alignSelf: "flex-start" }}
              >
                <FontAwesomeIcon icon={faGithub} />
                <span>Código</span>
                <ArrowUpRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
