/**
 * Modelle werden ausschließlich aus der statischen Konfiguration geladen.
 * Diese Suite stellt sicher, dass /public/models.json die einzige Quelle ist
 * und Fehlerszenarien sauber abgefangen werden.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

import { loadModelCatalog } from "../config/models";

const mockFetch = vi.fn();

global.fetch = mockFetch;

describe("loadModelCatalog", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockFetch.mockReset();
  });

  it("lädt und normalisiert Einträge aus models.json", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        await Promise.resolve();
        return [
          {
            id: "openrouter/demo-free:free",
            name: "Demo Free",
            desc: "Kostenloses Testmodell",
            price_in: 0,
            price_out: 0,
          },
          {
            id: "acme/paid-model",
            name: "Acme Paid",
            desc: "Premium Variante",
            price_in: 0.1,
            price_out: 0.2,
          },
        ];
      },
    });

    const models = await loadModelCatalog();

    expect(mockFetch).toHaveBeenCalledWith("/models.json", { cache: "default" });
    expect(models).toHaveLength(2);
    const freeModel = models.find((m) => m.id === "openrouter/demo-free:free");
    const paidModel = models.find((m) => m.id === "acme/paid-model");

    expect(freeModel).toMatchObject({
      id: "openrouter/demo-free:free",
      label: "Demo Free",
      safety: "free",
    });
    expect(freeModel?.tags).toContain("free");
    expect(freeModel?.pricing).toBeUndefined();
    expect(paidModel).toMatchObject({
      id: "acme/paid-model",
      label: "Acme Paid",
      description: "Premium Variante",
      pricing: { in: 0.1, out: 0.2 },
      safety: "moderate",
    });
  });

  it("gibt ein leeres Array zurück, wenn models.json leer ist", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        await Promise.resolve();
        return [];
      },
    });

    const models = await loadModelCatalog();
    expect(models).toEqual([]);
  });

  it("fängt HTTP-Fehler ab und liefert eine leere Liste", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Server Error",
    });

    const models = await loadModelCatalog();
    expect(models).toEqual([]);
  });

  it("behandelt Netzwerkfehler und liefert eine leere Liste", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network down"));

    const models = await loadModelCatalog();
    expect(models).toEqual([]);
  });
});
