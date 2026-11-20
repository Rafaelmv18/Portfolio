import { useEffect, useMemo, useState } from 'react';
import type { DataSource, Place } from './api';
import { Bolota } from './character/Bolota';
import { useForecast, useParallax, useReducedMotion } from './hooks';
import { composeLook } from './lib/outfit';
import { hourOf } from './lib/format';
import { skyColors, sunPhase } from './lib/sky';
import type { Unit } from './lib/format';
import { COVER, describe } from './lib/weather';
import type { Condition } from './lib/weather';
import { Horizon } from './scene/Horizon';
import { Celestial, Clouds, Corners, Fog, Layer, Mountains, ScreenFx, Stars } from './scene/Layers';
import { Precipitation } from './scene/Precipitation';
import { DailyStrip } from './ui/DailyStrip';
import { DemoPanel, KIND_LABEL } from './ui/DemoPanel';
import type { DemoState } from './ui/DemoPanel';
import { Readout, ReadoutSkeleton } from './ui/Readout';
import { SearchBox } from './ui/SearchBox';

const DEFAULT_PLACE: Place = { name: 'São Paulo', region: 'São Paulo', country: 'Brasil', latitude: -23.55, longitude: -46.63 };

// localStorage pode falhar (aba anônima, armazenamento bloqueado): o app funciona sem ele
function load<T>(key: string): T | null {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sem armazenamento */
  }
}

export default function App() {
  const reduced = useReducedMotion();
  const stageRef = useParallax<HTMLDivElement>(reduced);

  const [place, setPlace] = useState<Place>(() => load<Place>('horizonte:place') ?? DEFAULT_PLACE);
  const [unit, setUnit] = useState<Unit>(() => load<Unit>('horizonte:unit') ?? 'C');
  const [dayIndex, setDayIndex] = useState(0);
  const [hourIndex, setHourIndex] = useState(0);
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState(''); // anúncio para leitor de tela
  const [alert, setAlert] = useState(''); // aviso visível
  const [demoOpen, setDemoOpen] = useState(false);
  const [demo, setDemo] = useState<DemoState>({ active: false, kind: 'rain', tempC: 18, wind: 12 });
  const [source, setSource] = useState<DataSource>(() => load<DataSource>('horizonte:source') ?? 'real');
  const { data, status, retry } = useForecast(place, source);

  useEffect(() => save('horizonte:place', place), [place]);
  useEffect(() => save('horizonte:unit', unit), [unit]);
  useEffect(() => save('horizonte:source', source), [source]);

  const changeSource = (s: DataSource) => {
    setSource(s);
    setDayIndex(0);
    setHourIndex(0);
  };

  // janela de 24 horas: a partir de agora (hoje) ou da meia-noite do dia escolhido
  const hours = useMemo(() => {
    if (!data) return [];
    if (dayIndex === 0) {
      const start = Math.max(0, data.hours.findIndex((h) => h.t + 3600 > data.now));
      return data.hours.slice(start, start + 24);
    }
    const d = data.days[dayIndex];
    return data.hours.filter((h) => h.t >= d.t && h.t < d.t + 86400);
  }, [data, dayIndex]);

  const hi = Math.min(hourIndex, Math.max(0, hours.length - 1));
  const hour = hours[hi];

  // ---------- estado da cena ----------
  const real: Condition = hour ? describe(hour.code) : { label: '', kind: 'partly', intensity: 0 };
  const condition: Condition = demo.active ? { label: KIND_LABEL[demo.kind], kind: demo.kind, intensity: 0.8 } : real;
  const tempC = demo.active ? demo.tempC : (hour?.temp ?? 20);
  const wind = demo.active ? demo.wind : (hour?.wind ?? 8);
  const phase = data && hour ? sunPhase(hour.t, data.days) : { e: 0.6, p: 0.4, isDay: true };
  const sky = skyColors(phase.e, condition.kind);
  const cover = COVER[condition.kind];
  const localHour = data && hour ? hourOf(hour.t, data.offset) : 12;
  const look = composeLook({ kind: condition.kind, tempC, wind, sun: phase.e, hour: localHour });

  // atalho do painel de teste: pula para uma hora do dia dentro da janela de 24h
  const pickHour = (h: number) => {
    if (!data) return;
    const i = hours.findIndex((x) => hourOf(x.t, data.offset) === h);
    if (i >= 0) setHourIndex(i);
  };

  // as cores ficam em variáveis CSS registradas com @property: o navegador anima a transição
  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty('--sky-top', sky.top);
    root.setProperty('--sky-bottom', sky.bottom);
    root.setProperty('--ground', sky.ground);
    root.setProperty('--ground-back', sky.groundBack);
  }, [sky.top, sky.bottom, sky.ground, sky.groundBack]);

  const selectPlace = (p: Place) => {
    setPlace(p);
    setDayIndex(0);
    setHourIndex(0);
    setNotice(`Mostrando a previsão de ${p.name}.`);
  };

  const selectDay = (i: number) => {
    setDayIndex(i);
    setHourIndex(i === 0 ? 0 : 12);
  };

  const locate = () => {
    if (!('geolocation' in navigator)) {
      setAlert('Este navegador não informa a localização. Busque a cidade pelo nome.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        selectPlace({ name: 'Sua localização', latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      },
      (err) => {
        setLocating(false);
        setAlert(
          err.code === err.PERMISSION_DENIED
            ? 'A permissão de localização foi negada. Busque a cidade pelo nome.'
            : 'Não foi possível descobrir sua localização. Busque a cidade pelo nome.',
        );
      },
      { timeout: 10000 },
    );
  };

  return (
    <>
      <div className="stage" ref={stageRef}>
        <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
          <defs>
            <linearGradient id="cloud-shade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0.45" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.16" />
            </linearGradient>
          </defs>
        </svg>

        {/* camadas, de trás para frente */}
        <Layer depth={3}>
          <Stars opacity={Math.max(0, Math.min(1, -phase.e * 3)) * (1 - cover)} />
        </Layer>
        <Layer depth={5}>
          <Celestial phase={phase} cover={cover} />
        </Layer>
        <Layer depth={8} className={reduced ? 'is-reduced' : ''}>
          <Clouds cover={cover} tone={sky.cloud} wind={wind} />
        </Layer>
        <Layer depth={12}>
          <Mountains far={sky.mountainFar} near={sky.mountainNear} snowy={condition.kind === 'snow' || tempC <= 0} />
        </Layer>
        <Layer depth={14}>
          <Fog on={condition.kind === 'fog'} />
        </Layer>
        <Layer depth={18} className={reduced ? 'is-reduced' : ''}>
          <Clouds cover={cover} tone={sky.cloud} wind={wind} near />
        </Layer>

        <div className="stage__content">
          <header className="topbar">
            <SearchBox onSelect={selectPlace} onLocate={locate} locating={locating} />
            <div className="topbar__right">
              <button type="button" className="pill" aria-expanded={demoOpen} onClick={() => setDemoOpen((o) => !o)}>
                Testar climas
              </button>
              <div className="units" role="group" aria-label="Unidade de temperatura">
                <button type="button" aria-pressed={unit === 'C'} onClick={() => setUnit('C')}>°C</button>
                <button type="button" aria-pressed={unit === 'F'} onClick={() => setUnit('F')}>°F</button>
              </div>
            </div>
          </header>

          {status === 'error' && !data ? (
            <section className="readout readout--error" role="alert">
              <h1 className="readout__place">Não foi possível carregar a previsão.</h1>
              <p>Verifique a conexão e tente de novo.</p>
              <button type="button" className="pill" onClick={retry}>Tentar de novo</button>
            </section>
          ) : data && hour ? (
            <Readout
              place={place}
              t={hour.t}
              offset={data.offset}
              isNow={dayIndex === 0 && hi === 0}
              tempC={tempC}
              feelsC={demo.active ? tempC : hour.feels}
              label={condition.label}
              wind={wind}
              humidity={hour.humidity}
              rain={hour.rain}
              unit={unit}
              reduced={reduced}
              demo={demo.active || source === 'simulated'}
            />
          ) : (
            <ReadoutSkeleton />
          )}

          {status === 'loading' && data && <p className="loading-note">Atualizando…</p>}
          {status === 'error' && data && (
            <p className="loading-note" role="alert">
              A atualização falhou. <button type="button" className="link-btn" onClick={retry}>Tentar de novo</button>
            </p>
          )}
        </div>

        <Layer depth={22} className="layer--horizon">
          <Horizon
            hours={hours}
            index={hi}
            onChange={setHourIndex}
            unit={unit}
            offset={data?.offset ?? 0}
            kind={condition.kind}
            reduced={reduced}
            renderCharacter={({ x, y, moving }) => (
              <Bolota x={x} y={y} moving={moving} look={look} reduced={reduced} flip={x > window.innerWidth - 300} />
            )}
          />
        </Layer>

        <Precipitation kind={condition.kind} intensity={condition.intensity} wind={wind} reduced={reduced} />

        <Layer depth={32}>
          <Corners />
        </Layer>

        <ScreenFx kind={condition.kind} tempC={tempC} reduced={reduced} />

        <DemoPanel
          open={demoOpen}
          state={demo}
          onChange={setDemo}
          onClose={() => setDemoOpen(false)}
          hour={localHour}
          onPickHour={pickHour}
          source={source}
          onSource={changeSource}
        />
      </div>

      <main className="ground">
        <p className="ground__legend">
          As colinas mostram a temperatura das próximas 24 horas; as barras azuis, a chance de chuva. Arraste sobre elas, ou use as setas, para mudar a hora.
        </p>
        {data && <DailyStrip days={data.days} selected={dayIndex} onSelect={selectDay} unit={unit} offset={data.offset} />}
        <footer className="footer">
          <p>
            Dados meteorológicos: <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">
              Open-Meteo.com<span className="visually-hidden"> (abre em nova aba)</span>
            </a> (CC BY 4.0).
            {source === 'simulated' && ' Mostrando uma previsão simulada; troque em “Testar climas”.'}
          </p>
        </footer>
      </main>

      <p className="visually-hidden" role="status">
        {notice}
      </p>
      {alert && (
        <div className="toast" role="alert">
          <p>{alert}</p>
          <button type="button" className="link-btn" onClick={() => setAlert('')}>
            Fechar
          </button>
        </div>
      )}
    </>
  );
}
