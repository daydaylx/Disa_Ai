/* eslint-disable no-empty */
import * as React from "react";

export interface TemplateEntry {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  system: string;
  allow?: string[]; // optional: Modell-IDs, evtl. mit Suffixen wie ":free"
}

interface StylesFileA {
  styles: TemplateEntry[];
}
interface StylesFileB {
  templates: TemplateEntry[]; // Fallback-Variante
}

const LS_TEMPLATE_ID = "disa:style:templateId";
function lsKeyForOverride(id: string): string {
  return `disa:style:override:${id}`;
}

function safeGetItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSetItem(key: string, val: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, val);
  } catch {}
}
function safeRemoveItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {}
}

function stripSuffix(id: string): string {
  const idx = id.indexOf(":");
  return idx >= 0 ? id.slice(0, idx) : id;
}

function normalizeTemplates(arr: unknown): TemplateEntry[] {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((x) => {
      const o = x as Record<string, unknown>;
      return (
        !!o &&
        typeof o.id === "string" &&
        typeof o.name === "string" &&
        typeof o.system === "string"
      );
    })
    .map((t: Partial<TemplateEntry>) => {
      const base: TemplateEntry = {
        id: String(t.id),
        name: String(t.name),
        system: String(t.system),
      };
      if (typeof t.description === "string") base.description = t.description;
      if (Array.isArray(t.tags)) base.tags = t.tags.filter((z: unknown) => typeof z === "string");
      if (Array.isArray(t.allow)) base.allow = t.allow.filter((z: unknown) => typeof z === "string");
      return base;
    });
}

/** Fix: harte ID + Objekt, keine unsicheren [0]-Zugriffe */
const FALLBACK_TEMPLATE_ID = "no-filter-de" as const;
const FALLBACK_TEMPLATE: TemplateEntry = {
  id: FALLBACK_TEMPLATE_ID,
  name: "No-Filter (DE, direkt)",
  system:
    "Du antwortest direkt, ehrlich, ohne Floskeln. Fokus auf Risiken, Schwächen, realistische Einschätzungen. Deutsch, Du-Form.",
  allow: ["mistral/mistral-7b-instruct"],
};
const FALLBACK_TEMPLATES: Readonly<TemplateEntry[]> = Object.freeze([FALLBACK_TEMPLATE]);

export interface UseStyleTemplateState {
  list: TemplateEntry[];
  loading: boolean;
  error: string | null;

  templateId: string;
  setTemplateId: (id: string) => void;

  selected: TemplateEntry | undefined;
  systemText: string;
  setSystemText: (text: string) => void;

  /** normalisierte Modell-IDs aus allow (Suffixe entfernt) */
  allowedModelIds: string[];
  /** true, wenn irgendein allow-Eintrag explizit ":free" markiert war */
  preferFreeHint: boolean;

  reload: () => void;
}

/**
 * Lädt Templates aus /styles.json (primär) oder /style.json (Fallback).
 * Erwartete Schemata:
 *  A) { "styles": [ {id,name,system,description?,tags?,allow?[]} ] }
 *  B) { "templates": [ ... ] }   // ältere Variante
 */
export function useStyleTemplate(defaultId: string = FALLBACK_TEMPLATE_ID): UseStyleTemplateState {
  const [list, setList] = React.useState<TemplateEntry[]>(() => [...FALLBACK_TEMPLATES]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const [templateId, setTemplateIdState] = React.useState<string>(() => {
    return safeGetItem(LS_TEMPLATE_ID) ?? defaultId;
  });

  const selected = React.useMemo(
    () => list.find((t) => t.id === templateId) ?? list[0],
    [list, templateId],
  );

  const [systemText, setSystemTextState] = React.useState<string>(() => {
    const ov = safeGetItem(lsKeyForOverride(templateId));
    if (ov !== null) return ov;
    const sel = list.find((t) => t.id === templateId) ?? list[0];
    return sel ? sel.system : "";
  });

  const setTemplateId = React.useCallback(
    (id: string) => {
      setTemplateIdState(id);
      safeSetItem(LS_TEMPLATE_ID, id);
      const ov = safeGetItem(lsKeyForOverride(id));
      const base = (list.find((t) => t.id === id) ?? list[0])?.system ?? "";
      setSystemTextState(ov !== null ? ov : base);
    },
    [list],
  );

  const setSystemText = React.useCallback(
    (text: string) => {
      setSystemTextState(text);
      const key = lsKeyForOverride(templateId);
      const base = (list.find((t) => t.id === templateId) ?? list[0])?.system ?? "";
      if (text.trim() === base.trim()) {
        safeRemoveItem(key);
      } else {
        safeSetItem(key, text);
      }
    },
    [templateId, list],
  );

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const tryPaths = ["/styles.json", "/style.json"];
    let lastErr: string | null = null;
    for (const path of tryPaths) {
      try {
        const res = await fetch(path, { cache: "no-store" });
        if (!res.ok) {
          lastErr = `HTTP ${res.status} bei ${path}`;
          continue;
        }
        const json = (await res.json()) as Partial<StylesFileA & StylesFileB>;
        const arr = Array.isArray((json as StylesFileA).styles)
          ? (json as StylesFileA).styles
          : Array.isArray((json as StylesFileB).templates)
            ? (json as StylesFileB).templates
            : [];
        const next = normalizeTemplates(arr);
        if (next.length > 0) {
          setList(next);
          // Auswahl validieren
          const exists = next.some((t) => t.id === templateId);
          const first = next.at(0);
          const nextSel = exists ? templateId : first ? first.id : FALLBACK_TEMPLATE_ID;
          if (!exists) {
            setTemplateIdState(nextSel);
            safeSetItem(LS_TEMPLATE_ID, nextSel);
          }
          const ov = safeGetItem(lsKeyForOverride(nextSel));
          const base = (next.find((t) => t.id === nextSel) ?? first ?? FALLBACK_TEMPLATE).system;
          setSystemTextState(ov !== null ? ov : base);
          setLoading(false);
          setError(null);
          return;
        }
        lastErr = `Leere Liste in ${path}`;
      } catch (e: unknown) {
        lastErr = `Fehler beim Laden ${path}: ${String(e)}`;
      }
    }
    // Fallback
    setList([...FALLBACK_TEMPLATES]);
    const nextSel = FALLBACK_TEMPLATE_ID;
    setTemplateIdState(nextSel);
    safeSetItem(LS_TEMPLATE_ID, nextSel);
    const ov = safeGetItem(lsKeyForOverride(nextSel));
    setSystemTextState(ov !== null ? ov : FALLBACK_TEMPLATE.system);
    setLoading(false);
    setError(lastErr);
  }, [templateId]);

  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = React.useCallback(() => {
    void load();
  }, [load]);

  // allow normalisieren + Hint für :free
  const allowedModelIds = React.useMemo<string[]>(
    () => Array.from(new Set((selected?.allow ?? []).map(stripSuffix))),
    [selected],
  );
  const preferFreeHint = React.useMemo<boolean>(
    () => (selected?.allow ?? []).some((x) => typeof x === "string" && x.endsWith(":free")),
    [selected],
  );

  return {
    list,
    loading,
    error,
    templateId,
    setTemplateId,
    selected,
    systemText,
    setSystemText,
    allowedModelIds,
    preferFreeHint,
    reload,
  };
}
