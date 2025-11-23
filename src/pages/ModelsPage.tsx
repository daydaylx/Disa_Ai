import { useEffect, useMemo, useState } from "react";

import { AppHeader, Button, Input, ModelCard, SectionHeader, Typography } from "@/ui";

import { loadModelCatalog, type ModelEntry } from "../config/models";
import { useFavorites } from "../contexts/FavoritesContext";
import { useSettings } from "../hooks/useSettings";
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
  const { isModelFavorite, toggleModelFavorite, trackModelUsage } = useFavorites();
  const { settings, setPreferredModel } = useSettings();
  const activeModelName = useMemo(
    () => models.find((m) => m.id === settings.preferredModelId)?.name ?? settings.preferredModelId,
    [models, settings.preferredModelId],
  );

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
      const matchesFavorites = !showFavoritesOnly || isModelFavorite(model.id);
      const matchesFree = !showFreeOnly || model.isFree;

      return matchesSearch && matchesFavorites && matchesFree;
    });
  }, [isModelFavorite, models, searchQuery, showFavoritesOnly, showFreeOnly]);

  return (
    <div className="relative flex flex-col text-text-primary h-full">
      <AppHeader pageTitle="Modelle" />

      <div className="space-y-4 sm:space-y-6 px-[var(--spacing-4)] py-3 sm:py-[var(--spacing-6)]">
        <h1 className="text-2xl font-bold text-text-primary">Modelle</h1>
        <div className="with-spine flex flex-col gap-1">
          <SectionHeader
            variant="compact"
            title="Katalog & Bewertungen"
            subtitle="Vergleiche Kosten, Kontext und Fähigkeiten"
          />
          <p className="text-sm text-text-muted">
            Aurora-Line zeigt wichtige Bereiche auf einen Blick.
          </p>
        </div>
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={() => window.open("/models/mobile", "_self")}>
            Mobile Ansicht
          </Button>
        </div>

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
                aria-label="Modelle durchsuchen"
              />
            </div>

            {/* Premium Filter Buttons mit Brand-Akzent */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={cn(
                  "p-3 rounded-sm cursor-pointer transition-all duration-fast border",
                  showFavoritesOnly
                    ? "bg-brand/10 border-brand text-brand shadow-[var(--shadow-inset),var(--shadow-accent-glow)]"
                    : "bg-surface-2 border-surface-2 text-text-secondary hover:border-brand/60 hover:text-text-primary hover:shadow-raiseLg active:scale-[0.98]",
                )}
                aria-pressed={showFavoritesOnly}
                aria-label="Nur Favoriten anzeigen"
              >
                <Star className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowFreeOnly(!showFreeOnly)}
                className={cn(
                  "p-3 rounded-sm cursor-pointer transition-all duration-fast border",
                  showFreeOnly
                    ? "bg-brand/10 border-brand text-brand shadow-[var(--shadow-inset),var(--shadow-accent-glow)]"
                    : "bg-surface-2 border-surface-2 text-text-secondary hover:border-brand/60 hover:text-text-primary hover:shadow-raiseLg active:scale-[0.98]",
                )}
                aria-pressed={showFreeOnly}
                aria-label="Nur kostenlose Modelle anzeigen"
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

        {/* Aktives Modell Hinweis */}
        {settings.preferredModelId && (
          <div className="flex items-center gap-2 rounded-md border border-surface-2 bg-surface-inset px-3 py-2 text-sm text-text-secondary shadow-inset">
            <span className="font-semibold text-text-primary">Aktives Modell:</span>
            <span className="text-text-primary">{activeModelName}</span>
          </div>
        )}

        {/* Active Filters Bar */}
        {(showFavoritesOnly || showFreeOnly || searchQuery) && (
          <div className="sticky top-[var(--spacing-2)] z-30 bg-surface-inset/90 backdrop-blur rounded-md border border-surface-2 px-3 py-2 flex items-center gap-3 shadow-inset">
            <Typography variant="body-sm" className="text-text-secondary">
              Aktive Filter
            </Typography>
            {searchQuery && (
              <span className="text-xs rounded-sm bg-surface-1 px-2 py-1 text-text-primary border border-surface-2">
                Suche: “{searchQuery}”
              </span>
            )}
            {showFavoritesOnly && (
              <span className="text-xs rounded-sm bg-brand/10 px-2 py-1 text-brand border border-brand/50">
                Favoriten
              </span>
            )}
            {showFreeOnly && (
              <span className="text-xs rounded-sm bg-brand/10 px-2 py-1 text-brand border border-brand/50">
                Free
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => {
                setShowFavoritesOnly(false);
                setShowFreeOnly(false);
                setSearchQuery("");
              }}
            >
              Zurücksetzen
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-surface-inset shadow-inset flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-brand/30 border-t-brand rounded-full animate-spin shadow-brandGlow" />
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
            {filteredModels.map((model) => {
              const isActive = settings.preferredModelId === model.id;
              return (
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
                  isFavorite={isModelFavorite(model.id)}
                  isActive={isActive}
                  onToggleFavorite={() => {
                    toggleModelFavorite(model.id);
                    trackModelUsage(model.id, 0, 0);
                  }}
                  onCardClick={() => {
                    setPreferredModel(model.id);
                    trackModelUsage(model.id, 0, 0);
                  }}
                />
              );
            })}
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
            <div className="mt-4 flex justify-center">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setShowFavoritesOnly(false);
                  setShowFreeOnly(false);
                }}
              >
                Filter zurücksetzen
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
