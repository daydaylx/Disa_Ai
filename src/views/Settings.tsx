import React from "react";
import { Shell } from "../components/Shell";
import { Card, CardHeader, CardFooter } from "../components/Card";
import { Input, Textarea } from "../components/Input";
import { Button } from "../components/Button";
import { useLocalStorage } from "../hooks/useLocalStorage";

export default function Settings() {
  const [apiKey, setApiKey] = useLocalStorage<string>("disa_api_key", "");
  const [note, setNote] = useLocalStorage<string>("disa_note", ""); // kleiner Notizblock – harmlos & lokal
  const [saved, setSaved] = React.useState<null | "ok" | "err">(null);

  function save() {
    try {
      // useLocalStorage speichert automatisch – Button dient nur für Feedback
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
            <Input
              placeholder="sk-or-…"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <p className="text-sm text-zinc-400">
              Der Key wird nur lokal im Browser gespeichert. Kein Server, kein Sync.
            </p>
          </div>
          <CardFooter>
            <Button onClick={save}>Speichern</Button>
            {saved === "ok" && <span className="ml-3 text-sm text-green-400">Gespeichert.</span>}
            {saved === "err" && <span className="ml-3 text-sm text-red-400">Fehler beim Speichern.</span>}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader title="Notizen" subtitle="Einfacher lokaler Speicher" />
          <Textarea placeholder="Optional: kurze Notiz…" value={note} onChange={(e) => setNote(e.target.value)} />
        </Card>
      </div>
    </Shell>
  );
}
