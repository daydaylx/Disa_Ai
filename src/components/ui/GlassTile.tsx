import * as React from "react";

import { cn } from "../../lib/cn";

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
    "tile group flex min-h-[120px] flex-col items-center justify-center text-center transition-transform duration-200";
  const interactiveClasses =
    onPress && !disabled
      ? "cursor-pointer hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(9,11,17,0.75)]"
      : "";
  const disabledClasses = disabled ? "cursor-not-allowed opacity-50" : "";

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
      className={cn(baseClasses, interactiveClasses, disabledClasses, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onPress ? "button" : undefined}
      tabIndex={onPress && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      {icon ? (
        <div
          className="text-accent-500/90 mb-2 text-2xl transition duration-200 group-hover:text-accent-500"
          aria-hidden="true"
        >
          {icon}
        </div>
      ) : null}
      <div className="text-sm font-medium text-white">{title}</div>
      {subtitle ? <div className="mt-1 text-xs text-white/70 opacity-70">{subtitle}</div> : null}
    </div>
  );
};
