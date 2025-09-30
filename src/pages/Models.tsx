import { Loader2, Search } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

import { getModelFallback } from "../api/openrouter";
import { useStudio } from "../app/state/StudioContext";
import { PersonaSelector } from "../components/chat/PersonaSelector";
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
  if (price === undefined || price === null || typeof price !== "number") return "unbekannt";
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
  const { activePersona, setActivePersona } = useStudio();
  const [models, setModels] = useState<ModelEntry[]>([]);
  const [selected, setSelected] = useState<string>(
    getModelFallback() || "meta-llama/llama-3.3-70b-instruct:free",
  );
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<string[]>([]);
  const toasts = useToasts();

  const filterOptions = [
    { id: "free", label: "Kostenlos", count: models.filter((m) => m.pricing?.in === 0).length },
    {
      id: "coding",
      label: "Coding",
      count: models.filter((m) => m.tags?.includes("coding")).length,
    },
    { id: "fast", label: "Schnell", count: models.filter((m) => m.tags?.includes("fast")).length },
    {
      id: "large",
      label: "Large Context",
      count: models.filter((m) => (m.ctx || 0) > 100000).length,
    },
  ];

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
    let result = models;

    // Apply search filter
    const term = search.trim().toLowerCase();
    if (term) {
      result = result.filter((model) => {
        const haystack = [model.id, model.label, model.provider, ...(model.tags ?? [])]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(term);
      });
    }

    // Apply active filters
    if (filters.length > 0) {
      result = result.filter((model) => {
        return filters.every((filterId) => {
          switch (filterId) {
            case "free":
              return model.pricing?.in === 0;
            case "coding":
              return model.tags?.includes("coding");
            case "fast":
              return model.tags?.includes("fast");
            case "large":
              return (model.ctx || 0) > 100000;
            default:
              return true;
          }
        });
      });
    }

    return result;
  }, [models, search, filters]);

  const toggleFilter = (filterId: string) => {
    setFilters((prev) =>
      prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId],
    );
  };

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
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-white">Modelle & Rollen</h1>
        <p className="text-sm leading-relaxed text-white/60">
          Wähle ein KI-Modell und eine Rolle für optimale Ergebnisse
        </p>
      </header>

      {/* Rollenauswahl Section */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white/80">Chat-Rolle</h2>
        <PersonaSelector selectedPersona={activePersona} onPersonaChange={setActivePersona} />
      </section>

      {/* Modell-Suche Section */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-white/80">KI-Modell wählen</h2>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Modell oder Anbieter suchen..."
            className="focus:border-accent-500/50 border-white/20 bg-white/5 pl-10 text-white placeholder:text-white/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleFilter(option.id)}
              className={cn(
                "tap-target inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all",
                filters.includes(option.id)
                  ? "shadow-accent-500/25 bg-accent-500 text-white shadow-lg"
                  : "border border-white/20 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white",
              )}
            >
              {option.label}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  filters.includes(option.id) ? "bg-white/20" : "bg-white/10",
                )}
              >
                {option.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-sm text-white/60">
          Keine Modelle gefunden.
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto pb-4">
          {filtered.map((model) => (
            <Card
              key={model.id}
              role="button"
              tabIndex={0}
              data-testid="model-card"
              onClick={() => handleSelect(model)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  handleSelect(model);
                }
              }}
              className={cn(
                "border-white/20 bg-white/10 backdrop-blur transition-all",
                selected === model.id
                  ? "bg-accent-500/20 shadow-accent-500/25 border-accent-500 shadow-lg"
                  : "hover:border-white/30 hover:bg-white/20",
              )}
            >
              <CardHeader className="space-y-1 pb-3">
                <CardTitle className="text-base font-semibold text-white">
                  {model.label || model.id}
                </CardTitle>
                <CardDescription className="text-white/70">
                  {model.provider ?? "Unbekannter Anbieter"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Kontext</span>
                  <span className="font-medium text-white">{formatContext(model.ctx)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Prompt / Completion</span>
                  <span className="font-medium text-white">
                    {formatPrice(model.pricing?.in)} / {formatPrice(model.pricing?.out)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{SAFETY_LABELS[model.safety] ?? model.safety}</Badge>
                  {model.tags?.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {(model.tags?.length ?? 0) > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{(model.tags?.length ?? 0) - 3} weitere
                    </Badge>
                  )}
                </div>
                {selected === model.id ? (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full bg-accent-500 text-white"
                    disabled
                  >
                    ✓ Aktiv
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full border-0 bg-white/20 text-white hover:bg-white/30"
                  >
                    Auswählen
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
