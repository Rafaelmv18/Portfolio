import { useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { clamp } from '../lib/color';
import type { Phase } from '../lib/sky';
import type { Kind } from '../lib/weather';

/** Camada com parallax. depth = quantos px ela se desloca com o mouse. */
export function Layer({ depth, className = '', children }: { depth: number; className?: string; children?: ReactNode }) {
  return (
    <div className={`layer ${className}`} style={{ '--depth': depth } as CSSProperties} aria-hidden="true">
      {children}
    </div>
  );
}

/* ---------- estrelas ---------- */

// pseudo-aleatório com semente fixa: as estrelas ficam sempre no mesmo lugar
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

export function Stars({ opacity }: { opacity: number }) {
  const stars = useMemo(() => {
    const rnd = seeded(42);
    return Array.from({ length: 90 }, (_, i) => ({
      x: rnd() * 100,
      y: rnd() * 62,
      r: 0.6 + rnd() * 1.4,
      twinkle: i % 4 === 0,
      delay: rnd() * 4,
    }));
  }, []);
  return (
    <svg className="stars" style={{ opacity }} width="100%" height="100%">
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={`${s.x}%`}
          cy={`${s.y}%`}
          r={s.r}
          className={s.twinkle ? 'twinkle' : undefined}
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}
    </svg>
  );
}

/* ---------- sol e lua ---------- */

export function Celestial({ phase, cover }: { phase: Phase; cover: number }) {
  // o arco vai de 8% a 92% da largura; a altura acompanha o seno da fase
  const left = `${8 + phase.p * 84}%`;
  const height = Math.abs(phase.e);
  const top = `${66 - height * 52}%`;
  const warm = clamp(1 - phase.e * 4, 0, 1); // perto do horizonte o sol fica alaranjado
  const veil = 1 - cover * 0.75;
  return (
    <>
      <div
        className="sun"
        style={{ left, top, opacity: phase.isDay ? veil : 0, '--warm': warm } as CSSProperties}
      />
      <div className="moon" style={{ left, top, opacity: phase.isDay ? 0 : veil }} />
    </>
  );
}

/* ---------- nuvens ---------- */

const CLOUD_PATH =
  'M44 98 C16 98 10 66 36 60 C34 34 70 22 88 42 C98 12 152 14 158 48 C188 42 210 70 190 92 C186 97 180 98 172 98 Z';

const FAR = [
  { x: 10, y: 10, s: 0.7, dur: 1.0, off: 0.1 },
  { x: 55, y: 18, s: 0.55, dur: 1.2, off: 0.55 },
  { x: 80, y: 6, s: 0.8, dur: 0.9, off: 0.8 },
  { x: 30, y: 26, s: 0.5, dur: 1.3, off: 0.35 },
  { x: 68, y: 30, s: 0.6, dur: 1.1, off: 0.7 },
];
const NEAR = [
  { x: 20, y: 4, s: 1.4, dur: 1.0, off: 0.2 },
  { x: 62, y: 12, s: 1.1, dur: 1.15, off: 0.6 },
  { x: 85, y: 22, s: 1.25, dur: 0.95, off: 0.9 },
  { x: 40, y: 20, s: 1.0, dur: 1.2, off: 0.45 },
];

export function Clouds({ cover, tone, wind, near }: { cover: number; tone: string; wind: number; near?: boolean }) {
  const set = near ? NEAR : FAR;
  const visible = Math.round(cover * set.length + (near ? -0.5 : 0.4));
  // vento mais forte = nuvens mais rápidas
  const base = (near ? 70 : 140) / (1 + wind / 20);
  return (
    <div className={`clouds ${near ? 'clouds--near' : 'clouds--far'}`}>
      {set.map((c, i) => {
        const dur = base * c.dur;
        return (
          <svg
            key={i}
            className="cloud"
            viewBox="0 0 220 110"
            style={{
              '--x': `${c.x}%`,
              top: `${c.y}%`,
              width: `calc(var(--cloud-size) * ${c.s})`,
              color: tone,
              opacity: i < visible ? (near ? 0.95 : 0.8) : 0,
              animationDuration: `${dur}s`,
              animationDelay: `${-dur * c.off}s`,
            } as CSSProperties}
          >
            <path d={CLOUD_PATH} fill="currentColor" />
            <path d={CLOUD_PATH} fill="url(#cloud-shade)" />
          </svg>
        );
      })}
    </div>
  );
}

/* ---------- montanhas ---------- */

export function Mountains({ far, near, snowy }: { far: string; near: string; snowy: boolean }) {
  return (
    <svg className="mountains" viewBox="0 0 1440 420" preserveAspectRatio="xMidYMax slice">
      <path
        style={{ fill: far }}
        d="M0 300 L120 210 L210 250 L330 140 L450 240 L560 180 L700 260 L820 120 L960 230 L1080 170 L1200 250 L1320 160 L1440 220 L1440 420 L0 420 Z"
      />
      <g className={`snowcaps ${snowy ? 'is-on' : ''}`}>
        <path d="M330 140 L300 168 L318 162 L332 172 L348 160 L362 168 Z" />
        <path d="M820 120 L786 152 L806 146 L822 158 L838 146 L856 152 Z" />
        <path d="M1320 160 L1292 186 L1310 180 L1324 190 L1338 180 L1350 186 Z" />
      </g>
      <path
        style={{ fill: near }}
        d="M0 330 C120 300 200 260 300 280 C420 305 480 240 600 250 C720 262 780 310 900 296 C1020 282 1100 236 1220 252 C1320 266 1380 300 1440 290 L1440 420 L0 420 Z"
      />
    </svg>
  );
}

/* ---------- neblina ---------- */

export function Fog({ on }: { on: boolean }) {
  return (
    <div className="fog" style={{ opacity: on ? 1 : 0 }}>
      <span style={{ bottom: '18%' }} />
      <span style={{ bottom: '32%', animationDelay: '-12s' }} />
      <span style={{ bottom: '46%', animationDelay: '-24s' }} />
    </div>
  );
}

/* ---------- primeiro plano: tufos nos cantos ---------- */

export function Corners() {
  return (
    <svg className="corners" viewBox="0 0 1440 200" preserveAspectRatio="xMidYMax slice">
      <path d="M0 200 L0 120 C30 140 40 90 60 70 C62 110 80 120 96 96 C98 130 120 150 150 140 C170 160 180 180 200 200 Z" />
      <path d="M1440 200 L1440 110 C1410 130 1404 80 1384 60 C1380 104 1360 112 1346 92 C1342 130 1320 146 1290 138 C1270 160 1262 182 1240 200 Z" />
    </svg>
  );
}

/* ---------- efeitos de tela ---------- */

export function ScreenFx({ kind, tempC, reduced }: { kind: Kind; tempC: number; reduced: boolean }) {
  const frost = clamp((3 - tempC) / 10, 0, 1);
  const heat = clamp((tempC - 29) / 8, 0, 1);
  const wet = kind === 'rain' || kind === 'storm' || kind === 'drizzle';
  return (
    <div className="fx" aria-hidden="true">
      <div className="fx__frost" style={{ opacity: frost }} />
      <div className="fx__heat" style={{ opacity: heat }} />
      <div className={`fx__glass ${wet && !reduced ? 'is-on' : ''}`}>
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} style={{ left: `${8 + i * 10.5}%`, animationDelay: `${-i * 1.7}s`, '--s': 0.6 + (i % 3) * 0.3 } as CSSProperties} />
        ))}
      </div>
      <div className="fx__flash" />
    </div>
  );
}
