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
  // Responsive glassmorphism system mit verbesserter Skalierung
  const baseClasses = `glass-card relative overflow-hidden
    border border-white/20 rounded-2xl sm:rounded-3xl
    backdrop-blur-md backdrop-saturate-150
    shadow-[0_8px_30px_rgba(0,0,0,0.32)]
    px-4 py-4 sm:px-5 sm:py-5
    min-h-[84px] sm:min-h-[96px] lg:min-h-[104px]
    transition-[transform,background,box-shadow] duration-200 ease-out`;

  // Improved gradient system that works with glassmorphism
  // Use a base layer with alpha transparency and overlay gradient
  const gradientClasses = gradient
    ? `before:absolute before:inset-0 before:bg-gradient-to-br before:${gradient} before:opacity-60 before:rounded-2xl before:sm:rounded-3xl`
    : "bg-white/8";

  // Enhanced interactive classes with better scaling
  const interactiveClasses =
    onPress && !disabled
      ? "cursor-pointer hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-white/25 active:scale-[0.98] active:shadow-[0_6px_20px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
