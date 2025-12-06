import { act, renderHook } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { beforeEach, describe, expect, it } from "vitest";

import { SettingsProvider } from "../contexts/SettingsContext";
import { useSettings } from "../hooks/useSettings";

const STORAGE_KEY = "disa-ai-settings";

describe("useSettings", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  const wrapper = ({ children }: { children: ReactNode }) =>
    createElement(SettingsProvider, null, children);

  it("fällt bei korruptem JSON auf Defaults zurück", () => {
    localStorage.setItem(STORAGE_KEY, "{invalid-json");

    const { result } = renderHook(() => useSettings(), { wrapper });

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

    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.settings.discussionPreset).toBe("sarkastisch_witzig");
    expect(result.current.settings.discussionStrict).toBe(true);
    expect(result.current.settings.discussionMaxSentences).toBe(9);
    expect(result.current.settings.fontSize).toBe(20);
    expect(result.current.settings.reduceMotion).toBe(true);
    expect(result.current.settings.hapticFeedback).toBe(true);
  });

  it("persistiert den Jugendschutz-Toggle konsistent", () => {
    const { result } = renderHook(() => useSettings(), { wrapper });

    expect(result.current.settings.showNSFWContent).toBe(false);

    act(() => {
      result.current.toggleNSFWContent();
    });

    expect(result.current.settings.showNSFWContent).toBe(true);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    expect(saved.showNSFWContent).toBe(true);
  });
});
