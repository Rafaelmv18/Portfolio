import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { ItemId, Look, Mood } from '../lib/outfit';

interface Props {
  x: number;
  y: number;
  moving: boolean;
  look: Look;
  reduced: boolean;
  /** vira o balão para a esquerda quando a Bolota está perto da borda direita */
  flip: boolean;
}

/* ---------------------------------------------------------
   Peças (coordenadas do viewBox -20 -50 240 290).
   Corpo: círculo em (100,150) r62. Olhos em (80,138) e (120,138).
   Mão direita ~ (172,150) quando levantada; esquerda ~ (24,176).
   Todas ficam desenhadas; só as do visual atual recebem .is-on.
   --------------------------------------------------------- */
// cabo curto: a copa fica logo acima da cabeça (não invade o texto da tela)
const UMBRELLA_STICK = <line x1="172" y1="154" x2="172" y2="34" stroke="#5a4636" strokeWidth="4" strokeLinecap="round" />;

const ITEMS: Record<ItemId, ReactNode> = {
  /* ----- cabeça ----- */
  flower: (
    <g>
      <path d="M100 90 Q97 76 103 64" fill="none" stroke="#4f9a52" strokeWidth="4" strokeLinecap="round" />
      <path d="M100 80 Q88 72 86 80 Q94 86 100 80 Z" fill="#5fae5f" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={103 + Math.cos((a * Math.PI) / 180) * 7} cy={60 + Math.sin((a * Math.PI) / 180) * 7} r="6" fill="#ff9fc0" />
      ))}
      <circle cx="103" cy="60" r="4.5" fill="#ffd34d" />
    </g>
  ),
  cap: (
    <g>
      <path d="M50 114 C52 70 148 70 150 114 Q100 104 50 114 Z" fill="#2e6fd0" />
      <path d="M118 110 Q166 100 188 116 Q160 124 122 120 Z" fill="#2559aa" />
      <circle cx="100" cy="77" r="4" fill="#2559aa" />
    </g>
  ),
  beanie: (
    <g>
      <path d="M46 120 C46 62 154 62 154 120 Z" fill="#2f4b7c" />
      <rect x="42" y="106" width="116" height="21" rx="10" fill="#3e61a0" />
      {[56, 70, 84, 98, 112, 126, 140].map((x) => (
        <line key={x} x1={x} x2={x} y1="110" y2="123" stroke="#2f4b7c" strokeWidth="3" strokeLinecap="round" />
      ))}
      <circle cx="100" cy="60" r="13" fill="#efe7da" />
    </g>
  ),
  hood: (
    <g>
      <path d="M40 146 C34 64 166 64 160 146 C152 110 48 110 40 146 Z" fill="#f5c842" />
      <path d="M100 74 L100 96" stroke="#d9a92a" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  nightcap: (
    <g>
      <path d="M50 114 C56 58 130 38 176 70 C192 82 196 104 186 120 C176 98 156 90 150 114 Z" fill="#5b6fb8" />
      <path d="M48 112 Q100 100 152 112 L150 124 Q100 112 50 124 Z" fill="#ede6f5" />
      <circle cx="188" cy="124" r="10" fill="#ede6f5" />
      <circle cx="96" cy="78" r="2.5" fill="#ffe27a" />
      <circle cx="130" cy="66" r="2" fill="#ffe27a" />
      <circle cx="150" cy="86" r="2.5" fill="#ffe27a" />
    </g>
  ),
  bowler: (
    <g transform="rotate(-14 82 96)">
      <ellipse cx="82" cy="96" rx="36" ry="7" fill="#3b2a22" />
      <path d="M58 96 C58 60 106 60 106 96 Z" fill="#4a352b" />
      <rect x="58" y="86" width="48" height="7" fill="#2a1d17" />
    </g>
  ),
  blanket: (
    // cobertor com abertura para o rosto (fill-rule evenodd recorta a elipse do meio)
    <g>
      <path
        fillRule="evenodd"
        fill="#7d6bb5"
        d="M26 214 C14 130 36 70 100 64 C164 70 186 130 174 214 C150 204 128 218 100 208 C72 218 50 204 26 214 Z M100 116 m-44 30 a44 38 0 1 0 88 0 a44 38 0 1 0 -88 0 Z"
      />
      {[[60, 96], [100, 80], [140, 96], [44, 180], [156, 180], [100, 200]].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" fill="#f2d16b" />
      ))}
    </g>
  ),
  sleepmask: (
    <g>
      <path d="M44 104 Q100 88 156 104" fill="none" stroke="#4a5a9c" strokeWidth="5" />
      <path d="M66 100 q16 -12 32 0 q4 2 8 0 q16 -12 32 0 l-2 12 q-14 9 -30 0 q-4 -2 -8 0 q-16 9 -30 0 Z" fill="#5b6fb8" />
    </g>
  ),
  earmuffs: (
    <g>
      <path d="M40 142 C40 66 160 66 160 142" fill="none" stroke="#d8414e" strokeWidth="7" strokeLinecap="round" />
      <circle cx="40" cy="144" r="15" fill="#f2e9dc" />
      <circle cx="160" cy="144" r="15" fill="#f2e9dc" />
    </g>
  ),

  /* ----- rosto ----- */
  sunglasses: (
    <g>
      <rect x="61" y="127" width="37" height="25" rx="11" fill="#1c2230" />
      <rect x="102" y="127" width="37" height="25" rx="11" fill="#1c2230" />
      <path d="M98 135 Q100 131 102 135" fill="none" stroke="#1c2230" strokeWidth="3" />
      <path d="M68 133 L78 133 M109 133 L119 133" stroke="#fff" strokeOpacity=".45" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),

  /* ----- corpo ----- */
  scarf: (
    <g>
      <path d="M40 178 Q100 200 160 178 L162 196 Q100 218 38 196 Z" fill="#d8414e" />
      <path d="M126 192 L140 238 L120 240 L113 196 Z" fill="#c23441" className="anim-scarf" />
      <path d="M54 186 Q100 204 146 186" fill="none" stroke="#f2a0a6" strokeWidth="3" strokeDasharray="8 8" />
    </g>
  ),
  raincoat: (
    <g>
      <rect x="30" y="168" width="140" height="60" fill="#f5c842" clipPath="url(#body-clip)" />
      <circle cx="100" cy="186" r="4" fill="#b98318" />
      <circle cx="100" cy="202" r="4" fill="#b98318" />
    </g>
  ),
  boots: (
    <g fill="#e0a22a">
      <ellipse cx="78" cy="212" rx="19" ry="12" />
      <ellipse cx="122" cy="212" rx="19" ry="12" />
    </g>
  ),

  /* ----- mão direita ----- */
  umbrella: (
    <g className="anim-umbrella">
      {UMBRELLA_STICK}
      <g transform="translate(0 40)">
        <path d="M62 -4 Q140 -80 218 -4 Q198 -14 179 -4 Q159 -14 140 -4 Q121 -14 101 -4 Q82 -14 62 -4 Z" fill="#e04a43" />
        <path d="M140 -42 L140 -4 M101 -4 Q118 -40 140 -42 M179 -4 Q162 -40 140 -42" fill="none" stroke="#b8322d" strokeWidth="2.5" />
      </g>
    </g>
  ),
  umbrellaFlipped: (
    // virado do avesso pelo vento
    <g className="anim-umbrella anim-flipped">
      {UMBRELLA_STICK}
      <path transform="translate(0 40)" d="M96 -58 Q120 -8 172 -6 Q224 -8 248 -58 Q228 -44 212 -54 Q194 -42 172 -52 Q150 -42 132 -54 Q116 -44 96 -58 Z" fill="#e04a43" />
      <path transform="translate(0 40)" d="M172 -6 L172 -52 M132 -54 Q150 -16 172 -6 M212 -54 Q194 -16 172 -6" fill="none" stroke="#b8322d" strokeWidth="2.5" />
    </g>
  ),
  popsicle: (
    <g>
      <rect x="175" y="146" width="6" height="24" rx="3" fill="#dcbc8c" />
      <path d="M167 116 a11 11 0 0 1 22 0 v34 h-22 Z" fill="#ff7fa8" />
      <path d="M167 128 h22 v6 h-22 Z" fill="#ffd34d" />
    </g>
  ),
  mug: (
    <g>
      <path className="anim-steam" d="M170 120 q-5 -8 0 -16 q5 -8 0 -16 M180 122 q-5 -8 0 -16 q5 -8 0 -16" fill="none" stroke="#ffffff" strokeOpacity=".75" strokeWidth="3" strokeLinecap="round" />
      <rect x="163" y="128" width="26" height="26" rx="6" fill="#f4efe6" />
      <path d="M189 134 q10 0 10 8 q0 8 -10 8" fill="none" stroke="#f4efe6" strokeWidth="5" />
      <rect x="166" y="131" width="20" height="5" rx="2.5" fill="#7a4a2e" />
      <path d="M170 144 l12 0" stroke="#e46b6b" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  fan: (
    <g className="anim-fan">
      <path d="M176 150 L150 108 A50 50 0 0 1 204 104 Z" fill="#ff8fb1" />
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="176" y1="150" x2={156 + i * 15} y2={104 - (i === 1 || i === 2 ? 4 : 0)} stroke="#e0628a" strokeWidth="2" />
      ))}
      <circle cx="176" cy="150" r="4" fill="#8a5a3a" />
    </g>
  ),
  snowball: (
    <g>
      <circle cx="178" cy="136" r="13" fill="#f4f8fc" />
      <circle cx="173" cy="131" r="4" fill="#ffffff" />
      <path d="M168 142 a13 13 0 0 0 22 -2" fill="none" stroke="#c9d7e6" strokeWidth="3" />
    </g>
  ),

  /* ----- mão esquerda ----- */
  lantern: (
    <g className="anim-lantern">
      <circle cx="22" cy="176" r="46" fill="url(#lantern-glow)" />
      <path d="M12 160 Q22 146 32 160" fill="none" stroke="#2b2b2b" strokeWidth="3" />
      <rect x="11" y="159" width="22" height="30" rx="5" fill="#2f2f2f" />
      <rect x="15" y="164" width="14" height="20" rx="3" fill="#ffd27a" />
    </g>
  ),
  flashlight: (
    <g className="anim-flashlight">
      <path d="M8 182 L-90 236 L-60 268 Z" fill="url(#beam)" />
      <g transform="rotate(28 22 178)">
        <rect x="10" y="172" width="28" height="12" rx="4" fill="#3a3f4a" />
        <rect x="4" y="170" width="10" height="16" rx="3" fill="#565d6b" />
        <rect x="5" y="172" width="3" height="12" rx="1.5" fill="#fff3c2" />
      </g>
    </g>
  ),
  teddy: (
    <g>
      <circle cx="30" cy="166" r="6" fill="#8d6340" />
      <circle cx="54" cy="166" r="6" fill="#8d6340" />
      <ellipse cx="42" cy="200" rx="17" ry="18" fill="#a77b52" />
      <circle cx="42" cy="176" r="14" fill="#a77b52" />
      <ellipse cx="42" cy="181" rx="6" ry="4.5" fill="#d8b48a" />
      <circle cx="37" cy="173" r="2" fill="#2a1d17" />
      <circle cx="47" cy="173" r="2" fill="#2a1d17" />
      <circle cx="42" cy="179" r="1.8" fill="#2a1d17" />
    </g>
  ),

  /* ----- extras ----- */
  sweat: (
    <g className="anim-sweat">
      <path d="M152 104 C156 110 158 114 158 117 A6 6 0 0 1 146 117 C146 114 148 110 152 104 Z" fill="#a5d6ff" />
    </g>
  ),
  breath: (
    <g className="anim-breath" fill="#ffffff" fillOpacity=".7">
      <circle cx="124" cy="174" r="4" />
      <circle cx="134" cy="168" r="6" />
      <circle cx="148" cy="162" r="8" />
    </g>
  ),
  flakes: (
    <g fill="#ffffff">
      <circle cx="78" cy="74" r="3.5" />
      <circle cx="114" cy="68" r="3" />
      <circle cx="132" cy="82" r="3.5" />
      <circle cx="94" cy="58" r="2.5" />
    </g>
  ),
  leaf: (
    <g className="anim-leaf">
      <path d="M0 0 Q10 -10 22 0 Q10 10 0 0 Z" fill="#7cbf5a" />
      <path d="M2 0 L20 0" stroke="#4f8a35" strokeWidth="1.5" />
    </g>
  ),
  zzz: (
    <g className="anim-zzz" fill="#ffffff" fontFamily="Anybody, sans-serif" fontWeight="800">
      <text x="150" y="70" fontSize="18">z</text>
      <text x="166" y="48" fontSize="24">z</text>
      <text x="184" y="22" fontSize="30">z</text>
    </g>
  ),
};

// peças desenhadas atrás do corpo; o resto vai na frente
const BACK_ITEMS: ItemId[] = ['lantern', 'flashlight', 'umbrella', 'umbrellaFlipped', 'leaf'];
const FRONT_ITEMS = (Object.keys(ITEMS) as ItemId[]).filter((id) => !BACK_ITEMS.includes(id));

const MOUTHS: Record<Mood, ReactNode> = {
  happy: <path d="M88 168 Q100 182 112 168" className="mouth" />,
  cool: <path d="M90 172 Q103 178 114 166" className="mouth" />,
  cold: <path d="M86 172 l4 -4 l4 4 l4 -4 l4 4 l4 -4 l4 4" className="mouth anim-chatter" />,
  delight: <path d="M86 166 Q100 190 114 166 Z" className="mouth mouth--open" />,
  scared: <path d="M88 178 Q94 170 100 178 Q106 186 112 178" className="mouth" />,
  squint: <path d="M91 172 L109 172" className="mouth" />,
  sleepy: <circle cx="100" cy="174" r="4.5" className="mouth mouth--open" />,
  tired: <path d="M92 174 Q100 170 108 174" className="mouth" />,
  cozy: <path d="M90 170 Q100 178 110 170" className="mouth" />,
};

export function Bolota({ x, y, moving, look, reduced, flip }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [blink, setBlink] = useState(false);
  const [boing, setBoing] = useState(false);
  const [flinch, setFlinch] = useState(false);
  const [bubble, setBubble] = useState(false);

  // olhos seguem o cursor (escreve direto no DOM para não re-renderizar a cada movimento)
  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const svg = svgRef.current;
        if (!svg) return;
        const r = svg.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width * 0.5);
        const dy = e.clientY - (r.top + r.height * (188 / 290));
        const dist = Math.hypot(dx, dy) || 1;
        const k = Math.min(5.5, dist / 40) / dist;
        svg.style.setProperty('--ex', `${(dx * k).toFixed(2)}px`);
        svg.style.setProperty('--ey', `${(dy * k).toFixed(2)}px`);
      });
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // piscar em intervalos irregulares
  useEffect(() => {
    if (reduced) return;
    let id = 0;
    const schedule = () => {
      id = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        schedule();
      }, 2200 + Math.random() * 3200);
    };
    schedule();
    return () => clearTimeout(id);
  }, [reduced]);

  // susto com os raios
  useEffect(() => {
    const onBolt = () => {
      setFlinch(true);
      window.setTimeout(() => setFlinch(false), 600);
    };
    window.addEventListener('lightning', onBolt);
    return () => window.removeEventListener('lightning', onBolt);
  }, []);

  // a dica some sozinha depois de alguns segundos
  useEffect(() => {
    if (!bubble) return;
    const id = setTimeout(() => setBubble(false), 3600);
    return () => clearTimeout(id);
  }, [bubble, look.tip]);

  const onClick = () => {
    setBubble(true);
    if (reduced) return;
    setBoing(false);
    requestAnimationFrame(() => setBoing(true));
  };

  // poses dos braços vêm do que está em cada mão
  const classes = [
    'bolota',
    `mood-${look.mood}`,
    look.fx && `fx-${look.fx}`,
    look.right && `r-${look.right}`,
    look.left && `l-${look.left}`,
    look.mittens && 'has-mittens',
    look.head === 'bowler' && !look.left && 'hold-hat',
    !look.right && look.mood === 'happy' && 'wave',
    blink && 'is-blink',
    boing && 'is-boing',
    flinch && 'is-flinch',
    moving && 'is-moving',
    flip && 'is-flip',
  ]
    .filter(Boolean)
    .join(' ');

  const renderItem = (id: ItemId) => {
    const order = look.items.indexOf(id);
    return (
      <g key={id} className={`item ${order >= 0 ? 'is-on' : ''}`} style={{ '--i': Math.max(0, order) } as CSSProperties} filter="url(#felt)">
        {ITEMS[id]}
      </g>
    );
  };

  return (
    <div className={classes} style={{ transform: `translate(${x}px, ${y}px)` }}>
      <button type="button" className="bolota__btn" onClick={onClick} aria-label={`Bolota, o mascote. ${look.tip}`}>
        <svg ref={svgRef} viewBox="-20 -50 240 290" className="bolota__svg" aria-hidden="true">
          <defs>
            {/* textura de feltro: ruído desloca a borda (fiapos) e cria relevo com luz difusa */}
            <filter id="felt" x="-15%" y="-15%" width="130%" height="130%">
              <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="3" seed="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="fuzzy" />
              <feDiffuseLighting in="noise" surfaceScale="1.6" lightingColor="#ffffff" result="light">
                <feDistantLight azimuth="235" elevation="58" />
              </feDiffuseLighting>
              <feComposite in="fuzzy" in2="light" operator="arithmetic" k1="0.75" k2="0.4" k3="0" k4="0" />
            </filter>
            <radialGradient id="body-fill" cx="38%" cy="32%" r="75%">
              <stop offset="0" stopColor="#ffb487" />
              <stop offset=".55" stopColor="#f2885b" />
              <stop offset="1" stopColor="#c95d34" />
            </radialGradient>
            <radialGradient id="lantern-glow">
              <stop offset="0" stopColor="#ffd98a" stopOpacity=".75" />
              <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="beam" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff3c2" stopOpacity=".75" />
              <stop offset="1" stopColor="#fff3c2" stopOpacity="0" />
            </linearGradient>
            <clipPath id="body-clip">
              <circle cx="100" cy="150" r="62" />
            </clipPath>
          </defs>

          <ellipse className="bolota__shadow" cx="100" cy="222" rx="54" ry="7" />

          <g className="bolota__wobble">
            {BACK_ITEMS.map(renderItem)}

            <g className="bolota__body">
              <g filter="url(#felt)">
                <ellipse cx="78" cy="213" rx="17" ry="9" fill="#b9532e" />
                <ellipse cx="122" cy="213" rx="17" ry="9" fill="#b9532e" />
                <g className="arm arm-l">
                  <ellipse cx="42" cy="168" rx="11" ry="17" className="arm__shape" />
                </g>
                <g className="arm arm-r">
                  <ellipse cx="158" cy="168" rx="11" ry="17" className="arm__shape" />
                </g>
                <circle cx="100" cy="150" r="62" fill="url(#body-fill)" />
              </g>

              {/* rosto: sem filtro, olhos brilhantes como botões */}
              <g className="face">
                <g className="brows">
                  <path d="M66 122 L90 114" />
                  <path d="M134 122 L110 114" />
                </g>
                <g className="eyes">
                  {[80, 120].map((cx) => (
                    <g key={cx} className="eye">
                      <ellipse cx={cx} cy="138" rx="15" ry="17" fill="#ffffff" />
                      <g className="pupil">
                        <circle cx={cx} cy="139" r="8.5" fill="#1d1d24" />
                        <circle cx={cx + 3} cy="135" r="2.6" fill="#ffffff" />
                      </g>
                    </g>
                  ))}
                </g>
                {/* olhos fechados: para baixo (sono) e para cima (aconchego) */}
                <g className="lids lids--sleep">
                  <path d="M66 140 Q80 150 94 140" />
                  <path d="M106 140 Q120 150 134 140" />
                </g>
                <g className="lids lids--cozy">
                  <path d="M66 144 Q80 132 94 144" />
                  <path d="M106 144 Q120 132 134 144" />
                </g>
                <ellipse className="cheek" cx="66" cy="164" rx="8" ry="5" />
                <ellipse className="cheek" cx="134" cy="164" rx="8" ry="5" />
                {MOUTHS[look.mood]}
              </g>

              {FRONT_ITEMS.map(renderItem)}
            </g>
          </g>
        </svg>
      </button>
      <p className={`bubble ${bubble ? 'is-on' : ''}`} role="status">
        {bubble ? look.tip : ''}
      </p>
    </div>
  );
}
