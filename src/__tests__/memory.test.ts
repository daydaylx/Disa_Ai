import { describe, expect, it, vi } from "vitest";

import * as memory from "../api/memory";
// chatOnce wird im Modul memory importiert → wir mocken Rückgabe
import { DEFAULT_MODELS } from "../config/defaults";

vi.mock("../api/openrouter", () => ({
  chatOnce: vi.fn(() => Promise.resolve({ text: "- Punkt 1\n- Punkt 2" })),
  getModelFallback: vi.fn(() => DEFAULT_MODELS.FALLBACK_MODEL),
}));

describe("addExplicitMemory", () => {
  it("integriert Note in Bullet-Liste", async () => {
    const updated = await memory.addExplicitMemory({
      previousMemory: "- Punkt 1",
      note: "Bitte 'Punkt 2' merken",
    });
    expect(updated).toMatch(/Punkt 1/);
    expect(updated).toMatch(/Punkt 2/);
  });
});
