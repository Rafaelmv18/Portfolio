import { revealDelay } from "../hooks/useRevealOnScroll";

export default function Experience() {
  const experiences = [
    {
      company: "Equipadora Gato Preto",
      period: "abr 2026 – atual",
      current: true,
      role: "Estagiário de Desenvolvimento Full-Stack",
      descriptions: [
        "Desenvolvo sistemas internos com Python, React e PostgreSQL, do banco de dados à interface.",
        "Criei automações que tiraram trabalho manual da rotina interna e relatórios que a gestão usa para tomar decisões.",
        "Configuro e faço o deploy dos servidores de produção, e uso o Claude Code no dia a dia de desenvolvimento.",
      ],
      tags: ["Python", "React", "PostgreSQL", "Deploy", "Automação", "Claude Code"],
    },
    {
      company: "Grupo AME · Sistema Ametech-VR",
      period: "abr 2025 – fev 2026",
      current: false,
      role: "Engenheiro de Software Backend",
      descriptions: [
        "Desenvolvi APIs REST em Laravel, com autenticação via Sanctum, para uma plataforma de saúde, modelando o banco de dados e integrando com o frontend em Next.js.",
        "Coordenei as demandas do backend: definia os padrões de código, organizava o fluxo de desenvolvimento e priorizava as melhorias do sistema.",
        "Implementei os dashboards, o módulo de sessões terapêuticas e o controle de acesso por perfil de usuário.",
      ],
      tags: ["Laravel", "Next.js", "PostgreSQL", "REST", "Sanctum"],
    },
  ];

  return (
    <section className="section" id="experiencia">
      <h3 className="section-title reveal">
        Experiência
      </h3>

      {/* A linha vertical é o ::before de .timeline e "desenha" ao aparecer */}
      <div className="timeline reveal-line">
        {experiences.map((exp, idx) => (
          <div
            key={exp.company}
            className="timeline-item reveal"
            style={revealDelay(150 + idx * 150)}
          >
            <span
              className={`timeline-dot ${exp.current ? "timeline-dot-current" : ""}`}
              aria-hidden="true"
            />

            {/* Card com os detalhes da experiência */}
            <article
              className={`experience-card ${exp.current ? "experience-card-current" : ""}`}
            >
              <div className="experience-header">
                <div className="experience-title-area">
                  <h4 className="experience-company">{exp.company}</h4>
                </div>
                <span className="experience-period">{exp.period}</span>
              </div>

              <div className="experience-role">{exp.role}</div>

              <div className="experience-description-list">
                {exp.descriptions.map((desc) => (
                  <p key={desc} className="experience-description">
                    {desc}
                  </p>
                ))}
              </div>

              <div className="experience-tags">
                {exp.tags.map((t) => (
                  <span key={t} className="experience-tag">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
