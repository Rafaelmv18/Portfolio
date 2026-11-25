import { revealDelay } from "../hooks/useRevealOnScroll";

export default function About() {
  return (
    <section className="section" id="sobre">
      <h3 className="section-title reveal">Sobre Mim</h3>

      <div className="about-text">
        <p className="reveal" style={revealDelay(100)}>
          Estou no 7º semestre de <strong>Sistemas de Informação</strong> no{" "}
          <strong>IFBA (Instituto Federal da Bahia)</strong>.
        </p>
        <p className="reveal" style={revealDelay(200)}>
          Hoje sou estagiário de desenvolvimento full-stack na{" "}
          <strong>Equipadora Gato Preto</strong>, onde construo sistemas
          internos com Python, React e PostgreSQL: automações, relatórios para
          a gestão e a configuração dos servidores de produção.
        </p>
        <p className="reveal" style={revealDelay(300)}>
          Uso ferramentas de IA, como o Claude Code, no dia a dia para entregar
          mais rápido, sem deixar de revisar e entender o código que vai para
          produção.
        </p>
      </div>
    </section>
  );
}
