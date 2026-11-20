import { useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { searchPlaces } from '../api';
import type { Place } from '../api';
import { useDebounced } from '../hooks';

interface Props {
  onSelect: (place: Place) => void;
  onLocate: () => void;
  locating: boolean;
}

type Status = 'idle' | 'loading' | 'empty' | 'error';

/** Combobox acessível (padrão ARIA 1.2): setas navegam, Enter escolhe, Esc fecha. */
export function SearchBox({ onSelect, onLocate, locating }: Props) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const debounced = useDebounced(query.trim(), 300);

  useEffect(() => {
    if (debounced.length < 2) {
      setResults([]);
      setStatus('idle');
      return;
    }
    const ac = new AbortController();
    setStatus('loading');
    searchPlaces(debounced, ac.signal)
      .then((r) => {
        setResults(r);
        setStatus(r.length ? 'idle' : 'empty');
        setActive(r.length ? 0 : -1);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setStatus('error');
      });
    return () => ac.abort();
  }, [debounced]);

  const choose = (place: Place) => {
    onSelect(place);
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' && results.length) {
      e.preventDefault();
      setOpen(true);
      setActive((a) => (a + 1) % results.length);
    } else if (e.key === 'ArrowUp' && results.length) {
      e.preventDefault();
      setActive((a) => (a - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && active >= 0 && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const showList = open && debounced.length >= 2;
  const listId = `${id}-list`;

  return (
    <div className="search">
      <label htmlFor={`${id}-input`} className="visually-hidden">
        Buscar cidade
      </label>
      <div className="search__row">
        <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 L21 21" />
        </svg>
        <input
          ref={inputRef}
          id={`${id}-input`}
          className="search__input"
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          placeholder="Buscar cidade"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && active >= 0 ? `${id}-opt-${active}` : undefined}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
        />
        <button type="button" className="icon-btn" onClick={onLocate} disabled={locating} aria-label="Usar minha localização">
          <svg viewBox="0 0 24 24" aria-hidden="true" className={locating ? 'is-spinning' : undefined}>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2 v4 M12 18 v4 M2 12 h4 M18 12 h4" />
          </svg>
        </button>
      </div>

      <ul id={listId} role="listbox" className="search__list" hidden={!showList} aria-label="Cidades encontradas">
        {status === 'loading' && <li className="search__msg" role="presentation">Buscando…</li>}
        {status === 'empty' && <li className="search__msg" role="presentation">Nenhuma cidade encontrada para “{debounced}”.</li>}
        {status === 'error' && <li className="search__msg" role="presentation">A busca falhou. Verifique a conexão e tente de novo.</li>}
        {status === 'idle' &&
          results.map((p, i) => (
            <li
              key={`${p.latitude},${p.longitude}`}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              className="search__opt"
              onMouseDown={(e) => e.preventDefault()} // mantém o foco no campo até o clique terminar
              onClick={() => choose(p)}
              onMouseEnter={() => setActive(i)}
            >
              <span className="search__name">{p.name}</span>
              <span className="search__where">{[p.region, p.country].filter(Boolean).join(', ')}</span>
            </li>
          ))}
      </ul>
    </div>
  );
}
