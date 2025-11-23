import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import { useSettings } from "../hooks/useSettings";

const STORAGE_KEY = "disa-ai-settings";

describe("useSettings", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("fällt bei korruptem JSON auf Defaults zurück", () => {
    localStorage.setItem(STORAGE_KEY, "{invalid-json");

    const { result } = renderHook(() => useSettings());

    expect(result.current.settings.language).toBe("de");
    expect(result.current.settings.showNSFWContent).toBe(false);
    expect(result.current.settings.restoreLastConversation).toBe(true);
  });

  it("liest fehlende Felder aus Legacy-Keys", () => {
    localStorage.setItem("disa:discussion:preset", "sarkastisch_witzig");
    localStorage.setItem("disa:discussion:strict", "true");
    localStorage.setItem("disa:discussion:maxSentences", "9");
    localStorage.setItem("disa:ui:fontSize", "20");
    localStorage.setItem("disa:ui:reduceMotion", "true");
    localStorage.setItem("disa:ui:hapticFeedback", "true");

    const { result } = renderHook(() => useSettings());

    expect(result.current.settings.discussionPreset).toBe("sarkastisch_witzig");
    expect(result.current.settings.discussionStrict).toBe(true);
    expect(result.current.settings.discussionMaxSentences).toBe(9);
    expect(result.current.settings.fontSize).toBe(20);
    expect(result.current.settings.reduceMotion).toBe(true);
    expect(result.current.settings.hapticFeedback).toBe(true);
  });

  it("persistiert den Jugendschutz-Toggle konsistent", () => {
    const { result } = renderHook(() => useSettings());

    expect(result.current.settings.showNSFWContent).toBe(false);

    act(() => {
      result.current.toggleNSFWContent();
    });

    expect(result.current.settings.showNSFWContent).toBe(true);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    expect(saved.showNSFWContent).toBe(true);
  });

  it("persistiert das bevorzugte Modell", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.setPreferredModel("anthropic/claude-3-opus");
    });

    expect(result.current.settings.preferredModelId).toBe("anthropic/claude-3-opus");
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    expect(saved.preferredModelId).toBe("anthropic/claude-3-opus");
  });

  it("persistiert das Theme", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.settings.theme).toBe("dark");
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    expect(saved.theme).toBe("dark");
  });

  it("validiert und persistiert Creativity", () => {
    const { result } = renderHook(() => useSettings());

    act(() => {
      result.current.setCreativity(150); // Should clamp to 100
    });
    expect(result.current.settings.creativity).toBe(100);

    act(() => {
      result.current.setCreativity(-10); // Should clamp to 0
    });
    expect(result.current.settings.creativity).toBe(0);

    act(() => {
      result.current.setCreativity(50);
    });
    expect(result.current.settings.creativity).toBe(50);

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    expect(saved.creativity).toBe(50);
  });
});
