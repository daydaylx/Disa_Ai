import React from "react";
import { PersonaContext, type PersonaData, type PersonaModel, type PersonaStyle } from "./persona";

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<PersonaData>({ models: [], styles: [] });
  const [warnings, setWarnings] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => { void loadPersona(); }, []);

  async function tryFetchJSON(url: string): Promise<unknown | null> {
    try { const r = await fetch(url, { cache: "no-cache" }); if (!r.ok) return null; return await r.json(); } catch { return null; }
  }

  function validatePersona(input: unknown): { models: PersonaModel[]; styles: PersonaStyle[]; warnings: string[] } {
    const W: string[] = []; const models: PersonaModel[] = []; const styles: PersonaStyle[] = [];
    const MODEL_ID_RE = /^[a-z0-9._-]+(?:\/[a-z0-9._-]+)+$/i;
    const STYLE_ID_RE = /^[a-z0-9][a-z0-9._-]{1,63}$/i;

    if (Array.isArray(input?.models)) {
      const seen = new Set<string>();
      for (let i = 0; i < input.models.length; i++) {
        const m = input.models[i];
        const id = typeof m.id === "string" ? m.id.trim() : "";
        const label = typeof m.label === "string" ? m.label.trim() : "";
        if (!id || !MODEL_ID_RE.test(id)) { W.push(`Modell ${i}: ungültige id "${id}"`); continue; }
        if (!label || label.length > 64) { W.push(`Modell ${i}: ungültiges Label`); continue; }
        if (seen.has(id)) { W.push(`Modell ${i}: doppelte id "${id}"`); continue; }
        seen.add(id);
        const out: PersonaModel = { id, label };
        if (Array.isArray(m.tags)) out.tags = m.tags.filter((t: unknown) => typeof t === "string");
        if (typeof m.context === "number") out.context = m.context;
        models.push(out);
      }
    }
    if (Array.isArray(input?.styles)) {
      const seen = new Set<string>();
      for (let j = 0; j < input.styles.length; j++) {
        const s = input.styles[j];
        const id = typeof s.id === "string" ? s.id.trim() : "";
        const name = typeof s.name === "string" ? s.name.trim() : "";
        const system = typeof s.system === "string" ? s.system.trim() : "";
        const hint = typeof s.hint === "string" ? s.hint.trim() : "";
        const allow = Array.isArray(s.allow) ? s.allow.filter((x:any)=>typeof x==="string") : undefined;
        const deny  = Array.isArray(s.deny)  ? s.deny .filter((x:any)=>typeof x==="string") : undefined;

        const errs: string[] = [];
        if (!id || !STYLE_ID_RE.test(id)) errs.push("ungültige id");
        if (seen.has(id)) errs.push("doppelte id");
        if (name.length < 1 || name.length > 64) errs.push("Name Länge ungültig");
        if (system.length < 1 || system.length > 4000) errs.push("Systemprompt Länge ungültig");
        if (allow && deny) errs.push("allow und deny gleichzeitig");

        if (errs.length) { warnings.push(`Stil ${j} (${id||"?"}) übersprungen: ${errs.join(", ")}`); continue; }
        seen.add(id);
        const out: PersonaStyle = { id, name, system };
        if (hint) out.hint = hint; if (allow) out.allow = allow; if (deny) out.deny = deny;
        styles.push(out);
      }
    }
    if (styles.length === 0) {
      W.push("Keine gültigen Stile – Default aktiv.");
      styles.push({ id:"neutral", name:"Sachlich", system:"Kurz, präzise, Deutsch." });
    }
    return { models, styles, warnings: W };
  }

  async function loadPersona() {
    setWarnings([]); setError(null);
    try {
      let data: unknown | null =
        await tryFetchJSON("/persona.json") ??
        await tryFetchJSON("/personas.json") ??
        await tryFetchJSON("/data/personas.json");

      if (!data) throw new Error("not_found");
      const v = validatePersona(data);
      setData({ models: v.models, styles: v.styles });
      if (v.warnings.length) setWarnings(v.warnings);
    } catch {
      setData({ models: [], styles: [{ id:"neutral", name:"Sachlich", system:"Kurz, präzise, Deutsch." }]});
      setError("Konfiguration nicht geladen – Standardwerte aktiv.");
    }
  }

  return (
    <PersonaContext.Provider value={{ data, warnings, error, reload: loadPersona }}>
      {children}
    </PersonaContext.Provider>
  );
}
