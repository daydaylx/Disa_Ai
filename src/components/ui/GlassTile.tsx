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
    "tile group flex flex-col items-center justify-center text-center min-h-[120px] touch-target transition-transform duration-200";
  const interactiveClasses =
    onPress && !disabled
      ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(9,11,17,0.75)]"
      : "";
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
        <div
          className="text-accent-1/90 mb-2 text-2xl transition duration-200 group-hover:text-accent-1"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
      <div className="text-sm font-medium">{title}</div>
      {subtitle && <div className="mt-1 text-xs text-text-secondary opacity-70">{subtitle}</div>}
    </div>
  );
};
