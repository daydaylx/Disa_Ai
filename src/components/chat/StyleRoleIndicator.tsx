import * as React from "react";

import { getRoleById } from "../../config/roleStore";
import { getStyle, getTemplateId, getUseRoleStyle, type StyleKey } from "../../config/settings";
import { GlassCard } from "../glass/GlassCard";

const STYLE_LABELS: Record<StyleKey, { name: string; emoji: string }> = {
  neutral: { name: "Neutral", emoji: "📝" },
  blunt_de: { name: "Direkt", emoji: "🎯" },
  concise: { name: "Kurz", emoji: "⚡" },
  friendly: { name: "Freundlich", emoji: "😊" },
  creative_light: { name: "Kreativ", emoji: "🎨" },
  minimal: { name: "Minimal", emoji: "🔹" },
  technical_precise: { name: "Technisch", emoji: "⚙️" },
  socratic: { name: "Sokratisch", emoji: "❓" },
  bullet: { name: "Bullets", emoji: "📋" },
  step_by_step: { name: "Schritte", emoji: "📈" },
  formal_de: { name: "Formell", emoji: "🎩" },
  casual_de: { name: "Locker", emoji: "👋" },
  detailed: { name: "Detailliert", emoji: "📚" },
  no_taboos: { name: "Unzensiert", emoji: "🔓" },
};

interface StyleRoleIndicatorProps {
  onQuickStylesClick?: () => void;
  className?: string;
}

export const StyleRoleIndicator = React.memo<StyleRoleIndicatorProps>(
  ({ onQuickStylesClick, className }) => {
    const [currentStyle, setCurrentStyle] = React.useState<StyleKey>(() => getStyle());
    const [currentRoleId, setCurrentRoleId] = React.useState<string | null>(() => getTemplateId());
    const [useRoleStyleEnabled, setUseRoleStyleEnabled] = React.useState(() => getUseRoleStyle());

    // Update state when settings change (for real-time updates)
    React.useEffect(() => {
      const interval = setInterval(() => {
        const newStyle = getStyle();
        const newRoleId = getTemplateId();
        const newUseRoleStyle = getUseRoleStyle();

        if (newStyle !== currentStyle) setCurrentStyle(newStyle);
        if (newRoleId !== currentRoleId) setCurrentRoleId(newRoleId);
        if (newUseRoleStyle !== useRoleStyleEnabled) setUseRoleStyleEnabled(newUseRoleStyle);
      }, 1000);

      return () => clearInterval(interval);
    }, [currentStyle, currentRoleId, useRoleStyleEnabled]);

    const currentRole = React.useMemo(() => {
      return currentRoleId ? getRoleById(currentRoleId) : null;
    }, [currentRoleId]);

    const styleData = STYLE_LABELS[currentStyle];

    return (
      <GlassCard
        variant="subtle"
        className={`hover:bg-white/10 hover:shadow-lg inline-flex cursor-pointer items-center gap-2 px-3 py-2 transition-all duration-200 hover:scale-105 active:scale-95 ${className}`}
        onClick={onQuickStylesClick}
      >
        {/* Style Indicator */}
        <div className="gap-1.5 flex items-center">
          <span className="text-sm">{styleData.emoji}</span>
          <span className="text-white text-xs font-medium">{styleData.name}</span>
        </div>

        {/* Separator */}
        {currentRole && <span className="text-gray-500">•</span>}

        {/* Role Indicator */}
        {currentRole && (
          <div className="gap-1.5 flex items-center">
            <span className="text-sm">👤</span>
            <span className="text-cyan-400 text-xs font-medium">{currentRole.name}</span>
            {!useRoleStyleEnabled && (
              <span className="text-gray-500 text-xs" title="Rollen-Stil deaktiviert">
                (inaktiv)
              </span>
            )}
          </div>
        )}

        {/* Click indicator */}
        <span className="text-gray-500 ml-1 text-xs">⚙️</span>
      </GlassCard>
    );
  },
);
