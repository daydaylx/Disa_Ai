/**
 * Robuster Loader für public/persona.json
 * - nutzt import.meta.env.BASE_URL (Subpfad-sicher)
 * - prüft HTTP-Status
 * - prüft Content-Type (muss JSON sein)
 * - deaktiviert Cache
 */
export async function loadPersona<T = unknown>(): Promise<T> {
  const url = new URL('persona.json', import.meta.env.BASE_URL).toString();
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`persona.json HTTP ${res.status}: ${res.statusText}`);
  }
  const ct = (res.headers.get('content-type') || '').toLowerCase();
  if (!ct.includes('application/json')) {
    const head = await res.text();
    throw new Error(`persona.json ist kein JSON (Content-Type: ${ct}). Beginn: ${head.slice(0, 160)}`);
  }
  return (await res.json()) as T;
}
