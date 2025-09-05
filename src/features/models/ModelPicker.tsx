import React, { useMemo, useState } from "react";
import { Sheet } from "../../components/ui/Sheet";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useToasts } from "../../components/ui/Toast";
import { Icon } from "../../components/ui/Icon";
import { cn } from "../../lib/utils/cn";
import { useModels, type Model } from "./state";
import type { Filters, Tag } from "./modelFilters";
import { filterModels } from "./modelFilters";
import "../../styles/models.css";

export interface ModelPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value?: string;
  onChange?: (id: string) => void;
  recommended?: string[];
  onOpenSettings?: () => void;
  maxPriceUsdPerMTokDefault?: number;
}

const DEFAULT_RECO: string[] = [
  "qwen/qwen-2.5-coder-14b-instruct",
  "mistralai/mistral-nemo",
  "nousresearch/nous-hermes-2-mixtral",
];

function byId(models: Model[], id?: string) {
  if (!id) return undefined;
  return models.find((m) => m.id === id);
}

// Hilfsfunktion: erzeugt Filters-Objekt OHNE keys mit undefined
function makeFilters(defaultCap?: number): Filters {
  const base: Filters = {
    q: "",
    tags: { free: false, code: true, chat: true, long: false, nsfw: false, vision: false },
  };
  if (typeof defaultCap === "number" && Number.isFinite(defaultCap)) {
    base.maxPriceUsdPerMTok = defaultCap;
  }
  return base;
}

export const ModelPicker: React.FC<ModelPickerProps> = ({
  open,
  onOpenChange,
  value,
  onChange,
  recommended = DEFAULT_RECO,
  onOpenSettings,
  maxPriceUsdPerMTokDefault,
}) => {
  const { push } = useToasts();
  const { models, loading, error, source, refresh } = useModels();

  const [f, setF] = useState<Filters>(() => makeFilters(maxPriceUsdPerMTokDefault));

  const selected = byId(models, value);
  const reco = useMemo(
    () => recommended.map((id) => models.find((m) => m.id === id)).filter(Boolean) as Model[],
    [models, recommended],
  );

  const adv = useMemo(() => {
    const rest = models.filter((m) => !reco.some((r) => r.id === m.id));
    return filterModels(rest, f);
  }, [models, reco, f]);

  const anyKey = useMemo(() => {
    return !!(localStorage.getItem("openrouter_key") || localStorage.getItem("OPENROUTER_API_KEY"));
  }, [open, models.length]);

  function onPick(id: string) {
    onChange?.(id);
    onOpenChange(false);
    const m = byId(models, id);
    if (m) {
      push({ kind: "success", title: "Modell ausgewählt", message: m.label ?? m.id });
    }
  }

  // Hilfsupdate: setzt Cap oder entfernt das Feld
  function setPriceCap(val: string) {
    const num = val ? Number(val) : NaN;
    setF((prev) => {
      const next: Filters = { q: prev.q, tags: { ...prev.tags } };
      if (Number.isFinite(num)) next.maxPriceUsdPerMTok = num;
      return next;
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Modellauswahl" side="bottom">
      <div className="models-header px-3 py-2">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <div>
              Quelle:{" "}
              <span className="font-medium">
                {source === "openrouter"
                  ? "OpenRouter (live)"
                  : source === "public"
                    ? "/models.json"
                    : source === "memory"
                      ? "Cache"
                      : source === "builtin"
                        ? "Eingebaut"
                        : "unbekannt"}
              </span>
              {error ? <span className="ml-2 text-destructive">– Fehler: {error}</span> : null}
            </div>
            <div className="model-actions">
              <Button variant="secondary" size="sm" onClick={refresh} aria-label="Aktualisieren">
                <Icon name="info" className="mr-2" /> Aktualisieren
              </Button>
            </div>
          </div>

          {/* Suche + Filter */}
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:gap-3">
            <div className="flex-1">
              <Input
                label="Suche"
                placeholder="Modellname, Anbieter, Tags…"
                value={f.q}
                onChange={(e) => setF({ ...f, q: e.target.value })}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["free", "code", "chat", "long", "nsfw", "vision"] as Tag[]).map((t) => (
                <label key={t} className="filter-chip">
                  <input
                    type="checkbox"
                    checked={!!f.tags[t]}
                    onChange={(e) => setF({ ...f, tags: { ...f.tags, [t]: e.target.checked } })}
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
            <div className="w-full md:w-64">
              <Select
                label="Preisobergrenze (USD / 1M Tokens)"
                value={String(f.maxPriceUsdPerMTok ?? "")}
                onChange={(e) => setPriceCap(e.target.value)}
                options={[
                  { value: "", label: "Keine Grenze" },
                  { value: "100", label: "≤ $100" },
                  { value: "300", label: "≤ $300" },
                  { value: "600", label: "≤ $600" },
                  { value: "1000", label: "≤ $1k" },
                ]}
                placeholder="auswählen…"
              />
            </div>
          </div>

          {!anyKey && source !== "public" && source !== "builtin" ? (
            <div className="text-sm">
              <div className="model-row p-3">
                <div className="font-medium">Kein OpenRouter-API-Key gefunden.</div>
                <div className="meta mt-1">
                  Hinterlege den Key, um die Live-Modellliste zu laden.
                </div>
                <div className="mt-2">
                  <Button
                    variant="primary"
                    onClick={onOpenSettings}
                    aria-label="Zu den Einstellungen"
                  >
                    Zu den Einstellungen
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* EMPFOHLEN */}
      <section className="mx-auto w-full max-w-5xl px-3 py-3">
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Empfohlen</h2>
        {loading && !reco.length ? (
          <div className="text-sm text-muted-foreground">Lade Modelle…</div>
        ) : reco.length ? (
          <div className="grid grid-cols-1 gap-2">
            {reco.map((m) => (
              <article key={m.id} className="model-row p-3">
                <header className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{m.label ?? m.id}</div>
                    <div className="meta">{m.id}</div>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onPick(m.id)}
                    aria-label="Dieses Modell wählen"
                  >
                    Auswählen
                  </Button>
                </header>
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-muted-foreground">
                    Details
                  </summary>
                  <div className="mt-2">
                    <small className="text-muted-foreground">
                      Kontext: {m.context ? `${m.context.toLocaleString()} Tokens` : "k. A."}
                    </small>
                    {m.tags?.length ? (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {m.tags.map((t) => (
                          <span key={t} className="model-badge">
                            {t}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </details>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Keine empfohlenen Modelle gefunden.</div>
        )}
      </section>

      {/* ERWEITERT */}
      <section className="mx-auto w-full max-w-5xl px-3 pb-4">
        <h2 className="mb-2 text-sm font-semibold text-muted-foreground">Erweitert</h2>
        {loading && !adv.length ? (
          <div className="text-sm text-muted-foreground">Lade Modelle…</div>
        ) : adv.length ? (
          <div className="grid grid-cols-1 gap-2">
            {adv.map((m) => (
              <article key={m.id} className="model-row p-3">
                <header className="flex items-center justify-between gap-2">
                  <div>
                    <div className="font-medium">{m.label ?? m.id}</div>
                    <div className="meta">{m.id}</div>
                  </div>
                  <div className="model-actions">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onPick(m.id)}
                      aria-label="Wählen"
                    >
                      Wählen
                    </Button>
                  </div>
                </header>
                {m.description ? (
                  <p className="mt-2 text-sm leading-relaxed">{m.description}</p>
                ) : null}
                {m.tags?.length ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {m.tags.map((t) => (
                      <span key={t} className="model-badge">
                        {t}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">Keine Treffer mit aktuellen Filtern.</div>
        )}
      </section>
    </Sheet>
  );
};
