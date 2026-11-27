// Fonte única dos dados de contato usados no Hero, Contato e Footer.
export const contact = {
  github: "https://github.com/Rafaelmv18",
  linkedin: "https://www.linkedin.com/in/rafael-mascarenhas-7a696328b",
  email: "rafavenas@gmail.com",
  phone: "(75) 98807-1564",
  phoneRaw: "5575988071564",
} as const;

export const whatsappUrl = `https://wa.me/${contact.phoneRaw}`;

// PDF servido a partir de /public. Troque o arquivo lá para atualizar o download.
export const resume = {
  url: "/curriculo.pdf",
  fileName: "Curriculo-Rafael-Mascarenhas-Venas.pdf",
} as const;

export const navItems = [
  { href: "#experiencia", label: "Experiência" },
  { href: "#projetos", label: "Projetos" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#sobre", label: "Sobre" },
  { href: "#contato", label: "Contato" },
] as const;
