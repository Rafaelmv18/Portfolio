import { useEffect, useRef, useState } from 'react';
import { fetchForecast } from '../api';
import type { DataSource, Forecast, Place } from '../api';

const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

/** Respeita a preferência do sistema por menos animação. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia(REDUCE_QUERY).matches);
  useEffect(() => {
    const m = window.matchMedia(REDUCE_QUERY);
    const onChange = () => setReduced(m.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export function useDebounced<T>(value: T, ms: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

export function useElementSize<T extends Element>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

const easeOutCubic = (k: number) => 1 - Math.pow(1 - k, 3);

/**
 * Interpola uma lista de números até o novo alvo.
 * `target` precisa ter identidade estável (useMemo), senão a animação reinicia a cada render.
 */
export function useTweenedArray(target: number[], duration: number, reduced: boolean) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (reduced || from.length !== target.length) {
      current.current = target;
      setValue(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = easeOutCubic(Math.min(1, (now - t0) / duration));
      const next = target.map((v, i) => from[i] + (v - from[i]) * k);
      current.current = next;
      setValue(next);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  return value;
}

/** Número que "conta" até o novo valor. */
export function useTweenedNumber(target: number, duration: number, reduced: boolean) {
  const [value, setValue] = useState(target);
  const current = useRef(target);

  useEffect(() => {
    const from = current.current;
    if (reduced || from === target) {
      current.current = target;
      setValue(target);
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const k = easeOutCubic(Math.min(1, (now - t0) / duration));
      const next = from + (target - from) * k;
      current.current = next;
      setValue(next);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);

  return value;
}

/**
 * Parallax: grava --mx e --my (-1 a 1) no elemento, com suavização.
 * Cada camada usa esses valores multiplicados pela própria profundidade (--depth).
 */
export function useParallax<T extends HTMLElement>(reduced: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) {
      el?.style.setProperty('--mx', '0');
      el?.style.setProperty('--my', '0');
      return;
    }
    const target = { x: 0, y: 0 };
    const pos = { x: 0, y: 0 };
    let raf = 0;
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.08;
      pos.y += (target.y - pos.y) * 0.08;
      el.style.setProperty('--mx', pos.x.toFixed(4));
      el.style.setProperty('--my', pos.y.toFixed(4));
      raf = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);
  return ref;
}

type ForecastState ={ status: 'loading' | 'ready' | 'error'; data: Forecast | null };

/** Busca a previsão; mantém os dados anteriores na tela enquanto a nova cidade carrega. */
export function useForecast(place: Place, source: DataSource) {
  const [state, setState] = useState<ForecastState>({ status: 'loading', data: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const ac = new AbortController();
    setState((s) => ({ status: 'loading', data: s.data }));
    fetchForecast(source, place.latitude, place.longitude, ac.signal)
      .then((data) => setState({ status: 'ready', data }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setState((s) => ({ status: 'error', data: s.data }));
      });
    return () => ac.abort();
  }, [place.latitude, place.longitude, source, attempt]);

  return { ...state, retry: () => setAttempt((a) => a + 1) };
}
