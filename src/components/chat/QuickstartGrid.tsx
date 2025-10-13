/**
 * QuickstartGrid Component
 * Implements Issue #105 - Startkacheln funktional machen with tap, long-press, and ordering
 */

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

  // Load and sort quickstarts on mount
  useEffect(() => {
    const sortedQuickstarts = quickstartPersistence.sortQuickstarts(defaultQuickstarts);
    setQuickstarts(sortedQuickstarts);

    // Load pinned states
    const pinStates: Record<string, boolean> = {};
    defaultQuickstarts.forEach((qs) => {
      pinStates[qs.id] = quickstartPersistence.isPinned(qs.id);
    });
    setPinnedStates(pinStates);
  }, []);

  const handleQuickstartTap = useCallback(
    (action: QuickstartAction) => {
      // Mark as used and update order
      quickstartPersistence.markAsUsed(action.id);

      // Re-sort quickstarts based on new usage
      const updatedQuickstarts = quickstartPersistence.sortQuickstarts(defaultQuickstarts);
      setQuickstarts(updatedQuickstarts);

      // Call parent handler
      onQuickstartTap(action);
    },
    [onQuickstartTap],
  );

  const handleTogglePin = useCallback((actionId: string) => {
    // Toggle pin state
    const newPinnedState = quickstartPersistence.togglePin(actionId);

    // Update local state
    setPinnedStates((prev) => ({
      ...prev,
      [actionId]: newPinnedState,
    }));

    // Re-sort quickstarts to reflect pin changes
    const updatedQuickstarts = quickstartPersistence.sortQuickstarts(defaultQuickstarts);
    setQuickstarts(updatedQuickstarts);
  }, []);

  const handleLongPress = useCallback(
    (action: QuickstartAction) => {
      // Optional: Track long press analytics
      console.warn(`Long pressed on quickstart: ${action.id}`);
      onQuickstartLongPress?.(action);
    },
    [onQuickstartLongPress],
  );

  if (quickstarts.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-card h-32 animate-pulse">
            <div className="h-4 w-24 rounded bg-white/25" />
            <div className="mt-2 h-3 w-20 rounded bg-white/20" />
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
