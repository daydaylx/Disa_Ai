import { useCallback, useEffect, useState } from "react";

import { defaultQuickstarts, type QuickstartAction } from "../../config/quickstarts";
import { quickstartPersistence } from "../../lib/quickstarts/persistence";
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

  if (quickstarts.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="border-border bg-surface-1 h-32 animate-pulse rounded-lg border"
          >
            <div className="bg-surface-2 h-4 w-24 rounded" />
            <div className="bg-surface-2 mt-2 h-3 w-20 rounded" />
          </div>
        ))}
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
