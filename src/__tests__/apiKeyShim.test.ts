import { describe, it, expect, beforeEach } from "vitest";
import { readApiKey, writeApiKey } from "../lib/openrouter/key";

function clearAll() {
  localStorage.removeItem("disa_api_key");
  localStorage.removeItem("openrouter_key");
  localStorage.removeItem("OPENROUTER_API_KEY");
  localStorage.removeItem("disa:openrouter:key");
}

describe("API Key Shim", () => {
  beforeEach(clearAll);

  it("liest null wenn kein Key gesetzt", () => {
    expect(readApiKey()).toBeNull();
  });

  it("liest erste Variante gemäß Priorität", () => {
    localStorage.setItem("OPENROUTER_API_KEY", "sk-two");
    localStorage.setItem("disa_api_key", '"sk-one"');
    expect(readApiKey()).toBe("sk-one");
  });

  it("schreibt in alle Varianten (Abwärtskompatibilität)", () => {
    writeApiKey("sk-test");
    expect(localStorage.getItem("disa_api_key")).toBe("sk-test");
    expect(localStorage.getItem("openrouter_key")).toBe("sk-test");
    expect(localStorage.getItem("OPENROUTER_API_KEY")).toBe("sk-test");
    expect(localStorage.getItem("disa:openrouter:key")).toBe("sk-test");
  });

  it("löscht alle Varianten bei leerem Wert", () => {
    writeApiKey("sk-test");
    writeApiKey("");
    expect(readApiKey()).toBeNull();
  });
});

