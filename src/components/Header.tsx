import React from "react";

import { Menu } from "../lib/icons";
import { cn } from "../lib/utils";
import { FeatureFlagIndicator } from "./dev/FeatureFlagPanel";
import { ThemeToggle } from "./navigation/ThemeToggle";
import { Button } from "./ui/button";

interface HeaderProps {
  status?: "online" | "offline" | "loading" | "error";
  model?: string;
  tokensUsed?: number;
  /** Header style variant */
  variant?: "neo-floating" | "neo-glass" | "neo-dramatic" | "default";
  /** Enable condensed state enhancement */
  enhanced?: boolean;
}

const STATUS_META: Record<
  NonNullable<HeaderProps["status"]>,
  { label: string; bg: string; dot: string; text: string; glow: string }
> = {
  online: {
    label: "Online",
    bg: "bg-gradient-to-r from-[var(--succ)]/10 to-[var(--succ)]/5 border-[var(--succ)]/30 shadow-[var(--shadow-neumorphic-sm)]",
    dot: "bg-[var(--succ)] shadow-[0_0_8px_var(--succ)]/50",
    text: "text-[var(--succ)]",
    glow: "hover:shadow-[0_0_15px_var(--succ)]/30",
  },
  offline: {
    label: "Offline",
    bg: "bg-gradient-to-r from-[var(--err)]/10 to-[var(--err)]/5 border-[var(--err)]/30 shadow-[var(--shadow-neumorphic-sm)]",
    dot: "bg-[var(--err)] shadow-[0_0_8px_var(--err)]/50",
    text: "text-[var(--err)]",
    glow: "hover:shadow-[0_0_15px_var(--err)]/30",
  },
  loading: {
    label: "Verbinde",
    bg: "bg-gradient-to-r from-[var(--warn)]/10 to-[var(--warn)]/5 border-[var(--warn)]/30 shadow-[var(--shadow-neumorphic-sm)]",
    dot: "bg-[var(--warn)] shadow-[0_0_8px_var(--warn)]/50 animate-pulse",
    text: "text-[var(--warn)]",
    glow: "hover:shadow-[0_0_15px_var(--warn)]/30",
  },
  error: {
    label: "Fehler",
    bg: "bg-gradient-to-r from-[var(--err)]/10 to-[var(--err)]/5 border-[var(--err)]/30 shadow-[var(--shadow-neumorphic-sm)]",
    dot: "bg-[var(--err)] shadow-[0_0_8px_var(--err)]/50",
    text: "text-[var(--err)]",
    glow: "hover:shadow-[0_0_15px_var(--err)]/30",
  },
};

export const Header: React.FC<HeaderProps> = ({
  status = "online",
  model = "openrouter/auto",
  tokensUsed = 0,
  variant = "neo-floating",
  enhanced = true,
}) => {
  const [condensed, setCondensed] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setCondensed(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const statusMeta = STATUS_META[status];

  const toggleBottomSheet = () => {
    window.dispatchEvent(
      new CustomEvent("disa:bottom-sheet", { detail: { action: "toggle" as const } }),
    );
  };

  const headerVariantClasses = {
    "neo-floating": [
      // Floating Header Foundation
      "bg-[var(--surface-neumorphic-floating)]",
      "shadow-[var(--shadow-neumorphic-lg)]",
      "border-b-[var(--border-neumorphic-light)]",
      "backdrop-blur-xl",
      // Enhanced Condensed State
      condensed &&
        enhanced && [
          "shadow-[var(--shadow-neumorphic-xl)]",
          "bg-[var(--surface-neumorphic-floating)]",
          "scale-[0.98]",
          "mx-2 mt-2 rounded-[var(--radius-xl)]",
          "border-[var(--border-neumorphic-light)]",
        ],
    ]
      .filter(Boolean)
      .flat()
      .join(" "),

    "neo-glass": [
      "bg-[var(--surface-neumorphic-floating)]/90",
      "shadow-[var(--shadow-neumorphic-md)]",
      "border-b-[var(--border-neumorphic-light)]/50",
      "backdrop-blur-2xl backdrop-saturate-150",
      condensed &&
        enhanced && [
          "shadow-[var(--shadow-neumorphic-lg)]",
          "bg-[var(--surface-neumorphic-floating)]/95",
        ],
    ]
      .filter(Boolean)
      .flat()
      .join(" "),

    "neo-dramatic": [
      "bg-gradient-to-r from-[var(--acc1)] via-[color-mix(in_srgb,var(--acc1)_60%,var(--acc2)_40%)] to-[var(--acc2)]",
      "shadow-[var(--shadow-neumorphic-xl)]",
      "border-b-[var(--border-neumorphic-light)]",
      "backdrop-blur-xl",
      condensed &&
        enhanced && [
          "shadow-[var(--shadow-neumorphic-dramatic)]",
          "bg-gradient-to-r from-white via-[var(--surface-neumorphic-floating)] to-white",
          "scale-[0.95]",
          "mx-4 mt-2 rounded-[var(--radius-2xl)]",
        ],
    ]
      .filter(Boolean)
      .flat()
      .join(" "),

    default: [
      "bg-[var(--surface-neumorphic-raised)]",
      "shadow-[var(--shadow-neumorphic-sm)]",
      "border-b-[var(--border-neumorphic-subtle)]",
      condensed && "shadow-[var(--shadow-neumorphic-md)]",
    ]
      .filter(Boolean)
      .join(" "),
  };

  return (
    <header
      className={cn(
        // Base Layout
        "safe-x sticky top-0 z-40 pt-safe-top",
        "transition-all duration-300 ease-out",

        // Variant-specific styling
        headerVariantClasses[variant],

        // Padding based on condensed state
        condensed ? "pb-3 pt-3" : "pb-4 pt-4",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-6xl items-center justify-between gap-6",
          enhanced ? "px-6" : "px-4",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {/* Dramatic Neomorphic Logo */}
          <div
            className={cn(
              "flex items-center justify-center rounded-[var(--radius-lg)] transition-all duration-300 ease-out",
              "bg-gradient-to-br from-[var(--acc1)] to-[var(--acc2)]",
              "shadow-[var(--shadow-neumorphic-md)]",
              "size-11",
              // Enhanced states
              "hover:shadow-[var(--shadow-neumorphic-lg)]",
              "hover:scale-105",
              "active:shadow-[var(--shadow-inset-subtle)]",
              "active:scale-95",
              // Brand glow effect
              "hover:shadow-[0_0_20px_rgba(75,99,255,0.3)]",
            )}
          >
            <span className="inline-flex items-center justify-center rounded-sm px-1 text-lg font-bold text-white shadow-glow-brand">
              DA
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <div className="text-lg font-semibold leading-tight text-[var(--color-text-primary)]">
              Disa AI
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-text-tertiary)]">
              {/* Dramatic Neomorphic Status Badge */}
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 border transition-all duration-300 ease-out",
                  statusMeta.bg,
                  statusMeta.text,
                  statusMeta.glow,
                  "hover:scale-105 cursor-pointer",
                )}
              >
                <span
                  className={cn("h-2.5 w-2.5 rounded-full", statusMeta.dot)}
                  aria-hidden="true"
                />
                {statusMeta.label}
              </span>

              {/* Model Info with Neomorphic Container */}
              <span
                className={cn(
                  "truncate px-2 py-1 rounded-md",
                  "bg-[var(--surface-neumorphic-base)]",
                  "shadow-[var(--shadow-inset-subtle)]",
                  "border-[var(--border-neumorphic-subtle)]",
                  "text-[var(--color-text-secondary)]",
                  "hover:bg-[var(--surface-neumorphic-raised)]",
                  "hover:shadow-[var(--shadow-neumorphic-sm)]",
                  "transition-all duration-200 ease-out",
                )}
              >
                {model}
              </span>

              {/* Token Counter */}
              {tokensUsed > 0 && (
                <span
                  className={cn(
                    "px-2 py-1 rounded-md font-medium",
                    "bg-[var(--surface-neumorphic-raised)]",
                    "shadow-[var(--shadow-neumorphic-sm)]",
                    "border-[var(--border-neumorphic-light)]",
                    "text-[var(--color-text-secondary)]",
                    "hover:text-[var(--color-text-primary)]",
                    "transition-all duration-200 ease-out",
                  )}
                >
                  {tokensUsed} Tokens
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Action Buttons */}
        <div className="flex shrink-0 items-center gap-2">
          <FeatureFlagIndicator />
          <Button
            type="button"
            variant="neo-subtle"
            size="icon"
            aria-label="Schnellmenü öffnen"
            onClick={toggleBottomSheet}
            className="hover:shadow-[0_0_15px_rgba(75,99,255,0.2)]"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
