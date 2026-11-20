import type { CSSProperties } from 'react';
import type { Day } from '../api';
import { clamp, mix } from '../lib/color';
import { temp, weekdayShort } from '../lib/format';
import type { Unit } from '../lib/format';
import { describe } from '../lib/weather';
import { WeatherIcon } from './WeatherIcon';

interface Props {
  days: Day[];
  selected: number;
  onSelect: (i: number) => void;
  unit: Unit;
  offset: number;
}

// escala de cor por temperatura: frio azul → ameno amarelo → quente laranja
const tempColor = (c: number) => {
  const k = clamp((c + 5) / 40, 0, 1);
  return k < 0.5 ? mix('#7fb8f0', '#f2d16b', k * 2) : mix('#f2d16b', '#f0835a', (k - 0.5) * 2);
};

export function DailyStrip({ days, selected, onSelect, unit, offset }: Props) {
  const lo = Math.min(...days.map((d) => d.min));
  const hi = Math.max(...days.map((d) => d.max));
  const range = Math.max(1, hi - lo);

  return (
    <section className="days" aria-labelledby="days-title">
      <h2 id="days-title">Próximos 7 dias</h2>
      <ul className="days__list">
        {days.map((d, i) => {
          const c = describe(d.code);
          const bar = {
            left: `${((d.min - lo) / range) * 100}%`,
            width: `${Math.max(6, ((d.max - d.min) / range) * 100)}%`,
            '--from': tempColor(d.min),
            '--to': tempColor(d.max),
          } as CSSProperties;
          return (
            <li key={d.t}>
              <button
                type="button"
                className="day"
                aria-pressed={i === selected}
                onClick={() => onSelect(i)}
                aria-label={`${i === 0 ? 'Hoje' : weekdayShort(d.t, offset)}: ${c.label}, mínima ${temp(d.min, unit)}, máxima ${temp(d.max, unit)} graus`}
              >
                <span className="day__name">{i === 0 ? 'Hoje' : weekdayShort(d.t, offset)}</span>
                <WeatherIcon kind={c.kind} />
                <span className="day__temps">
                  <span className="day__max">{temp(d.max, unit)}°</span>
                  <span className="day__min">{temp(d.min, unit)}°</span>
                </span>
                <span className="day__range" aria-hidden="true">
                  <span style={bar} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
