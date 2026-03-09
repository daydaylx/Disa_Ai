import type { DiscussionPresetKey } from "@/prompts/discussion/presets";

// Safe localStorage operations mit defensivem Fehlerhandling
/**
 * Zentrale UI/Feature-Settings (lokal, kein Server).
 * Robust gegen exactOptionalPropertyTypes.
 */

const LS = {
  style: "disa:style",
  model: "disa:modelId",
  template: "disa:templateId",
  useRoleStyle: "disa:useRoleStyle",
  memEnabled: "disa:mem:enabled",
  fontSize: "disa:ui:fontSize",
  reduceMotion: "disa:ui:reduceMotion",
  hapticFeedback: "disa:ui:hapticFeedback",
  discussionPreset: "disa:discussion:preset",
  discussionStrict: "disa:discussion:strict",
  discussionMaxSentences: "disa:discussion:maxSentences",
} as const;

/** Antwortstil-Presets */
export type StyleKey =
  | "neutral"
  | "blunt_de"
  | "concise"
  | "friendly"
  | "creative_light"
  | "minimal"
  | "technical_precise"
  | "socratic"
  | "bullet"
  | "step_by_step"
  | "formal_de"
  | "casual_de"
  | "detailed"
  | "no_taboos";

export function setFontSize(n: number): void {
  try {
    const v = Math.max(12, Math.min(24, Math.floor(n || 0)));
    localStorage.setItem(LS.fontSize, String(v));
    document.documentElement.style.fontSize = `${v}px`;
  } catch {
    /* Safe: fallback to default */
  }
}

export function setReduceMotion(v: boolean): void {
  try {
    localStorage.setItem(LS.reduceMotion, v ? "true" : "false");
    document.body.classList.toggle("reduce-motion", v);
  } catch {
    /* Safe: fallback to default */
  }
}

export function setHapticFeedback(v: boolean): void {
  try {
    localStorage.setItem(LS.hapticFeedback, v ? "true" : "false");
  } catch {
    /* Safe: fallback to default */
  }
}

export function setDiscussionPreset(preset: DiscussionPresetKey): void {
  try {
    localStorage.setItem(LS.discussionPreset, preset);
  } catch {
    /* Safe: fallback to default */
  }
}

export function setDiscussionMaxSentences(count: number): void {
  try {
    const clamped = Math.min(10, Math.max(5, Math.round(count)));
    localStorage.setItem(LS.discussionMaxSentences, String(clamped));
  } catch {
    /* Safe: fallback to default */
  }
}
