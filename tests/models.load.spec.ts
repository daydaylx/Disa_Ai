import { afterEach, describe, expect, it, vi } from "vitest";
import {
  loadModelCatalog,
  chooseDefaultModel,
  labelForModel,
  type ModelEntry,
} from "@/config/models";

afterEach(() => {
  vi.restoreAllMocks();
  try {
    window.localStorage.clear();
    window.sessionStorage.clear();
  } catch {}
});

describe("loadModelCatalog()", () => {
  it("liefert Fallback-Modelle, wenn kein API-Key vorhanden ist", async () => {
    const list = await loadModelCatalog(); // KEIN { apiKey: undefined }
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBeGreaterThan(0);
    expect(list.some((m) => m.id === "openrouter/auto")).toBe(true);
  });

  it("mapped Live-Katalog bei vorhandenem API-Key (mit Mock-Fetch)", async () => {
    const wire = {
      data: [
        {
          id: "qwen/qwen-2.5-coder-32b-instruct",
          name: "Qwen 2.5 Coder 32B (Instruct)",
          context_length: 128000,
          pricing: { prompt: 0.1, completion: 0.2 },
        },
        {
          id: "mistral/mistral-small-latest",
          name: "Mistral Small (latest)",
          context_length: 32000,
          pricing: { prompt: 0.05, completion: 0.1 },
        },
      ],
    };

    const fetchMock = vi.spyOn(globalThis, "fetch" as any).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => wire,
    } as Response);

    const list = await loadModelCatalog({ apiKey: "test-key", preferFree: false, maxAgeMs: 0 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(list).toHaveLength(2);

    const qwen = list.find((m) => m.id.startsWith("qwen/"));
    expect(qwen?.provider.name).toBe("qwen");
    expect(qwen?.label).toMatch(/Qwen/i);
    expect(qwen?.ctx).toBe(128000);
    expect(qwen?.price?.in).toBe(0.1);
    expect(qwen?.price?.out).toBe(0.2);
  });

  it("chooseDefaultModel() bevorzugt free, wenn vorhanden", () => {
    const list: ModelEntry[] = [
      { id: "foo/a", label: "A", provider: { name: "foo" }, tags: [] },
      { id: "bar/b", label: "B", provider: { name: "bar" }, tags: ["free"] },
    ];
    expect(chooseDefaultModel(list, true)).toBe("bar/b");
  });

  it("labelForModel() liefert Label oder ID", () => {
    const list: ModelEntry[] = [{ id: "x/y", label: "Y", provider: { name: "x" } }];
    expect(labelForModel("x/y", list)).toBe("Y");
    expect(labelForModel("unknown", list)).toBe("unknown");
  });
});
