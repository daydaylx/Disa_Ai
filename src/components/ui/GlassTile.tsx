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
  /** Gradient background from quickstart config */
  gradient?: string;
}

export const GlassTile: React.FC<GlassTileProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  className = "",
  disabled = false,
  "data-testid": dataTestId,
  gradient,
}) => {
  const baseClasses = gradient
    ? `tile group flex min-h-[80px] flex-col justify-between rounded-2xl border border-white/15 px-5 py-4 text-left shadow-[0_8px_30px_rgba(0,0,0,0.28)] transition-transform duration-150 ease-out bg-gradient-to-br ${gradient}`
    : "tile group flex min-h-[60px] flex-col justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left backdrop-blur-md backdrop-saturate-150 shadow-[0_8px_30px_rgba(0,0,0,0.28)] transition-transform duration-150 ease-out";
  const interactiveClasses =
    onPress && !disabled
      ? gradient
        ? "cursor-pointer hover:brightness-110 hover:scale-[1.02] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
        : "cursor-pointer hover:bg-white/7 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
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
      <div className="flex w-full flex-col gap-2">
        <div className="flex items-start justify-between">
          <h3 className="text-[18px] font-bold leading-tight text-white">{title}</h3>
          <div className="shrink-0">
            <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
              Schnellstart
            </span>
          </div>
        </div>
        {subtitle ? <p className="text-[13px] leading-relaxed text-white/90">{subtitle}</p> : null}
      </div>
    </div>
  );
};
