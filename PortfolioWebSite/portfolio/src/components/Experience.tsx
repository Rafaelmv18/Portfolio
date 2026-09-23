export default function Experience() {
  return (
    <section className="section" id="experiencia">
      <span className="section-label">Trajetória Profissional</span>
      <h3 className="section-title">Experiência</h3>

      <div className="experience-list">
        <article className="experience-item">
          <div className="experience-header">
            <h4 className="experience-company">Equipadora Gato Preto</h4>
            <span className="experience-period">Abr, 2026 — Presente</span>
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
        <article className="experience-item">
          <div className="experience-header">
            <h4 className="experience-company">
              Grupo AME — Sistema Ametech-VR
            </h4>
            <span className="experience-period">Out, 2025 — Presente</span>
          </div>

          <div className="experience-role">Engenheiro de Software Backend</div>

          <p className="experience-description">
            - Arquitetura de APIs: Desenvolvimento de APIs REST em Laravel com
            autenticação segura via Sanctum, modelagem de banco de dados
            relacional e integração com frontend em Next.js para uma plataforma
            de gestão integrada de saúde e terapias. - Coordenação Técnica:
            Gestão das demandas do backend, definição de padrões técnicos,
            organização dos fluxos de desenvolvimento e implementação de
            melhorias contínuas no sistema. - Produto e Escalabilidade: Criação
            de dashboards, gestão de sessões terapêuticas e controle de acesso
            por perfis, otimizando processos para garantir segurança,
            performance e escalabilidade da aplicação.
          </p>
          <p className="experience-description">
            - Coordenação Técnica: Gestão das demandas do backend, definição de
            padrões técnicos, organização dos fluxos de desenvolvimento e
            implementação de melhorias contínuas no sistema.
          </p>
          <p className="experience-description">
            - Produto e Escalabilidade: Criação de dashboards, gestão de sessões
            terapêuticas e controle de acesso por perfis, otimizando processos
            para garantir segurança, performance e escalabilidade da aplicação.
          </p>

          <div className="experience-tags">
            <span className="experience-tag">Laravel</span>
            <span className="experience-tag">Next.js</span>
            <span className="experience-tag">PostgreSQL</span>
            <span className="experience-tag">Autenticação</span>
            <span className="experience-tag">Dashboards</span>
            <span className="experience-tag">Escalabilidade</span>
          </div>
        </article>
      </div>
    </section>
  );
}
