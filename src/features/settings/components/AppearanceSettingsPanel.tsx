import { Label, Switch } from "@/ui";

import { FONT_SIZE_MAX, FONT_SIZE_MIN, FONT_SIZE_STEP, THEME_OPTIONS } from "../constants";

interface AppearanceSettingsPanelProps {
  theme: "light" | "dark" | "auto";
  fontSize: number;
  reduceMotion: boolean;
  hapticFeedback: boolean;
  onThemeChange: (theme: "light" | "dark" | "auto") => void;
  onFontSizeChange: (size: number) => void;
  onReduceMotionToggle: () => void;
  onHapticFeedbackToggle: () => void;
}

export function AppearanceSettingsPanel({
  theme,
  fontSize,
  reduceMotion,
  hapticFeedback,
  onThemeChange,
  onFontSizeChange,
  onReduceMotionToggle,
  onHapticFeedbackToggle,
}: AppearanceSettingsPanelProps) {
  return (
    <div className="p-4 sm:p-6 space-y-6 bg-surface-1 animate-in slide-in-from-top-2 duration-200">
      {/* Theme */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-text-primary">Design-Modus</Label>
        <div className="flex p-1 rounded-lg bg-surface-inset border border-surface-2">
          {THEME_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onThemeChange(value)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                theme === value
                  ? "bg-surface-1 text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-3">
        <Label className="text-sm font-medium text-text-primary">Schriftgröße ({fontSize}px)</Label>
        <input
          type="range"
          min={FONT_SIZE_MIN}
          max={FONT_SIZE_MAX}
          step={FONT_SIZE_STEP}
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="w-full accent-brand h-2 rounded-full bg-surface-inset cursor-pointer"
        />
        <div className="flex justify-between text-xs text-text-muted">
          <span>Aa Klein</span>
          <span>Aa Groß</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-text-primary">Animationen reduzieren</span>
          <Switch checked={reduceMotion} onCheckedChange={onReduceMotionToggle} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-text-primary">Haptisches Feedback</span>
          <Switch checked={hapticFeedback} onCheckedChange={onHapticFeedbackToggle} />
        </div>
      </div>
    </div>
  );
}
