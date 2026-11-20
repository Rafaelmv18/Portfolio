export default function Experience() {
  const experiences = [
    {
      company: "Equipadora Gato Preto",
      period: "Abr, 2026 — Presente",
      current: true,
      role: "Estagiário de Desenvolvimento de Software",
      descriptions: [
        "Atuação no desenvolvimento de soluções end-to-end com Python, React e PostgreSQL.",
        "Responsável pela criação de sistemas de automação de processos que otimizaram a rotina interna e geraram dados estratégicos para a tomada de decisão da gestão.",
        "Experiência com configuração e implantação de servidores, além do uso de Claude Code para otimização do fluxo de desenvolvimento e entrega ágil de software.",
      ],
      tags: [
        "Python",
        "React",
        "PostgreSQL",
        "Servidores & Deploy",
        "Automação de Processos",
        "Claude Code",
      ],
    },
    {
      company: "Grupo AME — Sistema Ametech-VR",
      period: "Abr, 2025 — Fev, 2026",
      current: false,
      role: "Engenheiro de Software Backend",
      descriptions: [
        "Arquitetura de APIs: Desenvolvimento de APIs REST em Laravel com autenticação segura via Sanctum, modelagem de banco de dados relacional e integração com frontend em Next.js para plataforma integrada de saúde.",
        "Coordenação Técnica: Gestão das demandas do backend, definição de padrões técnicos, organização dos fluxos de desenvolvimento e melhorias contínuas no sistema.",
        "Produto e Escalabilidade: Criação de dashboards, gestão de sessões terapêuticas e controle de acesso por perfis, garantindo segurança e alta escalabilidade.",
      ],
      tags: [
        "Laravel",
        "Next.js",
        "PostgreSQL",
        "Autenticação",
        "Dashboards",
        "Escalabilidade",
      ],
    },
  ];

  return (
    <section className="section" id="experiencia">
      <span className="section-label">Trajetória Profissional</span>
      <h3 className="section-title">Experiência</h3>

      <div className="timeline-container">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className={`timeline-item ${exp.current ? "timeline-item-current" : ""}`}
          >
            {/* Linha vertical e marcador visual */}
            <div className="timeline-spine">
              <div
                className={`timeline-dot ${exp.current ? "timeline-dot-current" : ""}`}
              >
                {exp.current && <span className="timeline-dot-ping"></span>}
              </div>
              {idx < experiences.length - 1 && (
                <div className="timeline-line"></div>
              )}
            </div>

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
                {exp.descriptions.map((desc, dIdx) => (
                  <p key={dIdx} className="experience-description">
                    {desc}
                  </p>
                ))}
              </div>

              <div className="experience-tags">
                {exp.tags.map((t, tIdx) => (
                  <span key={tIdx} className="experience-tag">
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
