import type { Kind } from '../lib/weather';

const CLOUD = 'M15 36 H34 a8 8 0 0 0 1 -15.9 a11 11 0 0 0 -21 3 A6.5 6.5 0 0 0 15 36 Z';

/** Ícones pequenos; animam só no hover ou no dia selecionado (movimento com propósito). */
export function WeatherIcon({ kind }: { kind: Kind }) {
  return (
    <svg className={`wi wi--${kind}`} viewBox="0 0 48 48" aria-hidden="true">
      {(kind === 'clear' || kind === 'partly') && (
        <g className={`wi-sun ${kind === 'partly' ? 'wi-sun--small' : ''}`}>
          <circle cx="24" cy="24" r="7.5" />
          <g className="wi-rays">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
              <line key={a} x1="24" y1="9" x2="24" y2="12.5" transform={`rotate(${a} 24 24)`} />
            ))}
          </g>
        </g>
      )}
      {kind !== 'clear' && kind !== 'fog' && <path className="wi-cloud" d={CLOUD} />}
      {kind === 'fog' && (
        <g className="wi-fog">
          <line x1="10" y1="18" x2="38" y2="18" />
          <line x1="6" y1="26" x2="34" y2="26" />
          <line x1="12" y1="34" x2="40" y2="34" />
        </g>
      )}
      {(kind === 'rain' || kind === 'storm') && (
        <g className="wi-drops">
          <line x1="18" y1="40" x2="16" y2="45" />
          <line x1="25" y1="40" x2="23" y2="45" />
          <line x1="32" y1="40" x2="30" y2="45" />
        </g>
      )}
      {kind === 'drizzle' && (
        <g className="wi-drops wi-dots">
          <circle cx="18" cy="42" r="1.4" />
          <circle cx="25" cy="43" r="1.4" />
          <circle cx="32" cy="42" r="1.4" />
        </g>
      )}
      {kind === 'snow' && (
        <g className="wi-drops wi-flakes">
          <circle cx="18" cy="42" r="2" />
          <circle cx="26" cy="44" r="2" />
          <circle cx="33" cy="41" r="2" />
        </g>
      )}
      {kind === 'storm' && <path className="wi-bolt" d="M26 30 L21 38 H26 L23 46" />}
    </svg>
  );
}
