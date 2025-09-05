// localStorage Polyfill (einfach & ausreichend für Tests)
class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() { return this.store.size; }
  clear() { this.store.clear(); }
  getItem(key: string) { return this.store.has(key) ? this.store.get(key)! : null; }
  key(index: number) { return Array.from(this.store.keys())[index] ?? null; }
  removeItem(key: string) { this.store.delete(key); }
  setItem(key: string, value: string) { this.store.set(key, String(value)); }
}
if (!("localStorage" in globalThis)) {
  // @ts-ignore
  globalThis.localStorage = new MemoryStorage();
}

// navigator.onLine default
Object.defineProperty(navigator, "onLine", { value: true, configurable: true });

// matchMedia Stub
if (!("matchMedia" in window)) {
  // @ts-ignore
  window.matchMedia = (q: string) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener() {}, removeListener() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; }
  });
}

// crypto.randomUUID Stub (falls in Tests verwendet)
if (!("crypto" in globalThis)) {
  // @ts-ignore
  globalThis.crypto = {};
}
if (typeof (globalThis.crypto as any).randomUUID !== "function") {
  (globalThis.crypto as any).randomUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
}
