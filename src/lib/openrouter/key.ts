const CANDIDATES = [
  "disa_api_key",
  "openrouter_key",
  "OPENROUTER_API_KEY",
  "disa:openrouter:key",
] as const;

function safeGet(key: string): string | null {
  try {
    // Priority: sessionStorage (session-only, more secure)
    const sessionVal = sessionStorage.getItem(key);
    if (sessionVal) {
      const trimmed = sessionVal.replace(/^"+|"+$/g, "").trim();
      return trimmed.length ? trimmed : null;
    }

    // Fallback: localStorage (migrate to session)
    const localVal = localStorage.getItem(key);
    if (localVal) {
      const trimmed = localVal.replace(/^"+|"+$/g, "").trim();
      if (trimmed.length) {
        // Migrate to sessionStorage and remove from localStorage
        try {
          sessionStorage.setItem(key, trimmed);
          localStorage.removeItem(key);
        } catch {
          /* Migration failed, keep in localStorage */
        }
        return trimmed;
      }
    }

    return null;
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
      if (val) {
        // Store in sessionStorage (session-only, more secure)
        sessionStorage.setItem(k, val);
        // Always clear from localStorage (migration)
        localStorage.removeItem(k);
      } else {
        // Clear from both storages
        sessionStorage.removeItem(k);
        localStorage.removeItem(k);
      }
    } catch {
      /* Safe: continue with next candidate */
    }
  }
}

export function clearAllApiKeys(): void {
  // Clear all API key candidates from both storages
  for (const k of CANDIDATES) {
    try {
      sessionStorage.removeItem(k);
      localStorage.removeItem(k);
    } catch {
      /* Safe: continue with next candidate */
    }
  }
}

export function hasApiKey(): boolean {
  return Boolean(readApiKey());
}
