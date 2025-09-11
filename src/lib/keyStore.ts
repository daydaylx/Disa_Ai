const KEY_NAME = "disa_api_key";

export function getKey(): string | null {
  try {
    const raw = sessionStorage.getItem(KEY_NAME);
    if (!raw) return null;
    const k = raw.trim().replace(/^"+|"+$/g, "");
    return k.length ? k : null;
  } catch (e) {
    // Defensive: in nicht-Window-Kontexten oder Storage-Fehlern
    return null;
  }
}

export function setKey(k: string): void {
  if (typeof k !== "string") return;
  try {
    sessionStorage.setItem(KEY_NAME, k.trim());
  } catch (e) {
    // Ignorieren: private mode / quota
    return;
  }
}

export function clearKey(): void {
  try {
    sessionStorage.removeItem(KEY_NAME);
  } catch (e) {
    return;
  }
}

export function migrateLegacyKeyFromLocalStorage(): void {
  try {
    const legacy = localStorage.getItem(KEY_NAME);
    if (legacy) {
      // Bewusst NICHT automatisch in Session migrieren;
      // Nutzer muss bewusst neu setzen.
      localStorage.removeItem(KEY_NAME);
    }
  } catch (e) {
    return;
  }
}
