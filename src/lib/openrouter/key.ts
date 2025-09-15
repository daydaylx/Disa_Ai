import {
  clearKey as clearSessionKey,
  getKey as getSessionKey,
  setKey as setSessionKey,
} from "../keyStore";

/**
 * Lies den API-Key aus dem SessionStorage.
 * Keine LocalStorage-Fallbacks, keine .env-Inline-Werte im Client.
 */
export function readApiKey(): string | null {
  return getSessionKey();
}

/**
 * Schreibe den API-Key in den SessionStorage.
 * Trim und Leerprüfung sind in keyStore bereits enthalten.
 */
export function writeApiKey(k: string): void {
  setSessionKey(k);
}

/** Löscht den API-Key vollständig aus dem SessionStorage. */
export function clearAllApiKeys(): void {
  clearSessionKey();
}

/** Bequemer Check, ob aktuell ein Key vorhanden ist. */
export function hasApiKey(): boolean {
  return Boolean(readApiKey());
}
