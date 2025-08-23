import { describe, it, expect, vi } from "vitest";
import * as memory from "../api/memory";

// chatOnce wird im Modul memory importiert → wir mocken Rückgabe
vi.mock("../api/openrouter", () => ({
  chatOnce: vi.fn(async () => ({ text: "- Punkt 1\n- Punkt 2" })),
  getModelFallback: vi.fn(() => "meta-llama/llama-3.3-70b-instruct:free"),
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
