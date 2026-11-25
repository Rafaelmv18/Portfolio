import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
import { Mail, ArrowUpRight } from "lucide-react";
import { contact, whatsappUrl } from "../data/links";
import { revealDelay } from "../hooks/useRevealOnScroll";

export default function Contact() {
  const { email, phone, phoneRaw } = contact;

  return (
    <section className="section" id="contato">
      <h3 className="section-title reveal">
        Contato
      </h3>

      <div className="contact-card-wrapper reveal" style={revealDelay(150)}>
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
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-value"
              >
                {phone}
              </a>
            </div>
          </div>

          <div className="contact-actions-col">
            <a href={`mailto:${email}`} className="contact-btn">
              <Mail size={18} />
              <span>Enviar E-mail Direto</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn-ghost"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
              <span>WhatsApp</span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn-ghost"
            >
              <FontAwesomeIcon icon={faLinkedin} />
              <span>LinkedIn</span>
              <ArrowUpRight size={14} />
            </a>

            <a
              href={contact.github}
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
