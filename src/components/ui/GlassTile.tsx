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
  // Base GlassCard system nach Spezifikation
  const baseClasses = `glass-card relative
    bg-white/5 border border-white/15 rounded-2xl
    backdrop-blur-md backdrop-saturate-150
    shadow-[0_8px_30px_rgba(0,0,0,0.32)]
    px-5 py-4 min-h-[84px]
    transition-[transform,background] duration-150 ease-out`;

  // Gradient-System für Farbvarianten
  const gradientClasses = gradient ? `bg-gradient-to-tr ${gradient}` : "";

  // Interaktive Klassen nach neuer Spezifikation
  const interactiveClasses =
    onPress && !disabled
      ? "cursor-pointer hover:bg-white/7 hover:-translate-y-0.5 active:translate-y-[0.125rem] active:shadow-[0_4px_18px_rgba(0,0,0,0.26)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
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
      className={cn(baseClasses, gradientClasses, interactiveClasses, disabledClasses, className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onPress ? "button" : undefined}
      tabIndex={onPress && !disabled ? 0 : undefined}
      aria-disabled={disabled}
    >
      {/* Glass-Highlight nach Spezifikation */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent"
        style={{ clipPath: "inset(0 0 72% 0)" }}
      />

      {/* Layout nach neuer Spezifikation */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[17px] font-medium text-white">{title}</div>
          {subtitle && (
            <div className="mt-1.5 text-[13.5px] leading-[1.55] text-white/70">{subtitle}</div>
          )}
        </div>

        {/* Schnellstart-Pill nach neuer Spezifikation */}
        <button className="bg-white/6 border-white/12 hover:bg-white/8 inline-flex h-7 items-center rounded-full border px-3 text-[12px] text-white/85 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-white/20">
          Schnellstart
        </button>
      </div>
    </div>
  );
};
