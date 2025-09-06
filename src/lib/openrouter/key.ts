/* eslint-disable no-empty */
const CANDIDATES = [
  "disa_api_key",
  "openrouter_key",
  "OPENROUTER_API_KEY",
  "disa:openrouter:key",
] as const;

function safeGet(key: string): string | null {
  try {
    const v = localStorage.getItem(key);
    if (!v) return null;
    const trimmed = v.replace(/^"+|"+$/g, "").trim();
    return trimmed.length ? trimmed : null;
  } catch {
    return null;
  }
}

export function readApiKey(): string | null {
  for (const k of CANDIDATES) {
    const v = safeGet(k);
    if (v) return v;
  }
  return null;
}

export function writeApiKey(v: string | null | undefined): void {
  const val = (v ?? "").trim();
  for (const k of CANDIDATES) {
    try {
      if (val) localStorage.setItem(k, val);
      else localStorage.removeItem(k);
    } catch {}
  }
}
