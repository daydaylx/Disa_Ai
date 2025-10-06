import * as React from "react";

import { cn } from "../../lib/cn";

export interface GlassTileProps {
  /** Icon element or component */
  icon?: React.ReactNode;
  /** Tile title */
  title: string;
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
  /** Optional glow/shadow class for subtle colour accent */
  glowClassName?: string;
}

// Safelist gradient utilities for Tailwind (keeps variants during build)
const gradientSafelist =
  "before:from-amber-400/80 before:via-yellow-300/65 before:to-orange-400/70 before:from-sky-500/80 before:via-blue-500/65 before:to-indigo-500/70 before:from-emerald-400/75 before:via-teal-500/60 before:to-lime-500/60 before:from-orange-500/80 before:via-amber-500/65 before:to-rose-500/60 before:from-fuchsia-500/80 before:via-purple-500/65 before:to-violet-500/70";
void gradientSafelist;

export const GlassTile: React.FC<GlassTileProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  className = "",
  disabled = false,
  "data-testid": dataTestId,
  gradient,
  glowClassName,
}) => {
  // Base classes for the glassmorphism effect and layout
  const baseClasses = `glass-card relative overflow-hidden w-full text-left
    border border-white/15 rounded-2xl sm:rounded-3xl
    backdrop-blur-md backdrop-saturate-150
    px-4 py-4 sm:px-5 sm:py-5
    min-h-[84px] sm:min-h-[96px] lg:min-h-[104px]
    transition-[transform,background,box-shadow] duration-200 ease-out`;

  // Gradient overlay for visual depth
  const gradientOverlayClasses = gradient
    ? gradient
        .split(" ")
        .map((token) => token.trim())
        .filter(Boolean)
        .map((token) => `before:${token}`)
        .join(" ")
    : "";

  const gradientClasses = gradient
    ? `bg-white/12 before:absolute before:inset-0 before:bg-gradient-to-br ${gradientOverlayClasses} before:opacity-75 before:rounded-2xl before:sm:rounded-3xl before:content-['']`
    : "bg-white/12";

  const highlightClasses =
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_transparent_68%)] after:opacity-80 after:content-['']";

  const glowClasses = glowClassName ?? "shadow-[0_20px_55px_rgba(8,7,24,0.45)]";

  // Interactive classes for hover, active, and focus states
  const interactiveClasses = onPress
    ? "hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] hover:border-white/25 active:scale-[0.98] active:shadow-[0_6px_20px_rgba(0,0,0,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    : "";

  // Disabled state classes
  const disabledClasses = disabled ? "cursor-not-allowed opacity-50" : "";

  return (
    <button
      data-testid={dataTestId}
      className={cn(
        baseClasses,
        gradientClasses,
        highlightClasses,
        glowClasses,
        interactiveClasses,
        disabledClasses,
        className,
      )}
      onClick={onPress}
      disabled={disabled}
    >
      {/* Glass highlight effect */}
      <div
        className="from-white/12 pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b via-transparent to-transparent"
        style={{ clipPath: "inset(0 0 72% 0)" }}
      />

      {/* Content Layout */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          {icon && <div className="pt-0.5 text-white/80">{icon}</div>}
          <div>
            <div className="text-[17px] font-medium text-white">{title}</div>
            {subtitle && (
              <div className="mt-1.5 text-[13.5px] leading-[1.55] text-white/70">{subtitle}</div>
            )}
          </div>
        </div>

        {/* Quickstart Pill */}
        <span className="bg-white/8 hover:bg-white/12 inline-flex h-7 items-center rounded-full border border-white/15 px-3 text-[12px] font-medium text-white/90 transition-colors duration-150">
          Schnellstart
        </span>
      </div>
    </button>
  );
};
