export default function Skills() {
  const skillCategories = [
    {
      category: "Linguagens",
      items: ["JavaScript", "Python", "PHP", "C", "Java"],
    },
    {
      category: "Frameworks & Bibliotecas",
      items: ["React", "React Native", "Laravel"],
    },
    {
      category: "Desenvolvimento Web",
      items: ["HTML", "CSS"],
    },
    {
      category: "Bancos de Dados",
      items: ["PostgreSQL"],
    },
    {
      category: "Ferramentas & Infraestrutura",
      items: ["Git", "Servidores (Deploy / Configuração)", "Claude Code"],
    },
  ];

  return (
    <section className="section" id="habilidades">
      <span className="section-label">Competências</span>
      <h3 className="section-title">Habilidades Técnicas</h3>

      <div className="skills-groups">
        {skillCategories.map((group, idx) => (
          <div key={idx} className="skills-group">
            <div className="skills-group-header">
              <span className="skills-group-title">{group.category}</span>
              <div className="skills-pills">
                {group.items.map((item, iIdx) => (
                  <span key={iIdx} className="skill-pill-minimal">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
