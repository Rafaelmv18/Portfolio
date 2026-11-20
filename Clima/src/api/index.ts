import * as mock from './mock';
import * as real from './openMeteo';
import type { Forecast } from './openMeteo';

export type { Day, Forecast, Hour, Place } from './openMeteo';

/**
 * 'real'      → previsão de verdade da Open-Meteo
 * 'simulated' → semana inventada com todos os tipos de tempo (tempestade, neblina, neve…),
 *               para quem visita o projeto conseguir ver todas as cenas.
 */
export type DataSource = 'real' | 'simulated';

// a busca de cidades é sempre real; só a previsão pode ser simulada
export const searchPlaces = real.searchPlaces;

export function fetchForecast(source: DataSource, latitude: number, longitude: number, signal?: AbortSignal): Promise<Forecast> {
  return source === 'real' ? real.fetchForecast(latitude, longitude, signal) : mock.fetchForecast(latitude, longitude, signal);
}
