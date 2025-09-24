import React from "react";
import { Link } from "react-router-dom";

import { Field } from "../components/form/Field";
import { Input } from "../components/form/Input";
import { Select } from "../components/form/Select";
import { Switch } from "../components/form/Switch";
import { ApiError, AuthError, listModels, ORModel, RateLimitError } from "../services/openrouter";
import { useSettings } from "../state/settings";

type Opt = { value: string; label: string; disabled?: boolean };

export const Settings: React.FC = () => {
  const {
    settings,
    setApiKey,
    clearKey,
    setStream,
    setShowTokens,
    setMaxTokens,
    setModel,
    setPersistHistory,
  } = useSettings();

  const [localKey, setLocalKey] = React.useState(settings.apiKey);
  const [showKey, setShowKey] = React.useState(false);
  const [localMax, setLocalMax] = React.useState(String(settings.maxTokens));

  const [models, setModels] = React.useState<Opt[]>([{ value: "auto", label: "Auto" }]);
  const [loadingModels, setLoadingModels] = React.useState(false);
  const [modelError, setModelError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function run() {
      setLoadingModels(true);
      setModelError(null);
      try {
        const data: ORModel[] = await listModels(settings.apiKey);
        if (!mounted) return;
        const opts: Opt[] = [{ value: "auto", label: "Auto" }].concat(
          data.map((m) => ({ value: m.id, label: m.name ? `${m.name} (${m.id})` : m.id })),
        );
        setModels(opts);
      } catch (e: any) {
        if (!mounted) return;
        if (e instanceof AuthError) setModelError("API-Key fehlt oder ist ungültig.");
        else if (e instanceof RateLimitError)
          setModelError("Rate Limit erreicht. Später erneut versuchen.");
        else if (e instanceof ApiError) setModelError(`API-Fehler: ${e.message}`);
        else setModelError("Unbekannter Fehler beim Laden der Modelle.");
      } finally {
        if (mounted) setLoadingModels(false);
      }
    }
    void run();
    return () => {
      mounted = false;
    };
  }, [settings.apiKey]);

  const saveKey = () => setApiKey(localKey);
  const clear = () => {
    clearKey();
    setLocalKey("");
  };
  const saveMax = () => {
    const n = Number(localMax);
    if (Number.isFinite(n) && n > 0) setMaxTokens(n);
  };

  return (
    <div className="min-h-dvh bg-bg p-4 text-white">
      <header className="mb-4 flex h-14 items-center justify-between">
        <h2 className="font-semibold">Settings</h2>
        <Link className="text-sm opacity-80 hover:opacity-100" to="/chat">
          Zurück zum Chat
        </Link>
      </header>

      <div className="max-w-lg space-y-6">
        <section className="card space-y-4 p-4">
          <h3 className="font-semibold">Zugang</h3>
          <Field
            label="OpenRouter API-Key (Session)"
            hint={
              <>
                Wird nur in <code>sessionStorage</code> gehalten.
              </>
            }
          >
            <div className="flex gap-2">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                placeholder="sk-or-v1-…"
                data-testid="api-key"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="btn-ghost w-24"
                type="button"
                data-testid="toggle-key-visibility"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
          </Field>
          <div className="flex gap-3">
            <button onClick={saveKey} className="btn-primary" data-testid="save-key">
              Speichern
            </button>
            <button onClick={clear} className="btn-ghost" data-testid="clear-key">
              Löschen
            </button>
          </div>
        </section>

        <section className="card space-y-4 p-4">
          <h3 className="font-semibold">Verhalten</h3>
          <Field label="Streaming">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                Antworten während der Generierung anzeigen
              </span>
              <Switch checked={settings.stream} onChange={setStream} id="stream" />
            </div>
          </Field>
          <Field label="Tokenanzeige">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                Tokenzahlen einblenden (falls verfügbar)
              </span>
              <Switch checked={settings.showTokens} onChange={setShowTokens} id="show-tokens" />
            </div>
          </Field>
          <Field label="Max Tokens">
            <div className="flex items-center gap-2">
              <Input
                id="max-tokens"
                type="number"
                min={1}
                step={1}
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="max-w-[10rem]"
                data-testid="max-tokens"
              />
              <button onClick={saveMax} className="btn-ghost">
                Übernehmen
              </button>
              <span className="text-xs text-white/60">Aktuell: {settings.maxTokens}</span>
            </div>
          </Field>
          <Field
            label="Verlauf dauerhaft speichern"
            hint="Speichert Chat-Verlauf im Browser (localStorage)."
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">Sitzungsübergreifend behalten</span>
              <Switch
                checked={settings.persistHistory}
                onChange={setPersistHistory}
                id="persist-history"
              />
            </div>
          </Field>
        </section>

        <section className="card space-y-3 p-4">
          <h3 className="font-semibold">Modell</h3>
          <Field label="Model">
            <Select id="model" value={settings.model} onChange={setModel} options={models} />
          </Field>
          {loadingModels ? (
            <p className="text-xs text-white/60">Lade Modelle…</p>
          ) : modelError ? (
            <p className="text-xs text-danger-500">{modelError}</p>
          ) : (
            <p className="text-xs text-white/60">
              Aus OpenRouter geladen. Auswahl wird im Chat verwendet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
