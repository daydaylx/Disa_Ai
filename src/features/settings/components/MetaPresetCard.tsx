import type { BehaviorPreset } from "@/config/behavior-presets";

interface MetaPresetCardProps {
  preset: BehaviorPreset;
  isActive: boolean;
  onApply: (preset: BehaviorPreset) => void;
}

export function MetaPresetCard({ preset, isActive, onApply }: MetaPresetCardProps) {
  const Icon = preset.icon;

  return (
    <button
      onClick={() => onApply(preset)}
      className={`relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 text-left group ${
        isActive
          ? "border-brand bg-brand/5 shadow-brandGlow"
          : "border-transparent bg-surface-2 hover:bg-surface-3 hover:-translate-y-0.5"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${preset.bgColor}`}
      >
        <Icon className={`w-5 h-5 ${preset.color}`} />
      </div>
      <h3 className="font-bold text-text-primary mb-1">{preset.label}</h3>
      <p className="text-xs text-text-secondary leading-relaxed">{preset.description}</p>
      {isActive && (
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-brand shadow-brandGlow" />
      )}
    </button>
  );
}
