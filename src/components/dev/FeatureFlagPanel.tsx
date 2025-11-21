/**
 * Developer-UI für Feature-Flag-Anzeige
 *
 * Workflow-Regel: Dev-UI zeigt aktive Flags
 * Nur in Development-Modus sichtbar
 */

import { useState } from "react";

import { Button } from "@/ui/Button";

import { useFeatureFlagDebug } from "../../hooks/useFeatureFlags";
import { cn } from "../../lib/utils";

// Base styles for a chip, inspired by src/ui/Chip.tsx
const CHIP_BASE_STYLES =
  "inline-flex items-center rounded-sm font-medium bg-surface-2 shadow-raise px-2 py-1 text-xs";

const RISK_CHIP_VARIANTS: Record<string, string> = {
  high: "text-accent-danger",
  medium: "text-yellow-400", // Assuming a warning color
  low: "text-accent-secondary",
};

const SPRINT_CHIP_VARIANTS: Record<number, string> = {
  1: "text-blue-400", // Assuming an info color
  2: "text-accent-primary",
  3: "text-yellow-400", // Assuming a warning color
};

export function FeatureFlagPanel() {
  const debug = useFeatureFlagDebug();
  const [isExpanded, setIsExpanded] = useState(false);

  // Nur in Development anzeigen
  if (!debug.isDev || !debug.hasAnyActive) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[var(--z-popover)] max-w-sm">
      <div className="bg-surface-2 shadow-raiseLg rounded-2xl p-4" data-tone="warning">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-text-primary">
              Feature Flags aktiv
            </span>
            <span className={cn(CHIP_BASE_STYLES, "text-blue-400")}>{debug.activeCount}</span>
          </div>
          <Button
            size="icon"
            variant="ghost"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Panel einklappen" : "Panel ausklappen"}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "−" : "+"}
          </Button>
        </div>

        {!isExpanded && (
          <div className="mt-3 flex flex-wrap gap-2">
            {debug.activeFlags.slice(0, 3).map((flag) => (
              <span
                key={flag.key}
                className={cn(
                  CHIP_BASE_STYLES,
                  RISK_CHIP_VARIANTS[flag.riskLevel] ?? "text-text-secondary",
                )}
              >
                {flag.key}
              </span>
            ))}
            {debug.activeFlags.length > 3 && (
              <span className={cn(CHIP_BASE_STYLES, "text-text-secondary")}>
                +{debug.activeFlags.length - 3}
              </span>
            )}
          </div>
        )}

        {isExpanded && (
          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              {debug.activeFlags.map((flag) => (
                <div
                  key={flag.key}
                  className="bg-surface-inset shadow-inset rounded-xl p-3 space-y-2"
                  data-tone={flag.riskLevel === "high" ? "danger" : undefined}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary">{flag.name}</p>
                      <p className="text-xs text-text-secondary">{flag.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {flag.sprint && (
                        <span
                          className={cn(
                            CHIP_BASE_STYLES,
                            SPRINT_CHIP_VARIANTS[flag.sprint] ?? "text-accent-primary",
                          )}
                        >
                          S{flag.sprint}
                        </span>
                      )}
                      <span
                        className={cn(
                          CHIP_BASE_STYLES,
                          RISK_CHIP_VARIANTS[flag.riskLevel] ?? "text-text-secondary",
                        )}
                      >
                        {flag.riskLevel}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-text-tertiary">{flag.key}</div>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-surface-1 pt-3 text-xs text-text-secondary">
              {debug.environmentFlags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn(CHIP_BASE_STYLES, "text-text-secondary")}>ENV</span>
                  <span>{debug.environmentFlags.join(", ")}</span>
                </div>
              )}
              {debug.queryFlags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn(CHIP_BASE_STYLES, "text-text-secondary")}>Query</span>
                  <span>{debug.queryFlags.join(", ")}</span>
                </div>
              )}
              <div className="font-mono text-[11px] text-text-tertiary">
                Total: {debug.activeCount}/{debug.totalCount}
              </div>
            </div>

            <div className="border-t border-surface-1 pt-3 text-xs text-text-secondary">
              💡 Teste Flags mit{" "}
              <code className={cn(CHIP_BASE_STYLES, "normal-case tracking-normal font-mono")}>
                ?ff=flagname
              </code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Feature-Flag Indicator für Header/Navigation
 * Kleinere Variante für permanente Anzeige
 */
export function FeatureFlagIndicator() {
  const debug = useFeatureFlagDebug();

  if (!debug.isDev || !debug.hasAnyActive) {
    return null;
  }

  return (
    <span
      className={cn(CHIP_BASE_STYLES, "text-yellow-400")}
      title={`Aktive Feature-Flags: ${debug.activeFlags.map((f) => f.key).join(", ")}`}
    >
      FF: {debug.activeCount}
    </span>
  );
}
