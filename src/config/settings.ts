import type { DiscussionPresetKey } from "@/prompts/discussion/presets";

// Safe localStorage operations mit defensivem Fehlerhandling
/**
 * Zentrale UI/Feature-Settings (lokal, kein Server).
 * Robust gegen exactOptionalPropertyTypes.
 */

const LS = {
  style: "disa:style",
  nsfw: "disa:nsfw",
  model: "disa:modelId",
  template: "disa:templateId",
  useRoleStyle: "disa:useRoleStyle",
  memEnabled: "disa:mem:enabled",
  ctxMax: "disa:ctx:maxTokens",
  ctxReserve: "disa:ctx:reserve",
  composerOffset: "disa:ui:composerOffset",
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

/** Reservierte Tokens für die Antwort */
export function getCtxReservedTokens(): number {
  try {
    const raw = Number(localStorage.getItem(LS.ctxReserve));
    return Number.isFinite(raw) && raw >= 128 ? raw : 1000;
  } catch {
    return 1000;
  }
}
export function setCtxReservedTokens(n: number): void {
  try {
    const v = Math.max(128, Math.floor(n || 0));
    localStorage.setItem(LS.ctxReserve, String(v));
  } catch {
    /* Safe: fallback to default */
  }
}

/** Composer-Offset in px (Abstand vom unteren Rand) */
export function getComposerOffset(): number {
  try {
    const raw = Number(localStorage.getItem(LS.composerOffset));
    if (Number.isFinite(raw)) return Math.min(96, Math.max(16, Math.floor(raw)));
  } catch {
    /* Safe: fallback to default */
  }
  return 48;
}
export function setComposerOffset(n: number): void {
  try {
    const v = Math.min(96, Math.max(16, Math.floor(n || 0)));
    localStorage.setItem(LS.composerOffset, String(v));
  } catch {
    /* Safe: fallback to default */
  }
}

/** Font Size */
export function getFontSize(): number {
  try {
    const raw = Number(localStorage.getItem(LS.fontSize));
    return Number.isFinite(raw) && raw >= 12 && raw <= 24 ? raw : 16;
  } catch {
    return 16;
  }
}
export function setFontSize(n: number): void {
  try {
    const v = Math.max(12, Math.min(24, Math.floor(n || 0)));
    localStorage.setItem(LS.fontSize, String(v));
    document.documentElement.style.fontSize = `${v}px`;
  } catch {
    /* Safe: fallback to default */
  }
}

/** Reduce Motion */
export function getReduceMotion(): boolean {
  try {
    const raw = localStorage.getItem(LS.reduceMotion);
    return raw === "true";
  } catch {
    return false;
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

/** Haptic Feedback */
export function getHapticFeedback(): boolean {
  try {
    const raw = localStorage.getItem(LS.hapticFeedback);
    return raw === "true";
  } catch {
    return false;
  }
}
export function setHapticFeedback(v: boolean): void {
  try {
    localStorage.setItem(LS.hapticFeedback, v ? "true" : "false");
  } catch {
    /* Safe: fallback to default */
  }
}

/** Diskussionseinstellungen */
export function getDiscussionPreset(): DiscussionPresetKey {
  try {
    const raw = localStorage.getItem(LS.discussionPreset) as DiscussionPresetKey | null;
    if (raw === "locker_neugierig" || raw === "edgy_provokant" || raw === "nuechtern_pragmatisch") {
      return raw;
    }
    return "locker_neugierig";
  } catch {
    return "locker_neugierig";
  }
}

export function setDiscussionPreset(preset: DiscussionPresetKey): void {
  try {
    localStorage.setItem(LS.discussionPreset, preset);
  } catch {
    /* Safe: fallback to default */
  }
}

export function getDiscussionStrictMode(): boolean {
  try {
    const raw = localStorage.getItem(LS.discussionStrict);
    if (raw === null) return false;
    return raw === "true";
  } catch {
    return false;
  }
}

export function setDiscussionStrictMode(enabled: boolean): void {
  try {
    localStorage.setItem(LS.discussionStrict, enabled ? "true" : "false");
  } catch {
    /* Safe: fallback to default */
  }
}

export function getDiscussionMaxSentences(): number {
  try {
    const raw = Number(localStorage.getItem(LS.discussionMaxSentences));
    if (!Number.isFinite(raw)) return 8;
    return Math.min(10, Math.max(5, Math.round(raw)));
  } catch {
    return 8;
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
