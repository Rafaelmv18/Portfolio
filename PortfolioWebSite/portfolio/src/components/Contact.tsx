import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { Mail, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const email = "rafavenas@gmail.com";
  const phone = "(75) 98807-1564";
  const phoneRaw = "5575988071564";

  return (
    <section className="section" id="contato">
      <span className="section-label">Disponibilidade</span>
      <h3 className="section-title">Contato</h3>

      <div className="contact-card-wrapper">
        <div className="contact-details-box">
          <div className="contact-info-col">
            <div className="contact-detail-row">
              <span className="contact-label">E-mail</span>
              <a href={`mailto:${email}`} className="contact-value">
                {email}
              </a>
            </div>

            <div className="contact-detail-row">
              <span className="contact-label">Telefone</span>
              <a href={`tel:${phoneRaw}`} className="contact-value">
                {phone}
              </a>
            </div>

            <div className="contact-detail-row">
              <span className="contact-label">WhatsApp</span>
              <a
                href={`https://wa.me/${phoneRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-value"
              >
                {phone} <span className="contact-hint">(Iniciar conversa)</span>
              </a>
            </div>
          </div>

          <div className="contact-actions-col">
            <a href={`mailto:${email}`} className="contact-btn">
              <Mail size={18} />
              <span>Enviar E-mail Direto</span>
            </a>

            <a
              href={`https://wa.me/${phoneRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn-ghost"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
              <span>WhatsApp</span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href="https://www.linkedin.com/in/rafael-mascarenhas-7a696328b"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn-ghost"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <span>LinkedIn</span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href="https://github.com/Rafaelmv18"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn-ghost"
            >
              <FontAwesomeIcon icon={faGithub} />
              <span>GitHub</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
