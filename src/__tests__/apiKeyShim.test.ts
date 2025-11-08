import { beforeEach, describe, expect, it } from "vitest";

import { readApiKey, writeApiKey } from "../lib/openrouter/key";

function clearAll() {
  // Clear canonical key
  sessionStorage.removeItem("openrouter-key");
  localStorage.removeItem("openrouter-key");

  // Clear legacy keys
  sessionStorage.removeItem("disa_api_key");
  sessionStorage.removeItem("openrouter_key");
  sessionStorage.removeItem("OPENROUTER_API_KEY");
  sessionStorage.removeItem("disa:openrouter:key");
  localStorage.removeItem("disa_api_key");
  localStorage.removeItem("openrouter_key");
  localStorage.removeItem("OPENROUTER_API_KEY");
  localStorage.removeItem("disa:openrouter:key");
}

describe("API Key Shim", () => {
  beforeEach(clearAll);

  it("liefert null wenn kein Schlüssel vorhanden ist", () => {
    expect(readApiKey()).toBeNull();
  });

  it("liest kanonischen Schlüssel zuerst", () => {
    sessionStorage.setItem("openrouter-key", "sk-canonical");
    sessionStorage.setItem("disa_api_key", '"sk-legacy"');
    expect(readApiKey()).toBe("sk-canonical");
  });

  it("migriert Legacy-Schlüssel automatisch", () => {
    sessionStorage.setItem("disa_api_key", '"sk-legacy"');
    const key = readApiKey();
    expect(key).toBe("sk-legacy");

    // Nach dem Lesen sollte der Schlüssel migriert sein
    expect(sessionStorage.getItem("openrouter-key")).toBe("sk-legacy");
    expect(sessionStorage.getItem("disa_api_key")).toBeNull();
  });

  it("schreibt nur in kanonischen Schlüssel und räumt Legacy-Schlüssel auf", () => {
    writeApiKey("sk-test");

    // Nur der kanonische Schlüssel sollte gesetzt sein
    expect(sessionStorage.getItem("openrouter-key")).toBe("sk-test");

    // Legacy-Schlüssel sollten leer/gelöscht sein
    expect(sessionStorage.getItem("disa_api_key")).toBeNull();
    expect(sessionStorage.getItem("openrouter_key")).toBeNull();
    expect(sessionStorage.getItem("OPENROUTER_API_KEY")).toBeNull();
    expect(sessionStorage.getItem("disa:openrouter:key")).toBeNull();
  });

  it("löscht alle Varianten bei leerem Wert", () => {
    writeApiKey("sk-test");
    writeApiKey("");
    expect(readApiKey()).toBeNull();
  });
});
