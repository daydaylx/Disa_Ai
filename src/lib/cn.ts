// src/lib/cn.ts
<<<<<<< HEAD

=======
>>>>>>> 1b03054 (fix(build): parenthesize nullish-coalescing before logical OR in Chat.tsx)
export type ClassPrimitive = string | number | null | undefined | false;
export type ClassDictionary = Record<string, boolean | null | undefined>;
export type ClassValue = ClassPrimitive | ClassDictionary | ClassValue[];

/**
 * cn(...): einfache Klassen-Join-Funktion ohne Dependencies.
 * - Strings/Numbers werden übernommen
<<<<<<< HEAD
 * - falsy Werte (false/null/undefined/""/0) werden ignoriert
 * - Arrays werden rekursiv aufgelöst
 * - Objekte als { "klasse": boolean } interpretiert
 * Reihenfolge bleibt erhalten (wichtig für Tailwind).
=======
 * - falsy (false/null/undefined/""/0) ignoriert
 * - Arrays rekursiv
 * - Objekte als { "klasse": boolean }
 * Reihenfolge bleibt erhalten (Tailwind-Präzedenz).
>>>>>>> 1b03054 (fix(build): parenthesize nullish-coalescing before logical OR in Chat.tsx)
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
<<<<<<< HEAD

  return out.join(" ").replace(/\s+/g, " ").trim();
}

export default cn;
=======
  return out.join(" ").replace(/\s+/g, " ").trim();
}

export default cn;
>>>>>>> 1b03054 (fix(build): parenthesize nullish-coalescing before logical OR in Chat.tsx)
