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
  const baseClasses = "card flex min-h-[120px] flex-col items-center justify-center text-center";
  const interactiveClasses =
    onPress && !disabled
      ? "cursor-pointer transition-transform duration-fast hover:-translate-y-[1px]"
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
        <div className="mb-2 text-2xl text-accent" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <div className="text-sm font-semibold text-text-primary">{title}</div>
      {subtitle ? <div className="mt-1 text-xs text-text-muted">{subtitle}</div> : null}
    </div>
  );
};
