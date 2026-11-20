// Códigos WMO usados pela Open-Meteo → texto em português + tipo de cena.

export type Kind = 'clear' | 'partly' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';

export interface Condition {
  label: string;
  kind: Kind;
  intensity: number; // 0–1, controla a quantidade de partículas
}

const TABLE: Record<number, Condition> = {
  0: { label: 'Céu limpo', kind: 'clear', intensity: 0 },
  1: { label: 'Quase sem nuvens', kind: 'partly', intensity: 0 },
  2: { label: 'Parcialmente nublado', kind: 'partly', intensity: 0 },
  3: { label: 'Nublado', kind: 'cloudy', intensity: 0 },
  45: { label: 'Neblina', kind: 'fog', intensity: 0 },
  48: { label: 'Neblina com geada', kind: 'fog', intensity: 0 },
  51: { label: 'Garoa fraca', kind: 'drizzle', intensity: 0.3 },
  53: { label: 'Garoa', kind: 'drizzle', intensity: 0.55 },
  55: { label: 'Garoa forte', kind: 'drizzle', intensity: 0.8 },
  56: { label: 'Garoa congelante', kind: 'drizzle', intensity: 0.5 },
  57: { label: 'Garoa congelante forte', kind: 'drizzle', intensity: 0.8 },
  61: { label: 'Chuva fraca', kind: 'rain', intensity: 0.4 },
  63: { label: 'Chuva', kind: 'rain', intensity: 0.7 },
  65: { label: 'Chuva forte', kind: 'rain', intensity: 1 },
  66: { label: 'Chuva congelante', kind: 'rain', intensity: 0.5 },
  67: { label: 'Chuva congelante forte', kind: 'rain', intensity: 0.9 },
  71: { label: 'Neve fraca', kind: 'snow', intensity: 0.35 },
  73: { label: 'Neve', kind: 'snow', intensity: 0.65 },
  75: { label: 'Neve forte', kind: 'snow', intensity: 1 },
  77: { label: 'Grãos de neve', kind: 'snow', intensity: 0.3 },
  80: { label: 'Pancadas de chuva fracas', kind: 'rain', intensity: 0.5 },
  81: { label: 'Pancadas de chuva', kind: 'rain', intensity: 0.8 },
  82: { label: 'Pancadas de chuva fortes', kind: 'rain', intensity: 1 },
  85: { label: 'Pancadas de neve', kind: 'snow', intensity: 0.5 },
  86: { label: 'Pancadas de neve fortes', kind: 'snow', intensity: 0.9 },
  95: { label: 'Trovoada', kind: 'storm', intensity: 0.85 },
  96: { label: 'Trovoada com granizo', kind: 'storm', intensity: 1 },
  99: { label: 'Trovoada com granizo forte', kind: 'storm', intensity: 1 },
};

export function describe(code: number): Condition {
  return TABLE[code] ?? { label: 'Tempo indefinido', kind: 'cloudy', intensity: 0 };
}

// Quanto do céu fica coberto em cada tipo de tempo.
export const COVER: Record<Kind, number> = {
  clear: 0,
  partly: 0.35,
  cloudy: 0.85,
  fog: 0.5,
  drizzle: 0.8,
  rain: 0.9,
  snow: 0.8,
  storm: 1,
};
