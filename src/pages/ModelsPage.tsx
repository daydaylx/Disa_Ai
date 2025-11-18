import { useMemo, useState } from "react";

import { Button, Input, ModelCard, SectionHeader, Typography } from "@/ui";

import { Filter, Search, Settings, Star } from "../lib/icons";
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
    id: "gpt-4",
    name: "GPT-4",
    provider: "OpenAI",
    speed: 85,
    quality: 95,
    value: 75,
    isFree: false,
    price: "$0.030/1K",
    contextLength: "128K",
    isFavorite: true,
  },
  {
    id: "claude-3",
    name: "Claude 3",
    provider: "Anthropic",
    speed: 90,
    quality: 92,
    value: 80,
    isFree: false,
    price: "$0.025/1K",
    contextLength: "200K",
    isFavorite: false,
  },
  {
    id: "gpt-3.5",
    name: "GPT-3.5",
    provider: "OpenAI",
    speed: 95,
    quality: 85,
    value: 90,
    isFree: false,
    price: "$0.002/1K",
    contextLength: "16K",
    isFavorite: false,
  },
  {
    id: "llama-2",
    name: "Llama 2",
    provider: "Meta",
    speed: 80,
    quality: 88,
    value: 85,
    isFree: true,
    price: "FREE",
    contextLength: "4K",
    isFavorite: true,
  },
  {
    id: "mistral",
    name: "Mistral",
    provider: "Mistral AI",
    speed: 88,
    quality: 87,
    value: 88,
    isFree: false,
    price: "$0.007/1K",
    contextLength: "32K",
    isFavorite: false,
  },
  {
    id: "gemini",
    name: "Gemini",
    provider: "Google",
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
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Katalog"
        title="Modelle"
        description="Vergleiche Geschwindigkeit, Qualität und Kosten deiner Provider"
      />

      <div className="space-y-4 rounded-3xl border border-[var(--glass-border-soft)] bg-[var(--surface-card)]/70 p-4 shadow-[var(--shadow-sm)]">
        <div className="flex items-center gap-3">
          <Input
            placeholder="Modelle durchsuchen"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            className="flex-1 rounded-2xl border border-[var(--glass-border-soft)] bg-[var(--surface)] px-4 py-3 text-[var(--text-primary)]"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-[var(--glass-border-soft)] bg-[var(--surface)] text-[var(--text-secondary)]",
                showFavoritesOnly &&
                  "border-[var(--aurora-green-400)] text-[var(--aurora-green-400)]",
              )}
              aria-label="Favoriten anzeigen"
            >
              <Star className="h-5 w-5" />
            </button>
            <button
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              className={cn(
                "flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-[var(--glass-border-soft)] bg-[var(--surface)] text-[var(--text-secondary)]",
                showFreeOnly && "border-[var(--aurora-lila-400)] text-[var(--aurora-lila-400)]",
              )}
              aria-label="Kostenlose Modelle"
            >
              <Filter className="h-5 w-5" />
            </button>
            <button
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border border-[var(--glass-border-soft)] bg-[var(--surface)] text-[var(--text-secondary)]"
              aria-label="Weitere Einstellungen"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-[var(--text-secondary)]">
          <span>
            {filteredModels.length} Modelle gefunden
            {searchQuery && ` für "${searchQuery}"`}
          </span>
          {(showFavoritesOnly || showFreeOnly) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowFavoritesOnly(false);
                setShowFreeOnly(false);
              }}
            >
              Filter zurücksetzen
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2" data-testid="models-grid">
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

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <div className="rounded-3xl border border-[var(--glass-border-soft)] bg-[var(--surface-card)]/70 p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)]">
            <Search className="h-6 w-6 text-[var(--text-muted)]" />
          </div>
          <Typography variant="body-lg" className="font-semibold">
            Keine Modelle gefunden
          </Typography>
          <Typography variant="body-sm" className="text-[var(--text-secondary)]">
            {searchQuery
              ? `Keine Ergebnisse für "${searchQuery}"`
              : "Versuche es mit anderen Filtereinstellungen"}
          </Typography>
        </div>
      )}
    </div>
  );
}
