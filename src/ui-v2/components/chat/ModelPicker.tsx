import React from "react";

import { ApiError, AuthError, listModels, RateLimitError } from "../../services/openrouter";
import { useSettings } from "../../state/settings";

// Lokale Type-Definition für bessere Kompatibilität
type ORModel = {
  id: string;
  name?: string;
  context_length?: number;
  pricing?: { prompt?: number; completion?: number; unit?: string } | null;
  tags?: string[];
  description?: string;
  provider?: string;
};

export const ModelPicker: React.FC = () => {
  const { settings, setModel } = useSettings();
  const [models, setModels] = React.useState<{ value: string; label: string }[]>([
    { value: "auto", label: "Auto" },
  ]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function run() {
      setLoading(true);
      setError(null);
      try {
        const data: ORModel[] = await listModels(settings.apiKey);
        if (!mounted) return;
        const opts = [{ value: "auto", label: "Auto" }].concat(
          data.map((m) => ({ value: m.id, label: m.name ? `${m.name} (${m.id})` : m.id })),
        );
        setModels(opts);
      } catch (e: any) {
        if (!mounted) return;
        if (e instanceof AuthError) setError("Key fehlt/ungültig");
        else if (e instanceof RateLimitError) setError("Rate-Limit");
        else if (e instanceof ApiError) setError(e.message);
        else setError("Fehler");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    run();
    return () => {
      mounted = false;
    };
  }, [settings.apiKey]);

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="opacity-70">Model</span>
      <select
        value={settings.model}
        onChange={(e) => setModel(e.target.value)}
        disabled={loading}
        className="h-8 rounded-lg border border-white/15 bg-white/5 px-2 outline-none focus:border-accent-400"
        title={error ?? (loading ? "Lade Modelle…" : "Modellauswahl")}
      >
        {models.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-danger-500">{error}</span> : null}
    </label>
  );
};
