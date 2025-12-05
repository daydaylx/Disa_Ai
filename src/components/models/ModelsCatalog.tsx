import { useEffect, useMemo, useState } from "react";

import { loadModelCatalog, type ModelEntry } from "@/config/models";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSettings } from "@/hooks/useSettings";
import { CheckCircle, Cpu, Search, Star } from "@/lib/icons";
import { coercePrice, formatPricePerK } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import { Badge, Button, Card } from "@/ui";

// Simple input component for local use to avoid dependency on old Input
function SimpleSearchInput({ value, onChange, placeholder }: any) {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-tertiary">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl bg-surface-2 border border-white/5 pl-10 pr-4 text-sm text-ink-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 placeholder:text-ink-tertiary transition-all"
      />
    </div>
  );
}

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
    <div className={cn("flex flex-col h-full bg-bg-app", className)}>
      {/* Header & Search */}
      <div className="flex-none px-4 py-4 space-y-4 bg-bg-app/80 backdrop-blur-sm z-10">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-ink-primary">Modell-Katalog</h2>
          <p className="text-sm text-ink-secondary mt-1">
            Wähle das passende Gehirn für deinen Chat.
          </p>
        </div>

        <SimpleSearchInput
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
          placeholder="Modell suchen..."
        />

        {/* Quick Stats */}
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-surface-2 text-ink-secondary border-none">
            {catalog?.length ?? 0} Modelle
          </Badge>
          <Badge variant="secondary" className="bg-surface-2 text-ink-secondary border-none">
            {favorites.models.items.length} Favoriten
          </Badge>
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {catalog === null &&
            // Skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-surface-1 animate-pulse" />
            ))}

          {filtered.map((model) => {
            const isActive = activeModelId === model.id;
            const isFavorite = isModelFavorite(model.id);

            return (
              <Card
                key={model.id}
                variant={isActive ? "interactive" : "default"}
                padding="sm"
                className={cn(
                  "group relative transition-all duration-200 hover:shadow-lg",
                  isActive && "ring-1 ring-accent-primary/50 bg-surface-1/80",
                )}
                onClick={() => setPreferredModel(model.id)}
              >
                {isActive && (
                  <div className="absolute top-3 right-3 text-accent-primary">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                )}

                <div className="flex flex-col h-full gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-none h-10 w-10 rounded-xl bg-surface-2 flex items-center justify-center text-ink-secondary group-hover:text-ink-primary transition-colors">
                      {isFavorite ? (
                        <Star className="h-5 w-5 fill-accent-warning text-accent-warning" />
                      ) : (
                        <Cpu className="h-5 w-5" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 pr-6">
                      <h3 className="font-semibold text-base text-ink-primary truncate">
                        {model.label ?? model.id}
                      </h3>
                      <p className="text-xs text-ink-secondary truncate">{model.provider}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 px-1.5 border-white/10 text-ink-tertiary"
                    >
                      {Math.round(getContextTokens(model) / 1000)}k Context
                    </Badge>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5 px-1.5 border-white/10 text-ink-tertiary"
                    >
                      {getPriceLabel(model)}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs text-ink-tertiary hover:text-accent-warning hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleModelFavorite(model.id);
                      }}
                    >
                      {isFavorite ? "Favorit entfernen" : "Favorisieren"}
                    </Button>

                    {isActive ? (
                      <span className="text-xs font-medium text-accent-primary">Aktiv</span>
                    ) : (
                      <span className="text-xs text-ink-muted group-hover:text-ink-secondary">
                        Tippen zum Wählen
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
