import { Badge, Card, Label, Switch } from "@/ui";

import { FONT_SIZE_MAX, FONT_SIZE_MIN, FONT_SIZE_STEP, THEME_OPTIONS } from "../constants";

interface AppearanceSettingsPanelProps {
  theme: "light" | "dark" | "auto" | "oled";
  fontSize: number;
  reduceMotion: boolean;
  oledMode: boolean;
  batterySaver: boolean;
  hapticFeedback: boolean;
  onThemeChange: (theme: "light" | "dark" | "auto" | "oled") => void;
  onFontSizeChange: (size: number) => void;
  onReduceMotionToggle: () => void;
  onOledModeToggle: () => void;
  onBatterySaverToggle: () => void;
  onHapticFeedbackToggle: () => void;
}

export function AppearanceSettingsPanel({
  theme,
  fontSize,
  reduceMotion,
  oledMode,
  batterySaver,
  hapticFeedback,
  onThemeChange,
  onFontSizeChange,
  onReduceMotionToggle,
  onOledModeToggle,
  onBatterySaverToggle,
  onHapticFeedbackToggle,
}: AppearanceSettingsPanelProps) {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden rounded-[26px] border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl">
        <div className="space-y-4 p-4 sm:p-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Label className="text-sm font-semibold text-ink-primary">Design-Modus</Label>
              <Badge variant="settings" size="sm">
                Aktiv: {THEME_OPTIONS.find((option) => option.value === theme)?.label ?? theme}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed text-ink-secondary">
              Wähle den Grundlook der App. Die aktive Auswahl gilt sofort auf allen Seiten.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {THEME_OPTIONS.map(({ value, label }) => {
              const isActive = theme === value;
              return (
                <button
                  type="button"
                  key={value}
                  onClick={() => onThemeChange(value)}
                  aria-pressed={isActive}
                  className={`flex min-h-[56px] items-center justify-between rounded-[20px] border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-settings ${
                    isActive
                      ? "border-accent-settings-border bg-accent-settings-dim/40 text-ink-primary shadow-[0_16px_30px_-24px_rgba(251,191,36,0.75)]"
                      : "border-white/[0.08] bg-black/[0.10] text-ink-secondary hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-ink-primary"
                  }`}
                >
                  <span className="text-sm font-medium">{label}</span>
                  {isActive ? (
                    <Badge variant="settings" size="sm" className="rounded-full">
                      Aktiv
                    </Badge>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      <Card className="rounded-[26px] border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl">
        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <Label
                htmlFor="appearance-font-size"
                className="text-sm font-semibold text-ink-primary"
              >
                Schriftgröße
              </Label>
              <p className="mt-1 text-sm leading-relaxed text-ink-secondary">
                Passe die Lesbarkeit an, ohne das Layout zu sprengen.
              </p>
            </div>
            <Badge variant="settings" size="sm">
              {fontSize}px
            </Badge>
          </div>
          <div className="rounded-[20px] border border-white/[0.08] bg-black/[0.10] px-4 py-4 shadow-inner">
            <input
              id="appearance-font-size"
              type="range"
              min={FONT_SIZE_MIN}
              max={FONT_SIZE_MAX}
              step={FONT_SIZE_STEP}
              value={fontSize}
              onChange={(e) => onFontSizeChange(Number(e.target.value))}
              className="h-11 w-full cursor-pointer rounded-full bg-surface-2/50 accent-accent-settings"
            />
            <div className="mt-3 flex justify-between text-xs text-ink-muted">
              <span>Aa Klein</span>
              <span>Aa Groß</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="rounded-[26px] border-white/[0.10] bg-surface-1/82 shadow-[0_16px_38px_-30px_rgba(0,0,0,0.76)] ring-1 ring-inset ring-white/[0.04] sm:backdrop-blur-xl">
        <div className="space-y-3 p-4 sm:p-5">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-ink-primary">Komfort & Energie</p>
            <p className="text-sm leading-relaxed text-ink-secondary">
              Diese Schalter helfen dir, Animationen, Akkuverbrauch und haptische Rückmeldung an
              dein Gerät anzupassen.
            </p>
          </div>

          {[
            {
              label: "OLED Dark Mode",
              description: "Pure Black für OLED Displays und sparsamere Darstellung.",
              checked: oledMode,
              onChange: onOledModeToggle,
              ariaLabel: "OLED Dark Mode",
            },
            {
              label: "Animationen reduzieren",
              description: "Verringert Bewegung und Übergänge für ruhigere Bedienung.",
              checked: reduceMotion,
              onChange: onReduceMotionToggle,
              ariaLabel: "Animationen reduzieren",
            },
            {
              label: "Batteriesparmodus",
              description: "Reduziert Effekte und hilft auf schwächeren oder mobilen Geräten.",
              checked: batterySaver,
              onChange: onBatterySaverToggle,
              ariaLabel: "Batteriesparmodus",
            },
            {
              label: "Haptisches Feedback",
              description: "Bestätigt Aktionen mit leichter Vibration auf unterstützten Geräten.",
              checked: hapticFeedback,
              onChange: onHapticFeedbackToggle,
              ariaLabel: "Haptisches Feedback",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col gap-4 rounded-[20px] border border-white/[0.08] bg-black/[0.10] px-4 py-4 shadow-inner sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink-primary">{item.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink-tertiary">{item.description}</p>
              </div>
              <Switch
                checked={item.checked}
                onCheckedChange={item.onChange}
                aria-label={item.ariaLabel}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
