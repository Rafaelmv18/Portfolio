export default function Skills() {
  const skills = [
    { icon: "fa-html5", name: "HTML" },
    { icon: "fa-css3-alt", name: "CSS3" },
    { icon: "fa-js", name: "JS" },
    { icon: "fa-react", name: "React" },
  ];
  return (
    <section id="habilidades" className="content-section">
      <h2>Habilidades</h2>
      <ul>
        {skills.map((skills, index) => (
          <li key={index}>
            <i className={`fa-brands ${skills}`}></i>
            {skills.name}
          </li>
        ))}
      </ul>
      <p>
        Possuo experiência inicial com HTML, CSS, JavaScript e React, que venho
        aplicando no desenvolvimento de sites e pequenos projetos. Estou
        investindo meu tempo em estudos e práticas constantes para dominar essas
        tecnologias, entendendo tanto os fundamentos quanto conceitos mais
        avançados, a fim de evoluir profissionalmente e entregar soluções
        criativas e bem estruturadas.
      </p>
    </section>
  );
}
