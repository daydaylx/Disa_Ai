import * as React from "react";

import {
  type AuroraPerformance,
  type AuroraTheme,
  useAuroraTheme,
} from "../../hooks/useAuroraTheme";
import { GlassButton } from "../glass/GlassButton";
import { GlassCard } from "../glass/GlassCard";
import Switch from "../Switch";

const THEME_LABELS: Record<
  AuroraTheme,
  { name: string; description: string; colorAccent: string; colorClass: string }
> = {
  cyber: {
    name: "Cyber",
    description: "Classic blue-cyan design",
    colorAccent: "cyan",
    colorClass: "bg-cyan-400",
  },
  warm: {
    name: "Warm",
    description: "Orange-red tones",
    colorAccent: "orange",
    colorClass: "bg-orange-400",
  },
  cool: {
    name: "Cool",
    description: "Cool blue palette",
    colorAccent: "blue",
    colorClass: "bg-blue-400",
  },
  monochrome: {
    name: "Monochrome",
    description: "Grayscale elegance",
    colorAccent: "gray",
    colorClass: "bg-gray-400",
  },
  forest: {
    name: "Forest",
    description: "Natural green tones",
    colorAccent: "green",
    colorClass: "bg-green-400",
  },
  sunset: {
    name: "Sunset",
    description: "Sunset gradient",
    colorAccent: "amber",
    colorClass: "bg-amber-400",
  },
  ocean: {
    name: "Ocean",
    description: "Ocean depths",
    colorAccent: "blue",
    colorClass: "bg-blue-500",
  },
};

// Combined labels for both theme types and time-based themes
const ALL_THEME_LABELS: Record<string, { name: string; description?: string; timeRange?: string }> =
  {
    cyber: { name: "Cyber", description: "Classic blue-cyan design" },
    warm: { name: "Warm", description: "Orange-red tones" },
    cool: { name: "Cool", description: "Cool blue palette" },
    monochrome: { name: "Monochrome", description: "Grayscale elegance" },
    forest: { name: "Forest", description: "Natural green tones" },
    sunset: { name: "Sunset", description: "Sunset gradient" },
    ocean: { name: "Ocean", description: "Ocean depths" },
    dawn: { name: "Dawn", timeRange: "5:00 - 8:00" },
    day: { name: "Day", timeRange: "8:00 - 18:00" },
    dusk: { name: "Dusk", timeRange: "18:00 - 21:00" },
    night: { name: "Night", timeRange: "21:00 - 5:00" },
  };

const PERFORMANCE_LABELS: Record<AuroraPerformance, { name: string; description: string }> = {
  high: { name: "High Performance", description: "All effects active" },
  low: { name: "Reduced", description: "Fewer animations" },
  minimal: { name: "Minimal", description: "Static effects only" },
};

const TIME_LABELS = {
  dawn: { name: "Dawn", time: "5:00 - 8:00", shape: "circle", colorClass: "bg-yellow-300" },
  day: { name: "Day", time: "8:00 - 18:00", shape: "square", colorClass: "bg-blue-300" },
  dusk: { name: "Dusk", time: "18:00 - 21:00", shape: "triangle", colorClass: "bg-orange-400" },
  night: { name: "Night", time: "21:00 - 5:00", shape: "diamond", colorClass: "bg-indigo-600" },
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
            <h4 className="font-semibold text-white">Aurora Theme</h4>
            <p className="text-sm text-gray-400">
              Current: {ALL_THEME_LABELS[effectiveTheme]?.name || effectiveTheme}
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
                <div className={`h-4 w-4 rounded-full ${themeData.colorClass} mb-1`}></div>
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
            <h4 className="font-semibold text-white">Time-Based Themes</h4>
            <p className="text-sm text-gray-400">Automatic theme switching based on time of day</p>
          </div>
          <Switch checked={timeBasedEnabled} onChange={setTimeBasedEnabled} />
        </div>

        {timeBasedEnabled && (
          <GlassCard variant="subtle" className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-medium text-white">Currently active:</span>
              <span className="font-mono text-cyan-400">{currentTime}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(TIME_LABELS).map(([timeKey, timeData]) => {
                const isCurrentTime = currentTimeTheme === timeKey;
                return (
                  <div
                    key={timeKey}
                    className={`flex items-center gap-2 rounded-lg p-2 ${
                      isCurrentTime ? "border border-cyan-400/40 bg-cyan-400/20" : "bg-white/5"
                    }`}
                  >
                    <div className="flex h-4 w-4 items-center justify-center">
                      {timeData.shape === "circle" && (
                        <div className={`h-3 w-3 rounded-full ${timeData.colorClass}`}></div>
                      )}
                      {timeData.shape === "square" && (
                        <div className={`h-3 w-3 ${timeData.colorClass}`}></div>
                      )}
                      {timeData.shape === "triangle" && (
                        <div
                          className={`border-b-3 h-0 w-0 border-l-2 border-r-2 border-l-transparent border-r-transparent ${
                            timeData.colorClass.includes("yellow")
                              ? "border-b-yellow-300"
                              : timeData.colorClass.includes("orange")
                                ? "border-b-orange-400"
                                : "border-b-gray-400"
                          }`}
                        ></div>
                      )}
                      {timeData.shape === "diamond" && (
                        <div
                          className={`h-2.5 w-2.5 rotate-45 transform ${timeData.colorClass}`}
                        ></div>
                      )}
                    </div>
                    <div>
                      <div
                        className={`font-medium ${isCurrentTime ? "text-cyan-400" : "text-white"}`}
                      >
                        {timeData.name}
                      </div>
                      <div className="text-xs text-gray-400">{timeData.time}</div>
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
          <h4 className="font-semibold text-white">Performance Mode</h4>
          <p className="text-sm text-gray-400">Adjusts animations for your device performance</p>
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
                {isActive && (
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                )}
              </GlassButton>
            );
          })}
        </div>
      </div>

      {/* Theme Preview & Actions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-white">Actions</h4>
        </div>

        <div className="flex gap-3">
          <GlassButton variant="ghost" size="sm" onClick={resetToDefaults} className="flex-1">
            Reset to Defaults
          </GlassButton>
        </div>

        {/* Live Theme Info */}
        <GlassCard variant="subtle" className="p-3">
          <div className="space-y-1 text-xs text-gray-400">
            <div>
              Effective Theme: <span className="text-cyan-400">{effectiveTheme}</span>
            </div>
            <div>
              Performance: <span className="text-cyan-400">{performance}</span>
            </div>
            <div>
              Time-Based: <span className="text-cyan-400">{timeBasedEnabled ? "On" : "Off"}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
