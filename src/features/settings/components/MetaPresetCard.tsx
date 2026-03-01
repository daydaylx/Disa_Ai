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
      onClick={() => onApply(preset)}
      className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
        isActive
          ? "border-brand bg-brand/5 shadow-brandGlow"
          : "border-transparent bg-surface-2 hover:bg-surface-3 hover:-translate-y-0.5"
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${styles.bg}`}>
        <Icon className={`w-5 h-5 ${styles.text}`} />
      </div>
      <p className="font-bold text-text-primary mb-1">{preset.label}</p>
      <p className="text-xs text-text-secondary leading-relaxed">{preset.description}</p>
      {isActive && (
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-brand shadow-brandGlow" />
      )}
    </button>
  );
}
