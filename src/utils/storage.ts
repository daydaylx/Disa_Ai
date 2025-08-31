/* Centralized localStorage utilities for Disa_Ai.
   - Namespaced keys: disa:*
   - Versioned storage for future migrations
   - Safe JSON helpers (no throw)
   - Key enumeration
*/

const NS = "disa";
const STORAGE_VERSION = 1;

function hasWindow(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function nsKey(...parts: string[]): string {
  return [NS, ...parts].join(":");
}

export function getString(key: string): string | null {
  if (!hasWindow()) return null;
  try {
    const v = window.localStorage.getItem(key);
    return v === null ? null : v;
  } catch {
    return null;
  }
}

export function setString(key: string, value: string): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore quota
  }
}

export function del(key: string): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function getJSON<T>(key: string): T | null {
  const raw = getString(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setJSON<T>(key: string, value: T): void {
  setString(key, JSON.stringify(value));
}

export function listKeys(prefix?: string): string[] {
  if (!hasWindow()) return [];
  try {
    const out: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k) continue;
      if (!prefix || k.startsWith(prefix)) out.push(k);
    }
    return out.sort();
  } catch {
    return [];
  }
}

/** Storage versioning metadata */
const META_VERSION_KEY = nsKey("version");

export function getStorageVersion(): number {
  const v = getString(META_VERSION_KEY);
  const n = v ? parseInt(v, 10) : NaN;
  return Number.isFinite(n) ? n : 0;
}

export function setStorageVersion(v: number): void {
  setString(META_VERSION_KEY, String(v));
}

/** Conversation-related key helpers (safe template literals, no escaping bugs) */
export function convMetaKey(id: string): string {
  return nsKey("conv", id, "meta");
}
export function convMsgsKey(id: string): string {
  return nsKey("conv", id, "msgs");
}
export function convIndexKey(): string {
  return nsKey("conv", "index");
}

/** Migration:
 *  - Fixes historical broken keys due to escaped template strings, e.g. the literal:
 *      "disa:conv:${id}:meta" or "disa:conv:${id}:msgs"
 *    Those are useless (no id interpolation). We just delete them if found.
 *  - Ensures an index array exists.
 */
export function migrateStorage(): void {
  const current = getStorageVersion();
  if (current >= STORAGE_VERSION) return;

  // 0 -> 1
  // Remove bogus literal keys if present
  const bogusMeta = "disa:conv:${id}:meta";
  const bogusMsgs = "disa:conv:${id}:msgs";
  const keys = listKeys("disa:");
  if (keys.includes(bogusMeta)) del(bogusMeta);
  if (keys.includes(bogusMsgs)) del(bogusMsgs);

  // Ensure index array is an array of strings
  const idxKey = convIndexKey();
  const idx = getJSON<string[]>(idxKey);
  if (!Array.isArray(idx)) {
    setJSON(idxKey, []);
  }

  setStorageVersion(STORAGE_VERSION);
}
