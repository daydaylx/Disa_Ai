import React from "react";

import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Card, CardFooter,CardHeader } from "../components/Card";
import { Input, Textarea } from "../components/Input";
import { Select } from "../components/Select";
import { Shell } from "../components/Shell";
import { MODELS } from "../config/models";
import { usePersonaSelection } from "../config/personas";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useModel } from "../hooks/useModel";

export default function Settings() {
  const [apiKey, setApiKey] = useLocalStorage<string>("disa_api_key", "");
  const [note, setNote] = useLocalStorage<string>("disa_note", "");
  const [saved, setSaved] = React.useState<null | "ok" | "err">(null);

  const { model, setModel } = useModel();
  const [onlyFree, setOnlyFree] = useLocalStorage<boolean>("disa_filter_free", true);
  const [onlyOpen, setOnlyOpen] = useLocalStorage<boolean>("disa_filter_open", false);

  const filtered = React.useMemo(() => {
    return MODELS.filter(m => (onlyFree ? m.free : true) && (onlyOpen ? m.open : true));
  }, [onlyFree, onlyOpen]);

  const { personas, personaId, setPersonaId, active, loading: personasLoading } = usePersonaSelection();

  function save() {
    try {
      setSaved("ok");
      setTimeout(() => setSaved(null), 1500);
    } catch {
      setSaved("err");
      setTimeout(() => setSaved(null), 2000);
    }
  }

  return (
    <Shell>
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="OpenRouter API-Key" subtitle="Lokal im Browser gespeichert" />
          <div className="space-y-3">
            <Input placeholder="sk-or-…" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            <p className="text-sm text-zinc-400">Der Key wird nur lokal gespeichert. Kein Server.</p>
          </div>
          <CardFooter>
            <Button onClick={save}>Speichern</Button>
            {saved === "ok" && <span className="ml-3 text-sm text-green-400">Gespeichert.</span>}
            {saved === "err" && <span className="ml-3 text-sm text-red-400">Fehler beim Speichern.</span>}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader title="Modell-Auswahl" subtitle="Wir nutzen genau das hier gewählte Modell" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-zinc-300 select-none">
                <input type="checkbox" className="accent-fuchsia-500" checked={onlyFree} onChange={(e)=>setOnlyFree(e.target.checked)} />
                Nur kostenlose Modelle
              </label>
              <label className="flex items-center gap-2 text-sm text-zinc-300 select-none">
                <input type="checkbox" className="accent-fuchsia-500" checked={onlyOpen} onChange={(e)=>setOnlyOpen(e.target.checked)} />
                Offene Richtlinien
              </label>
            </div>
            <Select value={model} onChange={(e)=>setModel(e.target.value)}>
              {filtered.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </Select>
            <div className="flex flex-wrap gap-2">
              <Badge tone="green">free</Badge>
              <Badge tone="purple">open (uncensored)</Badge>
            </div>
            <p className="text-xs text-zinc-500">
              Tipp: Wenn ein freies Modell Rate-Limits hat, nimm ein anderes oder teste später.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader title="Stil (Systemprompt-Vorlage)" subtitle={personasLoading ? "Lade Vorlagen…" : "Wird als system vor jede Konversation gesendet"} />
          <div className="space-y-3">
            {personasLoading ? (
              <div className="text-sm text-zinc-400">Lade…</div>
            ) : personas.length === 0 ? (
              <div className="text-sm text-zinc-400">Keine Personas gefunden (es wird ein neutraler Fallback genutzt).</div>
            ) : (
              <>
                <Select value={personaId} onChange={(e)=>setPersonaId(e.target.value)}>
                  {personas.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </Select>
                {active && (
                  <div className="rounded-2xl bg-[#0f0f16] border border-white/10 p-3 max-h-56 overflow-auto">
                    <div className="text-xs text-zinc-400 mb-2">Vorschau</div>
                    <pre className="text-sm whitespace-pre-wrap text-zinc-200">{active.prompt}</pre>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        <Card>
          <CardHeader title="Notizen" subtitle="Einfacher lokaler Speicher" />
          <Textarea placeholder="Optional: kurze Notiz…" value={note} onChange={(e) => setNote(e.target.value)} />
        </Card>
      </div>
    </Shell>
  );
}
