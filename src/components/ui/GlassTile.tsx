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
  /** Test ID for e2e tests */
  "data-testid"?: string;
}

export const GlassTile: React.FC<GlassTileProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  className = "",
  disabled = false,
  "data-testid": dataTestId,
}) => {
  const baseClasses =
    "tile group flex min-h-[140px] flex-col items-start justify-between rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 text-left transition-all duration-300 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.3)]";
  const interactiveClasses =
    onPress && !disabled
      ? "cursor-pointer hover:border-white/30 hover:bg-gradient-to-br hover:from-white/15 hover:to-white/8 hover:shadow-[0_12px_40px_rgba(255,255,255,0.1)] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
      data-testid={dataTestId}
      className={cn(baseClasses, interactiveClasses, disabledClasses, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onPress ? "button" : undefined}
      tabIndex={onPress && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      <div className="flex w-full flex-col">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className="text-right">
            <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20">
              Schnellstart
            </button>
          </div>
        </div>
        {subtitle ? <p className="text-sm leading-relaxed text-white/80">{subtitle}</p> : null}
      </div>
    </div>
  );
};
