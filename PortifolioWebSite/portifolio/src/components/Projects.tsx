export default function Projects() {
  return (
    <section id="projetos" className="content-section">
      <h2>Projetos</h2>

      <div className="projetos-container">
        <p className="title">Mobile</p>
        <div className="projetos-grid">
          <div className="projeto-grid">
            <h3>IncluiAqui</h3>
            <p>
              Projeto realizado em equipe com React Native, TypeScript e
              JavaScript. Ele tem como foco a acessibilidade, facilitando o
              acesso a informações de acessibilidade dos locais.
            </p>
            <video src="projetoTA.mp4" muted loop controls></video>
            <div className="projeto-link">
              <a
                href="https://github.com/Rafaelmv18/IncluiAqui"
                target="_blank"
              >
                <i className="fa-brands fa-github"></i> Código
              </a>
            </div>
          </div>
        </div>

        <p className="title">Web</p>
        <div className="projetos-grid">
          <div className="projeto-grid">
            <h3>Previsão do tempo</h3>
            <p>
              Aplicação web que consome uma API para exibir a previsão do tempo
              de uma cidade.
            </p>
            <img src="clima.png" alt="Projeto Previsão do Tempo" />
            <div className="projeto-link">
              <a
                href="https://github.com/Rafaelmv18/Portfolio/tree/main/Clima"
                target="_blank"
              >
                <i className="fa-brands fa-github"></i> Código
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
