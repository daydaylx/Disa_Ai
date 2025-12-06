import { useEffect, useMemo, useState } from "react";

import { loadModelCatalog, type ModelEntry } from "@/config/models";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSettings } from "@/hooks/useSettings";
import { Check, Cpu, Star } from "@/lib/icons";
import { coercePrice, formatPricePerK } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { Button, Card, EmptyState, PageHeader, SearchInput } from "@/ui";

interface ModelsCatalogProps {
  className?: string;
}

function getContextTokens(entry?: ModelEntry) {
  if (!entry) return 0;
  return entry.ctx ?? entry.contextTokens ?? 0;
}

function getPriceLabel(entry: ModelEntry) {
  const inputPrice = coercePrice(entry.pricing?.in, 0);
  const outputPrice = coercePrice(entry.pricing?.out, 0);
  if (inputPrice === 0 && outputPrice === 0) return "Gratis";
  return `${formatPricePerK(inputPrice)} / ${formatPricePerK(outputPrice, { currencySymbol: "" })}`;
}

export function ModelsCatalog({ className }: ModelsCatalogProps) {
  const { settings, setPreferredModel } = useSettings();
  const { favorites, toggleModelFavorite, isModelFavorite } = useFavorites();
  const [catalog, setCatalog] = useState<ModelEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null); // Added error state
  const [search, setSearch] = useState("");

  // Load catalog
  useEffect(() => {
    let active = true;
    loadModelCatalog()
      .then((data) => {
        if (!active) return;
        setCatalog(data);
        setError(null); // Clear error on success
      })
      .catch((e) => {
        if (!active) return;
        setCatalog([]);
        setError(e.message || "Failed to load models"); // Set error message
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!catalog) return [] as ModelEntry[];
    const query = search.trim().toLowerCase();

    // Sort: Favorites first, then by name
    const sorted = [...catalog].sort((a, b) => {
      const favA = isModelFavorite(a.id) ? 1 : 0;
      const favB = isModelFavorite(b.id) ? 1 : 0;
      if (favA !== favB) return favB - favA;
      return (a.label || a.id).localeCompare(b.label || b.id);
    });

    if (!query) return sorted;
    return sorted.filter((entry) => {
      const haystack =
        `${entry.id} ${entry.label ?? ""} ${entry.provider ?? ""} ${entry.tags.join(" ")}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [catalog, search, isModelFavorite]);

  const activeModelId = settings.preferredModelId;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header Zone - Vibrant Glass */}
      <div className="flex-none sticky top-[3.5rem] lg:top-[4rem] z-sticky-content pt-4">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-bg-app/80 shadow-lg backdrop-blur-xl">
          {/* Ambient Header Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/10 via-transparent to-transparent pointer-events-none" />

          <div className="relative space-y-3 px-4 py-4">
            <PageHeader
              title="Modelle"
              description={`${catalog?.length ?? 0} verfügbar · ${favorites.models.items.length} Favoriten`}
              className="mb-0"
            />

            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Modell suchen..."
              className="w-full bg-surface-2/50 border-white/10 focus:border-brand-primary/50 focus:ring-brand-primary/20"
            />
          </div>
        </div>
      </div>

      {/* Content Zone - Scrollable List */}
      <div className="flex-1 overflow-y-auto pb-24 pt-4">
        {catalog === null ? (
          // Loading skeletons
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                data-testid="model-card-skeleton"
                className="h-20 rounded-2xl bg-surface-1/50 animate-pulse"
              />
            ))}
          </div>
        ) : error ? ( // Conditional rendering for error state
          <EmptyState
            icon={<Cpu className="h-8 w-8 text-ink-muted" />}
            title="Fehler beim Laden der Modelle" // More specific error title
            description={error} // Display the actual error message
            className="bg-status-error/10 border-status-error/20 text-status-error" // Error styling
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Cpu className="h-8 w-8 text-ink-muted" />}
            title="Keine Modelle gefunden"
            description="Versuche es mit anderen Suchbegriffen."
            className="bg-surface-1/30 rounded-2xl border border-white/5 backdrop-blur-sm py-12"
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((model) => {
              const isActive = activeModelId === model.id;
              const isFavorite = isModelFavorite(model.id);

              return (
                <Card
                  key={model.id}
                  variant="interactive"
                  role="button"
                  tabIndex={0}
                  onClick={() => setPreferredModel(model.id)}
                  className={cn(
                    "w-full flex items-center gap-4 min-h-[84px] text-left transition-all duration-300",
                    isActive
                      ? "bg-brand-primary/5 border-brand-primary/50 ring-1 ring-brand-primary/20 shadow-glow-sm"
                      : "bg-surface-1/60 border-white/5 hover:bg-surface-1/80 hover:border-white/10 shadow-sm",
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
                      isActive
                        ? "bg-brand-primary/20 text-brand-primary shadow-inner"
                        : "bg-surface-2/80 text-ink-tertiary",
                    )}
                  >
                    {isFavorite ? (
                      <Star className="h-6 w-6 fill-current text-status-warning drop-shadow-sm" />
                    ) : (
                      <Cpu className="h-6 w-6" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-semibold text-sm truncate",
                          isActive ? "text-brand-primary" : "text-ink-primary",
                        )}
                      >
                        {model.label ?? model.id}
                      </span>
                      {isActive && (
                        <Check className="h-4 w-4 text-brand-primary flex-shrink-0 drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-ink-tertiary font-medium">
                      <span className="truncate text-ink-secondary">{model.provider}</span>
                      <span className="text-ink-muted">·</span>
                      <span className="bg-surface-3/50 px-1.5 py-0.5 rounded text-[10px]">
                        {Math.round(getContextTokens(model) / 1000)}k
                      </span>
                      <span className="text-ink-muted">·</span>
                      <span>{getPriceLabel(model)}</span>
                    </div>
                  </div>

                  {/* Favorite Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "flex-shrink-0 h-11 w-11 transition-colors",
                      isFavorite
                        ? "text-status-warning hover:text-status-warning/80"
                        : "text-ink-muted hover:text-ink-primary",
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModelFavorite(model.id); // Corrected function name
                    }}
                    aria-label={isFavorite ? "Favorit entfernen" : "Zu Favoriten hinzufügen"}
                  >
                    <Star className={cn("h-5 w-5", isFavorite && "fill-current")} />
                  </Button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
