import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { Mail, ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <h1 className="hero-name">Rafael Mascarenhas Venas</h1>
      <h2 className="hero-role">
        Desenvolvedor de Software — Full-Stack & Mobile
      </h2>

      <p className="hero-bio">
        Estudante do 7º semestre de Sistemas de Informação no IFBA. Atualmente,
        atuo como Estagiário de Desenvolvimento Full-Stack, construindo sistemas
        de ponta a ponta focados em resolução de problemas reais, automação e
        suporte a decisões estratégicas. Combino uma postura altamente dedicada
        e analítica à utilização de tecnologias de IA para otimizar minha
        produtividade e o tempo de resposta às demandas da empresa.
      </p>

      <div className="hero-links">
        <a
          href="https://github.com/Rafaelmv18"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-link"
        >
          <FontAwesomeIcon icon={faGithub} />
          <span>GitHub</span>
          <ArrowUpRight size={14} />
        </a>

        <a
          href="https://www.linkedin.com/in/rafael-mascarenhas-7a696328b"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-link"
        >
          <FontAwesomeIcon icon={faLinkedin} />
          <span>LinkedIn</span>
          <ArrowUpRight size={14} />
        </a>

        <a href="mailto:rafavenas@gmail.com" className="hero-link">
          <Mail size={16} />
          <span>rafavenas@gmail.com</span>
        </a>

        <a
          href="https://wa.me/5575988071564"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-link"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
          <span>(75) 98807-1564</span>
        </a>
      </div>
    </section>
  );
}
