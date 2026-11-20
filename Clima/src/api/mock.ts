// Dados simulados com o MESMO formato da Open-Meteo.
// Cada cidade tem um "perfil" de clima para que todas as cenas apareçam durante o desenvolvimento.
// Para usar a API real, troque o import em src/api/index.ts.

import type { Day, Forecast, Hour, Place } from './openMeteo';

interface Profile {
  base: number;    // temperatura média
  swing: number;   // variação entre dia e noite
  windBoost: number;
  offset: number;  // fuso em segundos
  sunrise: number; // hora local (decimal)
  sunset: number;
  week: number[][]; // 7 dias × 4 blocos de 6h (madrugada, manhã, tarde, noite) com códigos WMO
}

const WEEKS = {
  tropical: [[2, 1, 80, 3], [3, 63, 95, 61], [0, 0, 1, 0], [45, 2, 2, 1], [1, 2, 81, 3], [3, 61, 61, 53], [0, 1, 2, 0]],
  sunny: [[0, 0, 1, 0], [1, 2, 2, 1], [2, 80, 95, 3], [0, 0, 0, 0], [1, 1, 2, 2], [3, 3, 61, 2], [0, 1, 1, 0]],
  south: [[45, 45, 3, 3], [3, 61, 63, 3], [1, 0, 1, 0], [45, 2, 3, 71], [3, 3, 2, 1], [0, 0, 1, 0], [2, 3, 61, 61]],
  snow: [[71, 73, 73, 3], [3, 75, 73, 71], [1, 0, 2, 3], [85, 86, 73, 71], [2, 1, 0, 0], [3, 71, 71, 3], [45, 45, 3, 2]],
  fog: [[45, 45, 3, 3], [48, 3, 61, 53], [3, 2, 2, 3], [45, 51, 53, 3], [2, 1, 3, 3], [3, 80, 81, 3], [45, 3, 2, 1]],
  storm: [[2, 1, 95, 81], [3, 80, 96, 63], [1, 2, 82, 3], [2, 2, 95, 95], [1, 1, 81, 3], [3, 63, 65, 61], [2, 1, 80, 2]],
};

const CITIES: (Place & { profile: Profile })[] = [
  { name: 'São Paulo', region: 'São Paulo', country: 'Brasil', latitude: -23.55, longitude: -46.63,
    profile: { base: 21, swing: 5, windBoost: 0, offset: -10800, sunrise: 5.4, sunset: 18.7, week: WEEKS.tropical } },
  { name: 'Rio de Janeiro', region: 'Rio de Janeiro', country: 'Brasil', latitude: -22.91, longitude: -43.17,
    profile: { base: 29, swing: 4, windBoost: 0, offset: -10800, sunrise: 5.2, sunset: 18.6, week: WEEKS.sunny } },
  { name: 'Gramado', region: 'Rio Grande do Sul', country: 'Brasil', latitude: -29.38, longitude: -50.88,
    profile: { base: 9, swing: 5, windBoost: 18, offset: -10800, sunrise: 5.6, sunset: 19.4, week: WEEKS.south } },
  { name: 'Manaus', region: 'Amazonas', country: 'Brasil', latitude: -3.12, longitude: -60.02,
    profile: { base: 29, swing: 4, windBoost: 5, offset: -14400, sunrise: 5.8, sunset: 18.2, week: WEEKS.storm } },
  { name: 'Oslo', region: 'Oslo', country: 'Noruega', latitude: 59.91, longitude: 10.75,
    profile: { base: -3, swing: 3, windBoost: 10, offset: 3600, sunrise: 8.5, sunset: 15.3, week: WEEKS.snow } },
  { name: 'Londres', region: 'Inglaterra', country: 'Reino Unido', latitude: 51.51, longitude: -0.13,
    profile: { base: 8, swing: 3, windBoost: 12, offset: 0, sunrise: 7.3, sunset: 16.1, week: WEEKS.fog } },
  { name: 'Lisboa', region: 'Lisboa', country: 'Portugal', latitude: 38.72, longitude: -9.14,
    profile: { base: 16, swing: 4, windBoost: 25, offset: 0, sunrise: 7.4, sunset: 17.3, week: WEEKS.sunny } },
  { name: 'Tóquio', region: 'Tóquio', country: 'Japão', latitude: 35.68, longitude: 139.69,
    profile: { base: 14, swing: 5, windBoost: 8, offset: 32400, sunrise: 6.2, sunset: 16.5, week: WEEKS.tropical } },
];

const DRIFT = [0, -2, 2, 1, -1, -3, 0];
const SEVERITY = [0, 1, 2, 3, 45, 48, 51, 53, 55, 61, 63, 65, 71, 73, 75, 80, 81, 82, 85, 86, 95, 96, 99];

const normalize = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const id = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(id);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

const rainChance = (code: number) =>
  code >= 95 ? 90 : code >= 80 ? 75 : code >= 71 ? 70 : code >= 61 ? 80 : code >= 51 ? 45 : code === 3 ? 15 : 5;

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  await wait(250, signal);
  const q = normalize(query);
  return CITIES.filter((c) => normalize(c.name).includes(q)).map((c) => ({
    name: c.name,
    region: c.region,
    country: c.country,
    latitude: c.latitude,
    longitude: c.longitude,
  }));
}

export async function fetchForecast(latitude: number, longitude: number, signal?: AbortSignal): Promise<Forecast> {
  await wait(500, signal);
  const city = CITIES.reduce((best, c) =>
    Math.hypot(c.latitude - latitude, c.longitude - longitude) < Math.hypot(best.latitude - latitude, best.longitude - longitude) ? c : best,
  );
  const p = city.profile;
  const now = Date.now() / 1000;
  const midnightLocal = Math.floor((now + p.offset) / 86400) * 86400;
  const start = midnightLocal - p.offset;

  const hours: Hour[] = [];
  const days: Day[] = [];

  for (let d = 0; d < 7; d++) {
    const dayStart = start + d * 86400;
    const dayHours: Hour[] = [];
    for (let h = 0; h < 24; h++) {
      const t = dayStart + h * 3600;
      const code = p.week[d][Math.floor(h / 6)];
      const wet = code >= 51;
      const temp = p.base + DRIFT[d] + p.swing * Math.sin(((h - 9) / 24) * Math.PI * 2) - (wet ? 2 : 0) + Math.sin(t / 5000) * 0.6;
      const wind = Math.max(0, 8 + 10 * Math.sin((h / 24) * Math.PI) + (code >= 95 ? 30 : 0) + p.windBoost * (d % 2 ? 1.6 : 0.6));
      const rain = rainChance(code);
      const hour: Hour = {
        t,
        temp,
        feels: temp + (temp > 25 ? 2 : temp < 10 ? -2 : 0) - wind / 25,
        code,
        rain,
        wind,
        humidity: Math.round(Math.min(98, 50 + rain * 0.45)),
      };
      dayHours.push(hour);
      hours.push(hour);
    }
    const codes = p.week[d];
    days.push({
      t: dayStart,
      max: Math.max(...dayHours.map((h) => h.temp)),
      min: Math.min(...dayHours.map((h) => h.temp)),
      code: codes.reduce((a, b) => (SEVERITY.indexOf(b) > SEVERITY.indexOf(a) ? b : a)),
      sunrise: dayStart + p.sunrise * 3600,
      sunset: dayStart + p.sunset * 3600,
      rain: Math.max(...dayHours.map((h) => h.rain)),
    });
  }

  return { offset: p.offset, now, hours, days };
}
