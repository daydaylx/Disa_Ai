import { Loader2, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { getModelFallback } from "../api/openrouter";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { loadModelCatalog, type ModelEntry } from "../config/models";
import { cn } from "../lib/utils";

function formatContext(ctx?: number) {
  if (!ctx) return "Unbekannte Kontextlänge";
  if (ctx >= 1000000) return `${(ctx / 1000000).toFixed(1)} Mio. Token`;
  if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}k Token`;
  return `${ctx.toLocaleString()} Token`;
}

function formatPrice(price?: number) {
  if (price === undefined) return "unbekannt";
  if (price === 0) return "Kostenlos";
  return `$${price.toFixed(3)}/1k`;
}

const SAFETY_LABELS: Record<string, string> = {
  free: "Kostenlos",
  moderate: "Mittel",
  strict: "Strikt",
  any: "Unbekannt",
};

export default function ModelsPage() {
  const [models, setModels] = useState<ModelEntry[]>([]);
  const [selected, setSelected] = useState<string>(
    getModelFallback() || "meta-llama/llama-3.3-70b-instruct:free",
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const toasts = useToasts();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const catalog = await loadModelCatalog();
        if (!mounted) return;
        setModels(catalog);
      } catch {
        toasts.push({
          kind: "error",
          title: "Modelle konnten nicht geladen werden",
          message: "Bitte überprüfe deine Verbindung und versuche es erneut.",
        });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [toasts]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return models;
    return models.filter((model) => {
      const haystack = [model.id, model.label, model.provider, ...(model.tags ?? [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [models, search]);

  const handleSelect = (model: ModelEntry) => {
    setSelected(model.id);
    try {
      localStorage.setItem("disa_model", model.id);
    } catch {
      /* ignore */
    }
    toasts.push({
      kind: "success",
      title: "Modell gewählt",
      message: `${model.label || model.id} wird für neue Gespräche verwendet.`,
    });
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col gap-4 p-4">
      <header>
        <h1 className="text-2xl font-semibold text-on-surface">Modelle</h1>
        <p className="text-text-muted text-sm">
          Suche ein Modell aus dem Katalog und setze es als Standard für deine Chats.
        </p>
      </header>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nach Modellen oder Anbietern suchen"
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-text-muted flex flex-1 items-center justify-center text-sm">
          Keine Modelle gefunden.
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {filtered.map((model) => (
            <Card
              key={model.id}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(model)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSelect(model);
                }
              }}
              className={cn(
                "transition-all",
                selected === model.id ? "border-accent-500 shadow-md" : "hover:shadow-sm",
              )}
            >
              <CardHeader className="space-y-1 pb-3">
                <CardTitle className="text-base font-semibold">{model.label || model.id}</CardTitle>
                <CardDescription>{model.provider ?? "Unbekannter Anbieter"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Kontext</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {formatContext(model.ctx)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500">Prompt / Completion</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">
                    {formatPrice(model.pricing?.in)} / {formatPrice(model.pricing?.out)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{SAFETY_LABELS[model.safety] ?? model.safety}</Badge>
                  {model.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {model.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{model.tags.length - 3} weitere
                    </Badge>
                  )}
                </div>
                {selected === model.id ? (
                  <Button size="sm" variant="secondary" className="w-full" disabled>
                    Aktiv
                  </Button>
                ) : (
                  <Button size="sm" className="w-full">
                    Modell festlegen
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
