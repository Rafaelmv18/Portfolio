import { useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent, ReactNode } from 'react';
import type { Hour } from '../api';
import { useElementSize, useTweenedArray } from '../hooks';
import { clamp } from '../lib/color';
import { hourLabel, temp } from '../lib/format';
import type { Unit } from '../lib/format';
import { describe } from '../lib/weather';
import type { Kind } from '../lib/weather';

interface Props {
  hours: Hour[];
  index: number;
  onChange: (i: number) => void;
  unit: Unit;
  offset: number;
  kind: Kind;
  reduced: boolean;
  /** Desenha o personagem em cima do morro, na hora escolhida. */
  renderCharacter: (pos: { x: number; y: number; moving: boolean }) => ReactNode;
}

type Pt = { x: number; y: number };

/** Curva suave passando por todos os pontos (Catmull-Rom convertida em Bézier). */
function smooth(pts: Pt[]) {
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
  }
  return d;
}

// margem lateral: a Bolota precisa caber inteira nas pontas
const MAX_PAD = 110;

export function Horizon({ hours, index, onChange, unit, offset, kind, reduced, renderCharacter }: Props) {
  const [ref, { width, height }] = useElementSize<HTMLDivElement>();
  const dragging = useRef(false);
  const [moving, setMoving] = useState(false);

  // temperaturas normalizadas (0 = mais frio, 1 = mais quente) — os morros se remodelam ao trocar de cidade/dia
  const norm = useMemo(() => {
    if (!hours.length) return Array.from({ length: 24 }, () => 0.5);
    const temps = hours.map((h) => h.temp);
    const min = Math.min(...temps);
    const range = Math.max(4, Math.max(...temps) - min);
    return temps.map((t) => (t - min) / range);
  }, [hours]);
  const shape = useTweenedArray(norm, 800, reduced);

  // a Bolota "pula" enquanto muda de hora
  useEffect(() => {
    if (reduced) return;
    setMoving(true);
    const id = setTimeout(() => setMoving(false), 420);
    return () => clearTimeout(id);
  }, [index, reduced]);

  const pad = Math.min(MAX_PAD, width * 0.14);
  const n = shape.length;
  const step = n > 1 ? (width - pad * 2) / (n - 1) : 0;
  const top = height * 0.42;
  const amp = height * 0.3;
  const pts: Pt[] = shape.map((k, i) => ({ x: pad + i * step, y: top + (1 - k) * amp }));
  const back: Pt[] = shape.map((_, i) => {
    const k = (shape[Math.max(0, i - 3)] + shape[Math.min(n - 1, i + 2)]) / 2;
    return { x: pad + i * step, y: top - 34 + (1 - k) * amp * 0.7 };
  });

  const ready = width > 0 && hours.length > 0;
  const first = pts[0];
  const last = pts[n - 1];
  const hill = ready ? `M0,${first.y} L${first.x},${first.y}${smooth(pts)} L${width},${last.y} L${width},${height} L0,${height} Z` : '';
  const ridge = ready ? `M${first.x},${first.y}${smooth(pts)}` : '';
  const hillBack = ready
    ? `M0,${back[0].y} L${back[0].x},${back[0].y}${smooth(back)} L${width},${back[n - 1].y} L${width},${height} L0,${height} Z`
    : '';

  const wet = kind === 'rain' || kind === 'storm' || kind === 'drizzle';
  const sel = hours[index];
  const p = pts[index] ?? { x: 0, y: 0 };

  const indexFromX = (clientX: number, el: Element) => {
    const r = el.getBoundingClientRect();
    return clamp(Math.round((clientX - r.left - pad) / (step || 1)), 0, n - 1);
  };

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    e.preventDefault(); // impede que o arrasto selecione texto da página
    // dá foco para as setas funcionarem depois do clique, mas marca que veio do mouse:
    // o contorno de foco só aparece para quem navega pelo teclado
    e.currentTarget.dataset.pointer = 'true';
    e.currentTarget.focus({ preventScroll: true });
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    onChange(indexFromX(e.clientX, e.currentTarget));
  };
  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (dragging.current) onChange(indexFromX(e.clientX, e.currentTarget));
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: KeyboardEvent<SVGSVGElement>) => {
    delete e.currentTarget.dataset.pointer;
    const moves: Record<string, number> = {
      ArrowLeft: index - 1, ArrowDown: index - 1, ArrowRight: index + 1, ArrowUp: index + 1,
      PageDown: index - 3, PageUp: index + 3, Home: 0, End: n - 1,
    };
    if (e.key in moves) {
      e.preventDefault();
      onChange(clamp(moves[e.key], 0, n - 1));
    }
  };

  return (
    <div className="horizon" ref={ref}>
      <svg
        className={`horizon__svg ${ready ? '' : 'is-loading'}`}
        width={width}
        height={height}
        role="slider"
        tabIndex={0}
        aria-label="Hora da previsão. Use as setas para mudar."
        aria-valuemin={0}
        aria-valuemax={Math.max(0, n - 1)}
        aria-valuenow={index}
        aria-valuetext={sel ? `${hourLabel(sel.t, offset)}, ${temp(sel.temp, unit)} graus, ${describe(sel.code).label}` : 'Carregando'}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        onBlur={(e) => delete e.currentTarget.dataset.pointer}
      >
        {ready ? (
          <>
            <path className="hill-back" d={hillBack} />
            <path className="hill" d={hill} />
            <path className={`snow-cover ${kind === 'snow' ? 'is-on' : ''}`} d={ridge} />

            {pts.map((pt, i) =>
              i % 2 === 1 ? (
                <path key={`t${i}`} className="tuft" transform={`translate(${pt.x + 6},${pt.y + 2})`} d="M-7 0 Q-5 -9 -3 0 Q-1 -13 1 0 Q3 -8 5 0 Z" />
              ) : null,
            )}

            {wet &&
              [3, 10, 17].map((i) =>
                pts[i] ? (
                  <g key={`p${i}`} className="puddle" transform={`translate(${pts[i].x},${pts[i].y + 9})`}>
                    <ellipse rx="20" ry="4.5" />
                    {!reduced && <ellipse className="ripple" rx="6" ry="1.5" style={{ animationDelay: `${i * 0.13}s` }} />}
                  </g>
                ) : null,
              )}

            {hours.map((h, i) => (
              <g key={h.t} transform={`translate(${pts[i].x},0)`}>
                {h.rain > 0 && <rect className="rain-bar" x={-1.5} y={height - 30 - (h.rain / 100) * 22} width={3} height={(h.rain / 100) * 22} rx={1.5} />}
                {i % 3 === 0 && (
                  <text className={`hour ${i === index ? 'is-selected' : ''}`} y={height - 10} textAnchor="middle">
                    {hourLabel(h.t, offset)}
                  </text>
                )}
              </g>
            ))}

          </>
        ) : (
          <line className="skeleton-line" x1={pad} x2={Math.max(pad, width - pad)} y1={top + amp / 2} y2={top + amp / 2} />
        )}
      </svg>
      {ready && renderCharacter({ x: p.x, y: p.y, moving })}
    </div>
  );
}
