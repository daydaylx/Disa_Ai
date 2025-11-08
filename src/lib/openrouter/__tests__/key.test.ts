import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { readApiKey, writeApiKey } from "../key";

describe("API Key Migration", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("sollte einen Legacy-Schlüssel zum kanonischen Schlüssel migrieren", () => {
    const testKey = "sk-test-key-from-localstorage";
    localStorage.setItem("disa_api_key", testKey);

    // readApiKey sollte die Migration auslösen
    const key = readApiKey();

    expect(key).toBe(testKey);
    // Migriert zum kanonischen Schlüssel
    expect(sessionStorage.getItem("openrouter-key")).toBe(testKey);
    // Legacy-Schlüssel werden gelöscht
    expect(sessionStorage.getItem("disa_api_key")).toBeNull();
    expect(localStorage.getItem("disa_api_key")).toBeNull();
  });

  it("sollte kanonischen Schlüssel bevorzugen und Legacy-Schlüssel ignorieren", () => {
    const canonicalKey = "sk-canonical-key";
    const legacyKey = "sk-legacy-key";

    sessionStorage.setItem("openrouter-key", canonicalKey);
    sessionStorage.setItem("disa_api_key", legacyKey);
    localStorage.setItem("disa_api_key", "old-key");

    const key = readApiKey();

    expect(key).toBe(canonicalKey);
    // Legacy-Schlüssel bleiben unberührt, wenn kanonischer Schlüssel existiert
    expect(sessionStorage.getItem("disa_api_key")).toBe(legacyKey);
    expect(localStorage.getItem("disa_api_key")).toBe("old-key");
  });

  it("sollte null liefern, wenn kein Schlüssel vorhanden ist", () => {
    const key = readApiKey();
    expect(key).toBeNull();
  });

  it("sollte einen neuen Schlüssel nur in kanonischen Schlüssel schreiben", () => {
    const testKey = "new-key";
    writeApiKey(testKey);

    // Nur kanonischer Schlüssel wird gesetzt
    expect(sessionStorage.getItem("openrouter-key")).toBe(testKey);
    // Legacy-Schlüssel bleiben leer
    expect(sessionStorage.getItem("disa_api_key")).toBeNull();
    expect(localStorage.getItem("disa_api_key")).toBeNull();
  });
});
