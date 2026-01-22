export default function Projects() {
  return (
    <section id="projetos">
      <h2>Projetos</h2>

      <div className="projetos-container">
        <p className="title">Web</p>
        <div className="projetos-grid">
          <div className="projeto-grid">
            <h3>Spike Gym</h3>
            <p>
              Projeto desenvolvido em dupla utilizando PHP e JavaScript, com o
              objetivo de criar um sistema completo para academias. A aplicação
              atende tanto os clientes, permitindo o agendamento de aulas e
              renovação de matrículas, quanto a gestão, oferecendo
              funcionalidades como controle de usuários e geração de relatórios
              administrativos.
            </p>
            <img src="site_academia.png" alt="Projeto To-do List" />
            <div className="projeto-link">
              <a
                href="https://github.com/Rafaelmv18/Site_Academia"
                target="_blank"
              >
                <i className="fa-brands fa-github"></i> Código
              </a>
            </div>
          </div>
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
          <div className="projeto-grid">
            <h3>Conversor de Moeda</h3>
            <p>
              Aplicação web que consome uma API para exibir a conversão de
              diferentes moedas.
            </p>
            <img src="conversor_moeda.png" alt="Projeto Conversor de Moeda" />
            <div className="projeto-link">
              <a
                href="https://github.com/Rafaelmv18/Portfolio/tree/main/ConversorMoeda"
                target="_blank"
              >
                <i className="fa-brands fa-github"></i> Código
              </a>
            </div>
          </div>
          <div className="projeto-grid">
            <h3>To-do List</h3>
            <p>Aplicação web de uma To-do List.</p>
            <img src="to-do_list.png" alt="Projeto To-do List" />
            <div className="projeto-link">
              <a
                href="https://github.com/Rafaelmv18/Portfolio/tree/main/To-do%20List"
                target="_blank"
              >
                <i className="fa-brands fa-github"></i> Código
              </a>
            </div>
          </div>
        </div>

        <p className="title">Mobile</p>
        <div className="projetos-grid">
          <div className="projeto-grid">
            <h3>IncluiAqui</h3>
            <p>
              Projeto realizado em equipe com React Native, TypeScript e
              JavaScript. Ele tem como foco a acessibilidade, facilitando o
              acesso a informações de acessibilidade dos locais.
            </p>
            <video src="/projetoTA.mp4" autoPlay muted loop controls></video>
            <div className="projeto-link">
              <a
                href="https://github.com/Rafaelmv18/IncluiAqui"
                target="_blank"
              >
                <i className="fa-brands fa-github"></i> Código
              </a>
              <a
                className="portal"
                href="https://portal.ifba.edu.br/feira-de-santana/noticias/2025/estudantes-do-ifba-feira-de-santana-desenvolvem-aplicativo-voltado-a-acessibilidade-incluiaqui"
                target="_blank"
              >
                <i className="fa-brands fa-github"></i> Portal IFBA
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
