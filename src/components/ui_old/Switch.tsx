import React from "react";

import { cn } from "../../lib/utils";

interface SwitchProps {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
  /** Size variant for different scales */
  size?: "sm" | "md" | "lg";
  /** Variant for different visual intensity */
  variant?: "default" | "dramatic";
}

const switchSizes = {
  sm: {
    track: "h-5 w-9",
    thumb: "h-3.5 w-3.5",
    checkedTranslate: "translate-x-4",
    uncheckedTranslate: "translate-x-0.5",
  },
  md: {
    track: "h-6 w-11",
    thumb: "h-4 w-4",
    checkedTranslate: "translate-x-6",
    uncheckedTranslate: "translate-x-1",
  },
  lg: {
    track: "h-8 w-14",
    thumb: "h-6 w-6",
    checkedTranslate: "translate-x-7",
    uncheckedTranslate: "translate-x-1",
  },
};

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      onChange,
      id,
      disabled = false,
      "aria-describedby": describedBy,
      size = "md",
      className,
    },
    ref,
  ) => {
    const handleClick = () => {
      if (!disabled) {
        onChange(!checked);
      }
    };

    const sizeConfig = switchSizes[size];

    return (
      <button
        ref={ref}
        id={id}
        role="switch"
        aria-checked={checked}
        aria-describedby={describedBy}
        onClick={handleClick}
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center rounded-full",
          className,
          "relative inline-flex items-center rounded-full",
          sizeConfig.track,

          // Glassmorphic Track Foundation
          "bg-[color-mix(in_srgb,var(--surface-card)_85%,transparent)]",
          "border border-[color-mix(in_srgb,var(--line)_70%,transparent)]",
          "shadow-[0_2px_8px_rgba(0,0,0,0.1)]",
          "backdrop-blur-sm",

          // Checked State Track (Illuminated)
          checked &&
            [
              "bg-[color-mix(in_srgb,var(--primary)_20%,transparent)]",
              "border-[color-mix(in_srgb,var(--primary)_50%,transparent)]",
              "shadow-glow-primary",
            ].join(" "),

          // Focus State (Glassmorphic)
          "focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",

          // Interactive States
          "transition-all duration-[180ms] ease-[cubic-bezier(.23,1,.32,1)]",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
        )}
      >
        {/* Dramatic Neomorphic Thumb */}
        <span
          className={cn(
            // Base Thumb Structure
            "inline-block rounded-full transform transition-all duration-[180ms] ease-[cubic-bezier(.23,1,.32,1)]",
            sizeConfig.thumb,

            // Position Animation
            checked ? sizeConfig.checkedTranslate : sizeConfig.uncheckedTranslate,

            // Glassmorphic Thumb Foundation
            "bg-[color-mix(in_srgb,var(--surface-card)_95%,white_5%)]",
            "border border-[color-mix(in_srgb,var(--line)_80%,transparent)]",
            "shadow-[0_2px_6px_rgba(0,0,0,0.15)]",

            // Checked State Thumb (Enhanced Illumination)
            checked &&
              [
                "bg-[color-mix(in_srgb,var(--primary)_90%,white_10%)]",
                "border-[color-mix(in_srgb,var(--primary)_70%,transparent)]",
                "shadow-glow-primary",
              ].join(" "),

            // Interactive States
            !disabled &&
              [
                // Hover: Subtle lift effect
                "hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)]",
                "hover:scale-105",

                // Active: Press effect
                "active:shadow-[0_1px_4px_rgba(0,0,0,0.1)]",
                "active:scale-95",
              ].join(" "),

            // Disabled State
            disabled &&
              [
                "bg-[color-mix(in_srgb,var(--surface-card)_70%,transparent)]",
                "border-[color-mix(in_srgb,var(--line)_50%,transparent)]",
                "shadow-none",
              ].join(" "),
          )}
        >
          {/* Inner highlight for depth perception */}
          <span
            className={cn(
              "absolute inset-1 rounded-full",
              "bg-gradient-to-br from-white/30 to-transparent",
              "transition-opacity duration-[180ms] ease-[cubic-bezier(.23,1,.32,1)]",
              checked ? "opacity-70" : "opacity-40",
            )}
          />
        </span>

        {/* Track glow effect when checked */}
        <span
          className={cn(
            "absolute inset-0 rounded-full",
            "pointer-events-none",
            "transition-opacity duration-[180ms] ease-[cubic-bezier(.23,1,.32,1)]",
            checked ? "opacity-30" : "opacity-0",
            "shadow-glow-primary",
          )}
        />
      </button>
    );
  },
);

Switch.displayName = "Switch";
