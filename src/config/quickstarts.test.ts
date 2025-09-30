import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  defaultQuickstarts,
  getQuickstartById,
  getQuickstarts,
  getQuickstartsWithFallback,
  loadQuickstarts,
  validateQuickstart,
} from "./quickstarts";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Quickstarts Configuration", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Reset console spy after each test
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getQuickstarts", () => {
    it("sollte Standard-Quickstarts zurückgeben", () => {
      const quickstarts = getQuickstarts();
      expect(quickstarts).toBe(defaultQuickstarts);
      expect(quickstarts.length).toBeGreaterThan(0);
    });
  });

  describe("getQuickstartById", () => {
    it("sollte Quickstart per ID finden", () => {
      const quickstart = getQuickstartById("text-writer");
      expect(quickstart).toBeDefined();
      expect(quickstart?.id).toBe("text-writer");
      expect(quickstart?.title).toBe("AI Text Writer");
    });

    it("sollte undefined für unbekannte ID zurückgeben", () => {
      const quickstart = getQuickstartById("non-existent");
      expect(quickstart).toBeUndefined();
    });
  });

  describe("validateQuickstart", () => {
    it("sollte gültigen Quickstart validieren", () => {
      const validQuickstart = {
        id: "test",
        title: "Test Title",
        subtitle: "Test Subtitle",
        gradient: "from-blue-500 to-red-500",
        flowId: "test.v1",
        autosend: false,
        prompt: "Test prompt",
      };

      const result = validateQuickstart(validQuickstart);
      expect(result).toEqual(validQuickstart);
    });

    it("sollte null für ungültigen Quickstart zurückgeben", () => {
      const invalidQuickstart = {
        id: "",
        title: "Test Title",
        // subtitle fehlt
        gradient: "from-blue-500 to-red-500",
        flowId: "test.v1",
        autosend: false,
        prompt: "Test prompt",
      };

      const result = validateQuickstart(invalidQuickstart);
      expect(result).toBeNull();
    });

    it("sollte null für leeres Objekt zurückgeben", () => {
      const result = validateQuickstart({});
      expect(result).toBeNull();
    });

    it("sollte null für null/undefined zurückgeben", () => {
      expect(validateQuickstart(null)).toBeNull();
      expect(validateQuickstart(undefined)).toBeNull();
    });
  });

  describe("loadQuickstarts - Issue #70 Tests", () => {
    it("sollte externe Konfiguration laden wenn verfügbar", async () => {
      const externalConfig = [
        {
          id: "external-test",
          title: "External Test",
          subtitle: "External Test Subtitle",
          gradient: "from-green-500 to-blue-500",
          flowId: "external.v1",
          autosend: true,
          prompt: "External prompt",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(externalConfig),
      });

      const result = await loadQuickstarts();
      expect(result).toEqual(externalConfig);
      expect(mockFetch).toHaveBeenCalledWith("/quickstarts.json", {
        cache: "no-store",
      });
    });

    it("sollte leere externe Konfiguration zurückgeben", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const result = await loadQuickstarts();
      // Leere Arrays sind zod-valid, werden also nicht als Fehler behandelt
      expect(result).toEqual([]);
    });

    it("sollte auf Defaults fallback bei invalider externer Konfiguration", async () => {
      const invalidConfig = [
        {
          id: "", // Ungültig: leere ID
          title: "Invalid",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidConfig),
      });

      const consoleSpy = vi.spyOn(console, "warn");
      const result = await loadQuickstarts();

      expect(result).toEqual(defaultQuickstarts);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Invalid quickstarts config, falling back to defaults:",
        expect.any(Object),
      );
    });

    it("sollte auf Defaults fallback bei Fetch-Fehler", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const consoleSpy = vi.spyOn(console, "warn");
      const result = await loadQuickstarts();

      expect(result).toEqual(defaultQuickstarts);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load external quickstarts, using defaults:",
        expect.any(Error),
      );
    });

    it("sollte auf Defaults fallback bei HTTP-Fehler", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await loadQuickstarts();
      // HTTP-Fehler führt nicht zum catch-Block, sondern überspringt nur den if (response.ok)
      expect(result).toEqual(defaultQuickstarts);
    });

    it("sollte auf Defaults fallback bei JSON-Parse-Fehler", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      const consoleSpy = vi.spyOn(console, "warn");
      const result = await loadQuickstarts();

      expect(result).toEqual(defaultQuickstarts);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load external quickstarts, using defaults:",
        expect.any(Error),
      );
    });
  });

  describe("getQuickstartsWithFallback - Issue #70 Tests", () => {
    it("sollte externe Quickstarts verwenden wenn verfügbar", async () => {
      const externalConfig = [
        {
          id: "external-fallback-test",
          title: "External Fallback Test",
          subtitle: "External Fallback Subtitle",
          gradient: "from-purple-500 to-pink-500",
          flowId: "external-fallback.v1",
          autosend: false,
          prompt: "External fallback prompt",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(externalConfig),
      });

      const result = await getQuickstartsWithFallback();
      expect(result).toEqual(externalConfig);
    });

    it("sollte Defaults verwenden wenn externe Config leer ist", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const result = await getQuickstartsWithFallback();

      // getQuickstartsWithFallback prüft external.length > 0, also fallen leere Arrays auf defaults zurück
      expect(result).toEqual(defaultQuickstarts);
    });

    it("sollte Defaults verwenden bei Fehler", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Fetch failed"));

      const consoleSpy = vi.spyOn(console, "warn");
      const result = await getQuickstartsWithFallback();

      expect(result).toEqual(defaultQuickstarts);
      // getQuickstartsWithFallback ruft loadQuickstarts auf, das loggt "Failed to load..."
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load external quickstarts, using defaults:",
        expect.any(Error),
      );
    });
  });

  describe("Default Quickstarts Struktur", () => {
    it("sollte alle Standard-Quickstarts mit korrekter Struktur haben", () => {
      defaultQuickstarts.forEach((quickstart) => {
        expect(quickstart).toHaveProperty("id");
        expect(quickstart).toHaveProperty("title");
        expect(quickstart).toHaveProperty("subtitle");
        expect(quickstart).toHaveProperty("gradient");
        expect(quickstart).toHaveProperty("flowId");
        expect(quickstart).toHaveProperty("autosend");
        expect(quickstart).toHaveProperty("prompt");

        expect(typeof quickstart.id).toBe("string");
        expect(typeof quickstart.title).toBe("string");
        expect(typeof quickstart.subtitle).toBe("string");
        expect(typeof quickstart.gradient).toBe("string");
        expect(typeof quickstart.flowId).toBe("string");
        expect(typeof quickstart.autosend).toBe("boolean");
        expect(typeof quickstart.prompt).toBe("string");

        expect(quickstart.id.length).toBeGreaterThan(0);
        expect(quickstart.title.length).toBeGreaterThan(0);
        expect(quickstart.subtitle.length).toBeGreaterThan(0);
        expect(quickstart.gradient.length).toBeGreaterThan(0);
        expect(quickstart.flowId.length).toBeGreaterThan(0);
        expect(quickstart.prompt.length).toBeGreaterThan(0);
      });
    });

    it("sollte mindestens 3 Standard-Quickstarts haben", () => {
      expect(defaultQuickstarts.length).toBeGreaterThanOrEqual(3);
    });

    it("sollte Text Writer Quickstart enthalten", () => {
      const textWriter = defaultQuickstarts.find((q) => q.id === "text-writer");
      expect(textWriter).toBeDefined();
      expect(textWriter?.title).toBe("AI Text Writer");
      expect(textWriter?.autosend).toBe(false);
    });

    it("sollte Fact Check Quickstart enthalten", () => {
      const factCheck = defaultQuickstarts.find((q) => q.id === "fact-check");
      expect(factCheck).toBeDefined();
      expect(factCheck?.title).toBe("Faktencheck");
      expect(factCheck?.autosend).toBe(false);
    });
  });
});
