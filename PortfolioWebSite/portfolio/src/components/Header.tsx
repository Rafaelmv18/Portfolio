import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="site-nav">
        <a href="#inicio" className="nav-logo">
          Rafael Mascarenhas
        </a>

        <ul className="nav-links">
          <li>
            <a href="#experiencia">Experiência</a>
          </li>
          <li>
            <a href="#projetos">Projetos</a>
          </li>
          <li>
            <a href="#habilidades">Habilidades</a>
          </li>
          <li>
            <a href="#sobre">Sobre</a>
          </li>
          <li>
            <a href="#contato">Contato</a>
          </li>
        </ul>

        <button
          className="nav-mobile-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Alternar menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div
          style={{
            background: "#0e1118",
            borderBottom: "1px solid #1e2430",
            padding: "1rem 24px",
            display: "flex",
            flexDirection: "column",
            gap: "0.85rem",
          }}
        >
          <a
            href="#experiencia"
            onClick={() => setIsOpen(false)}
            style={{
              color: "#f1f5f9",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Experiência
          </a>
          <a
            href="#projetos"
            onClick={() => setIsOpen(false)}
            style={{
              color: "#f1f5f9",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Projetos
          </a>
          <a
            href="#habilidades"
            onClick={() => setIsOpen(false)}
            style={{
              color: "#f1f5f9",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Habilidades
          </a>
          <a
            href="#sobre"
            onClick={() => setIsOpen(false)}
            style={{
              color: "#f1f5f9",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Sobre
          </a>
          <a
            href="#contato"
            onClick={() => setIsOpen(false)}
            style={{
              color: "#f1f5f9",
              textDecoration: "none",
              fontSize: "0.95rem",
            }}
          >
            Contato
          </a>
        </div>
      )}
    </header>
  );
}
