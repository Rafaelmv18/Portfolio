import { contact } from "../data/links";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="portfolio-container footer-inner">
        <span>© {currentYear} Rafael Mascarenhas Venas</span>
        <div className="footer-links">
          <a href={contact.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${contact.email}`}>E-mail</a>
        </div>
      </div>
    </footer>
  );
}
