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
    "tile group flex min-h-[110px] flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all duration-200";
  const interactiveClasses =
    onPress && !disabled
      ? "cursor-pointer hover:border-white/20 hover:bg-white/10 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
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
