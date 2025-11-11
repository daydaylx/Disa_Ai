/**
 * Developer-UI für Feature-Flag-Anzeige
 *
 * Workflow-Regel: Dev-UI zeigt aktive Flags
 * Nur in Development-Modus sichtbar
 */

import { useState } from "react";

import { useFeatureFlagDebug } from "../../hooks/useFeatureFlags";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export function FeatureFlagPanel() {
  const debug = useFeatureFlagDebug();
  const [isExpanded, setIsExpanded] = useState(false);

  // Nur in Development anzeigen
  if (!debug.isDev || !debug.hasAnyActive) {
    return null;
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500/10 text-red-600 border-red-200";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "low":
        return "bg-green-500/10 text-green-600 border-green-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getSprintColor = (sprint?: number) => {
    if (!sprint) return "bg-gray-500/10 text-gray-600";

    switch (sprint) {
      case 1:
        return "bg-blue-500/10 text-blue-600";
      case 2:
        return "bg-purple-500/10 text-purple-600";
      case 3:
        return "bg-orange-500/10 text-orange-600";
      default:
        return "bg-gray-500/10 text-gray-600";
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[var(--z-popover)] max-w-sm">
      <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-yellow-800">Feature Flags Active</span>
              <Badge variant="secondary" className="text-xs">
                {debug.activeCount}
              </Badge>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800"
            >
              {isExpanded ? "−" : "+"}
            </Button>
          </div>

          {/* Kompakte Anzeige */}
          {!isExpanded && (
            <div className="flex flex-wrap gap-1">
              {debug.activeFlags.slice(0, 3).map((flag) => (
                <Badge
                  key={flag.key}
                  variant="outline"
                  className={`text-xs ${getRiskColor(flag.riskLevel)}`}
                >
                  {flag.key}
                </Badge>
              ))}
              {debug.activeFlags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{debug.activeFlags.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Erweiterte Anzeige */}
          {isExpanded && (
            <div className="space-y-3">
              <div className="space-y-2">
                {debug.activeFlags.map((flag) => (
                  <div key={flag.key} className="p-2 bg-white rounded-md border">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">{flag.name}</h4>
                        <p className="text-xs text-gray-600 mt-0.5">{flag.description}</p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        {flag.sprint && (
                          <Badge
                            variant="outline"
                            className={`text-xs ${getSprintColor(flag.sprint)}`}
                          >
                            S{flag.sprint}
                          </Badge>
                        )}
                        <Badge
                          variant="outline"
                          className={`text-xs ${getRiskColor(flag.riskLevel)}`}
                        >
                          {flag.riskLevel}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 font-mono">{flag.key}</div>
                  </div>
                ))}
              </div>

              {/* Debugging-Informationen */}
              <div className="pt-2 border-t border-yellow-200">
                <div className="text-xs text-yellow-700 space-y-1">
                  {debug.environmentFlags.length > 0 && (
                    <div>
                      <strong>ENV:</strong> {debug.environmentFlags.join(", ")}
                    </div>
                  )}
                  {debug.queryFlags.length > 0 && (
                    <div>
                      <strong>QUERY:</strong> {debug.queryFlags.join(", ")}
                    </div>
                  )}
                  <div className="font-mono text-xs opacity-75">
                    Total: {debug.activeCount}/{debug.totalCount}
                  </div>
                </div>
              </div>

              {/* Hilfe-Text */}
              <div className="pt-2 border-t border-yellow-200">
                <p className="text-xs text-yellow-700">
                  💡 Teste Flags mit:{" "}
                  <code className="bg-yellow-100 px-1 rounded">?ff=flagname</code>
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
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
    <Badge
      variant="outline"
      className="bg-yellow-50 text-yellow-700 border-yellow-300 text-xs"
      title={`Active feature flags: ${debug.activeFlags.map((f) => f.key).join(", ")}`}
    >
      FF: {debug.activeCount}
    </Badge>
  );
}
