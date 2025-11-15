import { useMemo, useState } from "react";

import {
  AppMenuDrawer,
  defaultMenuSections,
  MenuIcon,
  useMenuDrawer,
} from "../components/layout/AppMenuDrawer";
import { ModelsPageShell } from "../components/layout/PageShell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ModelCard } from "../components/ui/modern-cards";
import { Typography } from "../components/ui/typography";
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

  const { isOpen, openMenu, closeMenu } = useMenuDrawer();

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
    <ModelsPageShell actions={<MenuIcon onClick={openMenu} />}>
      {/* Such-/Filterleiste */}
      <div className="space-y-4">
        {/* Pill-Input "Mod" links, daneben Icon-Buttons */}
        <div className="flex items-center gap-3">
          {/* Pill-Input */}
          <div className="flex-1 relative">
            <Input
              placeholder="Mod"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "rounded-full bg-[var(--surface)] border-[var(--glass-border-soft)]",
                "text-[var(--text-primary)] placeholder-[var(--text-muted)]",
                "focus:border-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]/20",
              )}
            />
          </div>

          {/* Icon-Buttons als kleine runde Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={cn(
                "p-3 rounded-full transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center",
                showFavoritesOnly
                  ? "bg-[var(--color-primary-500)] text-white"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-neutral-700)]",
              )}
              aria-label="Favoriten anzeigen"
            >
              <Star className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowFreeOnly(!showFreeOnly)}
              className={cn(
                "p-3 rounded-full transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center",
                showFreeOnly
                  ? "bg-[var(--color-primary-500)] text-white"
                  : "bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-neutral-700)]",
              )}
              aria-label="Kostenlose Modelle"
            >
              <Filter className="h-5 w-5" />
            </button>

            <button
              className="p-3 rounded-full bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--color-neutral-700)] transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Einstellungen"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <Typography variant="body-sm" className="text-[var(--text-secondary)]">
            {filteredModels.length} Modelle gefunden
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
              className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Filter zurücksetzen
            </Button>
          )}
        </div>
      </div>

      {/* Modelle-Karten */}
      <div className="space-y-4">
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
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--surface)] flex items-center justify-center">
            <Search className="w-8 h-8 text-[var(--text-muted)]" />
          </div>
          <Typography variant="body-lg" className="text-[var(--text-primary)] font-medium mb-2">
            Keine Modelle gefunden
          </Typography>
          <Typography variant="body-sm" className="text-[var(--text-secondary)]">
            {searchQuery
              ? `Keine Ergebnisse für "${searchQuery}"`
              : "Versuche es mit anderen Filtereinstellungen"}
          </Typography>
        </div>
      )}

      {/* Menu Drawer */}
      <AppMenuDrawer isOpen={isOpen} onClose={closeMenu} sections={defaultMenuSections} />
    </ModelsPageShell>
  );
}
