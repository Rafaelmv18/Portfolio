import type { CSSProperties } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { Mail, ArrowUpRight, Download } from "lucide-react";
import { contact, resume } from "../data/links";
import { revealDelay } from "../hooks/useRevealOnScroll";

// Feixes de luz que cruzam o hero: [posição vertical %, duração s, atraso s]
const streaks: Array<[number, number, number]> = [
  [14, 7, 0],
  [32, 9, 2.5],
  [51, 6.5, 1.2],
  [68, 8, 4],
  [86, 10, 0.6],
];

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      {/* Fundo decorativo: grade, brilhos e feixes passando */}
      <div className="hero-bg" aria-hidden="true">
        <div className="hero-grid" />
        <div className="hero-glow hero-glow-a" />
        <div className="hero-glow hero-glow-b" />
        {streaks.map(([top, dur, delay]) => (
          <span
            key={top}
            className="hero-streak"
            style={
              {
                top: `${top}%`,
                "--streak-dur": `${dur}s`,
                "--streak-delay": `${delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      <div className="hero-content">
        <span className="hero-eyebrow hero-enter" style={revealDelay(0)}>
          Olá, eu sou
        </span>

        <h1 className="hero-name hero-enter" style={revealDelay(100)}>
          Rafael Mascarenhas Venas
        </h1>
        <h2 className="hero-role hero-enter" style={revealDelay(220)}>
          Desenvolvedor Full-Stack e Mobile
        </h2>

        <p className="hero-bio hero-enter" style={revealDelay(340)}>
          Desenvolvedor Full-Stack e estudante de Sistemas de Informação no
          IFBA. Construo sistemas de ponta a ponta focados em resolver problemas
          reais, automatizar processos e apoiar decisões estratégicas.
        </p>

        <div className="hero-links hero-enter" style={revealDelay(460)}>
          <a
            href={contact.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-link"
          >
            <FontAwesomeIcon icon={faGithub} />
            <span>GitHub</span>
            <ArrowUpRight size={14} />
          </a>

          <a
            href={contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-link"
          >
            <FontAwesomeIcon icon={faLinkedin} />
            <span>LinkedIn</span>
            <ArrowUpRight size={14} />
          </a>

          <a
            href={resume.url}
            download={resume.fileName}
            className="hero-link"
          >
            <Download size={16} />
            <span>Baixar currículo</span>
          </a>

          <a href="#contato" className="hero-link hero-link-primary">
            <Mail size={16} />
            <span>Entrar em contato</span>
          </a>
        </div>
      </div>
    </section>
  );
}
