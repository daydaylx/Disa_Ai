import {
  clearKey as clearSessionKey,
  getKey as getSessionKey,
  setKey as setSessionKey,
} from "../keyStore";

const KEY_CANDIDATES = [
  "disa_api_key",
  "openrouter_key",
  "OPENROUTER_API_KEY",
  "disa:openrouter:key",
];

/**
 * Lies den API-Key mit Migration und Multi-Key-Support.
 * Migriert automatisch von localStorage nach sessionStorage.
 */
export function readApiKey(): string | null {
  // Zuerst versuchen wir sessionStorage
  let key = getSessionKey();
  if (key) return key;

  // Migration von localStorage falls notwendig
  try {
    const legacyKey = localStorage.getItem("disa_api_key");
    if (legacyKey) {
      const trimmed = legacyKey.trim().replace(/^"+|"+$/g, "");
      if (trimmed.length > 0) {
        // Migriere zu sessionStorage
        setSessionKey(trimmed);
        localStorage.removeItem("disa_api_key");
        return trimmed;
      }
    }
  } catch {
    // Storage access error - ignore
  }

  // Fallback: Probiere andere Key-Kandidaten in sessionStorage
  try {
    for (const candidateKey of KEY_CANDIDATES.slice(1)) {
      const candidateValue = sessionStorage.getItem(candidateKey);
      if (candidateValue) {
        const trimmed = candidateValue.trim().replace(/^"+|"+$/g, "");
        if (trimmed.length > 0) {
          return trimmed;
        }
      }
    }
  } catch {
    // Storage access error - ignore
  }

  return null;
}

/**
 * Schreibe den API-Key in alle unterstützten Varianten für Abwärtskompatibilität.
 */
export function writeApiKey(k: string): void {
  const trimmed = k.trim();

  if (!trimmed) {
    // Leerer Key = löschen
    clearAllApiKeys();
    return;
  }

  try {
    // Hauptschlüssel in sessionStorage
    setSessionKey(trimmed);

    // Für Abwärtskompatibilität auch in anderen Varianten setzen
    for (const candidateKey of KEY_CANDIDATES.slice(1)) {
      sessionStorage.setItem(candidateKey, trimmed);
    }
  } catch {
    // Storage access error - ignore
  }
}

/** Löscht den API-Key vollständig aus allen Speicherorten. */
export function clearAllApiKeys(): void {
  clearSessionKey();

  try {
    // Lösche aus sessionStorage
    for (const candidateKey of KEY_CANDIDATES) {
      sessionStorage.removeItem(candidateKey);
    }

    // Lösche auch aus localStorage
    for (const candidateKey of KEY_CANDIDATES) {
      localStorage.removeItem(candidateKey);
    }
  } catch {
    // Storage access error - ignore
  }
}

/** Bequemer Check, ob aktuell ein Key vorhanden ist. */
export function hasApiKey(): boolean {
  return Boolean(readApiKey());
}
