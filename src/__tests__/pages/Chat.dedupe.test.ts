import { describe, expect, it } from "vitest";

/**
 * Helper function to normalize prompt text for deduplication
 * Matches the implementation in Chat.tsx
 */
const normalizePrompt = (text: string): string => {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
};

describe("Chat Suggestion Deduplication", () => {
  describe("normalizePrompt", () => {
    it("trims whitespace from both ends", () => {
      expect(normalizePrompt("  Hello World  ")).toBe("hello world");
      expect(normalizePrompt("\tHello World\n")).toBe("hello world");
    });

    it("converts to lowercase", () => {
      expect(normalizePrompt("HELLO WORLD")).toBe("hello world");
      expect(normalizePrompt("Hello World")).toBe("hello world");
      expect(normalizePrompt("HeLLo WoRLd")).toBe("hello world");
    });

    it("collapses multiple spaces into single space", () => {
      expect(normalizePrompt("Hello  World")).toBe("hello world");
      expect(normalizePrompt("Hello   World")).toBe("hello world");
      expect(normalizePrompt("Hello    World")).toBe("hello world");
    });

    it("handles tabs and mixed whitespace", () => {
      expect(normalizePrompt("Hello\tWorld")).toBe("hello world");
      expect(normalizePrompt("Hello \t World")).toBe("hello world");
      expect(normalizePrompt("Hello  \t  World")).toBe("hello world");
    });

    it("handles newlines", () => {
      expect(normalizePrompt("Hello\nWorld")).toBe("hello world");
      expect(normalizePrompt("Hello\n\nWorld")).toBe("hello world");
      expect(normalizePrompt("Hello \n World")).toBe("hello world");
    });

    it("handles combined normalization", () => {
      expect(normalizePrompt("  HELLO   \t  WORLD  \n")).toBe("hello world");
    });
  });

  describe("deduplication logic", () => {
    it("removes exact duplicates", () => {
      const input = ["Test 1", "Test 2", "Test 1"];
      const seen = new Set<string>();
      const output = input.filter((prompt) => {
        const normalized = normalizePrompt(prompt);
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      });
      expect(output).toHaveLength(2);
      expect(output).toEqual(["Test 1", "Test 2"]);
    });

    it("removes case-insensitive duplicates", () => {
      const input = ["Hello World", "HELLO WORLD", "hello world"];
      const seen = new Set<string>();
      const output = input.filter((prompt) => {
        const normalized = normalizePrompt(prompt);
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      });
      expect(output).toHaveLength(1);
      expect(output).toEqual(["Hello World"]);
    });

    it("removes whitespace-variant duplicates", () => {
      const input = ["Hello  World", "Hello World", "Hello   World"];
      const seen = new Set<string>();
      const output = input.filter((prompt) => {
        const normalized = normalizePrompt(prompt);
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      });
      expect(output).toHaveLength(1);
      expect(output).toEqual(["Hello  World"]);
    });

    it("preserves original casing of first occurrence", () => {
      const input = ["Hello World", "HELLO WORLD"];
      const seen = new Set<string>();
      const output = input.filter((prompt) => {
        const normalized = normalizePrompt(prompt);
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      });
      expect(output).toEqual(["Hello World"]);
    });

    it("handles complex mixed duplicates", () => {
      const input = [
        "Erkläre mir Quantenphysik",
        "ERKLÄRE MIR QUANTENPHYSIK",
        "Erkläre  mir  Quantenphysik",
        "erkläre mir quantenphysik",
        "Was koche ich heute?",
        "Was  koche ich heute?",
      ];
      const seen = new Set<string>();
      const output = input.filter((prompt) => {
        const normalized = normalizePrompt(prompt);
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      });
      expect(output).toHaveLength(2);
      expect(output).toEqual(["Erkläre mir Quantenphysik", "Was koche ich heute?"]);
    });

    it("handles empty strings", () => {
      const input = ["", "Test", ""];
      const seen = new Set<string>();
      const output = input.filter((prompt) => {
        const normalized = normalizePrompt(prompt);
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      });
      expect(output).toHaveLength(2);
      expect(output).toEqual(["", "Test"]);
    });

    it("handles strings with only whitespace", () => {
      const input = ["   ", "Test", "\t\n"];
      const seen = new Set<string>();
      const output = input.filter((prompt) => {
        const normalized = normalizePrompt(prompt);
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      });
      expect(output).toHaveLength(2);
      // Both whitespace-only strings normalize to "" (empty string)
      expect(output).toEqual(["   ", "Test"]);
    });

    it("handles German umlauts and special characters", () => {
      const input = ["Schönes Wetter", "SCHÖNES WETTER", "schönes  wetter"];
      const seen = new Set<string>();
      const output = input.filter((prompt) => {
        const normalized = normalizePrompt(prompt);
        if (seen.has(normalized)) return false;
        seen.add(normalized);
        return true;
      });
      expect(output).toHaveLength(1);
      expect(output).toEqual(["Schönes Wetter"]);
    });
  });

  describe("integration with Set behavior", () => {
    it("Set maintains insertion order", () => {
      const seen = new Set<string>();
      seen.add("a");
      seen.add("b");
      seen.add("c");
      expect(Array.from(seen)).toEqual(["a", "b", "c"]);
    });

    it("Set.has returns true for existing items", () => {
      const seen = new Set<string>();
      seen.add("test");
      expect(seen.has("test")).toBe(true);
      expect(seen.has("other")).toBe(false);
    });

    it("deduplication preserves order of first occurrences", () => {
      const input = ["A", "B", "A", "C", "B", "D"];
      const seen = new Set<string>();
      const output = input.filter((item) => {
        if (seen.has(item)) return false;
        seen.add(item);
        return true;
      });
      expect(output).toEqual(["A", "B", "C", "D"]);
    });
  });
});
