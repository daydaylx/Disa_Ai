import { useEffect, useMemo, useState } from "react";

import { AppHeader, Button, Input, ModelCard, SectionHeader, Typography } from "@/ui";

import { loadModelCatalog, type ModelEntry } from "../config/models";
import { Filter, Search, Star } from "../lib/icons";
import { cn } from "../lib/utils";

interface Model {
  id: string;
  name: string;
  provider: string;
  speed: number;
  quality: number;
  value: number;
  isFree: boolean;
  price: string;
  contextLength: string;
  isFavorite?: boolean;
  description?: string;
}

/**
 * Konvertiert ModelEntry aus models.json zu UI Model Format
 * Generiert heuristische Metriken basierend auf Preis und Modellgröße
 */
function convertToUIModel(entry: ModelEntry): Model {
  const isFree = entry.tags.includes("free") || !entry.pricing;
  const provider = entry.provider ?? "unknown";
  const name = entry.label ?? entry.id;

  // Heuristische Metriken basierend auf Preis und Modellgröße
  let speed = 85;
  let quality = 85;
  let value = 85;

  if (isFree) {
    // Kostenlose Modelle: guter Value, variable Quality
    speed = 88;
    quality = 82;
    value = 92;
  } else if (entry.pricing) {
    // Preisbasierte Heuristik
    const avgPrice = ((entry.pricing.in ?? 0) + (entry.pricing.out ?? 0)) / 2;

    if (avgPrice < 0.05) {
      speed = 92;
      quality = 80;
      value = 90;
    } else if (avgPrice < 0.15) {
      speed = 85;
      quality = 88;
      value = 85;
    } else {
      speed = 78;
      quality = 93;
      value = 75;
    }
  }

  // Context Length formatieren
  let contextLength = "N/A";
  if (entry.ctx) {
    if (entry.ctx >= 1000000) {
      contextLength = `${(entry.ctx / 1000000).toFixed(1)}M`;
    } else if (entry.ctx >= 1000) {
      contextLength = `${Math.round(entry.ctx / 1000)}K`;
    } else {
      contextLength = `${entry.ctx}`;
    }
  }

  // Preis formatieren
  let price = "FREE";
  if (!isFree && entry.pricing) {
    const displayPrice = entry.pricing.in ?? entry.pricing.out ?? 0;
    price = `$${displayPrice.toFixed(3)}/1K`;
  }

  return {
    id: entry.id,
    name,
    provider,
    speed,
    quality,
    value,
    isFree,
    price,
    contextLength,
    description: entry.description,
    isFavorite: false,
  };
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lade Modelle beim Mount
  useEffect(() => {
    let mounted = true;

    async function fetchModels() {
      try {
        setIsLoading(true);
        setError(null);
        const catalog = await loadModelCatalog();
        const uiModels = catalog.map(convertToUIModel);

        if (mounted) {
          setModels(uiModels);
        }
      } catch (err) {
        console.error("Failed to load models:", err);
        if (mounted) {
          setError(err instanceof Error ? err.message : "Fehler beim Laden der Modelle");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void fetchModels();

    return () => {
      mounted = false;
    };
  }, []);

  // Optimized filtering with useMemo - prevents re-computation on every render
  const filteredModels = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();

    return models.filter((model) => {
      const matchesSearch =
        model.name.toLowerCase().includes(searchLower) ||
        model.provider.toLowerCase().includes(searchLower);
      const matchesFavorites = !showFavoritesOnly || model.isFavorite;
      const matchesFree = !showFreeOnly || model.isFree;

      return matchesSearch && matchesFavorites && matchesFree;
    });
  }, [models, searchQuery, showFavoritesOnly, showFreeOnly]);

  const toggleFavorite = (modelId: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === modelId ? { ...model, isFavorite: !model.isFavorite } : model,
      ),
    );
  };

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <AppHeader pageTitle="Modelle" />

      <div className="space-y-4 sm:space-y-6 px-[var(--spacing-4)] py-3 sm:py-[var(--spacing-6)]">
        <SectionHeader
          variant="compact"
          title="Katalog & Bewertungen"
          subtitle="Vergleiche Kosten, Kontext und Fähigkeiten"
        />

        {/* Such-/Filterleiste */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Input
                placeholder="Modell suchen..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="rounded-full"
              />
            </div>

            {/* Premium Filter Buttons mit Brand-Akzent */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={cn(
                  "p-3 rounded-sm shadow-raise cursor-pointer transition-all duration-fast",
                  showFavoritesOnly
                    ? "bg-surface-inset shadow-inset shadow-brandGlow ring-1 ring-brand text-brand"
                    : "bg-surface-2 hover:shadow-raiseLg active:scale-[0.98]",
                )}
              >
                <Star className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowFreeOnly(!showFreeOnly)}
                className={cn(
                  "p-3 rounded-sm shadow-raise cursor-pointer transition-all duration-fast",
                  showFreeOnly
                    ? "bg-surface-inset shadow-inset shadow-brandGlow ring-1 ring-brand text-brand"
                    : "bg-surface-2 hover:shadow-raiseLg active:scale-[0.98]",
                )}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Typography variant="body-sm" className="text-text-secondary">
              {filteredModels.length} Modelle
              {searchQuery && ` für "${searchQuery}"`}
            </Typography>

            {(showFavoritesOnly || showFreeOnly) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowFavoritesOnly(false);
                  setShowFreeOnly(false);
                }}
                className="text-text-secondary hover:text-text-primary"
              >
                Filter zurücksetzen
              </Button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-md bg-surface-inset shadow-inset flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand/30 border-t-brand rounded-full animate-spin" />
            </div>
            <Typography variant="body-lg" className="text-text-primary font-medium">
              Lade Modelle...
            </Typography>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-md bg-surface-inset shadow-inset flex items-center justify-center">
              <div className="w-8 h-8 text-destructive">⚠</div>
            </div>
            <Typography variant="body-lg" className="text-text-primary font-medium mb-2">
              Fehler beim Laden
            </Typography>
            <Typography variant="body-sm" className="text-text-secondary">
              {error}
            </Typography>
          </div>
        )}

        {/* Model Grid - kompakter für mobile Ansicht */}
        {!isLoading && !error && (
          <div
            className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3"
            data-testid="models-grid"
          >
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                name={model.name}
                vendor={model.provider}
                speed={model.speed}
                quality={model.quality}
                value={model.value}
                isFree={model.isFree}
                price={model.price}
                contextLength={model.contextLength}
                isFavorite={model.isFavorite}
                onToggleFavorite={() => toggleFavorite(model.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State - Material */}
        {!isLoading && !error && filteredModels.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-md bg-surface-inset shadow-inset flex items-center justify-center">
              <Search className="w-8 h-8 text-text-muted" />
            </div>
            <Typography
              variant="body-lg"
              className="text-text-primary font-medium mb-2"
              aria-label="Models page empty state heading"
            >
              Keine Modelle gefunden
            </Typography>
            <Typography variant="body-sm" className="text-text-secondary">
              {searchQuery
                ? `Keine Ergebnisse für "${searchQuery}"`
                : "Versuche es mit anderen Filtereinstellungen"}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
