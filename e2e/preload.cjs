// e2e/preload.cjs
// Kleine Polyfills für Node-Testlauf (Playwright-Runner)

// localStorage
if (typeof globalThis.localStorage === "undefined") {
  class MemoryStorage {
    constructor() {
      this.store = new Map();
    }
    get length() {
      return this.store.size;
    }
    clear() {
      this.store.clear();
    }
    getItem(k) {
      return this.store.has(k) ? this.store.get(k) : null;
    }
    key(i) {
      return Array.from(this.store.keys())[i] ?? null;
    }
    removeItem(k) {
      this.store.delete(k);
    }
    setItem(k, v) {
      this.store.set(k, String(v));
    }
  }
  // eslint-disable-next-line no-global-assign
  globalThis.localStorage = new MemoryStorage();
}

// matchMedia Stub
if (typeof globalThis.window === "undefined") globalThis.window = {};
if (typeof globalThis.window.matchMedia === "undefined") {
  globalThis.window.matchMedia = (q) => ({
    matches: false,
    media: q,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  });
}

// crypto.randomUUID
if (typeof globalThis.crypto === "undefined") globalThis.crypto = {};
if (typeof globalThis.crypto.randomUUID !== "function") {
  globalThis.crypto.randomUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
}
