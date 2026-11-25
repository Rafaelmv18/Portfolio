import { revealDelay } from "../hooks/useRevealOnScroll";

export default function Skills() {
  const skillCategories = [
    {
      category: "Linguagens",
      items: ["JavaScript", "TypeScript", "Python", "PHP", "C"],
    },
    {
      category: "Frameworks & Bibliotecas",
      items: ["React", "React Native", "Laravel", "GSAP"],
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
      <h3 className="section-title reveal">
        Habilidades Técnicas
      </h3>

      <div className="skills-groups">
        {skillCategories.map((group, idx) => (
          <div
            key={group.category}
            className="skills-group reveal"
            style={revealDelay(100 + idx * 90)}
          >
            <div className="skills-group-header">
              <span className="skills-group-title">{group.category}</span>
              <div className="skills-pills">
                {group.items.map((item) => (
                  <span key={item} className="skill-pill-minimal">
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
