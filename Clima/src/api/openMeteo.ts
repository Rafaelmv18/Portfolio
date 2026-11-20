// Cliente da Open-Meteo (gratuita, sem chave de API).
// Todos os horários vêm em segundos Unix (UTC); `offset` converte para a hora local da cidade.

export interface Place {
  name: string;
  region?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export interface Hour {
  t: number;
  temp: number;
  feels: number;
  code: number;
  rain: number; // chance de chuva, 0–100
  wind: number; // km/h
  humidity: number;
}

export interface Day {
  t: number; // meia-noite local
  max: number;
  min: number;
  code: number;
  sunrise: number;
  sunset: number;
  rain: number;
}

export interface Forecast {
  offset: number;
  now: number;
  hours: Hour[];
  days: Day[];
}

interface GeoResult {
  name: string;
  admin1?: string;
  country?: string;
  latitude: number;
  longitude: number;
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const params = new URLSearchParams({ name: query, count: '6', language: 'pt', format: 'json' });
  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, { signal });
  if (!res.ok) throw new Error(`Busca de cidades falhou (${res.status})`);
  const data: { results?: GeoResult[] } = await res.json();
  return (data.results ?? []).map((r) => ({
    name: r.name,
    region: r.admin1,
    country: r.country,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

interface ForecastResponse {
  utc_offset_seconds: number;
  hourly: {
    time: number[];
    temperature_2m: number[];
    apparent_temperature: number[];
    weather_code: number[];
    precipitation_probability: (number | null)[];
    wind_speed_10m: number[];
    relative_humidity_2m: number[];
  };
  daily: {
    time: number[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: number[];
    sunset: number[];
    precipitation_probability_max: (number | null)[];
  };
}

export async function fetchForecast(latitude: number, longitude: number, signal?: AbortSignal): Promise<Forecast> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: 'temperature_2m,apparent_temperature,weather_code,precipitation_probability,wind_speed_10m,relative_humidity_2m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
    timezone: 'auto',
    timeformat: 'unixtime',
    forecast_days: '7',
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!res.ok) throw new Error(`Previsão falhou (${res.status})`);
  const d: ForecastResponse = await res.json();
  const h = d.hourly;
  const dl = d.daily;

  return {
    offset: d.utc_offset_seconds,
    now: Date.now() / 1000,
    hours: h.time.map((t, i) => ({
      t,
      temp: h.temperature_2m[i],
      feels: h.apparent_temperature[i],
      code: h.weather_code[i],
      rain: h.precipitation_probability[i] ?? 0,
      wind: h.wind_speed_10m[i],
      humidity: h.relative_humidity_2m[i],
    })),
    days: dl.time.map((t, i) => ({
      t,
      max: dl.temperature_2m_max[i],
      min: dl.temperature_2m_min[i],
      code: dl.weather_code[i],
      sunrise: dl.sunrise[i],
      sunset: dl.sunset[i],
      rain: dl.precipitation_probability_max[i] ?? 0,
    })),
  };
}
