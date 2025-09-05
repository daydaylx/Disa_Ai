export type Theme = "system" | "light" | "dark";

export interface AppSettings {
  theme: Theme;
  language: "de";
  defaultModelId?: string;  // optional → NICHT mit undefined setzen
  openrouterKey?: string;   // optional → NICHT mit undefined setzen
}

export function validateSettings(input: Partial<AppSettings>):
  | { ok: true; value: AppSettings }
  | { ok: false; error: string } {

  const out: AppSettings = {
    theme: "system",
    language: "de"
  };

  if (input.theme) {
    if (input.theme === "system" || input.theme === "light" || input.theme === "dark") {
      out.theme = input.theme;
    } else {
      return { ok: false, error: "Ungültiges Theme" };
    }
  }

  // Sprache fest auf "de"
  if (typeof input.defaultModelId === "string" && input.defaultModelId.trim()) {
    out.defaultModelId = input.defaultModelId.trim();
  }
  if (typeof input.openrouterKey === "string" && input.openrouterKey.trim()) {
    out.openrouterKey = input.openrouterKey.trim();
  }

  return { ok: true, value: out };
}
