import { useEffect, useMemo, useState } from "react";

import { loadModelCatalog, type ModelEntry } from "@/config/models";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSettings } from "@/hooks/useSettings";
import { Check, Cpu, Star } from "@/lib/icons";
import { coercePrice, formatPricePerK } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { Button, EmptyState, PageHeader, SearchInput } from "@/ui";

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
  const [search, setSearch] = useState("");

  // Load catalog
  useEffect(() => {
    let active = true;
    loadModelCatalog()
      .then((data) => {
        if (!active) return;
        setCatalog(data);
      })
      .catch(() => {
        if (!active) return;
        setCatalog([]);
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
      {/* Header */}
      <div className="flex-none sticky top-16 z-20 bg-bg-app/90 backdrop-blur px-4 py-3 border-b border-white/5 space-y-3">
        <PageHeader
          title="Modelle"
          description={`${catalog?.length ?? 0} verfügbar · ${favorites.models.items.length} Favoriten`}
        />

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Modell suchen..."
          className="w-full"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 pb-16 pt-3 space-y-2">
        {catalog === null ? (
          // Loading skeletons
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-surface-1 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Cpu className="h-6 w-6" />}
            title="Keine Modelle gefunden"
            description="Versuche es mit anderen Suchbegriffen."
          />
        ) : (
          <div className="space-y-2.5">
            {filtered.map((model) => {
              const isActive = activeModelId === model.id;
              const isFavorite = isModelFavorite(model.id);

              return (
                <button
                  key={model.id}
                  onClick={() => setPreferredModel(model.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all min-h-[84px]",
                    "hover:bg-surface-2 active:scale-[0.99] shadow-sm",
                    isActive
                      ? "bg-surface-1 border-accent-primary/30 ring-1 ring-accent-primary/30"
                      : "bg-surface-1 border-white/5",
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "flex-shrink-0 h-10 w-10 rounded-xl flex items-center justify-center",
                      isActive
                        ? "bg-accent-primary/10 text-accent-primary"
                        : "bg-surface-2 text-ink-tertiary",
                    )}
                  >
                    {isFavorite ? (
                      <Star className="h-5 w-5 fill-current text-status-warning" />
                    ) : (
                      <Cpu className="h-5 w-5" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-medium text-sm truncate",
                          isActive ? "text-accent-primary" : "text-ink-primary",
                        )}
                      >
                        {model.label ?? model.id}
                      </span>
                      {isActive && <Check className="h-4 w-4 text-accent-primary flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-ink-tertiary">
                      <span className="truncate">{model.provider}</span>
                      <span className="text-ink-muted">·</span>
                      <span>{Math.round(getContextTokens(model) / 1000)}k</span>
                      <span className="text-ink-muted">·</span>
                      <span>{getPriceLabel(model)}</span>
                    </div>
                  </div>

                  {/* Favorite Toggle */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 text-ink-tertiary hover:text-status-warning h-10 w-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleModelFavorite(model.id);
                    }}
                    aria-label={isFavorite ? "Favorit entfernen" : "Zu Favoriten hinzufügen"}
                  >
                    <Star
                      className={cn("h-4 w-4", isFavorite && "fill-current text-status-warning")}
                    />
                  </Button>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
