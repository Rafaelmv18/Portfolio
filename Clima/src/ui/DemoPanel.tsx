import type { DataSource } from '../api';
import type { Kind } from '../lib/weather';

export interface DemoState {
  active: boolean;
  kind: Kind;
  tempC: number;
  wind: number;
}

const KINDS: { kind: Kind; label: string }[] = [
  { kind: 'clear', label: 'Céu limpo' },
  { kind: 'partly', label: 'Poucas nuvens' },
  { kind: 'cloudy', label: 'Nublado' },
  { kind: 'fog', label: 'Neblina' },
  { kind: 'drizzle', label: 'Garoa' },
  { kind: 'rain', label: 'Chuva' },
  { kind: 'storm', label: 'Tempestade' },
  { kind: 'snow', label: 'Neve' },
];

export const KIND_LABEL = Object.fromEntries(KINDS.map((k) => [k.kind, k.label])) as Record<Kind, string>;

const TIMES: { hour: number; label: string }[] = [
  { hour: 3, label: 'Madrugada' },
  { hour: 6, label: 'Amanhecer' },
  { hour: 14, label: 'Tarde' },
  { hour: 18, label: 'Entardecer' },
  { hour: 22, label: 'Noite' },
];

interface Props {
  open: boolean;
  state: DemoState;
  onChange: (s: DemoState) => void;
  onClose: () => void;
  hour: number;
  onPickHour: (h: number) => void;
  source: DataSource;
  onSource: (s: DataSource) => void;
}

/**
 * Painel para testar qualquer clima sem depender do tempo real.
 * Útil para quem visita o portfólio num dia nublado comum.
 */
export function DemoPanel({ open, state, onChange, onClose, hour, onPickHour, source, onSource }: Props) {
  const set = (patch: Partial<DemoState>) => onChange({ ...state, ...patch, active: true });

  return (
    <aside className={`demo ${open ? 'is-open' : ''}`} aria-label="Testar climas" hidden={!open}>
      <div className="demo__head">
        <h2>Testar climas</h2>
        <button type="button" className="demo__close" onClick={onClose}>
          Fechar
        </button>
      </div>

      <fieldset className="demo__kinds">
        <legend>Previsão</legend>
        <label className="chip">
          <input type="radio" name="demo-source" checked={source === 'real'} onChange={() => onSource('real')} />
          <span>Real</span>
        </label>
        <label className="chip">
          <input type="radio" name="demo-source" checked={source === 'simulated'} onChange={() => onSource('simulated')} />
          <span>Simulada</span>
        </label>
        <p className="demo__hint demo__hint--full">
          {source === 'real'
            ? 'Dados de verdade da Open-Meteo.'
            : 'Uma semana inventada com tempestade, neblina, neve e calor, para ver todas as cenas nas colinas e nos próximos dias.'}
        </p>
      </fieldset>

      <fieldset className="demo__kinds">
        <legend>Condição agora</legend>
        {KINDS.map((k) => (
          <label key={k.kind} className="chip">
            <input type="radio" name="demo-kind" checked={state.active && state.kind === k.kind} onChange={() => set({ kind: k.kind })} />
            <span>{k.label}</span>
          </label>
        ))}
      </fieldset>

      <fieldset className="demo__kinds">
        <legend>Hora do dia</legend>
        {TIMES.map((t) => (
          <label key={t.hour} className="chip">
            <input type="radio" name="demo-time" checked={hour === t.hour} onChange={() => onPickHour(t.hour)} />
            <span>{t.label}</span>
          </label>
        ))}
      </fieldset>

      <label className="demo__range">
        <span>
          Temperatura <output>{state.tempC}°C</output>
        </span>
        <input type="range" min={-10} max={40} value={state.tempC} onChange={(e) => set({ tempC: Number(e.target.value) })} />
      </label>

      <label className="demo__range">
        <span>
          Vento <output>{state.wind} km/h</output>
        </span>
        <input type="range" min={0} max={80} value={state.wind} onChange={(e) => set({ wind: Number(e.target.value) })} />
      </label>

      <p className="demo__hint">Também dá para arrastar nas colinas para escolher qualquer hora.</p>

      <button type="button" className="demo__reset" onClick={() => onChange({ ...state, active: false })} disabled={!state.active}>
        Voltar ao tempo real
      </button>
    </aside>
  );
}
