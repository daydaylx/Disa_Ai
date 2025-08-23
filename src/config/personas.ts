export type Persona = {
  id: string;
  label: string;
  prompt: string;
};

export type PersonaState = {
  personas: Persona[];
  loading: boolean;
  error: string | null;
};

const PERSONA_KEY = "disa_persona_id";

const FALLBACK_PERSONAS: Persona[] = [
  { id: "neutral", label: "Neutral (Standard)", prompt: "You are a helpful assistant. Be concise, precise, and avoid hallucinations." },
  { id: "coder_strict", label: "Coder Strict", prompt: "You are a senior software engineer. Prefer robust, tested, production-grade solutions. No placeholders. Point out risks directly." },
  { id: "creative_direct", label: "Kreativ Direkt", prompt: "Schreibe lebendig, aber klar. Keine Floskeln, kein Marketing. Fasse dich nicht unnötig kurz, aber werde nie schwafelig." }
];

// versucht mehrere bekannte Pfade
const CANDIDATE_URLS = ["/persona.json", "/personas.json"];

function coerceToPersonas(raw: any): Persona[] | null {
  try {
    if (!raw) return null;

    // Fall A: { personas: [...] }
    if (Array.isArray(raw?.personas)) {
      const list = raw.personas as any[];
      const mapped = list
        .map((p) => normalizeItem(p))
        .filter(Boolean) as Persona[];
      return mapped.length ? mapped : null;
    }

    // Fall B: { templates: [...] }
    if (Array.isArray(raw?.templates)) {
      const list = raw.templates as any[];
      const mapped = list
        .map((p) => normalizeItem(p))
        .filter(Boolean) as Persona[];
      return mapped.length ? mapped : null;
    }

    // Fall C: Array direkt
    if (Array.isArray(raw)) {
      const mapped = raw.map((p) => normalizeItem(p)).filter(Boolean) as Persona[];
      return mapped.length ? mapped : null;
    }

    // Fall D: Schlüssel auf oberster Ebene (objekt → ein Eintrag)
    if (raw && typeof raw === "object") {
      const single = normalizeItem(raw);
      if (single) return [single];
    }

    return null;
  } catch {
    return null;
  }
}

function normalizeItem(p: any): Persona | null {
  if (!p || typeof p !== "object") return null;

  const label = p.label || p.name || p.title || p.id || "Unbenannt";
  const id = (p.id || slugify(label)).toString();

  const prompt =
    p.prompt ||
    p.system ||
    p.system_prompt ||
    p.systemPrompt ||
    p.content ||
    (Array.isArray(p.messages)
      ? // manche definieren messages = [{role:'system', content:'...'}, ...]
        (p.messages.find((m: any) => m?.role === "system")?.content ?? "")
      : "");

  if (!prompt || typeof prompt !== "string") return null;
  return { id, label, prompt: prompt.trim() };
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function loadPersonas(): Promise<Persona[]> {
  for (const url of CANDIDATE_URLS) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const json = await res.json();
      const personas = coerceToPersonas(json);
      if (personas && personas.length) return personas;
    } catch {
      // weiter zum nächsten Kandidaten
    }
  }
  return FALLBACK_PERSONAS;
}

// --- Hooks ---

import * as React from "react";

export function usePersonas(): PersonaState {
  const [state, setState] = React.useState<PersonaState>({
    personas: [],
    loading: true,
    error: null
  });

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const personas = await loadPersonas();
        if (!alive) return;
        setState({ personas, loading: false, error: null });
      } catch (e: any) {
        if (!alive) return;
        setState({ personas: FALLBACK_PERSONAS, loading: false, error: e?.message ?? "Unbekannter Fehler" });
      }
    })();
    return () => { alive = false; };
  }, []);

  return state;
}

export function usePersonaSelection() {
  const { personas, loading } = usePersonas();
  const [personaId, setPersonaId] = React.useState<string>(() => {
    try { return localStorage.getItem(PERSONA_KEY) || ""; } catch { return ""; }
  });

  React.useEffect(() => {
    // wenn noch nichts gewählt und wir haben geladene Personas, standard auf erstes
    if (!loading && personas.length && !personaId) {
      setPersonaId(personas[0].id);
    }
  }, [loading, personas, personaId]);

  React.useEffect(() => {
    try { if (personaId) localStorage.setItem(PERSONA_KEY, personaId); } catch {}
  }, [personaId]);

  const active = React.useMemo(
    () => personas.find(p => p.id === personaId),
    [personas, personaId]
  );

  return { personas, personaId, setPersonaId, active, loading };
}
