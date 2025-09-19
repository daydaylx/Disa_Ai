import * as React from "react";

export interface GlassTileProps {
  /** Icon element or component */
  icon?: React.ReactNode;
  /** Tile title */
  title: string;
  /** Optional subtitle or description */
  subtitle?: string;
  /** Click handler */
  onPress?: () => void;
  /** Optional className for additional styling */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export const GlassTile: React.FC<GlassTileProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  className = "",
  disabled = false,
}) => {
  const baseClasses =
    "tile flex flex-col items-center justify-center text-center min-h-[120px] touch-target";
  const interactiveClasses =
    onPress && !disabled ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98]" : "";
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  const handleClick = () => {
    if (!disabled && onPress) {
      onPress();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled && onPress && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onPress();
    }
  };

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${disabledClasses} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onPress ? "button" : undefined}
      tabIndex={onPress && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      {icon && (
        <div className="mb-2 text-2xl opacity-80" aria-hidden="true">
          {icon}
        </div>
      )}
      <div className="text-sm font-medium">{title}</div>
      {subtitle && <div className="mt-1 text-xs text-text-secondary opacity-70">{subtitle}</div>}
    </div>
  );
};
