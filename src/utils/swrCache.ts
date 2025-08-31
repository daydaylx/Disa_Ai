/* Simple SWR-like cache on top of localStorage or sessionStorage.
   - Stores: { ts: epoch_ms, data: T }
   - Provides: get (with freshness check), set, clear
*/

export type SwrCacheBackend = "local" | "session";

export type SwrEntry<T> = {
  ts: number;
  data: T;
};

function getStorage(backend: SwrCacheBackend): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return backend === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null;
  }
}

export function swrGet<T>(
  key: string,
  maxAgeMs: number,
  backend: SwrCacheBackend = "local",
): { fresh: boolean; value: T | null } {
  const store = getStorage(backend);
  if (!store) return { fresh: false, value: null };
  try {
    const raw = store.getItem(key);
    if (!raw) return { fresh: false, value: null };
    const parsed = JSON.parse(raw) as SwrEntry<T>;
    if (!parsed || typeof parsed.ts !== "number") return { fresh: false, value: null };
    const age = Date.now() - parsed.ts;
    const fresh = age <= maxAgeMs;
    return { fresh, value: parsed.data ?? null };
  } catch {
    return { fresh: false, value: null };
  }
}

export function swrSet<T>(key: string, data: T, backend: SwrCacheBackend = "local"): void {
  const store = getStorage(backend);
  if (!store) return;
  const entry: SwrEntry<T> = { ts: Date.now(), data };
  try {
    store.setItem(key, JSON.stringify(entry));
  } catch {
    // ignore quota errors
  }
}

export function swrClear(key: string, backend: SwrCacheBackend = "local"): void {
  const store = getStorage(backend);
  if (!store) return;
  try {
    store.removeItem(key);
  } catch {
    // ignore
  }
}
