import { Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { getModelFallback } from "../api/openrouter";
import { useStudio } from "../app/state/StudioContext";
import { RoleSelector } from "../components/chat/RoleSelector";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/Switch";
import { useToasts } from "../components/ui/toast/ToastsProvider";
import { VirtualList } from "../components/ui/VirtualList";
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

type LoadingState = "idle" | "loading" | "success" | "error" | "timeout";

export default function ModelsPage() {
  const { activeRole, setActiveRole } = useStudio();
  const [models, setModels] = useState<ModelEntry[]>([]);
  const [selected, setSelected] = useState<string>(
    getModelFallback() || "meta-llama/llama-3.3-70b-instruct:free",
  );
  const [search, setSearch] = useState("");
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [filters, setFilters] = useState<string[]>([]);
  const [showNsfw, setShowNsfw] = useState(false);
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
    let timeoutId: NodeJS.Timeout;

    const loadModels = async () => {
      if (loadingState === "loading") return; // Prevent duplicate calls

      setLoadingState("loading");
      setErrorMessage("");

      // Global timeout für die gesamte Operation
      timeoutId = setTimeout(() => {
        if (mounted) {
          setLoadingState("timeout");
          setErrorMessage(
            "Das Laden der Modelle dauert ungewöhnlich lange. Bitte überprüfe deine Internetverbindung.",
          );
        }
      }, 20000); // 20s globaler Timeout

      try {
        const catalog = await loadModelCatalog(undefined, toasts);

        if (!mounted) return;

        clearTimeout(timeoutId);
        setModels(catalog);
        setLoadingState("success");

        if (catalog.length === 0) {
          setErrorMessage("Keine Modelle verfügbar. Das System läuft im Offline-Modus.");
        }
      } catch (error) {
        if (!mounted) return;

        clearTimeout(timeoutId);
        setLoadingState("error");

        const errorMsg = error instanceof Error ? error.message : "Unbekannter Fehler";
        setErrorMessage(`Modelle konnten nicht geladen werden: ${errorMsg}`);

        toasts.push({
          kind: "error",
          title: "Lade-Fehler",
          message:
            "Modelle konnten nicht geladen werden. Versuche es erneut oder prüfe deine Verbindung.",
        });
      }
    };

    void loadModels();

    return () => {
      mounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toasts]); // einmaliger Call beim Mount

  const retryLoadModels = () => {
    setLoadingState("idle"); // Reset state to trigger reload
  };

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

    if (!showNsfw) {
      result = result.filter((model) => model.safety !== "strict");
    }

    return result;
  }, [models, search, filters, showNsfw]);

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

  // Render function for virtual list
  const renderModelCard = (model: ModelEntry) => (
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
      aria-pressed={selected === model.id}
      aria-label={`Modell ${model.label || model.id} auswählen`}
      className={cn(
        "mb-3 min-h-touch-rec border-white/20 bg-white/10 backdrop-blur transition-all",
        selected === model.id
          ? "bg-accent-500/20 shadow-accent-500/25 border-accent-500 shadow-lg"
          : "hover:border-white/30 hover:bg-white/20",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-corporate-text-primary">
            {model.label || model.id}
          </CardTitle>
          <CardDescription className="text-xs text-corporate-text-secondary">
            {model.provider || "Unbekannter Anbieter"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {selected === model.id && <div className="text-accent-400 h-4 w-4">✓</div>}
          {model.pricing?.in === 0 && (
            <Badge
              variant="secondary"
              className="border-green-500/30 bg-green-500/20 text-xs text-green-400"
            >
              Kostenlos
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-white/50">Kontext</p>
            <p className="text-white">{formatContext(model.ctx)}</p>
          </div>
          <div>
            <p className="text-white/50">Preis</p>
            <p className="text-white">{formatPrice(model.pricing?.in)}</p>
          </div>
        </div>
        {model.tags && model.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {model.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-white/20 text-xs text-corporate-text-secondary"
              >
                {tag}
              </Badge>
            ))}
            {model.tags.length > 3 && (
              <Badge
                variant="outline"
                className="border-white/20 text-xs text-corporate-text-secondary"
              >
                +{model.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col gap-4 p-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-white" data-testid="models-title">
          Modelle & Rollen
        </h1>
        <p className="text-sm leading-relaxed text-white/60">
          Wähle ein KI-Modell und eine Rolle für optimale Ergebnisse
        </p>
      </header>

      {/* Rollenauswahl Section */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-white/80">Chat-Rolle</h2>
        <RoleSelector selectedRole={activeRole} onRoleChange={setActiveRole} />
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
            data-testid="models-search"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleFilter(option.id)}
              data-testid={`models-filter-${option.id}`}
              className={cn(
                "inline-flex min-h-touch-rec items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all",
                filters.includes(option.id)
                  ? "shadow-accent-500/25 bg-accent-500 text-corporate-text-onAccent shadow-lg"
                  : "border border-white/20 bg-white/5 text-corporate-text-secondary hover:bg-white/10 hover:text-corporate-text-primary",
              )}
            >
              {option.label}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  filters.includes(option.id)
                    ? "bg-white/20 text-corporate-text-onAccent"
                    : "bg-white/10 text-corporate-text-secondary",
                )}
              >
                {option.count}
              </span>
            </button>
          ))}
          <div className="flex items-center space-x-2">
            <Switch id="nsfw-toggle" checked={showNsfw} onChange={setShowNsfw} />
            <Label htmlFor="nsfw-toggle">18+ anzeigen</Label>
          </div>
        </div>
      </section>

      {loadingState === "loading" ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-accent-500" />
            <p className="text-sm text-white/60">Lädt Modellkatalog...</p>
          </div>
        </div>
      ) : loadingState === "error" || loadingState === "timeout" ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="text-red-400">⚠️</div>
            <div className="space-y-2">
              <p className="text-sm text-white/80">Fehler beim Laden</p>
              <p className="max-w-xs text-xs text-white/60">{errorMessage}</p>
            </div>
            <button
              onClick={retryLoadModels}
              className="hover:bg-accent-600 min-h-touch-rec rounded-md bg-accent-500 px-4 py-2 text-sm font-medium text-corporate-text-onAccent transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-center text-sm text-white/60">
          <div>
            <p className="font-semibold text-white">Keine Modelle gefunden</p>
            <p className="mt-2">
              {models.length === 0
                ? "Es sind keine Modelle verfügbar. Bitte überprüfe deine Verbindung."
                : "Deine Suche ergab keine Treffer. Versuche es mit anderen Suchbegriffen oder Filtern."}
            </p>
          </div>
        </div>
      ) : (
        <VirtualList
          items={filtered}
          renderItem={renderModelCard}
          keyExtractor={(model) => model.id}
          itemHeight={140}
          virtualizationThreshold={20}
          className="flex-1 pb-4"
          emptyComponent={
            <div className="text-center text-white/60">
              <p>Keine Modelle gefunden</p>
            </div>
          }
        />
      )}
    </div>
  );
}
