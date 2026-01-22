import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHtml5,
  faCss3Alt,
  faJs,
  faReact,
  faJava,
  faPhp,
  faGitAlt,
} from "@fortawesome/free-brands-svg-icons";
import { faC, faDatabase } from "@fortawesome/free-solid-svg-icons";

const Skills = () => {
  const skills = [
    { name: "HTML", icon: faHtml5 },
    { name: "CSS", icon: faCss3Alt },
    { name: "JavaScript", icon: faJs },
    { name: "React", icon: faReact },
    { name: "Java", icon: faJava },
    { name: "PHP", icon: faPhp },
    { name: "C", icon: faC },
    { name: "Git", icon: faGitAlt },
    { name: "Postgres", icon: faDatabase },
  ];

  return (
    <section id="habilidades" className="content-section">
      <h2>Habilidades</h2>
      {/* CORREÇÃO: "carousel" com apenas um 's' para bater com o CSS */}
      <div className="carousel">
        <ul className="group">
          {skills.map((skill, index) => (
            <li key={`skill-1-${index}`} className="card">
              <FontAwesomeIcon
                icon={skill.icon}
                className={`icon-${skill.name.toLowerCase()}`}
              />
              <span>{skill.name}</span>
            </li>
          ))}
        </ul>

        {/* Segunda lista idêntica para o loop infinito */}
        <ul aria-hidden="true" className="group">
          {skills.map((skill, index) => (
            <li key={`skill-2-${index}`} className="card">
              <FontAwesomeIcon
                icon={skill.icon}
                className={`icon-${skill.name.toLowerCase()}`}
              />
              <span>{skill.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="skills-description">
        Possuo experiência inicial com HTML, CSS, JavaScript e React, que venho
        aplicando no desenvolvimento de sites e pequenos projetos. Estou
        investindo meu tempo em estudos e práticas constantes para dominar essas
        tecnologias, a fim de evoluir profissionalmente.
      </p>
    </section>
  );
};

export default Skills;
