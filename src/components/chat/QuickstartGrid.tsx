import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { defaultQuickstarts, type QuickstartAction } from "../../config/quickstarts";
import { quickstartPersistence } from "../../lib/quickstarts/persistence";
import { Button } from "../ui/button";
import { QuickstartTile } from "./QuickstartTile";

interface QuickstartGridProps {
  onQuickstartTap: (action: QuickstartAction) => void;
  onQuickstartLongPress?: (action: QuickstartAction) => void;
  isLoading?: boolean;
}

export function QuickstartGrid({
  onQuickstartTap,
  onQuickstartLongPress,
  isLoading = false,
}: QuickstartGridProps) {
  const [quickstarts, setQuickstarts] = useState<QuickstartAction[]>([]);
  const [pinnedStates, setPinnedStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const sortedQuickstarts = quickstartPersistence.sortQuickstarts(defaultQuickstarts);
    setQuickstarts(sortedQuickstarts);

    const pinStates: Record<string, boolean> = {};
    defaultQuickstarts.forEach((qs) => {
      pinStates[qs.id] = quickstartPersistence.isPinned(qs.id);
    });
    setPinnedStates(pinStates);
  }, []);

  const handleQuickstartTap = useCallback(
    (action: QuickstartAction) => {
      quickstartPersistence.markAsUsed(action.id);

      const updatedQuickstarts = quickstartPersistence.sortQuickstarts(defaultQuickstarts);
      setQuickstarts(updatedQuickstarts);

      onQuickstartTap(action);
    },
    [onQuickstartTap],
  );

  const handleTogglePin = useCallback((actionId: string) => {
    const newPinnedState = quickstartPersistence.togglePin(actionId);

    setPinnedStates((prev) => ({
      ...prev,
      [actionId]: newPinnedState,
    }));

    const updatedQuickstarts = quickstartPersistence.sortQuickstarts(defaultQuickstarts);
    setQuickstarts(updatedQuickstarts);
  }, []);

  const handleLongPress = useCallback(
    (action: QuickstartAction) => {
      console.warn(`Long pressed on quickstart: ${action.id}`);
      onQuickstartLongPress?.(action);
    },
    [onQuickstartLongPress],
  );

  // Empty state: No quickstarts available
  if (quickstarts.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center p-4">
        <div className="max-w-xs space-y-4 text-center">
          <div className="border-border bg-surface-2 mx-auto flex h-16 w-16 items-center justify-center rounded-full border">
            <Sparkles className="text-text-1 h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="typo-h5 text-text-0">Keine Schnellstarts verfügbar</h3>
            <p className="typo-body-sm text-text-1">
              Schnellstarts helfen dir, häufige Aufgaben mit einem Tippen zu starten. Sie werden
              automatisch geladen.
            </p>
          </div>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              const sortedQuickstarts = quickstartPersistence.sortQuickstarts(defaultQuickstarts);
              setQuickstarts(sortedQuickstarts);
            }}
            className="mx-auto"
          >
            <Sparkles className="h-4 w-4" />
            Schnellstarts neu laden
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {quickstarts.map((action, index) => (
        <QuickstartTile
          key={action.id}
          action={action}
          index={index}
          onTap={handleQuickstartTap}
          onLongPress={handleLongPress}
          onTogglePin={handleTogglePin}
          isPinned={pinnedStates[action.id] || false}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
