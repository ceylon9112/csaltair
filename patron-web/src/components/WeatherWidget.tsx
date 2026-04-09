import { format, parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

import { fetchFairGroundsCurrentWeather, type CurrentWeatherResult } from '@/utils/weather/openMeteo';

const REFRESH_MS = 15 * 60 * 1000;

export function WeatherWidget() {
  const [state, setState] = useState<CurrentWeatherResult | null>(null);

  const runFetch = useCallback((signal: AbortSignal) => {
    fetchFairGroundsCurrentWeather(signal).then(setState);
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    runFetch(ac.signal);
    const id = setInterval(() => {
      const next = new AbortController();
      runFetch(next.signal);
    }, REFRESH_MS);
    return () => {
      ac.abort();
      clearInterval(id);
    };
  }, [runFetch]);

  const onRefresh = useCallback(() => {
    const ac = new AbortController();
    runFetch(ac.signal);
  }, [runFetch]);

  const timeLabel =
    state?.ok === true
      ? (() => {
          try {
            return `Updated ${format(parseISO(state.time), 'h:mm a')}`;
          } catch {
            return null;
          }
        })()
      : null;

  return (
    <div className="card" role="region" aria-label="Fair Grounds weather">
      <div className="subtitle" style={{ marginBottom: 4 }}>
        Fair Grounds weather
      </div>
      <p className="caption" style={{ marginTop: 0 }}>
        New Orleans — today (Open-Meteo)
      </p>

      {state === null ? <p className="muted">Loading weather…</p> : null}

      {state?.ok ? (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 12, gap: 12 }}>
          <span style={{ fontSize: '2.25rem', lineHeight: 1 }} aria-hidden>
            {state.emoji}
          </span>
          <div>
            <div className="title" style={{ fontSize: '1.75rem', margin: 0 }}>
              {Math.round(state.temperatureF)}°F
            </div>
            <p style={{ margin: '4px 0 0' }}>{state.description}</p>
            {state.humidityPercent != null ? (
              <p className="caption" style={{ margin: '4px 0 0' }}>
                Humidity {Math.round(state.humidityPercent)}%
              </p>
            ) : null}
            {timeLabel ? <p className="caption">{timeLabel}</p> : null}
          </div>
        </div>
      ) : state && !state.ok && state.error !== 'Cancelled' ? (
        <p className="muted" style={{ marginTop: 12 }}>
          {state.error}. Tap refresh to try again.
        </p>
      ) : null}

      <button type="button" className="btn secondary" style={{ marginTop: 12 }} onClick={onRefresh}>
        Refresh
      </button>
    </div>
  );
}
