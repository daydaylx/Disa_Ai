/**
 * Model Fallback Strategy Tests
 *
 * Diese Test-Suite überprüft die Resilienz des Modell-Katalog-Systems
 * bei verschiedenen Fehlerszenarien wie Netzwerkausfällen, leeren
 * API-Antworten oder fehlenden Konfigurationsdateien.
 *
 * Test-Szenarien:
 * - Styles.json erfolgreich geladen
 * - Styles.json fehlgeschlagen, Fallback auf API
 * - Leere API-Antwort, Notfall-Fallback aktiviert
 * - Netzwerk-Timeouts werden gracefully behandelt
 * - Fehlformatierte Styles.json wird robust verarbeitet
 */

import { beforeEach, describe, expect, it, vi } from "vitest";

import { loadModelCatalog } from "../config/models";
import { getRawModels } from "../services/openrouter";

// Mock the OpenRouter service
vi.mock("../services/openrouter", () => ({
  getRawModels: vi.fn(),
}));

// Mock fetch for styles.json
const mockFetch = vi.fn();
global.fetch = mockFetch;

/**
 * Haupt-Test-Suite für das Modell-Fallback-System
 *
 * Testet die mehrschichtige Fallback-Strategie des Modell-Katalogs,
 * die sicherstellt, dass das System immer brauchbare Modelle bereitstellt,
 * selbst wenn externe Ressourcen ausfallen.
 */
describe("Model Fallback Strategy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  /**
   * Testet die mehrschichtige Fallback-Logik
   *
   * Prioritäten:
   * 1. Styles.json (lokal oder remote)
   * 2. API-Antwort von OpenRouter
   * 3. Emergency-Fallback (harte Kodierung)
   */
  describe("Multi-layer fallback scenarios", () => {
    /**
     * Test: Styles.json erfolgreich laden
     *
     * Erwartet: Das System nutzt die in styles.json definierten Modelle
     * und gibt sie korrekt zurück
     */
    it("should use styles.json when available", async () => {
      // Mock successful styles.json fetch
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => ({
          styles: [
            {
              allow: ["meta-llama/llama-3.3-70b-instruct:free", "mistralai/mistral-nemo:free"],
            },
            {
              allow: ["qwen/qwen-2.5-72b-instruct:free"],
            },
          ],
        }),
      });

      // Mock OpenRouter API response
      vi.mocked(getRawModels).mockResolvedValueOnce([
        {
          id: "meta-llama/llama-3.3-70b-instruct:free",
          name: "Llama 3.3 70B",
          tags: ["free"],
        },
        {
          id: "mistralai/mistral-nemo:free",
          name: "Mistral Nemo",
          tags: ["free"],
        },
        {
          id: "qwen/qwen-2.5-72b-instruct:free",
          name: "Qwen 2.5 72B",
          tags: ["free"],
        },
      ]);

      const models = await loadModelCatalog();

      expect(models).toHaveLength(3);
      expect(models.map((m) => m.id)).toContain("meta-llama/llama-3.3-70b-instruct:free");
      expect(models.map((m) => m.id)).toContain("mistralai/mistral-nemo:free");
      expect(models.map((m) => m.id)).toContain("qwen/qwen-2.5-72b-instruct:free");
    });

    /**
     * Test: Intelligenter Fallback bei styles.json-Fehlschlag
     *
     * Wenn styles.json nicht verfügbar ist, sollte das System intelligente
     * Fallback-Logik verwenden, um passende Modelle aus der API-Antwort auszuwählen
     */
    it("should use intelligent fallback when styles.json fails", async () => {
      // Mock failed styles.json fetch
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      // Mock successful OpenRouter API response
      vi.mocked(getRawModels).mockResolvedValueOnce([
        {
          id: "meta-llama/llama-3.3-70b-instruct:free",
          name: "Llama 3.3 70B",
          tags: ["free"],
        },
        {
          id: "mistralai/mistral-nemo:free",
          name: "Mistral Nemo",
          tags: ["free"],
        },
        {
          id: "qwen/qwen-2.5-72b-instruct:free",
          name: "Qwen 2.5 72B",
          tags: ["free"],
        },
        {
          id: "openai/gpt-4o-mini",
          name: "GPT-4o Mini",
          tags: [],
        },
      ]);

      const models = await loadModelCatalog();

      // Should return intelligent fallback based on patterns
      expect(models.length).toBeGreaterThan(0);

      // Should prioritize free models
      const freeModels = models.filter((m) => m.safety === "free");
      expect(freeModels.length).toBeGreaterThan(0);

      // Should include models from major providers
      const hasLlama = models.some((m) => m.id.includes("meta-llama"));
      const hasMistral = models.some((m) => m.id.includes("mistralai"));
      expect(hasLlama || hasMistral).toBe(true);
    });

    /**
     * Test: Statischer Notfall-Fallback bei komplettem Ausfall
     *
     * Wenn sowohl styles.json als auch die API fehlschlagen,
     * sollte das System auf harte-kodierte Emergency-Fallback-Modelle
     * zurückgreifen
     */
    it("should use static fallback when both styles.json and API fail", async () => {
      // Mock failed styles.json fetch
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      // Mock failed OpenRouter API
      vi.mocked(getRawModels).mockRejectedValueOnce(new Error("API error"));

      const models = await loadModelCatalog();

      // Should return emergency fallback models
      expect(models.length).toBeGreaterThan(0);
      expect(models.length).toBeLessThanOrEqual(5); // Should be limited set

      // Should include at least one known free model
      const hasKnownFreeModel = models.some(
        (m) => m.id.includes("llama-3.3") || m.id.includes("mistral-nemo") || m.safety === "free",
      );
      expect(hasKnownFreeModel).toBe(true);
    });

    it("should handle intelligent pattern matching when exact models unavailable", async () => {
      // Mock styles.json with specific models
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => ({
          styles: [
            {
              allow: ["meta-llama/llama-3.3-70b-instruct:free"],
            },
          ],
        }),
      });

      // Mock API with different but related models
      vi.mocked(getRawModels).mockResolvedValueOnce([
        {
          id: "meta-llama/llama-3.3-70b-instruct", // Same but no :free suffix
          name: "Llama 3.3 70B",
          tags: [],
        },
        {
          id: "meta-llama/llama-3.1-8b-instruct:free", // Different version
          name: "Llama 3.1 8B",
          tags: ["free"],
        },
      ]);

      const models = await loadModelCatalog();

      // Should find intelligent matches
      expect(models.length).toBeGreaterThan(0);

      // Should match by pattern
      const hasLlamaMatch = models.some((m) => m.id.includes("meta-llama"));
      expect(hasLlamaMatch).toBe(true);
    });

    /**
     * Test: Notfall-Fallback bei leerer API-Antwort
     *
     * Sicherstellt, dass das System immer brauchbare Modelle bereitstellt,
     * selbst wenn die API eine leere Antwort liefert
     */
    it("should provide meaningful fallback even with empty API response", async () => {
      // Mock failed styles.json
      mockFetch.mockRejectedValueOnce(new Error("styles.json not found"));

      // Mock empty API response
      vi.mocked(getRawModels).mockResolvedValueOnce([]);

      const models = await loadModelCatalog();

      // Should still provide emergency models
      expect(models.length).toBeGreaterThan(0);
      expect(models.every((m) => m.id && m.label)).toBe(true);

      // Should have basic required properties
      models.forEach((model) => {
        expect(model.id).toBeTruthy();
        expect(model.label).toBeTruthy();
        expect(model.tags).toBeDefined();
        expect(model.safety).toBeDefined();
      });
    });
  });

  /**
   * Testet Randfälle und Resilienz-Szenarien
   *
   * Diese Tests überprüfen, ob das System robust mit unerwarteten
   * oder fehlerhaften Eingaben umgeht
   */
  describe("Resilience edge cases", () => {
    /**
     * Test: Fehlformatierte styles.json robust verarbeiten
     *
     * Stellt sicher, dass fehlerhafte JSON-Daten nicht zum Absturz
     * des Systems führen, sondern ein Fallback ausgelöst wird
     */
    it("should handle malformed styles.json gracefully", async () => {
      // Mock malformed styles.json
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => ({
          // Missing styles array
          invalid: "data",
        }),
      });

      // Mock valid API response
      vi.mocked(getRawModels).mockResolvedValueOnce([
        {
          id: "meta-llama/llama-3.3-70b-instruct:free",
          name: "Llama 3.3 70B",
          tags: ["free"],
        },
      ]);

      const models = await loadModelCatalog();

      // Should fall back to intelligent selection
      expect(models.length).toBeGreaterThan(0);
    });

    /**
     * Test: Netzwerk-Timeouts robust behandeln
     *
     * Überprüft, ob das System mit Netzwerk-Timeouts umgehen kann,
     * ohne dass die Anwendung hängt oder abstürzt
     */
    it("should handle network timeouts gracefully", async () => {
      // Mock timeout for styles.json
      mockFetch.mockImplementationOnce(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), 10)),
      );

      // Mock fast API response
      vi.mocked(getRawModels).mockResolvedValueOnce([
        {
          id: "mistralai/mistral-nemo:free",
          name: "Mistral Nemo",
          tags: ["free"],
        },
      ]);

      const models = await loadModelCatalog();

      // Should handle timeout and provide fallback
      expect(models.length).toBeGreaterThan(0);
    });
  });
});
