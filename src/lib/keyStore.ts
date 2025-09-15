const KEY_NAME = "disa_api_key";

export function getKey(): string | null {
  try {
    const raw = sessionStorage.getItem(KEY_NAME);
    if (!raw) return null;
    const k = raw.trim().replace(/^"+|"+$/g, "");
    return k.length ? k : null;
  } catch {
    // storage unavailable (Safari ITP, private mode, etc.)
    return null;
  }
}

export function setKey(k: string): void {
  if (typeof k !== "string") return;
  try {
    sessionStorage.setItem(KEY_NAME, k.trim());
  } catch {
    // storage unavailable
    return;
  }
}

export function clearKey(): void {
  try {
    sessionStorage.removeItem(KEY_NAME);
  } catch {
    // storage unavailable
    return;
  }
}

/**
 * Entfernt einen ggf. vorhandenen Legacy-Key aus dem LocalStorage.
 * Es findet keine automatische Migration in den SessionStorage statt,
 * damit der Nutzer den Key bewusst neu setzt.
 */
export function migrateLegacyKeyFromLocalStorage(): void {
  try {
    const legacy = localStorage.getItem(KEY_NAME);
    if (legacy) {
      localStorage.removeItem(KEY_NAME);
    }
  } catch {
    // storage unavailable
    return;
  }
}
