import type { Day } from '../api/openMeteo';
import { clamp, mix } from './color';
import type { Kind } from './weather';

export interface Phase {
  /** "Altura" do sol: 1 = meio-dia, 0 = horizonte, -1 = meia-noite. */
  e: number;
  /** Progresso no arco atual (dia ou noite), 0–1. */
  p: number;
  isDay: boolean;
}

/** Posição do sol calculada a partir do nascer e do pôr do sol reais da cidade. */
export function sunPhase(t: number, days: Day[]): Phase {
  const day = days.find((d) => t >= d.t && t < d.t + 86400) ?? days[0];
  if (!day) return { e: 0.5, p: 0.5, isDay: true };
  const dayLen = clamp(day.sunset - day.sunrise, 1, 86399); // evita divisão por zero perto dos polos
  const nightLen = 86400 - dayLen;
  const since = (((t - day.sunrise) % 86400) + 86400) % 86400;
  if (since < dayLen) {
    const p = since / dayLen;
    return { e: Math.sin(Math.PI * p), p, isDay: true };
  }
  const p = (since - dayLen) / nightLen;
  return { e: -Math.sin(Math.PI * p), p, isDay: false };
}

// Paletas do céu por altura do sol: [e, topo, base]
const STOPS: [number, string, string][] = [
  [-1, '#0a1530', '#1a2a4c'],
  [-0.25, '#141f45', '#2f3a66'],
  [-0.08, '#27306a', '#7a5a86'],
  [0, '#3d5b96', '#f09a63'],
  [0.12, '#4f86c6', '#f5c48c'],
  [0.35, '#3c80cc', '#9fcdee'],
  [1, '#2c73c6', '#93c6ee'],
];

const OVERCAST: Record<Kind, number> = {
  clear: 0,
  partly: 0.12,
  cloudy: 0.45,
  fog: 0.55,
  drizzle: 0.5,
  rain: 0.6,
  snow: 0.4,
  storm: 0.72,
};

export interface SkyColors {
  top: string;
  bottom: string;
  ground: string;
  groundBack: string;
  mountainFar: string;
  mountainNear: string;
  cloud: string;
}

export function skyColors(e: number, kind: Kind): SkyColors {
  let i = 0;
  while (i < STOPS.length - 2 && e > STOPS[i + 1][0]) i++;
  const [e0, t0, b0] = STOPS[i];
  const [e1, t1, b1] = STOPS[i + 1];
  const k = clamp((e - e0) / (e1 - e0), 0, 1);
  let top = mix(t0, t1, k);
  let bottom = mix(b0, b1, k);

  // tempo fechado: o céu perde cor e escurece
  const grey = e > 0 ? (kind === 'fog' ? '#8e99a6' : '#6f7b88') : '#232a38';
  const o = OVERCAST[kind];
  top = mix(top, grey, o);
  bottom = mix(bottom, grey, o * 0.85);

  const night = clamp(-e * 2.5, 0, 1);
  const storminess = kind === 'storm' ? 0.7 : kind === 'rain' ? 0.5 : kind === 'drizzle' ? 0.35 : kind === 'cloudy' ? 0.25 : 0.05;
  const cloud = mix(mix('#ffffff', '#5b6471', storminess), '#39445c', night * 0.8);

  // perspectiva atmosférica: quanto mais longe, mais parecido com o céu
  return {
    top,
    bottom,
    ground: mix(bottom, '#0b1322', 0.66),
    groundBack: mix(bottom, '#0b1322', 0.48),
    mountainNear: mix(mix(top, bottom, 0.5), '#0b1322', 0.32),
    mountainFar: mix(mix(top, bottom, 0.6), '#0b1322', 0.14),
    cloud,
  };
}
