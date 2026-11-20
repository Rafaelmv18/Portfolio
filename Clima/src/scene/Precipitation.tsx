import { useEffect, useRef } from 'react';
import type { Kind } from '../lib/weather';

interface Props {
  kind: Kind;
  intensity: number;
  wind: number;
  reduced: boolean;
}

interface Drop {
  x: number;
  y: number;
  v: number;
  len: number;
  r: number;
  phase: number;
}

/**
 * Chuva, garoa, neve e raios em canvas.
 * Centenas de partículas: canvas é bem mais leve que centenas de elementos no DOM.
 */
export function Precipitation({ kind, intensity, wind, reduced }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({
    w: 0,
    h: 0,
    drops: [] as Drop[],
    flash: 0,
    bolt: null as null | { pts: [number, number][]; life: number },
    nextBolt: 2,
  });

  // tamanho do canvas acompanha a tela (com densidade de pixels limitada a 2x)
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ro = new ResizeObserver(() => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = c.getBoundingClientRect();
      c.width = Math.round(width * dpr);
      c.height = Math.round(height * dpr);
      c.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
      state.current.w = width;
      state.current.h = height;
    });
    ro.observe(c);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const c = canvasRef.current;
    const ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    const s = state.current;
    if (!s.w) {
      const r = c.getBoundingClientRect();
      s.w = r.width;
      s.h = r.height;
    }

    const snow = kind === 'snow';
    const drizzle = kind === 'drizzle';
    const wet = snow || drizzle || kind === 'rain' || kind === 'storm';
    const count = wet ? Math.round((snow ? 170 : drizzle ? 130 : 380) * Math.max(0.3, intensity)) : 0;
    const slant = Math.max(-0.6, Math.min(0.6, wind / 70)); // deslocamento horizontal por px de queda

    const spawn = (anywhere: boolean): Drop => ({
      x: Math.random() * (s.w + 300) - 150,
      y: anywhere ? Math.random() * s.h : -30 - Math.random() * 60,
      v: snow ? 35 + Math.random() * 55 : drizzle ? 480 + Math.random() * 220 : 900 + Math.random() * 500,
      len: drizzle ? 6 + Math.random() * 6 : 14 + Math.random() * 14,
      r: 1.2 + Math.random() * 2.6,
      phase: Math.random() * Math.PI * 2,
    });

    s.drops = s.drops.slice(0, count);
    while (s.drops.length < count) s.drops.push(spawn(true));

    const makeBolt = () => {
      const pts: [number, number][] = [];
      let x = s.w * (0.2 + Math.random() * 0.6);
      let y = 0;
      while (y < s.h * 0.62) {
        pts.push([x, y]);
        x += (Math.random() - 0.5) * 60;
        y += 20 + Math.random() * 40;
      }
      return { pts, life: 1 };
    };

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      const dt = reduced ? 0 : Math.min(0.05, (now - last) / 1000);
      last = now;
      const { w, h } = s;
      ctx.clearRect(0, 0, w, h);

      if (snow) {
        ctx.fillStyle = 'rgba(255,255,255,0.88)';
        for (const d of s.drops) {
          d.y += d.v * dt;
          d.phase += dt * 1.4;
          d.x += (Math.sin(d.phase) * 22 + slant * d.v) * dt;
          if (d.y > h + 10) Object.assign(d, spawn(false));
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (count) {
        ctx.strokeStyle = drizzle ? 'rgba(220,232,250,0.45)' : 'rgba(215,230,250,0.55)';
        ctx.lineWidth = drizzle ? 1 : 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        for (const d of s.drops) {
          d.y += d.v * dt;
          d.x += d.v * slant * dt;
          if (d.y > h + 30) Object.assign(d, spawn(false));
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(d.x - slant * d.len, d.y - d.len);
        }
        ctx.stroke();
      }

      // raios: no máximo um a cada 4 s, clarão fraco (seguro para fotossensibilidade)
      if (kind === 'storm' && !reduced) {
        s.nextBolt -= dt;
        if (s.nextBolt <= 0) {
          s.bolt = makeBolt();
          s.flash = 1;
          s.nextBolt = 4 + Math.random() * 6;
          window.dispatchEvent(new CustomEvent('lightning'));
        }
        if (s.flash > 0) {
          ctx.fillStyle = `rgba(230,236,255,${s.flash * 0.2})`;
          ctx.fillRect(0, 0, w, h);
          s.flash = Math.max(0, s.flash - dt * 3);
        }
        if (s.bolt) {
          ctx.strokeStyle = `rgba(255,255,255,${s.bolt.life})`;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          s.bolt.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.stroke();
          s.bolt.life -= dt * 2.5;
          if (s.bolt.life <= 0) s.bolt = null;
        }
      }

      if (!reduced && (count || kind === 'storm')) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [kind, intensity, wind, reduced]);

  return <canvas ref={canvasRef} className="precip" aria-hidden="true" />;
}
