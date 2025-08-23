/**
 * Neutralisiert die Kollision zwischen @playwright/test (Jest-Expect)
 * und @vitest/expect, indem Redefinitionen des Jest-Matcher-Symbols
 * verhindert werden.
 */
const SYM = Symbol.for("$$jest-matchers-object");

// Falls bereits definiert, versuche es konfigurierbar zu machen (best effort)
try {
  const d = Object.getOwnPropertyDescriptor(globalThis, SYM);
  if (!d) {
    Object.defineProperty(globalThis, SYM, { value: {}, configurable: true, writable: true });
  } else if (d && d.configurable === false) {
    // Nicht konfigurierbar: wir lassen es stehen und fangen spätere Redefinitionen ab
  }
} catch { /* noop */ }

// Monkeypatch: Ignoriere Redefinitionen genau dieses Symbols
const _define = Object.defineProperty;
Object.defineProperty = function(target, prop, desc) {
  try {
    if (prop === SYM) {
      const cur = Object.getOwnPropertyDescriptor(target, prop);
      if (cur && cur.configurable === false) {
        // statt Fehler still akzeptieren
        return target;
      }
    }
  } catch { /* noop */ }
  return _define(target, prop, desc);
};
