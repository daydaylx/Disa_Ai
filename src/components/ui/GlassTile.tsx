import * as React from "react";

import { cn } from "../../lib/cn";

// The props are simplified: `gradient` and `glowClassName` are removed as the new
// .glass-surface class handles these aspects centrally.
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
  /** Label for the pill badge in the top-right corner */
  badgeLabel?: string;
  /** Visual tone to derive accent colours */
  badgeTone?: "warm" | "cool" | "fresh" | "sunset" | "violet" | "default";
}

export const GlassTile: React.FC<GlassTileProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  className = "",
  disabled = false,
  "data-testid": dataTestId,
  badgeLabel,
  badgeTone = "default",
}) => {
  // The toneStyles are now mapped to the semantic colors from the design system,
  // ensuring consistency with the rest of the application.
  const toneStyles: Record<
    NonNullable<GlassTileProps["badgeTone"]>,
    { badge: string; stripe: string }
  > = {
    warm: {
      badge: "border-semantic-warning/40 text-semantic-warning",
      stripe: "from-semantic-warning/35 via-semantic-warning/25 to-transparent",
    },
    cool: {
      badge: "border-accent-500/40 text-accent-500",
      stripe: "from-accent-500/35 via-accent-500/25 to-transparent",
    },
    fresh: {
      badge: "border-semantic-success/40 text-semantic-success",
      stripe: "from-semantic-success/35 via-semantic-success/25 to-transparent",
    },
    sunset: {
      badge: "border-semantic-danger/40 text-semantic-danger",
      stripe: "from-semantic-danger/30 via-semantic-danger/25 to-transparent",
    },
    violet: {
      badge: "border-semantic-purple/40 text-semantic-purple",
      stripe: "from-semantic-purple/35 via-semantic-purple/25 to-transparent",
    },
    default: {
      badge: "border-white/20 text-zinc-200",
      stripe: "from-white/25 via-white/10 to-transparent",
    },
  };

  const accents = toneStyles[badgeTone] ?? toneStyles.default;

  // The component now uses the unified .glass-surface class.
  // All custom hover, shadow, and gradient logic has been removed in favor of the central system.
  const disabledClasses = disabled ? "cursor-not-allowed opacity-50" : "";

  return (
    <button
      data-testid={dataTestId}
      className={cn(
        "glass-card w-full text-left text-white",
        "px-4 py-4 sm:px-5 sm:py-5",
        "min-h-[84px] sm:min-h-[96px] lg:min-h-[104px]",
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
            "bg-white/8 inline-flex h-7 items-center rounded-full border px-3 text-[12px] font-medium text-zinc-200 transition-colors duration-150",
            accents.badge,
          )}
        >
          {badgeLabel ?? "Schnellstart"}
        </span>
      </div>
    </button>
  );
};
