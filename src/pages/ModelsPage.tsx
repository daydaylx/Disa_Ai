import { useMemo, useState } from "react";

import { AppHeader, Button, Input, ModelCard, SectionHeader, Typography } from "@/ui";

import { Filter, Search, Star } from "../lib/icons";
import { cn } from "../lib/utils";

// Mock data für Modelle - würde normalerweise aus API kommen
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
}

const mockModels: Model[] = [
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "openai",
    speed: 85,
    quality: 95,
    value: 75,
    isFree: false,
    price: "$0.030/1K",
    contextLength: "128K",
    isFavorite: true,
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "anthropic",
    speed: 90,
    quality: 92,
    value: 80,
    isFree: false,
    price: "$0.025/1K",
    contextLength: "200K",
    isFavorite: false,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    speed: 95,
    quality: 85,
    value: 90,
    isFree: false,
    price: "$0.002/1K",
    contextLength: "16K",
    isFavorite: false,
  },
  {
    id: "mistral-nemo",
    name: "Mistral: Mistral Nemo",
    provider: "mistralai",
    speed: 88,
    quality: 87,
    value: 88,
    isFree: true,
    price: "FREE",
    contextLength: "131K",
    isFavorite: true,
  },
  {
    id: "llama-3-70b",
    name: "Meta: Llama 3 70B",
    provider: "meta-llama",
    speed: 80,
    quality: 88,
    value: 85,
    isFree: false,
    price: "$0.007/1K",
    contextLength: "32K",
    isFavorite: false,
  },
  {
    id: "gemini-pro",
    name: "Gemini Pro",
    provider: "google",
    speed: 82,
    quality: 90,
    value: 78,
    isFree: false,
    price: "$0.001/1K",
    contextLength: "1M",
    isFavorite: false,
  },
];

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>(mockModels);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

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

            {/* Material Filter Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={cn(
                  "p-3 rounded-sm shadow-raise cursor-pointer transition-all duration-fast",
                  showFavoritesOnly
                    ? "bg-surface-inset shadow-inset ring-1 ring-accent-primary text-accent-primary"
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
                    ? "bg-surface-inset shadow-inset ring-1 ring-accent-primary text-accent-primary"
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

        {/* Model Grid - kompakter für mobile Ansicht */}
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

        {/* Empty State - Material */}
        {filteredModels.length === 0 && (
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
