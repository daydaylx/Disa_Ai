import { beforeEach, describe, expect, it } from "vitest";

import { readApiKey, writeApiKey } from "../lib/openrouter/key";

function clearAll() {
  sessionStorage.removeItem("disa_api_key");
  sessionStorage.removeItem("openrouter_key");
  sessionStorage.removeItem("OPENROUTER_API_KEY");
  sessionStorage.removeItem("disa:openrouter:key");
}

describe("API Key Shim", () => {
  beforeEach(clearAll);

  it("liest null wenn kein Key gesetzt", () => {
    expect(readApiKey()).toBeNull();
  });

  it("liest erste Variante gemäß Priorität", () => {
    sessionStorage.setItem("OPENROUTER_API_KEY", "sk-two");
    sessionStorage.setItem("disa_api_key", '"sk-one"');
    expect(readApiKey()).toBe("sk-one");
  });

  it("schreibt in alle Varianten (Abwärtskompatibilität)", () => {
    writeApiKey("sk-test");
    expect(sessionStorage.getItem("disa_api_key")).toBe("sk-test");
    expect(sessionStorage.getItem("openrouter_key")).toBe("sk-test");
    expect(sessionStorage.getItem("OPENROUTER_API_KEY")).toBe("sk-test");
    expect(sessionStorage.getItem("disa:openrouter:key")).toBe("sk-test");
  });

  it("löscht alle Varianten bei leerem Wert", () => {
    writeApiKey("sk-test");
    writeApiKey("");
    expect(readApiKey()).toBeNull();
  });
});
