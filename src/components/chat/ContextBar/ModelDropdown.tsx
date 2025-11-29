import { useNavigate } from "react-router-dom";

import type { ModelEntry } from "@/config/models";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useSettings } from "@/hooks/useSettings";
import { Check, ChevronRight, Lock } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/Button";

interface ModelDropdownProps {
  currentModelId: string;
  catalog: ModelEntry[] | null;
  onSelect: (modelId: string) => void;
  onClose?: () => void;
}

export function ModelDropdown({ currentModelId, catalog, onSelect, onClose }: ModelDropdownProps) {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { favorites } = useFavorites(); // Get favorites directly

  // Fallback if catalog not loaded yet
  const models = catalog || [];

  // Use the ids of favorites to filter ModelEntry[] directly
  const favoriteModelIds = new Set(favorites.models?.items || []);
  const favoritesList = models.filter((model) => favoriteModelIds.has(model.id));

  // Safety Filter - youth filtering means !showNSFWContent
  const isSafe = (model: ModelEntry) => {
    if (settings.showNSFWContent) return true; // Not in youth filter mode
    return model.safety !== "any";
  };

  // 1. Get Safe Favorites
  const safeFavorites = favoritesList.filter(isSafe);

  // 2. Get Recommended (excluding already favored)
  const recommended = models.filter(
    (m) => m.recommended && isSafe(m) && !safeFavorites.find((f) => f.id === m.id),
  );

  // 3. Combine to get top 5 items total
  const displayModels = [...safeFavorites, ...recommended].slice(0, 5);

  const handleSelect = (id: string) => {
    onSelect(id);
    onClose?.();
  };

  // Badge Helper
  const getBadge = (model: ModelEntry) => {
    const isFree =
      model.tags.includes("free") || (model.pricing?.in === 0 && model.pricing?.out === 0);
    if (isFree)
      return (
        <span className="ml-2 rounded-[4px] bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-ink-secondary">
          Free
        </span>
      );
    return (
      <span className="ml-2 rounded-[4px] bg-accent-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-accent-primary">
        $
      </span>
    );
  };

  return (
    <div className="w-[280px] p-2">
      <div className="px-2 py-1.5 text-xs font-medium text-ink-secondary uppercase tracking-wider">
        Modell wählen
      </div>

      <div className="space-y-1 mb-2">
        {displayModels.map((model) => (
          <button
            key={model.id}
            onClick={() => handleSelect(model.id)}
            className={cn(
              "relative flex w-full flex-col items-start rounded-md px-2 py-2 text-sm transition-colors outline-none",
              "hover:bg-surface-2 focus:bg-surface-2",
              currentModelId === model.id ? "bg-surface-2" : "",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <span
                className={cn(
                  "font-medium truncate",
                  currentModelId === model.id ? "text-ink-primary" : "text-ink-primary",
                )}
              >
                {model.label}
                {getBadge(model)}
              </span>
              {currentModelId === model.id && (
                <Check className="h-3.5 w-3.5 text-accent-primary flex-shrink-0 ml-2" />
              )}
            </div>
            <span className="text-xs text-ink-secondary line-clamp-1 text-left mt-0.5">
              {model.description || "Ein leistungsstarkes KI-Modell."}
            </span>
          </button>
        ))}
      </div>

      <div className="my-2 h-px bg-border-ink/50" />

      {/* Footer Actions */}
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-between text-ink-secondary hover:text-ink-primary"
        onClick={() => {
          void navigate("/models");
          onClose?.();
        }}
      >
        <span>Modelle & Details…</span>
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Youth Protection Hint */}
      {!settings.showNSFWContent && (
        <div className="mt-2 flex items-center gap-2 px-2 py-1 text-[10px] text-ink-tertiary border-t border-border-ink/30 pt-2">
          <Lock className="h-3 w-3" />
          <span>Einige Modelle sind im Jugendschutz-Modus ausgeblendet.</span>
        </div>
      )}
    </div>
  );
}
