import { Moon, Utensils, Waves } from "@/lib/icons";
import { Button } from "@/ui/Button";

import type { GameState } from "../../hooks/useGameState";

interface SurvivalQuickActionsProps {
  state: GameState;
  onQuickAction: (action: "eat" | "drink" | "rest") => void;
  isLoading?: boolean;
}

export function SurvivalQuickActions({
  state,
  onQuickAction,
  isLoading = false,
}: SurvivalQuickActionsProps) {
  // Find consumable items
  const foodItems = state.inventory.filter(
    (item) =>
      item.type === "consumable" &&
      (item.name.toLowerCase().includes("ration") ||
        item.name.toLowerCase().includes("nahrung") ||
        item.name.toLowerCase().includes("konserve")),
  );

  const waterItems = state.inventory.filter(
    (item) =>
      item.type === "consumable" &&
      (item.name.toLowerCase().includes("wasser") ||
        item.name.toLowerCase().includes("water") ||
        item.name.toLowerCase().includes("getränk")),
  );

  const hasFood = foodItems.length > 0;
  const hasWater = waterItems.length > 0;

  // Calculate total quantities (not just array length)
  const totalFood = foodItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalWater = waterItems.reduce((sum, item) => sum + item.quantity, 0);

  // Only show if player needs it or has items
  const showEat = state.survival.hunger < 60 || hasFood;
  const showDrink = state.survival.thirst < 60 || hasWater;
  const showRest = state.survival.fatigue > 30;

  const hasAnyActions = showEat || showDrink || showRest;

  // Always reserve space to prevent layout shift, but hide if no actions
  return (
    <div
      className="flex flex-wrap gap-2 justify-center transition-opacity duration-200"
      style={{
        minHeight: hasAnyActions ? "auto" : "0px",
        opacity: hasAnyActions ? 1 : 0,
        pointerEvents: hasAnyActions ? "auto" : "none",
      }}
    >
      {showEat && (
        <Button
          variant={state.survival.hunger < 30 ? "destructive" : "secondary"}
          size="sm"
          className="gap-2"
          onClick={() => onQuickAction("eat")}
          disabled={!hasFood || isLoading}
          title={hasFood ? "Essen aus Inventar verwenden" : "Keine Nahrung im Inventar"}
        >
          <Utensils className="h-4 w-4" />
          Essen
          {hasFood && <span className="text-xs opacity-70">({totalFood})</span>}
        </Button>
      )}

      {showDrink && (
        <Button
          variant={state.survival.thirst < 30 ? "destructive" : "secondary"}
          size="sm"
          className="gap-2"
          onClick={() => onQuickAction("drink")}
          disabled={!hasWater || isLoading}
          title={hasWater ? "Wasser aus Inventar verwenden" : "Kein Wasser im Inventar"}
        >
          <Waves className="h-4 w-4" />
          Trinken
          {hasWater && <span className="text-xs opacity-70">({totalWater})</span>}
        </Button>
      )}

      {showRest && (
        <Button
          variant={state.survival.fatigue > 70 ? "destructive" : "secondary"}
          size="sm"
          className="gap-2"
          onClick={() => onQuickAction("rest")}
          disabled={isLoading}
          title="Kurze Rast (30 Minuten)"
        >
          <Moon className="h-4 w-4" />
          Rasten
        </Button>
      )}
    </div>
  );
}
