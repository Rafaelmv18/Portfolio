export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="portfolio-container footer-inner">
        <div>
          <span>© {currentYear} Rafael Mascarenhas Venas</span>
        </div>
        <div className="footer-links">
          <a
            href="https://github.com/Rafaelmv18"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/rafael-mascarenhas-7a696328b"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a href="mailto:rafavenas@gmail.com">E-mail</a>
        </div>
      </div>
    </footer>
  );
}
