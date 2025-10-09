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
  /** Label for the pill badge in the top-right corner */
  badgeLabel?: string;
  /** Visual tone to derive accent colours */
  badgeTone?: "warm" | "cool" | "fresh" | "sunset" | "violet" | "default";
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
  badgeLabel,
  badgeTone = "default",
}) => {
  const toneStyles: Record<
    NonNullable<GlassTileProps["badgeTone"]>,
    { badge: string; stripe: string }
  > = {
    warm: {
      badge: "border-amber-300/40 text-amber-200",
      stripe: "from-amber-400/35 via-orange-400/25 to-transparent",
    },
    cool: {
      badge: "border-sky-300/40 text-sky-200",
      stripe: "from-sky-400/35 via-blue-400/25 to-transparent",
    },
    fresh: {
      badge: "border-emerald-300/40 text-emerald-200",
      stripe: "from-emerald-400/35 via-teal-400/25 to-transparent",
    },
    sunset: {
      badge: "border-orange-300/40 text-orange-200",
      stripe: "from-orange-400/30 via-amber-400/25 to-transparent",
    },
    violet: {
      badge: "border-fuchsia-300/40 text-fuchsia-200",
      stripe: "from-fuchsia-400/35 via-purple-400/25 to-transparent",
    },
    default: {
      badge: "border-white/20 text-zinc-200",
      stripe: "from-white/25 via-white/10 to-transparent",
    },
  };

  const accents = toneStyles[badgeTone] ?? toneStyles.default;
  const baseClasses = `relative overflow-hidden w-full text-left bg-white/[0.06] border border-white/[0.1] text-white
    rounded-2xl sm:rounded-3xl px-4 py-4 sm:px-5 sm:py-5
    min-h-[84px] sm:min-h-[96px] lg:min-h-[104px]
    shadow-[0_8px_28px_-8px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.15)]
    transition-[transform,background,box-shadow] duration-200 ease-out
    backdrop-blur-[20px] backdrop-brightness-[1.15]`;

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
    ? `before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br ${gradientOverlayClasses} before:opacity-15 before:content-['']`
    : "";

  const highlightClasses =
    "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_70%)] after:opacity-70 after:content-['']";

  const glowClasses = glowClassName ?? "shadow-[0_16px_40px_rgba(5,8,18,0.45)]";

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
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-x-5 top-2 h-px rounded-full bg-gradient-to-r opacity-70",
          accents.stripe,
        )}
      />
      {/* Content Layout */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-4">
          {icon && <div className="pt-0.5 text-zinc-300">{icon}</div>}
          <div>
            <div className="text-[17px] font-medium text-zinc-100">{title}</div>
            {subtitle && (
              <div className="mt-1.5 text-[13.5px] leading-[1.55] text-zinc-400">{subtitle}</div>
            )}
          </div>
        </div>

        {/* Quickstart Pill */}
        <span
          className={cn(
            "inline-flex h-7 items-center rounded-full border border-white/[0.12] bg-white/[0.08] px-3 text-[12px] font-medium text-zinc-100 backdrop-blur-sm backdrop-brightness-110 transition-colors duration-150",
            accents.badge,
          )}
        >
          {badgeLabel ?? "Schnellstart"}
        </span>
      </div>
    </button>
  );
};
