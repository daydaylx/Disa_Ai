import * as React from "react";

export interface TemplateEntry {
  id: string;
  name: string;
  description?: string;
  tags?: string[];
  system: string;
}

interface StyleFile {
  templates: TemplateEntry[];
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
  } catch {
    /* noop */
  }
}
function safeRemoveItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

function initialTemplateId(defaultId: string): string {
  return safeGetItem(LS_TEMPLATE_ID) ?? defaultId;
}
function readOverride(id: string): string | null {
  return safeGetItem(lsKeyForOverride(id));
}
function writeOverride(id: string, text: string): void {
  const key = lsKeyForOverride(id);
  if (text.trim().length === 0) {
    safeRemoveItem(key);
    return;
  }
  safeSetItem(key, text);
}

function isTemplateEntry(x: unknown): x is TemplateEntry {
  const o = x as Record<string, unknown>;
  return !!o && typeof o.id === "string" && typeof o.name === "string" && typeof o.system === "string";
}
function normalizeTemplates(arr: unknown): TemplateEntry[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter(isTemplateEntry).map((t) => ({
    id: t.id,
    name: t.name,
    system: t.system,
    description: typeof t.description === "string" ? t.description : undefined,
    tags: Array.isArray(t.tags) ? t.tags.filter((x) => typeof x === "string") : undefined,
  }));
}

/** Fallback, falls /style.json fehlt – minimal, kein Platzhalter-Spam */
const FALLBACK_TEMPLATES: Readonly<TemplateEntry[]> = Object.freeze([
  {
    id: "no-filter-de",
    name: "No-Filter (DE, direkt)",
    system:
      "Du antwortest direkt, ehrlich, ohne Floskeln. Fokus auf Risiken, Schwächen, realistische Einschätzungen. Deutsch, Du-Form.",
  },
]);

export interface UseStyleTemplateState {
  list: TemplateEntry[];
  loading: boolean;
  error: string | null;

  templateId: string;
  setTemplateId: (id: string) => void;

  selected: TemplateEntry | undefined;
  systemText: string;
  setSystemText: (text: string) => void;

  reload: () => void;
}

/**
 * Lädt Templates aus /style.json (public). Persistiert Auswahl und pro-Template Overrides.
 * /style.json Schema:
 * {
 *   "templates": [{ "id": "no-filter-de", "name": "No-Filter", "system": "..." , "description": "...", "tags": ["de"] }]
 * }
 */
export function useStyleTemplate(defaultId: string = FALLBACK_TEMPLATES[0].id): UseStyleTemplateState {
  const [list, setList] = React.useState<TemplateEntry[]>(() => [...FALLBACK_TEMPLATES]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const [templateId, setTemplateIdState] = React.useState<string>(() => initialTemplateId(defaultId));
  const selected = React.useMemo(
    () => list.find((t) => t.id === templateId) ?? list[0],
    [list, templateId]
  );

  const [systemText, setSystemTextState] = React.useState<string>(() => {
    const ov = readOverride(templateId);
    if (ov !== null) return ov;
    const sel = list.find((t) => t.id === templateId) ?? list[0];
    return sel ? sel.system : "";
  });

  const setTemplateId = React.useCallback((id: string) => {
    setTemplateIdState(id);
    safeSetItem(LS_TEMPLATE_ID, id);
    const ov = readOverride(id);
    const base = list.find((t) => t.id === id)?.system ?? "";
    setSystemTextState(ov !== null ? ov : base);
  }, [list]);

  const setSystemText = React.useCallback((text: string) => {
    setSystemTextState(text);
    writeOverride(templateId, text);
    const base = list.find((t) => t.id === templateId)?.system ?? "";
    // Wenn Override == Basis, Override entfernen (sauber halten)
    if (text === base) {
      safeRemoveItem(lsKeyForOverride(templateId));
    }
  }, [templateId, list]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    const ctrl = new AbortController();
    try {
      const res = await fetch("/style.json", { signal: ctrl.signal, cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as Partial<StyleFile>;
      const next = normalizeTemplates(json?.templates);
      if (next.length > 0) {
        setList(next);
        // Auswahl validieren
        const exists = next.some((t) => t.id === templateId);
        const nextSel = exists ? templateId : next[0].id;
        if (!exists) {
          setTemplateIdState(nextSel);
          safeSetItem(LS_TEMPLATE_ID, nextSel);
        }
        // Systemtext für (neuen) Selektor aktualisieren
        const ov = readOverride(nextSel);
        const base = next.find((t) => t.id === nextSel)?.system ?? "";
        setSystemTextState(ov !== null ? ov : base);
      } else {
        // Leere Datei → Fallback behalten
        setList([...FALLBACK_TEMPLATES]);
        const nextSel = FALLBACK_TEMPLATES[0].id;
        setTemplateIdState(nextSel);
        safeSetItem(LS_TEMPLATE_ID, nextSel);
        const ov = readOverride(nextSel);
        setSystemTextState(ov !== null ? ov : FALLBACK_TEMPLATES[0].system);
      }
    } catch (e: unknown) {
      setError(`Konnte /style.json nicht laden: ${String(e)}`);
      setList([...FALLBACK_TEMPLATES]);
      const nextSel = FALLBACK_TEMPLATES[0].id;
      setTemplateIdState(nextSel);
      safeSetItem(LS_TEMPLATE_ID, nextSel);
      const ov = readOverride(nextSel);
      setSystemTextState(ov !== null ? ov : FALLBACK_TEMPLATES[0].system);
    } finally {
      setLoading(false);
    }
    return () => ctrl.abort();
  }, [templateId]);

  // initial laden
  React.useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reload = React.useCallback(() => { void load(); }, [load]);

  return {
    list,
    loading,
    error,
    templateId,
    setTemplateId,
    selected,
    systemText,
    setSystemText,
    reload,
  };
}
