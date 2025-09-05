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

/** Stil lesen/schreiben */
export function getStyle(): StyleKey {
  try {
    const raw = localStorage.getItem(LS.style) as StyleKey | null;
    return raw ?? "blunt_de";
  } catch {
    return "blunt_de";
  }
}
export function setStyle(v: StyleKey): void {
  try {
    localStorage.setItem(LS.style, v);
  } catch {}
}

/** NSFW-Flag */
export function getNSFW(): boolean {
  try {
    const raw = localStorage.getItem(LS.nsfw);
    if (raw === null) return false;
    return raw === "true";
  } catch {
    return false;
  }
}
export function setNSFW(v: boolean): void {
  try {
    localStorage.setItem(LS.nsfw, v ? "true" : "false");
  } catch {}
}

/** Ausgewähltes Modell */
export function getSelectedModelId(): string | null {
  try {
    return localStorage.getItem(LS.model);
  } catch {
    return null;
  }
}
export function setSelectedModelId(id: string | null): void {
  try {
    if (id === null) localStorage.removeItem(LS.model);
    else localStorage.setItem(LS.model, id);
  } catch {}
}

/** Aktive Rolle (Template-ID aus public/styles.json) */
export function getTemplateId(): string | null {
  try {
    return localStorage.getItem(LS.template);
  } catch {
    return null;
  }
}
export function setTemplateId(id: string | null): void {
  try {
    if (id === null) localStorage.removeItem(LS.template);
    else localStorage.setItem(LS.template, id);
  } catch {}
}

/** Stil-Overlay der Rolle anwenden? */
export function getUseRoleStyle(): boolean {
  try {
    const raw = localStorage.getItem(LS.useRoleStyle);
    if (raw === null) return true;
    return raw === "true";
  } catch {
    return true;
  }
}
export function setUseRoleStyle(v: boolean): void {
  try {
    localStorage.setItem(LS.useRoleStyle, v ? "true" : "false");
  } catch {}
}
