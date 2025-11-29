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
      const quickstart = getQuickstartById("discussion-aliens");
      expect(quickstart).toBeDefined();
      expect(quickstart?.id).toBe("discussion-aliens");
      expect(quickstart?.title).toBe("Gibt es Außerirdische?");
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
        description: "Test Description",
        icon: null,
        system: "test-system",
        user: "test-user",
      };

      const result = validateQuickstart(validQuickstart);
      expect(result).toEqual(validQuickstart);
    });

    it("sollte null für ungültigen Quickstart zurückgeben", () => {
      const invalidQuickstart = {
        id: "",
        title: "Test Title",
        // description fehlt
        icon: null,
        system: "test-system",
        user: "test-user",
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
          description: "External Test Description",
          icon: null,
          system: "test-system",
          user: "test-user",
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
      await expect(loadQuickstarts()).rejects.toThrow(
        "No valid quickstarts found in external config",
      );
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load external quickstarts, using defaults:",
        expect.any(Error),
      );
    });

    it("sollte auf Defaults fallback bei Fetch-Fehler", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const consoleSpy = vi.spyOn(console, "warn");
      await expect(loadQuickstarts()).rejects.toThrow("Network error");
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

      await expect(loadQuickstarts()).rejects.toThrow("Quickstarts request failed with status 404");
    });

    it("sollte auf Defaults fallback bei JSON-Parse-Fehler", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      const consoleSpy = vi.spyOn(console, "warn");
      await expect(loadQuickstarts()).rejects.toThrow("Invalid JSON");
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
          description: "External Fallback Description",
          icon: null,
          system: "test-system",
          user: "test-user",
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(externalConfig),
      });

      const result = await getQuickstartsWithFallback();
      expect(result).toEqual(externalConfig);
    });

    it("sollte Defaults verwenden wenn externe Config leer ist und Fallback melden", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

      const fallbackSpy = vi.fn();
      const result = await getQuickstartsWithFallback({
        onFallback: fallbackSpy,
      });

      // getQuickstartsWithFallback prüft external.length > 0, also fallen leere Arrays auf defaults zurück
      expect(result).toEqual(defaultQuickstarts);
      expect(fallbackSpy).toHaveBeenCalledWith({ reason: "empty" });
    });

    it("sollte Defaults verwenden bei Fehler und Fallback melden", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Fetch failed"));

      const consoleSpy = vi.spyOn(console, "warn");
      const fallbackSpy = vi.fn();
      const result = await getQuickstartsWithFallback({
        onFallback: fallbackSpy,
      });

      expect(result).toEqual(defaultQuickstarts);
      // getQuickstartsWithFallback ruft loadQuickstarts auf, das loggt "Failed to load..."
      expect(consoleSpy).toHaveBeenCalledWith(
        "Failed to load external quickstarts, using defaults:",
        expect.any(Error),
      );
      expect(fallbackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          reason: "error",
          error: expect.any(Error),
        }),
      );
    });
  });

  describe("Default Quickstarts Struktur", () => {
    it("sollte alle Standard-Quickstarts mit korrekter Struktur haben", () => {
      defaultQuickstarts.forEach((quickstart) => {
        expect(quickstart).toHaveProperty("id");
        expect(quickstart).toHaveProperty("title");
        expect(quickstart).toHaveProperty("description");
        expect(quickstart).toHaveProperty("icon");
        expect(quickstart).toHaveProperty("system");
        expect(quickstart).toHaveProperty("user");

        expect(typeof quickstart.id).toBe("string");
        expect(typeof quickstart.title).toBe("string");
        expect(typeof quickstart.description).toBe("string");
        expect(typeof quickstart.system).toBe("string");
        expect(typeof quickstart.user).toBe("string");

        expect(quickstart.id.length).toBeGreaterThan(0);
        expect(quickstart.title.length).toBeGreaterThan(0);
        expect(quickstart.description.length).toBeGreaterThan(0);
        expect(quickstart.system.length).toBeGreaterThan(0);
        expect(quickstart.user.length).toBeGreaterThan(0);
      });
    });

    it("sollte mindestens 3 Standard-Quickstarts haben", () => {
      expect(defaultQuickstarts.length).toBeGreaterThanOrEqual(3);
    });

    it("sollte aliens Diskussion enthalten", () => {
      const aliensDiscussion = defaultQuickstarts.find((q) => q.id === "discussion-aliens");
      expect(aliensDiscussion).toBeDefined();
      expect(aliensDiscussion?.title).toBe("Gibt es Außerirdische?");
    });

    it("sollte Verschwörungstheorie enthalten", () => {
      const conspiracyDiscussion = defaultQuickstarts.find((q) => q.id === "conspiracy-flat-earth");
      expect(conspiracyDiscussion).toBeDefined();
      expect(conspiracyDiscussion?.title).toBe("Flache Erde");
    });
  });
});
