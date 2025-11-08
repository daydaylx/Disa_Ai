import { useCallback, useMemo, useRef } from "react";

import type { QuickstartAction } from "../../config/quickstarts";
import { useQuickstartManager } from "../../hooks/useQuickstartManager";
import { Sparkles } from "../../lib/icons";
import { Button } from "../ui/button";
import { ChatStatusBanner } from "./ChatStatusBanner";
import { createRoleQuickstarts } from "./quickstartHelpers";
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
  const {
    quickstarts,
    isLoading: managerLoading,
    error,
    trackUsage,
    togglePin,
    isPinned,
    reload,
  } = useQuickstartManager();
  const fallbackQuickstartsRef = useRef<QuickstartAction[] | null>(null);

  const combinedLoading = isLoading || managerLoading;

  if (!managerLoading && quickstarts.length > 0 && fallbackQuickstartsRef.current) {
    fallbackQuickstartsRef.current = null;
  }

  if (!managerLoading && quickstarts.length === 0 && !fallbackQuickstartsRef.current) {
    fallbackQuickstartsRef.current = createRoleQuickstarts();
  }

  const quickstartsToDisplay = useMemo<QuickstartAction[]>(() => {
    if (quickstarts.length > 0) {
      return quickstarts;
    }
    return fallbackQuickstartsRef.current ?? [];
  }, [quickstarts]);

  const handleQuickstartTap = useCallback(
    (action: QuickstartAction) => {
      trackUsage(action.id);
      onQuickstartTap(action);
    },
    [onQuickstartTap, trackUsage],
  );

  const handleTogglePin = useCallback(
    (actionId: string) => {
      togglePin(actionId);
    },
    [togglePin],
  );

  const handleLongPress = useCallback(
    (action: QuickstartAction) => {
      console.warn(`Long pressed on quickstart: ${action.id}`);
      onQuickstartLongPress?.(action);
    },
    [onQuickstartLongPress],
  );

  if (combinedLoading && quickstartsToDisplay.length === 0) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={`quickstart-skeleton-${index}`}
            className="border-border bg-surface-card animate-pulse rounded-lg border p-4"
          >
            <div className="bg-surface-subtle h-4 w-32 rounded" />
            <div className="bg-surface-subtle mt-2 h-3 w-48 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (!combinedLoading && quickstartsToDisplay.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center p-4">
        <div className="max-w-xs space-y-4 text-center">
          {error ? (
            <ChatStatusBanner error={error} onRetry={reload} className="px-3" />
          ) : (
            <div className="space-y-2">
              <div className="border-border bg-surface-subtle mx-auto flex h-16 w-16 items-center justify-center rounded-full border">
                <Sparkles className="text-text-secondary h-8 w-8" />
              </div>
              <h3 className="typo-h5 text-text-primary">Keine Schnellstarts verfügbar</h3>
              <p className="typo-body-sm text-text-secondary">
                Schnellstarts helfen dir, häufige Aufgaben mit einem Tippen zu starten. Sie werden
                automatisch geladen.
              </p>
            </div>
          )}
          <Button variant="secondary" size="sm" onClick={() => reload()} className="mx-auto">
            <Sparkles className="h-4 w-4" />
            Schnellstarts neu laden
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-4">
      {error ? <ChatStatusBanner error={error} onRetry={reload} className="px-1" /> : null}
      <div className="grid grid-cols-2 gap-3">
        {quickstartsToDisplay.map((action, index) => (
          <QuickstartTile
            key={action.id}
            action={action}
            index={index}
            onTap={handleQuickstartTap}
            onLongPress={handleLongPress}
            onTogglePin={handleTogglePin}
            isPinned={isPinned(action.id)}
            isLoading={combinedLoading}
          />
        ))}
      </div>
    </div>
  );
}
