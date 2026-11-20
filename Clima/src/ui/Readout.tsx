import type { CSSProperties } from 'react';
import type { Place } from '../api';
import { useTweenedNumber } from '../hooks';
import { clamp } from '../lib/color';
import { hourLabel, longDate, temp, toUnit } from '../lib/format';
import type { Unit } from '../lib/format';

interface Props {
  place: Place;
  t: number;
  offset: number;
  isNow: boolean;
  tempC: number;
  feelsC: number;
  label: string;
  wind: number;
  humidity: number;
  rain: number;
  unit: Unit;
  reduced: boolean;
  demo: boolean;
}

/**
 * A temperatura é desenhada com uma fonte variável: no frio o número fica fino e estreito,
 * no calor fica pesado e largo. O próprio formato do número é um dado.
 */
export function Readout(p: Props) {
  const shown = useTweenedNumber(toUnit(p.tempC, p.unit), 600, p.reduced);
  const k = clamp((p.tempC + 5) / 42, 0, 1);
  const numberStyle = { fontVariationSettings: `"wdth" ${Math.round(62 + 84 * k)}, "wght" ${Math.round(160 + 740 * k)}` } as CSSProperties;

  return (
    <section className="readout" aria-label="Condição do tempo">
      <h1 className="readout__place">
        {p.place.name}
        {p.place.region && p.place.region !== p.place.name ? <span>, {p.place.region}</span> : null}
      </h1>
      <p className="readout__when">
        {p.isNow ? `Agora, ${longDate(p.t, p.offset).toLowerCase()}` : `${longDate(p.t, p.offset)}, ${hourLabel(p.t, p.offset)}`}
        {p.demo && <span className="badge">Simulação</span>}
      </p>
      <p className="readout__temp" style={numberStyle} aria-label={`${temp(p.tempC, p.unit)} graus`}>
        {Math.round(shown)}
        <span className="readout__deg">°{p.unit}</span>
      </p>
      <p className="readout__label">{p.label}</p>
      <dl className="readout__details">
        <div>
          <dt>Sensação</dt>
          <dd>{temp(p.feelsC, p.unit)}°</dd>
        </div>
        <div>
          <dt>Vento</dt>
          <dd>{Math.round(p.wind)} km/h</dd>
        </div>
        <div>
          <dt>Umidade</dt>
          <dd>{Math.round(p.humidity)}%</dd>
        </div>
        <div>
          <dt>Chance de chuva</dt>
          <dd>{Math.round(p.rain)}%</dd>
        </div>
      </dl>
    </section>
  );
}

export function ReadoutSkeleton() {
  return (
    <section className="readout" aria-busy="true" aria-label="Carregando previsão">
      <span className="sk sk--line" style={{ width: '12rem' }} />
      <span className="sk sk--line" style={{ width: '16rem' }} />
      <span className="sk sk--temp" />
      <span className="sk sk--line" style={{ width: '10rem' }} />
    </section>
  );
}
