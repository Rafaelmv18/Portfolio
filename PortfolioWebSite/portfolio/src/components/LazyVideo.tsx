import { useEffect, useRef } from "react";

type LazyVideoProps = {
  src: string;
  poster?: string;
  label: string;
};

/**
 * Vídeo que só baixa e toca quando entra na tela, e pausa ao sair.
 * Quem prefere menos movimento (prefers-reduced-motion) não recebe autoplay
 * e pode dar play manualmente pelos controles.
 */
export default function LazyVideo({ src, poster, label }: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src;
          if (!reduceMotion) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px", threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      preload="none"
      muted
      loop
      playsInline
      controls
      aria-label={label}
    />
  );
}
