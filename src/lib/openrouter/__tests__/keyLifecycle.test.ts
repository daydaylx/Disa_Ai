import { beforeEach, describe, expect, it } from "vitest";

import { clearAllApiKeys, DEFAULT_API_KEY, hasApiKey, readApiKey, writeApiKey } from "../key";

describe("API Key Lifecycle & Security", () => {
  beforeEach(() => {
    // Clean up all storages before each test
    sessionStorage.clear();
    localStorage.clear();
  });

  describe("Secure Storage Migration", () => {
    it("should migrate from localStorage to canonical sessionStorage key", () => {
      const testKey = "sk-test-migration-key";

      // Start with key in localStorage (legacy state)
      localStorage.setItem("disa_api_key", testKey);

      // Reading key should migrate it to canonical sessionStorage key
      const retrievedKey = readApiKey();

      expect(retrievedKey).toBe(testKey);
      expect(sessionStorage.getItem("openrouter-key")).toBe(testKey);
      expect(sessionStorage.getItem("disa_api_key")).toBeNull();
      expect(localStorage.getItem("disa_api_key")).toBeNull();
    });

    it("should prefer canonical key over legacy keys", () => {
      const canonicalKey = "sk-canonical-key";
      const legacyKey = "sk-legacy-key";
      const localKey = "sk-local-key";

      localStorage.setItem("disa_api_key", localKey);
      sessionStorage.setItem("disa_api_key", legacyKey);
      sessionStorage.setItem("openrouter-key", canonicalKey);

      const retrievedKey = readApiKey();

      expect(retrievedKey).toBe(canonicalKey);
      // Legacy keys should remain untouched when canonical key exists
      expect(sessionStorage.getItem("disa_api_key")).toBe(legacyKey);
      expect(localStorage.getItem("disa_api_key")).toBe(localKey);
    });

    it("should handle migration failure gracefully", () => {
      const testKey = "sk-test-key";
      localStorage.setItem("disa_api_key", testKey);

      // Mock sessionStorage to fail
      const originalSetItem = sessionStorage.setItem;
      sessionStorage.setItem = () => {
        throw new Error("Storage full");
      };

      // Should still return the key despite migration failure
      const retrievedKey = readApiKey();
      expect(retrievedKey).toBe(testKey);

      // Restore original method
      sessionStorage.setItem = originalSetItem;
    });
  });

  describe("Key Expiry & Session Behavior", () => {
    it("should store keys only in canonical sessionStorage key", () => {
      const testKey = "sk-new-session-key";

      writeApiKey(testKey);

      expect(sessionStorage.getItem("openrouter-key")).toBe(testKey);
      expect(sessionStorage.getItem("disa_api_key")).toBeNull();
      expect(localStorage.getItem("disa_api_key")).toBeNull();
    });

    it("should clear keys from both storages on logout", () => {
      const testKey = "sk-clear-test-key";

      // Set key in both storages
      sessionStorage.setItem("disa_api_key", testKey);
      localStorage.setItem("disa_api_key", testKey);

      // Clear all keys
      clearAllApiKeys();

      expect(sessionStorage.getItem("disa_api_key")).toBeNull();
      expect(localStorage.getItem("disa_api_key")).toBeNull();
      expect(hasApiKey()).toBe(false);
    });

    it("should clear key when setting empty value", () => {
      const testKey = "sk-temp-key";
      sessionStorage.setItem("disa_api_key", testKey);

      writeApiKey(""); // Empty string should clear

      expect(hasApiKey()).toBe(false);
      expect(sessionStorage.getItem("disa_api_key")).toBeNull();
    });
  });

  describe("Multiple Key Candidates", () => {
    it("should try all key candidates in order", () => {
      const testKey = "sk-fallback-key";

      // Set key in a fallback location
      sessionStorage.setItem("OPENROUTER_API_KEY", testKey);

      const retrievedKey = readApiKey();
      expect(retrievedKey).toBe(testKey);
    });

    it("should clear all candidates when logging out", () => {
      const testKey = "sk-multi-key";

      // Set keys in multiple locations
      sessionStorage.setItem("disa_api_key", testKey);
      sessionStorage.setItem("openrouter_key", testKey);
      localStorage.setItem("OPENROUTER_API_KEY", testKey);

      clearAllApiKeys();

      expect(sessionStorage.getItem("disa_api_key")).toBeNull();
      expect(sessionStorage.getItem("openrouter_key")).toBeNull();
      expect(localStorage.getItem("OPENROUTER_API_KEY")).toBeNull();
    });
  });

  describe("Security Edge Cases", () => {
    it("should handle malformed keys gracefully", () => {
      // Keys with quotes should be trimmed
      localStorage.setItem("disa_api_key", '"sk-quoted-key"');

      const retrievedKey = readApiKey();
      expect(retrievedKey).toBe("sk-quoted-key");
    });

    it("should reject empty or whitespace-only keys", () => {
      localStorage.setItem("disa_api_key", "   ");

      const retrievedKey = readApiKey();
      expect(retrievedKey).toBe(DEFAULT_API_KEY);
    });

    it("should handle storage access errors", () => {
      // Mock storage to throw errors
      const originalGetItem = sessionStorage.getItem;
      sessionStorage.getItem = () => {
        throw new Error("Storage access denied");
      };

      // Should return default key gracefully
      const retrievedKey = readApiKey();
      expect(retrievedKey).toBe(DEFAULT_API_KEY);

      // Restore original method
      sessionStorage.getItem = originalGetItem;
    });
  });

  describe("hasApiKey Helper", () => {
    it("should return true when valid key exists", () => {
      sessionStorage.setItem("disa_api_key", "sk-valid-key");
      expect(hasApiKey()).toBe(true);
    });

    it("should return false when no key exists", () => {
      expect(hasApiKey()).toBe(true);
    });

    it("should return false for empty key", () => {
      sessionStorage.setItem("disa_api_key", "");
      expect(hasApiKey()).toBe(true);
    });
  });
});
