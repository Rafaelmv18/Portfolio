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

      <div className="contact-section-content">
        <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
          Estou aberto a oportunidades profissionais, estágios e novos projetos.
          Sinta-se à vontade para entrar em contato diretamente por qualquer um
          dos canais abaixo:
        </p>

        <div className="contact-details-box">
          <div className="contact-detail-row">
            <span className="contact-label">E-mail:</span>
            <a href={`mailto:${email}`} className="contact-value">
              {email}
            </a>
          </div>

          <div className="contact-detail-row">
            <span className="contact-label">Telefone:</span>
            <a href={`tel:${phoneRaw}`} className="contact-value">
              {phone}
            </a>
          </div>

          <div className="contact-detail-row">
            <span className="contact-label">WhatsApp:</span>
            <a
              href={`https://wa.me/${phoneRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-value"
            >
              {phone} (Conversar no WhatsApp)
            </a>
          </div>

          <div className="contact-actions-row">
            <a href={`mailto:${email}`} className="contact-btn">
              <Mail size={16} />
              <span>Enviar E-mail</span>
            </a>

            <a
              href={`https://wa.me/${phoneRaw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-btn-ghost"
            >
              <FontAwesomeIcon icon={faWhatsapp} />
              <span>Abrir WhatsApp</span>
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
