// src/lib/cn.ts
export type ClassPrimitive = string | number | null | undefined | false;
export type ClassDictionary = Record<string, boolean | null | undefined>;
export type ClassValue = ClassPrimitive | ClassDictionary | ClassValue[];

/**
 * cn(...): einfache Klassen-Join-Funktion ohne Dependencies.
 * - Strings/Numbers werden übernommen
 * - falsy (false/null/undefined/""/0) ignoriert
 * - Arrays rekursiv
 * - Objekte als { "klasse": boolean }
 * Reihenfolge bleibt erhalten (Tailwind-Präzedenz).
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  const push = (v: ClassValue): void => {
    if (!v) return;

    if (typeof v === "string" || typeof v === "number") {
      const s = String(v).trim();
      if (s) out.push(s);
      return;
    }

    if (Array.isArray(v)) {
      for (const item of v) push(item);
      return;
    }

    if (typeof v === "object") {
      for (const [k, on] of Object.entries(v)) {
        if (on) out.push(k);
      }
      return;
    }
  };

  for (const v of values) push(v);
  return out.join(" ").replace(/\s+/g, " ").trim();
}

export default cn;
