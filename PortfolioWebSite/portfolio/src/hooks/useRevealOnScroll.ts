import { useEffect, type CSSProperties } from "react";

const SELECTOR = ".reveal, .reveal-line";

/**
 * Observa todos os elementos com `.reveal` / `.reveal-line` e adiciona
 * `.is-visible` quando entram na tela (uma vez só). O CSS faz a animação.
 * Se o usuário prefere menos movimento, mostra tudo direto.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(SELECTOR);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/** Atraso da animação de entrada, para criar efeito em cascata. */
export function revealDelay(ms: number): CSSProperties {
  return { "--reveal-delay": `${ms}ms` } as CSSProperties;
}
