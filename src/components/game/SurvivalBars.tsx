import { Activity, Moon, Utensils, Waves } from "@/lib/icons";

import type { SurvivalState } from "../../hooks/useGameState";

interface SurvivalBarsProps {
  survival: SurvivalState;
}

interface SurvivalBarConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  value: number;
  gradient: string;
  warningThreshold: number;
  criticalThreshold: number;
}

export function SurvivalBars({ survival }: SurvivalBarsProps) {
  const bars: SurvivalBarConfig[] = [
    {
      label: "Hunger",
      icon: Utensils,
      iconColor: "text-amber-400",
      value: survival.hunger,
      gradient: "from-amber-500 to-amber-300",
      warningThreshold: 30,
      criticalThreshold: 15,
    },
    {
      label: "Durst",
      icon: Waves,
      iconColor: "text-blue-400",
      value: survival.thirst,
      gradient: "from-blue-500 to-blue-300",
      warningThreshold: 30,
      criticalThreshold: 15,
    },
    {
      label: "Strahlung",
      icon: Activity,
      iconColor: "text-lime-400",
      value: survival.radiation,
      gradient: "from-lime-500 to-lime-300",
      warningThreshold: 50,
      criticalThreshold: 75,
    },
    {
      label: "Müdigkeit",
      icon: Moon,
      iconColor: "text-purple-400",
      value: survival.fatigue,
      gradient: "from-purple-500 to-purple-300",
      warningThreshold: 50,
      criticalThreshold: 75,
    },
  ];

  const getBarColor = (bar: SurvivalBarConfig) => {
    // For hunger/thirst, low is bad
    if (bar.label === "Hunger" || bar.label === "Durst") {
      if (bar.value <= bar.criticalThreshold) {
        return "from-status-error to-red-400";
      }
      if (bar.value <= bar.warningThreshold) {
        return "from-orange-500 to-orange-300";
      }
    }
    // For radiation/fatigue, high is bad
    else {
      if (bar.value >= bar.criticalThreshold) {
        return "from-status-error to-red-400";
      }
      if (bar.value >= bar.warningThreshold) {
        return "from-orange-500 to-orange-300";
      }
    }
    return bar.gradient;
  };

  const getTextColor = (bar: SurvivalBarConfig) => {
    // For hunger/thirst, low is bad
    if (bar.label === "Hunger" || bar.label === "Durst") {
      if (bar.value <= bar.criticalThreshold) return "text-status-error";
      if (bar.value <= bar.warningThreshold) return "text-orange-400";
    }
    // For radiation/fatigue, high is bad
    else {
      if (bar.value >= bar.criticalThreshold) return "text-status-error";
      if (bar.value >= bar.warningThreshold) return "text-orange-400";
    }
    return "text-ink-secondary";
  };

  return (
    <div className="space-y-2">
      <div className="text-[11px] uppercase tracking-[0.18em] text-ink-tertiary mb-3">
        Überlebensstatus
      </div>
      <div className="grid grid-cols-2 gap-2">
        {bars.map((bar) => {
          const Icon = bar.icon;
          return (
            <div key={bar.label} className="space-y-1">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.16em]">
                <span className={`flex items-center gap-1 ${getTextColor(bar)}`}>
                  <Icon className={`h-3 w-3 ${bar.iconColor}`} />
                  {bar.label}
                </span>
                <span className={getTextColor(bar)}>{bar.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-2/80 border border-white/10 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getBarColor(bar)} transition-[width] duration-500 ease-out`}
                  style={{ width: `${bar.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
