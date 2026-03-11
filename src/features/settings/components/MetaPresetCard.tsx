import type { BehaviorPreset } from "@/config/behavior-presets";
import { BEHAVIOR_PRESET_STYLES } from "@/config/behavior-presets";

interface MetaPresetCardProps {
  preset: BehaviorPreset;
  isActive: boolean;
  onApply: (preset: BehaviorPreset) => void;
}

export function MetaPresetCard({ preset, isActive, onApply }: MetaPresetCardProps) {
  const Icon = preset.icon;
  const styles = BEHAVIOR_PRESET_STYLES[preset.id];

  return (
    <button
      type="button"
      onClick={() => onApply(preset)}
      className={`group relative flex min-h-[196px] flex-col items-start rounded-[24px] border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-settings ${
        isActive
          ? "border-accent-settings-border bg-accent-settings-dim/30 shadow-[0_18px_34px_-26px_rgba(251,191,36,0.8)] ring-1 ring-inset ring-accent-settings-border/35"
          : "border-white/[0.10] bg-surface-1/82 shadow-[0_14px_30px_-26px_rgba(0,0,0,0.72)] ring-1 ring-inset ring-white/[0.04] hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-surface-2/72 hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,0.78)]"
      }`}
    >
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] shadow-inner ${styles.bg}`}
      >
        <Icon className={`h-5 w-5 ${styles.text}`} />
      </div>
      <p className="mb-1 text-base font-semibold tracking-tight text-ink-primary">{preset.label}</p>
      <p className="text-sm leading-relaxed text-ink-secondary">{preset.description}</p>
      {isActive && (
        <div className="absolute right-4 top-4 inline-flex min-h-[28px] items-center rounded-full border border-accent-settings-border/50 bg-accent-settings-dim/65 px-2.5 text-[11px] font-semibold text-ink-primary shadow-sm">
          Aktiv
        </div>
      )}
      <div className="mt-auto pt-4 text-xs font-medium uppercase tracking-[0.16em] text-ink-tertiary">
        {isActive ? "Wird aktuell genutzt" : "Tippen zum Übernehmen"}
      </div>
    </button>
  );
}
