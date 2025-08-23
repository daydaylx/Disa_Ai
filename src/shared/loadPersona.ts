export async function loadPersona<T = unknown>(): Promise<T> {
  const url = new URL('persona.json', import.meta.env.BASE_URL).toString();
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`persona.json HTTP ${res.status}: ${res.statusText}`);

  const ct = (res.headers.get('content-type') || '').toLowerCase();
  const text = await res.text();

  // Harte HTML-Detektion
  if (!ct.includes('application/json') || /^<!doctype html>|^<html/i.test(text.trim())) {
    throw new Error(`persona.json wurde nicht als JSON geliefert (ct="${ct}"). Wahrscheinlich SPA-Fallback/Rewrites. Erste 120 Zeichen: ${text.slice(0,120)}`);
  }

  try {
    return JSON.parse(text) as T;
  } catch (e: unknown) {
    throw new Error(`persona.json ist kein valides JSON: ${(e as Error)?.message || e}`);
  }
}
