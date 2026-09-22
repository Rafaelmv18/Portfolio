export default function Experience() {
  return (
    <section className="section" id="experiencia">
      <span className="section-label">Trajetória Profissional</span>
      <h3 className="section-title">Experiência</h3>

      <div className="experience-list">
        <article className="experience-item">
          <div className="experience-header">
            <h4 className="experience-company">Equipadora Gato Preto</h4>
            <span className="experience-period">2026 — Presente</span>
          </div>

          <div className="experience-role">
            Estagiário de Desenvolvimento de Software
          </div>

          <p className="experience-description">
            Atuação no desenvolvimento de soluções end-to-end com Python, React
            e PostgreSQL. Responsável pela criação de sistemas de automação de
            processos que otimizaram a rotina interna e geraram dados
            estratégicos para a tomada de decisão da gestão. Experiência com
            configuração e implantação de servidores, além do uso de Claude Code
            para otimização do fluxo de desenvolvimento e entrega ágil de
            software.
          </p>

          <div className="experience-tags">
            <span className="experience-tag">Python</span>
            <span className="experience-tag">React</span>
            <span className="experience-tag">PostgreSQL</span>
            <span className="experience-tag">Servidores & Deploy</span>
            <span className="experience-tag">Automação de Processos</span>
            <span className="experience-tag">Claude Code</span>
          </div>
        </article>
      </div>
    </section>
  );
}
