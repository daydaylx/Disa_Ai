import { afterEach,beforeEach, describe, expect, it } from "vitest";

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

  it("sollte einen Schlüssel von localStorage nach sessionStorage migrieren", () => {
    const testKey = "sk-test-key-from-localstorage";
    localStorage.setItem("disa_api_key", testKey);

    // readApiKey sollte die Migration auslösen
    const key = readApiKey();

    expect(key).toBe(testKey);
    expect(sessionStorage.getItem("disa_api_key")).toBe(testKey);
    expect(localStorage.getItem("disa_api_key")).toBeNull();
  });

  it("sollte einen Schlüssel direkt aus sessionStorage lesen, wenn vorhanden", () => {
    const testKey = "sk-test-key-from-sessionstorage";
    sessionStorage.setItem("disa_api_key", testKey);
    localStorage.setItem("disa_api_key", "old-key");

    const key = readApiKey();

    expect(key).toBe(testKey);
    expect(localStorage.getItem("disa_api_key")).toBe("old-key"); // Sollte nicht angetastet werden, wenn session-Key da ist
  });

  it("sollte null zurückgeben, wenn kein Schlüssel vorhanden ist", () => {
    const key = readApiKey();
    expect(key).toBeNull();
  });

  it("sollte einen neuen Schlüssel in sessionStorage schreiben", () => {
    const testKey = "new-key";
    writeApiKey(testKey);

    expect(sessionStorage.getItem("disa_api_key")).toBe(testKey);
    expect(localStorage.getItem("disa_api_key")).toBeNull();
  });
});
