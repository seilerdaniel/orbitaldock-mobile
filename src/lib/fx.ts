import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Live USD -> ARS exchange rate with graceful degradation:
 * dolarapi.com (blue) -> dolarapi.com (oficial) -> last cached quote ->
 * null (UI renders a "no data" state).
 */

export interface FxQuote {
  /** ARS per 1 USD. */
  rate: number;
  source: string;
  fetchedAt: string;
  /** True when served from cache because live sources were unreachable. */
  stale: boolean;
}

const CACHE_KEY = 'orbitaldock.fx.v1';
const REQUEST_TIMEOUT_MS = 6000;

interface DolarApiEntry {
  venta?: unknown;
  compra?: unknown;
  nombre?: unknown;
  fechaActualizacion?: unknown;
}

async function fetchQuote(kind: 'blue' | 'oficial', label: string): Promise<FxQuote | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`https://dolarapi.com/v1/dolares/${kind}`, {
      signal: controller.signal,
    });
    if (!response.ok) return null;

    const entry = (await response.json()) as DolarApiEntry;
    const rate = typeof entry.venta === 'number' ? entry.venta : Number(entry.venta);

    if (!Number.isFinite(rate) || rate <= 0) return null;

    const fetchedAt =
      typeof entry.fechaActualizacion === 'string' ? entry.fechaActualizacion : new Date().toISOString();

    return { rate, source: `Dólar ${label} · dolarapi.com`, fetchedAt, stale: false };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function getCachedQuote(): Promise<FxQuote | null> {
  try {
    const raw = await AsyncStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as FxQuote | null;
    if (!parsed || typeof parsed.rate !== 'number') return null;

    return { ...parsed, stale: true };
  } catch {
    return null;
  }
}

async function cacheQuote(quote: FxQuote): Promise<void> {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(quote));
  } catch {
    // Persistence is best-effort; the in-memory value still drives the UI.
  }
}

/** Returns the freshest USD->ARS quote available, or null when nothing works. */
export async function getUsdArsRate(): Promise<FxQuote | null> {
  const blue = await fetchQuote('blue', 'Blue');
  if (blue) {
    await cacheQuote(blue);
    return blue;
  }

  const oficial = await fetchQuote('oficial', 'Oficial');
  if (oficial) {
    await cacheQuote(oficial);
    return oficial;
  }

  return getCachedQuote();
}
