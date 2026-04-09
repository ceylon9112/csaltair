/** Fair Grounds Race Course area — New Orleans, LA (Central Time). */
export const FAIR_GROUNDS_LAT = 29.9509;
export const FAIR_GROUNDS_LON = -90.0812;

export type CurrentWeatherOk = {
  ok: true;
  temperatureF: number;
  weatherCode: number;
  description: string;
  emoji: string;
  /** ISO observation time from API */
  time: string;
  humidityPercent?: number;
};

export type CurrentWeatherResult = CurrentWeatherOk | { ok: false; error: string };

/** WMO Weather interpretation codes (Open-Meteo). */
export function wmoToDisplay(code: number): { emoji: string; description: string } {
  if (code === 0) return { emoji: '☀️', description: 'Clear' };
  if (code === 1) return { emoji: '🌤️', description: 'Mostly clear' };
  if (code === 2) return { emoji: '⛅', description: 'Partly cloudy' };
  if (code === 3) return { emoji: '☁️', description: 'Overcast' };
  if (code === 45 || code === 48) return { emoji: '🌫️', description: 'Fog' };
  if (code >= 51 && code <= 55) return { emoji: '🌦️', description: 'Drizzle' };
  if (code >= 56 && code <= 57) return { emoji: '🌨️', description: 'Freezing drizzle' };
  if (code >= 61 && code <= 65) return { emoji: '🌧️', description: 'Rain' };
  if (code >= 66 && code <= 67) return { emoji: '🌧️', description: 'Freezing rain' };
  if (code >= 71 && code <= 77) return { emoji: '❄️', description: 'Snow' };
  if (code >= 80 && code <= 82) return { emoji: '🌦️', description: 'Rain showers' };
  if (code === 85 || code === 86) return { emoji: '🌨️', description: 'Snow showers' };
  if (code >= 95 && code <= 99) return { emoji: '⛈️', description: 'Thunderstorm' };
  return { emoji: '🌡️', description: 'Mixed conditions' };
}

export async function fetchFairGroundsCurrentWeather(
  signal?: AbortSignal
): Promise<CurrentWeatherResult> {
  try {
    const params = new URLSearchParams({
      latitude: String(FAIR_GROUNDS_LAT),
      longitude: String(FAIR_GROUNDS_LON),
      current: 'temperature_2m,relative_humidity_2m,weather_code',
      temperature_unit: 'fahrenheit',
      timezone: 'America/Chicago',
    });
    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const res = await fetch(url, { signal });
    if (!res.ok) {
      return { ok: false, error: 'Weather data unavailable' };
    }
    const json = (await res.json()) as {
      current?: {
        time: string;
        temperature_2m: number;
        weather_code: number;
        relative_humidity_2m?: number;
      };
    };
    const c = json.current;
    if (!c || typeof c.temperature_2m !== 'number' || typeof c.weather_code !== 'number') {
      return { ok: false, error: 'No current conditions' };
    }
    const { emoji, description } = wmoToDisplay(c.weather_code);
    return {
      ok: true,
      temperatureF: c.temperature_2m,
      weatherCode: c.weather_code,
      description,
      emoji,
      time: c.time,
      humidityPercent: c.relative_humidity_2m,
    };
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      return { ok: false, error: 'Cancelled' };
    }
    return { ok: false, error: 'Could not load weather' };
  }
}
