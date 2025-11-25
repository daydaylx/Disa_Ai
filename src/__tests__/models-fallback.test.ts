/**
 * Hybrid-Katalog: Live-Daten von OpenRouter + kuratierte Metadaten.
 * Diese Suite stellt sicher, dass nur kostenlose Modelle angezeigt werden und
 * Metadaten korrekt gemergt werden.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

import { loadModelCatalog } from "../config/models";
import { resolvePublicAssetUrl } from "../lib/publicAssets";
import { getRawModels } from "../services/openrouter";

vi.mock("../services/openrouter", () => ({
  getRawModels: vi.fn(),
}));

const mockFetch = vi.fn();

global.fetch = mockFetch as unknown as typeof fetch;

describe("loadModelCatalog (Hybrid)", () => {
  const mockedGetRawModels = getRawModels as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetRawModels.mockReset();
    mockFetch.mockReset();
  });

  it("kombiniert Live-Modelle mit Metadaten und filtert Non-Free Modelle heraus", async () => {
    mockedGetRawModels.mockResolvedValueOnce([
      {
        id: "meta-llama/llama-3.3-70b-instruct:free",
        name: "Llama 3.3 70B",
        description: "API Beschreibung",
        pricing: { prompt: 0, completion: 0 },
        context_length: 131072,
        tags: ["coding"],
      },
      {
        id: "acme/paid-model",
        name: "Acme Paid",
        description: "Premium",
        pricing: { prompt: 0.1, completion: 0.2 },
        context_length: 4096,
      },
    ]);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          "meta-llama/llama-3.3-70b-instruct:free": {
            qualityScore: 95,
            openness: 0.8,
            label: "Llama 3.3 70B (Gratis)",
            description: "Kuratiert",
            tags: ["logic"],
          },
        }),
    });

    const models = await loadModelCatalog();

    expect(mockedGetRawModels).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith(resolvePublicAssetUrl("models_metadata.json"), {
      cache: "no-store",
    });
    expect(models).toHaveLength(1);
    expect(models[0]).toMatchObject({
      id: "meta-llama/llama-3.3-70b-instruct:free",
      label: "Llama 3.3 70B (Gratis)",
      description: "Kuratiert",
      qualityScore: 95,
      openness: 0.8,
      pricing: { in: 0, out: 0 },
      provider: "meta-llama",
      safety: "free",
    });
    expect(models[0]!.tags).toEqual(expect.arrayContaining(["free", "coding", "logic"]));
    expect(models[0]!.contextTokens).toBe(131072);
    expect(models[0]!.contextK).toBe(128);
  });

  it("nutzt API-Daten und Default-Werte, wenn Metadaten fehlen", async () => {
    mockedGetRawModels.mockResolvedValueOnce([
      {
        id: "openrouter/new-free:free",
        name: "New Free",
        description: "API desc",
        pricing: { prompt: 0, completion: 0 },
        context_length: 2048,
      },
    ]);

    mockFetch.mockResolvedValueOnce({ ok: false });

    const models = await loadModelCatalog();

    expect(models).toHaveLength(1);
    expect(models[0]).toMatchObject({
      id: "openrouter/new-free:free",
      label: "New Free",
      description: "API desc",
      qualityScore: 50,
      openness: 0.5,
      pricing: { in: 0, out: 0 },
    });
  });

  it("gibt eine leere Liste zurück, wenn Live-Daten nicht geladen werden können", async () => {
    mockedGetRawModels.mockRejectedValueOnce(new Error("Network down"));
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    const models = await loadModelCatalog();

    expect(models).toEqual([]);
  });
});
