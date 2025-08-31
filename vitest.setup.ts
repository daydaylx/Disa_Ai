// Polyfill crypto.randomUUID falls im Testumfeld nicht vorhanden
if (typeof globalThis.crypto === "undefined") {
  // @ts-ignore
  globalThis.crypto = {};
}
// @ts-ignore
if (typeof globalThis.crypto.randomUUID !== "function") {
  // @ts-ignore
  globalThis.crypto.randomUUID = function randomUUID() {
    // nicht kryptografisch – reicht für Tests
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  };
}
