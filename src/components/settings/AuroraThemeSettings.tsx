import * as React from "react";

import {
  type AuroraPerformance,
  type AuroraTheme,
  useAuroraTheme,
} from "../../hooks/useAuroraTheme";
import { GlassButton } from "../glass/GlassButton";
import { GlassCard } from "../glass/GlassCard";
import Switch from "../Switch";

const THEME_LABELS: Record<AuroraTheme, { name: string; description: string; emoji: string }> = {
  cyber: { name: "Cyber", description: "Klassisches Blau-Cyan Design", emoji: "🌐" },
  warm: { name: "Warm", description: "Orange-Rot Töne", emoji: "🔥" },
  cool: { name: "Cool", description: "Blaue Kühle", emoji: "❄️" },
  monochrome: { name: "Monochrom", description: "Graustufen", emoji: "⚫" },
  forest: { name: "Forest", description: "Grüne Naturtöne", emoji: "🌲" },
  sunset: { name: "Sunset", description: "Sonnenuntergang", emoji: "🌅" },
  ocean: { name: "Ocean", description: "Meerestöne", emoji: "🌊" },
};

// Combined labels for both theme types and time-based themes
const ALL_THEME_LABELS: Record<string, { name: string; description?: string; emoji: string }> = {
  ...THEME_LABELS,
  dawn: { name: "Morgengrauen", emoji: "🌅" },
  day: { name: "Tag", emoji: "☀️" },
  dusk: { name: "Dämmerung", emoji: "🌇" },
  night: { name: "Nacht", emoji: "🌙" },
};

const PERFORMANCE_LABELS: Record<AuroraPerformance, { name: string; description: string }> = {
  high: { name: "Hoch", description: "Alle Effekte aktiv" },
  low: { name: "Reduziert", description: "Weniger Animationen" },
  minimal: { name: "Minimal", description: "Nur statische Effekte" },
};

const TIME_LABELS = {
  dawn: { name: "Morgengrauen", emoji: "🌅", time: "5-8 Uhr" },
  day: { name: "Tag", emoji: "☀️", time: "8-18 Uhr" },
  dusk: { name: "Dämmerung", emoji: "🌇", time: "18-21 Uhr" },
  night: { name: "Nacht", emoji: "🌙", time: "21-5 Uhr" },
};

export function AuroraThemeSettings() {
  const {
    theme,
    performance,
    timeBasedEnabled,
    currentTimeTheme,
    effectiveTheme,
    setTheme,
    setPerformance,
    setTimeBasedEnabled,
    resetToDefaults,
    availableThemes,
    availablePerformanceModes,
  } = useAuroraTheme();

  const currentTime = React.useMemo(() => {
    const hour = new Date().getHours();
    return `${hour.toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}`;
  }, []);

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold">Aurora Theme</h4>
            <p className="text-gray-400 text-sm">
              Aktuell: {ALL_THEME_LABELS[effectiveTheme]?.name || effectiveTheme}{" "}
              {ALL_THEME_LABELS[effectiveTheme]?.emoji}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {availableThemes.map((themeOption) => {
            const themeData = THEME_LABELS[themeOption];
            const isActive = theme === themeOption && !timeBasedEnabled;
            return (
              <GlassButton
                key={themeOption}
                variant={isActive ? "primary" : "secondary"}
                size="sm"
                onClick={() => setTheme(themeOption)}
                className="flex h-auto flex-col items-center gap-1 p-3"
              >
                <span className="text-lg">{themeData.emoji}</span>
                <span className="text-xs font-medium">{themeData.name}</span>
              </GlassButton>
            );
          })}
        </div>
      </div>

      {/* Time-Based Themes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-semibold">Zeit-basierte Themes</h4>
            <p className="text-gray-400 text-sm">Automatischer Themenwechsel je nach Tageszeit</p>
          </div>
          <Switch checked={timeBasedEnabled} onChange={setTimeBasedEnabled} />
        </div>

        {timeBasedEnabled && (
          <GlassCard variant="subtle" className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-white font-medium">Aktuell aktiv:</span>
              <span className="text-cyan-400 font-mono">{currentTime}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(TIME_LABELS).map(([timeKey, timeData]) => {
                const isCurrentTime = currentTimeTheme === timeKey;
                return (
                  <div
                    key={timeKey}
                    className={`flex items-center gap-2 rounded-lg p-2 ${
                      isCurrentTime ? "bg-cyan-400/20 border-cyan-400/40 border" : "bg-white/5"
                    }`}
                  >
                    <span>{timeData.emoji}</span>
                    <div>
                      <div
                        className={`font-medium ${isCurrentTime ? "text-cyan-400" : "text-white"}`}
                      >
                        {timeData.name}
                      </div>
                      <div className="text-gray-400 text-xs">{timeData.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}
      </div>

      {/* Performance Mode */}
      <div className="space-y-4">
        <div>
          <h4 className="text-white font-semibold">Performance Modus</h4>
          <p className="text-gray-400 text-sm">Passt Animationen an dein Gerät an</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {availablePerformanceModes.map((perfMode) => {
            const perfData = PERFORMANCE_LABELS[perfMode];
            const isActive = performance === perfMode;
            return (
              <GlassButton
                key={perfMode}
                variant={isActive ? "primary" : "ghost"}
                onClick={() => setPerformance(perfMode)}
                className="flex h-auto items-center justify-between p-3"
              >
                <div className="text-left">
                  <div className="font-medium">{perfData.name}</div>
                  <div className="text-xs opacity-80">{perfData.description}</div>
                </div>
                {isActive && <span className="text-cyan-400">✓</span>}
              </GlassButton>
            );
          })}
        </div>
      </div>

      {/* Theme Preview & Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-semibold">Aktionen</h4>
        </div>

        <div className="flex gap-3">
          <GlassButton variant="ghost" size="sm" onClick={resetToDefaults} className="flex-1">
            Standard wiederherstellen
          </GlassButton>
        </div>

        {/* Live Theme Info */}
        <GlassCard variant="subtle" className="p-3">
          <div className="text-gray-400 space-y-1 text-xs">
            <div>
              Effektives Theme: <span className="text-cyan-400">{effectiveTheme}</span>
            </div>
            <div>
              Performance: <span className="text-cyan-400">{performance}</span>
            </div>
            <div>
              Zeit-basiert: <span className="text-cyan-400">{timeBasedEnabled ? "An" : "Aus"}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
