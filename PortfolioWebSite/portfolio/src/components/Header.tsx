import { useEffect, useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { navItems, resume } from "../data/links";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Navegação principal">
        <a href="#inicio" className="nav-logo">
          Rafael Mascarenhas
        </a>

        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
          <li>
            <a
              href={resume.url}
              download={resume.fileName}
              className="nav-cta"
            >
              <Download size={15} />
              <span>Currículo</span>
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="nav-mobile-toggle"
          onClick={() => setIsOpen((open) => !open)}
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {isOpen && (
        <div id="mobile-menu" className="mobile-menu">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <a
            href={resume.url}
            download={resume.fileName}
            className="mobile-menu-cta"
            onClick={() => setIsOpen(false)}
          >
            <Download size={15} />
            <span>Baixar currículo</span>
          </a>
        </div>
      )}
    </header>
  );
}
